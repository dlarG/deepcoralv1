from flask import Blueprint, Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
from ultralytics import YOLO 
from PIL import Image, ImageEnhance
import cv2
import numpy as np
import os
import uuid
import torch
import segmentation_models_pytorch as smp
import albumentations as A
from albumentations.pytorch import ToTensorV2
from pathlib import Path
from db import get_db_connection
from datetime import datetime

image_bp = Blueprint('image', __name__)

# Load detection model
detection_model = YOLO("../models/autocrop_yolov11_best.pt")

print("YOLO model classes:", detection_model.names)
# Load segmentation model
BASE_DIR = Path(__file__).parent.parent
MODEL_PATH = BASE_DIR.parent / "models" / "coral_unet_best.pth"

print(f"Loading segmentation model from: {MODEL_PATH}")
print(f"Model exists: {MODEL_PATH.exists()}")

NUM_CLASSES = 11  # 10 coral classes + background

if MODEL_PATH.exists():
    try:
        segmentation_model = smp.Unet(
            encoder_name="resnet34",
            encoder_weights=None,
            in_channels=3,
            classes=NUM_CLASSES
        )
        segmentation_model.load_state_dict(torch.load(str(MODEL_PATH), map_location='cpu'))
        segmentation_model.eval()
        print("✅ Segmentation model loaded successfully!")
    except Exception as e:
        print(f"❌ Error loading segmentation model: {e}")
        segmentation_model = None
else:
    print("❌ Segmentation model file not found!")
    segmentation_model = None

UPLOAD_FOLDER = "../backend/coral_uploads"
OUTPUT_FOLDER = "../backend/coral_uploads/outputs"
MASKS_FOLDER = "../backend/coral_uploads/masks"

# Create directories
for folder in [UPLOAD_FOLDER, OUTPUT_FOLDER, MASKS_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

# Coral class mapping
CORAL_CLASSES = {
    1: {'name': 'acropora-branching', 'color': '#FF6B6B', 'category': 'hard_coral'},
    2: {'name': 'acropora-tabulate', 'color': '#FFD166', 'category': 'hard_coral'},
    3: {'name': 'digitate', 'color': '#06D6A0', 'category': 'hard_coral'},
    4: {'name': 'encrusting', 'color': '#118AB2', 'category': 'hard_coral'},
    5: {'name': 'foliose', 'color': '#073B4C', 'category': 'hard_coral'},
    6: {'name': 'massive', 'color': '#EF476F', 'category': 'hard_coral'},
    7: {'name': 'mushroom', 'color': '#7209B7', 'category': 'hard_coral'},
    8: {'name': 'non-acropora-branching', 'color': '#F72585', 'category': 'soft_coral'},
    9: {'name': 'submassive', 'color': '#4ECDC4', 'category': 'hard_coral'},
    10: {'name': 'soft-coral', 'color': '#FFA500', 'category': 'soft_coral'}
}

@image_bp.route('/crops/<filename>')
def serve_crop(filename):
    return send_from_directory(OUTPUT_FOLDER, filename)

@image_bp.route('/masks/<filename>')
def serve_mask(filename):
    return send_from_directory(MASKS_FOLDER, filename)

def preprocess_for_segmentation(image_path, target_size=(256, 256)):
    """Preprocess image for segmentation model"""
    transform = A.Compose([
        A.Resize(target_size[0], target_size[1]),
        A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ToTensorV2()
    ])
    
    # Read image with OpenCV
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not load image from {image_path}")
    
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    original_size = (image.shape[1], image.shape[0])  # (width, height)
    
    # Apply transforms
    augmented = transform(image=image)
    tensor = augmented['image'].unsqueeze(0)
    
    return tensor, original_size

def segment_coral_lifeforms(image_path):
    """Segment coral lifeforms and calculate coverage"""
    if segmentation_model is None:
        print("❌ Segmentation model not available")
        return [], {}, None, 0
    
    try:
        # Preprocess image
        input_tensor, original_size = preprocess_for_segmentation(image_path)
        
        # Run segmentation
        with torch.no_grad():
            output = segmentation_model(input_tensor)
            predictions = torch.argmax(output, dim=1).squeeze().cpu().numpy()
        
        # Resize predictions to original size
        predictions_resized = cv2.resize(
            predictions.astype(np.uint8), 
            original_size, 
            interpolation=cv2.INTER_NEAREST
        )
        
        # Calculate coverage statistics
        total_pixels = predictions_resized.size
        unique_classes, pixel_counts = np.unique(predictions_resized, return_counts=True)
        
        coverage_data = []
        class_masks = {}
        
        for class_id, pixel_count in zip(unique_classes, pixel_counts):
            if class_id in CORAL_CLASSES:  # Only include coral classes (1-10)
                percentage = (pixel_count / total_pixels) * 100
                
                coverage_data.append({
                    'class_id': int(class_id),
                    'class_name': CORAL_CLASSES[class_id]['name'],
                    'category': CORAL_CLASSES[class_id]['category'],
                    'color': CORAL_CLASSES[class_id]['color'],
                    'pixel_count': int(pixel_count),
                    'coverage_percent': round(percentage, 2)
                })
                
                # Create individual class mask
                class_mask = (predictions_resized == class_id).astype(np.uint8) * 255
                class_masks[class_id] = class_mask
        
        # Create visualization mask
        visualization_mask = create_visualization_mask(predictions_resized)
        
        return coverage_data, class_masks, visualization_mask, total_pixels
        
    except Exception as e:
        print(f"Segmentation error: {str(e)}")
        import traceback
        traceback.print_exc()
        return [], {}, None, 0

def create_visualization_mask(predictions):
    """Create colored visualization mask"""
    h, w = predictions.shape
    colored_mask = np.zeros((h, w, 3), dtype=np.uint8)
    
    for class_id, class_info in CORAL_CLASSES.items():
        mask = predictions == class_id
        if np.any(mask):
            # Convert hex color to RGB
            hex_color = class_info['color'].lstrip('#')
            rgb_color = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
            colored_mask[mask] = rgb_color
    
    # Background (class 0) remains black
    return colored_mask

def enhanced_crop_inside_quadrat(image_path, bbox, crop_method='conservative'):
    x1, y1, x2, y2 = bbox
    width = x2 - x1
    height = y2 - y1
    
    if crop_method == 'conservative':
        margin = 0.04  # 4% margin reduction 
    elif crop_method == 'moderate':
        margin = 0.12  # 12% margin reduction
    elif crop_method == 'aggressive':
        margin = 0.18  # 18% margin reduction
    elif crop_method == 'smart':
        return smart_crop_quadrat(image_path, bbox)
    
    x1 += width * margin
    y1 += height * margin
    x2 -= width * margin
    y2 -= height * margin
    
    img = Image.open(image_path)
    img_width, img_height = img.size
    
    x1 = max(0, min(x1, img_width))
    y1 = max(0, min(y1, img_height))
    x2 = max(0, min(x2, img_width))
    y2 = max(0, min(y2, img_height))
    
    return img.crop((x1, y1, x2, y2))

def smart_crop_quadrat(image_path, bbox):
    """Smart cropping using edge detection"""
    try:
        cv_img = cv2.imread(image_path)
        x1, y1, x2, y2 = map(int, bbox)
        
        roi = cv_img[y1:y2, x1:x2]
        gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        edges = cv2.Canny(blurred, 30, 100)
        
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            best_contour = None
            best_area = 0
            
            for contour in contours:
                epsilon = 0.02 * cv2.arcLength(contour, True)
                approx = cv2.approxPolyDP(contour, epsilon, True)
                
                if len(approx) >= 4:
                    area = cv2.contourArea(contour)
                    if area > best_area and area > (roi.shape[0] * roi.shape[1] * 0.1):
                        best_contour = contour
                        best_area = area
            
            if best_contour is not None:
                cx, cy, cw, ch = cv2.boundingRect(best_contour)
                inner_padding = 0.05
                cx += int(cw * inner_padding)
                cy += int(ch * inner_padding)
                cw -= int(cw * inner_padding * 2)
                ch -= int(ch * inner_padding * 2)
                
                final_x1 = x1 + cx
                final_y1 = y1 + cy
                final_x2 = x1 + cx + cw
                final_y2 = y1 + cy + ch
                
                pil_img = Image.open(image_path)
                return pil_img.crop((final_x1, final_y1, final_x2, final_y2))
        
        return enhanced_crop_inside_quadrat(image_path, bbox, 'aggressive')
        
    except Exception as e:
        print(f"Smart crop failed: {e}")
        return enhanced_crop_inside_quadrat(image_path, bbox, 'aggressive')
    
def enhance_cropped_image(cropped_img):
    """Enhance the cropped image quality"""
    enhancer = ImageEnhance.Contrast(cropped_img)
    cropped_img = enhancer.enhance(1.1)
    
    enhancer = ImageEnhance.Sharpness(cropped_img)
    cropped_img = enhancer.enhance(1.05)
    
    return cropped_img

@image_bp.route("/detect_custom", methods=["POST", "OPTIONS"])
def detect_and_crop_custom():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
            
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({"error": "Empty filename"}), 400
            
        allowed_extensions = {'jpg', 'jpeg', 'png', 'webp'}
        if '.' not in file.filename or file.filename.split('.')[-1].lower() not in allowed_extensions:
            return jsonify({"error": "Invalid file type"}), 400

        crop_intensity = request.form.get('intensity', 'aggressive')
        
        unique_id = str(uuid.uuid4())[:8]
        ext = file.filename.split('.')[-1].lower()
        safe_filename = f"{unique_id}.{ext}"
        image_path = os.path.join(UPLOAD_FOLDER, safe_filename)
        
        try:
            file.save(image_path)
        except Exception as e:
            return jsonify({"error": f"Failed to save file: {str(e)}"}), 500

        # Optional: Comment out underwater validation if too strict
        img = cv2.imread(image_path)
        if not validate_underwater_characteristics(img):
            print("Warning: Image doesn't appear underwater, but proceeding anyway...")
            # Don't reject - just log warning

        try:
            results = detection_model(image_path)
        except Exception as e:
            try:
                os.remove(image_path)
            except:
                pass
            return jsonify({"error": f"Model processing failed: {str(e)}"}), 500

        # UPDATED: Check for your specific quadrat classes
        if not results[0].boxes or len(results[0].boxes) == 0:
            try:
                os.remove(image_path)
            except:
                pass
            return jsonify({"error": "No objects detected in this image"}), 400

        valid_quadrats = 0
        for box in results[0].boxes:
            cls = int(box.cls)
            confidence = float(box.conf)
            label = detection_model.names[cls]
            
            # UPDATED: Check for your specific quadrat classes
            if label.lower() in ['full_quadrat', 'half_quadrat'] and confidence > 0.4:
                valid_quadrats += 1

        if valid_quadrats == 0:
            try:
                os.remove(image_path)
            except:
                pass
            return jsonify({"error": "No valid coral quadrats (full_quadrat or half_quadrat) detected with sufficient confidence"}), 400

        crops = []
        for i, box in enumerate(results[0].boxes):
            try:
                cls = int(box.cls)
                confidence = float(box.conf)
                label = detection_model.names[cls]
                
                # UPDATED: Only process boxes that are your quadrat classes
                if label.lower() in ['full_quadrat', 'half_quadrat'] and confidence > 0.4:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()

                    cropped = enhanced_crop_inside_quadrat(image_path, [x1, y1, x2, y2], crop_intensity)
                    cropped = enhance_cropped_image(cropped)

                    crop_filename = f"{label}_{i}_{crop_intensity}_{safe_filename}"
                    crop_path = os.path.join(OUTPUT_FOLDER, crop_filename)
                    cropped.save(crop_path, quality=95)

                    crops.append(f"crops/{crop_filename}")
            except Exception as e:
                print(f"Error processing box {i}: {str(e)}")
                continue
                
        try:
            os.remove(image_path)
        except:
            pass

        if len(crops) == 0:
            return jsonify({"error": "No valid coral quadrats could be processed"}), 400

        return jsonify({
            "crops": crops,
            "method": crop_intensity,
            "original_filename": file.filename,
            "valid_quadrats": len(crops)
        })
        
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

def validate_underwater_characteristics(img):
    """Validate if image has underwater/coral characteristics - made less strict"""
    try:
        # Convert to HSV for better color analysis
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
        # Define blue-green color ranges typical of underwater images
        blue_lower = np.array([80, 30, 30])   # More lenient blue range
        blue_upper = np.array([140, 255, 255])
        
        green_lower = np.array([30, 30, 30])  # More lenient green range
        green_upper = np.array([90, 255, 255])
        
        # Create masks for blue and green colors
        blue_mask = cv2.inRange(hsv, blue_lower, blue_upper)
        green_mask = cv2.inRange(hsv, green_lower, green_upper)
        
        # Calculate percentage of blue-green pixels
        total_pixels = img.shape[0] * img.shape[1]
        blue_pixels = np.sum(blue_mask > 0)
        green_pixels = np.sum(green_mask > 0)
        
        blue_green_percentage = (blue_pixels + green_pixels) / total_pixels
        
        # Check for underwater characteristics - made more lenient
        avg_brightness = np.mean(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY))
        
        # Calculate texture variation using standard deviation
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        texture_variation = np.std(gray)
        
        # More lenient validation criteria
        has_underwater_colors = blue_green_percentage > 0.05  # Reduced from 0.1 to 0.05
        appropriate_brightness = 30 < avg_brightness < 200    # Wider brightness range
        has_texture = texture_variation > 15                  # Reduced from 20 to 15
        
        return has_underwater_colors and appropriate_brightness and has_texture
        
    except Exception as e:
        print(f"Underwater validation error: {e}")
        return True  # Changed to True - if validation fails, assume it's valid


@image_bp.route("/validate_quadrats", methods=["POST", "OPTIONS"])
def validate_quadrats():
    """Validate if uploaded images contain coral quadrats"""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    try:
        files = request.files.getlist('images')
        if not files:
            return jsonify({"error": "No image files provided"}), 400

        validation_results = []
        
        for file in files:
            if not file or file.filename == '':
                continue
                
            # Validate file extension
            allowed_extensions = {'png', 'jpg', 'jpeg', 'webp'}
            ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
            
            if ext not in allowed_extensions:
                validation_results.append({
                    'filename': file.filename,
                    'valid': False,
                    'reason': 'Invalid file type',
                    'quadrat_count': 0,
                    'confidence': 0
                })
                continue
            
            # Save temporary file for validation
            unique_id = str(uuid.uuid4())[:8]
            safe_filename = f"validate_{unique_id}.{ext}"
            temp_path = os.path.join(UPLOAD_FOLDER, safe_filename)
            
            try:
                file.save(temp_path)
                
                # Run detection with STRICT validation
                detection_results = detection_model(temp_path)
                
                if not detection_results[0].boxes or len(detection_results[0].boxes) == 0:
                    validation_results.append({
                        'filename': file.filename,
                        'valid': False,
                        'reason': 'No objects detected',
                        'quadrat_count': 0,
                        'confidence': 0
                    })
                    continue
                
                # Check if detected objects are actually coral quadrats
                valid_quadrats = 0
                total_confidence = 0
                quadrat_confidences = []
                quadrat_types = []
                
                for box in detection_results[0].boxes:
                    cls = int(box.cls)
                    confidence = float(box.conf)
                    label = detection_model.names[cls]
                    
                    # UPDATED: Check for your specific quadrat classes with confidence threshold
                    if label.lower() in ['full_quadrat', 'half_quadrat'] and confidence > 0.4:  # Lowered threshold slightly
                        valid_quadrats += 1
                        total_confidence += confidence
                        quadrat_confidences.append(confidence)
                        quadrat_types.append(label)
                    
                # Additional validation: check image characteristics (optional, can be disabled if too strict)
                img = cv2.imread(temp_path)
                if img is None:
                    validation_results.append({
                        'filename': file.filename,
                        'valid': False,
                        'reason': 'Could not read image',
                        'quadrat_count': 0,
                        'confidence': 0
                    })
                    continue
                
                # Optional: Comment out underwater validation if it's rejecting valid coral images
                is_underwater = validate_underwater_characteristics(img)
                
                avg_confidence = total_confidence / valid_quadrats if valid_quadrats > 0 else 0
                
                # UPDATED: More lenient validation logic
                if valid_quadrats > 0 and avg_confidence > 0.4:  # Lowered confidence threshold
                    # Optional: Remove underwater check if it's too strict
                    if is_underwater:
                        validation_results.append({
                            'filename': file.filename,
                            'valid': True,
                            'reason': f'Found {valid_quadrats} quadrat(s): {", ".join(set(quadrat_types))}',
                            'quadrat_count': valid_quadrats,
                            'confidence': round(avg_confidence, 2),
                            'quadrat_confidences': quadrat_confidences,
                            'quadrat_types': quadrat_types
                        })
                    else:
                        # Still accept but with warning about environment
                        validation_results.append({
                            'filename': file.filename,
                            'valid': True,  # Changed to True - accept even if environment detection fails
                            'reason': f'Found {valid_quadrats} quadrat(s): {", ".join(set(quadrat_types))} (environment check uncertain)',
                            'quadrat_count': valid_quadrats,
                            'confidence': round(avg_confidence, 2),
                            'quadrat_confidences': quadrat_confidences,
                            'quadrat_types': quadrat_types
                        })
                else:
                    reason = "No coral quadrats detected"
                    if valid_quadrats == 0:
                        reason = "No full_quadrat or half_quadrat objects found"
                    elif avg_confidence <= 0.4:
                        reason = f"Low confidence detection ({avg_confidence:.2f}) - detected: {', '.join(set(quadrat_types))}"
                    
                    validation_results.append({
                        'filename': file.filename,
                        'valid': False,
                        'reason': reason,
                        'quadrat_count': valid_quadrats,
                        'confidence': round(avg_confidence, 2),
                        'detected_types': quadrat_types
                    })
                
            except Exception as e:
                validation_results.append({
                    'filename': file.filename,
                    'valid': False,
                    'reason': f'Processing error: {str(e)}',
                    'quadrat_count': 0,
                    'confidence': 0
                })
            finally:
                # Clean up temporary file
                try:
                    os.remove(temp_path)
                except:
                    pass
        
        return jsonify({
            "validation_results": validation_results,
            "total_images": len(validation_results),
            "valid_images": sum(1 for result in validation_results if result['valid']),
            "invalid_images": sum(1 for result in validation_results if not result['valid'])
        })
        
    except Exception as e:
        print(f"Validation error: {str(e)}")
        return jsonify({"error": f"Validation failed: {str(e)}"}), 500

@image_bp.route("/detect_and_segment", methods=["POST", "OPTIONS"])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def detect_crop_and_segment():
    """Enhanced endpoint that saves to database"""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
            
        file = request.files['image']
        uploader_id = request.form.get('uploader_id', 1)  # Default to user ID 1
        
        # ... existing file validation code ...

        crop_intensity = request.form.get('intensity', 'aggressive')
        unique_id = str(uuid.uuid4())[:8]
        ext = file.filename.split('.')[-1].lower()
        safe_filename = f"{unique_id}.{ext}"
        image_path = os.path.join(UPLOAD_FOLDER, safe_filename)
        
        file.save(image_path)

        # Detection and cropping
        detection_results = detection_model(image_path)
        crops_data = []
        total_coverage_data = []
        
        for i, box in enumerate(detection_results[0].boxes):
            try:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                cls = int(box.cls)
                label = detection_model.names[cls]

                # Crop the quadrat
                cropped = enhanced_crop_inside_quadrat(image_path, [x1, y1, x2, y2], crop_intensity)
                cropped = enhance_cropped_image(cropped)

                crop_filename = f"{label}_{i}_{crop_intensity}_{safe_filename}"
                crop_path = os.path.join(OUTPUT_FOLDER, crop_filename)
                cropped.save(crop_path, quality=95)

                # Segment the cropped image
                coverage_data, class_masks, visualization_mask, total_pixels = segment_coral_lifeforms(crop_path)
                
                # Save visualization mask
                viz_filename = f"visualization_{crop_filename}"
                viz_path = os.path.join(MASKS_FOLDER, viz_filename)
                if visualization_mask is not None:
                    cv2.imwrite(viz_path, cv2.cvtColor(visualization_mask, cv2.COLOR_RGB2BGR))

                # Calculate analysis confidence (average of detection confidence)
                analysis_confidence = float(box.conf) if hasattr(box, 'conf') else 0.85

                # Save to database
                image_id = save_image_to_database(
                    crop_filename, 
                    uploader_id, 
                    total_pixels, 
                    total_pixels,  # For now, assuming all pixels are analyzed
                    analysis_confidence
                )

                if image_id and coverage_data:
                    save_segmentation_results(image_id, coverage_data, f"masks/{viz_filename}")

                # Accumulate coverage data for total statistics
                total_coverage_data.extend(coverage_data)

                crops_data.append({
                    'crop_url': f"crops/{crop_filename}",
                    'visualization_url': f"masks/{viz_filename}",
                    'coverage_data': coverage_data,
                    'total_pixels': total_pixels,
                    'detection_label': label,
                    'image_id': image_id
                })

            except Exception as e:
                print(f"Error processing box {i}: {str(e)}")
                continue
        
        # Calculate aggregated coverage statistics
        aggregated_coverage = {}
        total_pixels_all = sum(crop['total_pixels'] for crop in crops_data)
        
        for crop in crops_data:
            for coral in crop['coverage_data']:
                class_name = coral['class_name']
                if class_name not in aggregated_coverage:
                    aggregated_coverage[class_name] = {
                        'class_name': class_name,
                        'category': coral['category'],
                        'color': coral['color'],
                        'total_pixels': 0,
                        'total_coverage_percent': 0
                    }
                aggregated_coverage[class_name]['total_pixels'] += coral['pixel_count']
        
        # Calculate total percentages
        for class_name in aggregated_coverage:
            aggregated_coverage[class_name]['total_coverage_percent'] = round(
                (aggregated_coverage[class_name]['total_pixels'] / total_pixels_all) * 100, 2
            ) if total_pixels_all > 0 else 0

        # Clean up original file
        try:
            os.remove(image_path)
        except:
            pass

        return jsonify({
            "crops": crops_data,
            "method": crop_intensity,
            "original_filename": file.filename,
            "total_crops": len(crops_data),
            "segmentation_available": segmentation_model is not None,
            "aggregated_coverage": list(aggregated_coverage.values()),
            "total_pixels": total_pixels_all
        })
        
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@image_bp.route("/get_coral_classes", methods=["GET"])
def get_coral_classes():
    """Get available coral classes for reference"""
    classes_list = [{'id': k, **v} for k, v in CORAL_CLASSES.items()]
    return jsonify({"classes": classes_list})


def save_segmentation_results(image_id, coverage_data, mask_path):
    """Save segmentation results to database"""
    conn = get_db_connection()
    if conn is None:
        return False
    
    try:
        with conn.cursor() as cur:
            for coral_data in coverage_data:
                # First, ensure coral lifeform exists
                cur.execute("""
                    INSERT INTO coral_lifeforms (class_name, category, color_hex)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (class_name) DO NOTHING
                """, (coral_data['class_name'], coral_data['category'], coral_data['color']))
                
                # Get coral lifeform ID
                cur.execute("""
                    SELECT id FROM coral_lifeforms WHERE class_name = %s
                """, (coral_data['class_name'],))
                
                class_id = cur.fetchone()[0]
                
                # Save segmentation result
                cur.execute("""
                    INSERT INTO segmentation_results 
                    (image_id, class_id, area_px, coverage_percent, mask_path)
                    VALUES (%s, %s, %s, %s, %s)
                """, (image_id, class_id, coral_data['pixel_count'], 
                      coral_data['coverage_percent'], mask_path))
            
            conn.commit()
            return True
    except Exception as e:
        print(f"Database error saving segmentation: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()


@image_bp.route("/batch_analyze", methods=["POST", "OPTIONS"])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def batch_analyze_images():
    """New endpoint for batch analysis with quadrat validation"""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    try:
        files = request.files.getlist('images')
        if not files:
            return jsonify({"error": "No image files provided"}), 400

        uploader_id = request.form.get('uploader_id', 1)
        crop_intensity = request.form.get('intensity', 'aggressive')
        
        all_results = []
        batch_coverage_data = {}
        batch_total_pixels = 0
        rejected_images = []
        
        for file_index, file in enumerate(files):
            if not file or file.filename == '':
                continue
                
            # Validate file extension
            allowed_extensions = {'png', 'jpg', 'jpeg', 'webp'}
            ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
            if ext not in allowed_extensions:
                rejected_images.append({
                    'filename': file.filename,
                    'reason': 'Invalid file type'
                })
                continue
                
            # Process each file similar to detect_and_segment
            unique_id = str(uuid.uuid4())[:8]
            safe_filename = f"batch_{file_index}_{unique_id}.{ext}"
            image_path = os.path.join(UPLOAD_FOLDER, safe_filename)
            
            file.save(image_path)
            
            # Detection and processing
            detection_results = detection_model(image_path)
            
            # UPDATED: Check for your specific quadrat classes
            valid_detections = []
            if detection_results[0].boxes:
                for box in detection_results[0].boxes:
                    cls = int(box.cls)
                    confidence = float(box.conf)
                    label = detection_model.names[cls]
                    
                    if label.lower() in ['full_quadrat', 'half_quadrat'] and confidence > 0.4:
                        valid_detections.append(box)
            
            if len(valid_detections) == 0:
                rejected_images.append({
                    'filename': file.filename,
                    'reason': 'No coral quadrats (full_quadrat or half_quadrat) detected'
                })
                try:
                    os.remove(image_path)
                except:
                    pass
                continue
            
            image_crops = []
            
            for i, box in enumerate(valid_detections):
                try:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    cls = int(box.cls)
                    label = detection_model.names[cls]

                    # Crop and segment
                    cropped = enhanced_crop_inside_quadrat(image_path, [x1, y1, x2, y2], crop_intensity)
                    cropped = enhance_cropped_image(cropped)

                    crop_filename = f"{label}_{i}_{file_index}_{safe_filename}"
                    crop_path = os.path.join(OUTPUT_FOLDER, crop_filename)
                    cropped.save(crop_path, quality=95)

                    coverage_data, class_masks, visualization_mask, total_pixels = segment_coral_lifeforms(crop_path)
                    
                    viz_filename = f"batch_viz_{crop_filename}"
                    viz_path = os.path.join(MASKS_FOLDER, viz_filename)
                    if visualization_mask is not None:
                        cv2.imwrite(viz_path, cv2.cvtColor(visualization_mask, cv2.COLOR_RGB2BGR))

                    # Save to database
                    analysis_confidence = float(box.conf) if hasattr(box, 'conf') else 0.85
                    image_id = save_image_to_database(crop_filename, uploader_id, total_pixels, total_pixels, analysis_confidence)
                    
                    if image_id and coverage_data:
                        save_segmentation_results(image_id, coverage_data, f"masks/{viz_filename}")

                    # Accumulate batch statistics
                    batch_total_pixels += total_pixels
                    for coral in coverage_data:
                        class_name = coral['class_name']
                        if class_name not in batch_coverage_data:
                            batch_coverage_data[class_name] = {
                                'class_name': class_name,
                                'category': coral['category'],
                                'color': coral['color'],
                                'total_pixels': 0,
                                'images_found_in': 0
                            }
                        batch_coverage_data[class_name]['total_pixels'] += coral['pixel_count']
                        
                    image_crops.append({
                        'crop_url': f"crops/{crop_filename}",
                        'visualization_url': f"masks/{viz_filename}",
                        'coverage_data': coverage_data,
                        'total_pixels': total_pixels,
                        'detection_label': label,
                        'image_id': image_id
                    })

                except Exception as e:
                    print(f"Error processing crop {i} in image {file_index}: {e}")
                    continue
            
            if image_crops:  # Only add if crops were successfully processed
                all_results.append({
                    'filename': file.filename,
                    'crops': image_crops,
                    'processed': True
                })
            
            # Clean up
            try:
                os.remove(image_path)
            except:
                pass
        
        # Calculate batch percentages
        for class_name in batch_coverage_data:
            batch_coverage_data[class_name]['coverage_percent'] = round(
                (batch_coverage_data[class_name]['total_pixels'] / batch_total_pixels) * 100, 2
            ) if batch_total_pixels > 0 else 0

        return jsonify({
            "results": all_results,
            "rejected_images": rejected_images,
            "batch_statistics": {
                "total_images_processed": len(all_results),
                "total_images_rejected": len(rejected_images),
                "total_crops": sum(len(result['crops']) for result in all_results),
                "total_pixels": batch_total_pixels,
                "coverage_summary": list(batch_coverage_data.values())
            },
            "method": crop_intensity
        })

    except Exception as e:
        print(f"Batch analysis error: {str(e)}")
        return jsonify({"error": f"Batch analysis failed: {str(e)}"}), 500
    
def save_image_to_database(filename, uploader_id, total_pixels, analyzed_area_px, analysis_confidence):
    """Save image metadata to database"""
    conn = get_db_connection()
    if conn is None:
        return None
    
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO images (filename, uploader_id, uploaded_at, total_pixels, 
                                  analyzed_area_px, analysis_confidence, processing_status)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (filename, uploader_id, datetime.now(), total_pixels, 
                  analyzed_area_px, analysis_confidence, 'completed'))
            
            image_id = cur.fetchone()[0]
            conn.commit()
            return image_id
    except Exception as e:
        print(f"Database error saving image: {e}")
        conn.rollback()
        return None
    finally:
        conn.close()

def save_segmentation_results(image_id, coverage_data, mask_path):
    """Save segmentation results to database"""
    conn = get_db_connection()
    if conn is None:
        return False
    
    try:
        with conn.cursor() as cur:
            for coral_data in coverage_data:
                # First, ensure coral lifeform exists
                cur.execute("""
                    INSERT INTO coral_lifeforms (class_name, category, color_hex)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (class_name) DO NOTHING
                """, (coral_data['class_name'], coral_data['category'], coral_data['color']))
                
                # Get coral lifeform ID
                cur.execute("""
                    SELECT id FROM coral_lifeforms WHERE class_name = %s
                """, (coral_data['class_name'],))
                
                result = cur.fetchone()
                if not result:
                    continue
                    
                class_id = result[0]
                
                # Save segmentation result
                cur.execute("""
                    INSERT INTO segmentation_results 
                    (image_id, class_id, area_px, coverage_percent, mask_path)
                    VALUES (%s, %s, %s, %s, %s)
                """, (image_id, class_id, coral_data['pixel_count'], 
                      coral_data['coverage_percent'], mask_path))
            
            conn.commit()
            return True
    except Exception as e:
        print(f"Database error saving segmentation: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()
