# upload_image.py - UPDATED MODEL LOADING
from flask import Blueprint, Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
from PIL import Image, ImageEnhance
import cv2
import numpy as np
import os
import uuid
import warnings
import json
import psycopg2
from pathlib import Path
from db import get_db_connection
from datetime import datetime
from flask import session
from routes.activity_log import (
    log_image_upload, log_system_action, ActivityLogger
)

warnings.filterwarnings("ignore")

image_bp = Blueprint('image', __name__)

PYTORCH_AVAILABLE = False
YOLO_AVAILABLE = False
SEGMENTATION_AVAILABLE = False
detection_model = None
segmentation_model = None

print("🔍 Checking package availability...")


try:
    import numpy as np
    print(f"✅ NumPy {np.__version__} imported successfully")
except Exception as e:
    print(f"❌ NumPy import failed: {e}")

try:
    import torch
    print(f"✅ PyTorch {torch.__version__} imported successfully")
    print(f"✅ CUDA available: {torch.cuda.is_available()}")
    PYTORCH_AVAILABLE = True
except Exception as e:
    print(f"❌ PyTorch import failed: {e}")
    PYTORCH_AVAILABLE = False

# Load YOLO model first (less dependencies)
if PYTORCH_AVAILABLE:
    try:
        from ultralytics import YOLO
        print(f"✅ Ultralytics imported successfully")
        
        # Try to load the YOLO model
        model_path = "./models/autocrop_yolov11_best.pt"
        
        print(f"🔄 Attempting to load YOLO model from: {model_path}")
        
        if os.path.exists(model_path):
            print(f"📁 Model exists: {model_path}")
            try:
                detection_model = YOLO(model_path)
                print(f"✅ YOLO model loaded successfully!")
                print(f"✅ YOLO model classes: {detection_model.names}")
                YOLO_AVAILABLE = True
            except Exception as e:
                print(f"❌ YOLO model loading failed: {e}")
                print("💡 Trying alternative loading method...")
                
                # Alternative loading for compatibility
                try:
                    detection_model = torch.load(model_path, map_location='cpu')
                    if hasattr(detection_model, 'names'):
                        print(f"✅ YOLO model loaded via torch.load!")
                        YOLO_AVAILABLE = True
                    else:
                        print("❌ Loaded model doesn't have expected attributes")
                        detection_model = None
                        YOLO_AVAILABLE = False
                except Exception as e2:
                    print(f"❌ Alternative loading also failed: {e2}")
                    detection_model = None
                    YOLO_AVAILABLE = False
        else:
            print(f"❌ YOLO model file not found: {model_path}")
            YOLO_AVAILABLE = False
            
    except ImportError as e:
        print(f"❌ Ultralytics import failed: {e}")
        YOLO_AVAILABLE = False
else:
    print("❌ YOLO unavailable - PyTorch not available")

# Load segmentation model (NEW MODEL - 9 classes)
if PYTORCH_AVAILABLE:
    try:
        import segmentation_models_pytorch as smp
        import albumentations as A
        from albumentations.pytorch import ToTensorV2
        print("✅ Segmentation models imported successfully")
        
        BASE_DIR = Path(__file__).parent.parent
        MODEL_PATH = BASE_DIR.parent / "backend" / "models" / "segmentation" / "version4" / "coral_unet_best.pth"
        
        print(f"🔄 Loading segmentation model from: {MODEL_PATH}")
        print(f"📁 Model exists: {MODEL_PATH.exists()}")
        
        NUM_CLASSES = 9
        
        if MODEL_PATH.exists():
            try:
                segmentation_model = smp.Unet(
                    encoder_name="resnet34",
                    encoder_weights=None,
                    in_channels=3,
                    classes=NUM_CLASSES
                )
                
                checkpoint = torch.load(str(MODEL_PATH), map_location='cpu', weights_only=False)
                
                if 'model_state_dict' in checkpoint:
                    segmentation_model.load_state_dict(checkpoint['model_state_dict'])
                else:
                    segmentation_model.load_state_dict(checkpoint)
                
                segmentation_model.eval()
                print("✅ Segmentation model loaded successfully!")
                SEGMENTATION_AVAILABLE = True
                
                segmentation_transform = A.Compose([
                    A.Resize(512, 512),
                    A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
                    ToTensorV2()
                ])
                
            except Exception as e:
                print(f"❌ Error loading segmentation model: {e}")
                segmentation_model = None
                SEGMENTATION_AVAILABLE = False
        else:
            print("❌ Segmentation model file not found!")
            segmentation_model = None
            SEGMENTATION_AVAILABLE = False
            
    except ImportError as e:
        print(f"❌ Segmentation models import failed: {e}")
        SEGMENTATION_AVAILABLE = False
else:
    print("❌ Segmentation unavailable - PyTorch not available")

CORAL_CLASSES = {
    1: {'name': 'acropora-branching', 'color': '#FF6B6B', 'category': 'hard_coral'},
    2: {'name': 'acropora-tabulate', 'color': '#FFD166', 'category': 'hard_coral'},
    3: {'name': 'encrusting', 'color': '#06D6A0', 'category': 'hard_coral'},
    4: {'name': 'foliose', 'color': '#118AB2', 'category': 'hard_coral'},
    5: {'name': 'massive', 'color': '#073B4C', 'category': 'hard_coral'},
    6: {'name': 'mushroom', 'color': '#EF476F', 'category': 'hard_coral'},
    7: {'name': 'non-acropora-branching', 'color': '#7209B7', 'category': 'hard_coral'},
    8: {'name': 'submassive', 'color': '#F72585', 'category': 'hard_coral'}
}

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

COLOR_MAP = {
    0: [0, 0, 0],           # Background - Black (#000000)
    1: [255, 107, 107],     # Acropora-branching - #FF6B6B  
    2: [255, 209, 102],     # Acropora-tabulate - #FFD166
    3: [76, 205, 196],      # Encrusting - #4ECDC4
    4: [17, 138, 178],      # Foliose - #118AB2 (was yellow, now blue)
    5: [7, 59, 76],         # Massive - #073B4C
    6: [239, 71, 111],      # Mushroom - #EF476F
    7: [114, 9, 183],       # Non-acropora-branching - #7209B7
    8: [247, 37, 133]       # Submassive - #F72585
}

UPLOAD_FOLDER = "../backend/coral_uploads"
OUTPUT_FOLDER = "../backend/coral_uploads/outputs"
MASKS_FOLDER = "../backend/coral_uploads/masks"

# Ensure directories exist
for folder in [UPLOAD_FOLDER, OUTPUT_FOLDER, MASKS_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)
        print(f"📁 Created directory: {folder}")

def predict_segmentation(image):
    """Perform segmentation using NEW model"""
    if not SEGMENTATION_AVAILABLE:
        raise Exception("Segmentation model not available")
    
    transform = A.Compose([
        A.Resize(512, 512),
        A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ToTensorV2()
    ])
    
    # Preprocess
    original_size = image.shape[:2]
    augmented = transform(image=image)  # Changed from self.segmentation_transform
    input_tensor = augmented['image'].unsqueeze(0)
    
    # Predict
    with torch.no_grad():
        output = segmentation_model(input_tensor)
        pred_mask = torch.argmax(output.squeeze(), dim=0).cpu().numpy()
    
    # Resize back to original size
    pred_mask_resized = cv2.resize(pred_mask, (original_size[1], original_size[0]), 
                                 interpolation=cv2.INTER_NEAREST)
    
    return pred_mask_resized

def create_colored_mask(mask):
    """Convert mask to colored image using NEW color map"""
    colored_mask = np.zeros((mask.shape[0], mask.shape[1], 3), dtype=np.uint8)
    for class_id, color in COLOR_MAP.items():
        colored_mask[mask == class_id] = color
    return colored_mask

def create_overlay(image, mask, alpha=0.5):
    """Create overlay of original image and mask"""
    colored_mask = create_colored_mask(mask)
    overlay = cv2.addWeighted(image, 1 - alpha, colored_mask, alpha, 0)
    return overlay

def calculate_statistics(mask):
    """Calculate area statistics for each class"""
    total_pixels = mask.shape[0] * mask.shape[1]
    stats = {}
    
    for class_id in range(len(CORAL_CLASSES)):
        class_pixels = np.sum(mask == class_id)
        percentage = (class_pixels / total_pixels) * 100
        if percentage > 0.1:  # Only include classes with > 0.1% coverage
            class_name = CORAL_CLASSES[class_id]['name']
            stats[class_name] = {
                'pixels': int(class_pixels),
                'percentage': round(percentage, 2),
                'color': COLOR_MAP[class_id],
                'category': CORAL_CLASSES[class_id]['category']
            }
    
    return stats

# Print final status
print("\n🎯 SYSTEM STATUS SUMMARY:")
print(f"   PyTorch: {'✅ Available' if PYTORCH_AVAILABLE else '❌ Not Available'}")
print(f"   YOLO Detection: {'✅ Available' if YOLO_AVAILABLE else '❌ Not Available'}")
print(f"   Coral Segmentation: {'✅ Available' if SEGMENTATION_AVAILABLE else '❌ Not Available'}")


# Add system status endpoints
@image_bp.route("/system_status", methods=["GET"])
def get_system_status():
    """Get comprehensive system status"""
    import sys
    import platform
    
    status = {
        "system_info": {
            "python_version": sys.version,
            "platform": platform.platform()
        },
        "package_status": {
            "pytorch_available": PYTORCH_AVAILABLE,
            "yolo_available": YOLO_AVAILABLE,
            "segmentation_available": SEGMENTATION_AVAILABLE
        },
        "models_loaded": {
            "detection_model": detection_model is not None,
            "segmentation_model": segmentation_model is not None
        },
        "features_available": {
            "quadrat_detection": YOLO_AVAILABLE and detection_model is not None,
            "coral_segmentation": SEGMENTATION_AVAILABLE and segmentation_model is not None,
            "basic_image_processing": True
        },
        "recommendations": []
    }
    
    try:
        import torch
        status["package_versions"] = {"torch": torch.__version__}
    except:
        pass
    
    try:
        import ultralytics
        status["package_versions"]["ultralytics"] = ultralytics.__version__
    except:
        pass
    
    # Add recommendations
    if not PYTORCH_AVAILABLE:
        status["recommendations"].append("Install PyTorch: pip install torch==2.0.1 torchvision==0.15.2")
    
    if not YOLO_AVAILABLE:
        if PYTORCH_AVAILABLE:
            status["recommendations"].append("Update Ultralytics for YOLOv11 support: pip install --upgrade ultralytics>=8.1.0")
        else:
            status["recommendations"].append("PyTorch required before installing Ultralytics")
    
    if not SEGMENTATION_AVAILABLE:
        status["recommendations"].append("Install segmentation models: pip install segmentation-models-pytorch")
    
    return jsonify(status)

@image_bp.route("/fix_yolo_compatibility", methods=["GET"])
def fix_yolo_compatibility():
    return jsonify({
        "issue": "YOLOv11 model incompatibility with current Ultralytics version",
        "your_model": "autocrop_yolov11_best.pt (requires C3k2 module)",
        "current_ultralytics": "8.0.196 (doesn't have C3k2)",
        "solutions": [
            {
                "option": 1,
                "title": "Update Ultralytics (Recommended)",
                "commands": [
                    "pip install --upgrade ultralytics>=8.1.0"
                ],
                "description": "Update to version that supports YOLOv11 and C3k2 module"
            },
            {
                "option": 2,
                "title": "Use latest version",
                "commands": [
                    "pip install --upgrade ultralytics"
                ],
                "description": "Install the very latest Ultralytics version"
            },
            {
                "option": 3,
                "title": "Force reinstall",
                "commands": [
                    "pip uninstall ultralytics -y",
                    "pip install ultralytics>=8.1.0"
                ],
                "description": "Clean reinstall if update doesn't work"
            }
        ],
        "alternative": "Train a new YOLOv8 model instead of YOLOv11 for better compatibility",
        "restart_required": "Yes - restart the Flask application after updating Ultralytics"
    })

@image_bp.route('/crops/<filename>')
def serve_crop(filename):
    return send_from_directory(OUTPUT_FOLDER, filename)

@image_bp.route('/masks/<filename>')
def serve_mask(filename):
    return send_from_directory(MASKS_FOLDER, filename)

def preprocess_for_segmentation(image_path, target_size=(512, 512)):
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

def log_image_detection_activity(user_id, filename, detection_results, crop_count, method):
    """Log image detection and cropping activity"""
    try:
        metadata = {
            'filename': filename,
            'crop_method': method,
            'crops_generated': crop_count,
            'detection_confidence': detection_results.get('highest_confidence', 0) if detection_results else 0,
            'total_detections': detection_results.get('total_detections', 0) if detection_results else 0
        }
        
        return ActivityLogger.log_activity(
            user_id=user_id,
            activity_type='image_detection',
            description=f"Detected and cropped {crop_count} quadrat(s) from {filename}",
            category='image_analysis',
            metadata=metadata
        )
    except Exception as e:
        print(f"Error logging image detection: {e}")
        return False
    
def log_image_segmentation_activity(user_id, filename, coverage_data, total_pixels):
    """Log coral segmentation analysis activity"""
    try:
        coral_types_found = len(coverage_data) if coverage_data else 0
        coral_names = [coral['class_name'] for coral in coverage_data] if coverage_data else []
        
        metadata = {
            'filename': filename,
            'total_pixels_analyzed': total_pixels,
            'coral_types_found': coral_types_found,
            'coral_classes_detected': coral_names,
            'segmentation_successful': coral_types_found > 0
        }
        
        return ActivityLogger.log_activity(
            user_id=user_id,
            activity_type='coral_segmentation',
            description=f"Analyzed coral coverage in {filename} - found {coral_types_found} coral types",
            category='image_analysis',
            metadata=metadata
        )
    except Exception as e:
        print(f"Error logging segmentation: {e}")
        return False
    
def log_batch_analysis_activity(user_id, total_images, successful_images, rejected_images, total_crops):
    """Log batch analysis activity"""
    try:
        rejected_filenames = [img['filename'] for img in rejected_images] if rejected_images else []
        
        metadata = {
            'total_images_submitted': total_images,
            'successful_images': successful_images,
            'rejected_images': len(rejected_images),
            'total_crops_generated': total_crops,
            'rejection_reasons': [img['reason'] for img in rejected_images] if rejected_images else [],
            'rejected_filenames': rejected_filenames
        }
        
        return ActivityLogger.log_activity(
            user_id=user_id,
            activity_type='batch_image_analysis',
            description=f"Batch analyzed {total_images} images - {successful_images} successful, {len(rejected_images)} rejected, {total_crops} crops generated",
            category='image_analysis',
            metadata=metadata
        )
    except Exception as e:
        print(f"Error logging batch analysis: {e}")
        return False

def log_image_validation_activity(user_id, total_images, valid_images, invalid_images):
    """Log image validation activity"""
    try:
        metadata = {
            'total_images': total_images,
            'valid_images': valid_images,
            'invalid_images': invalid_images,
            'validation_success_rate': (valid_images / total_images * 100) if total_images > 0 else 0
        }
        
        return ActivityLogger.log_activity(
            user_id=user_id,
            activity_type='image_validation',
            description=f"Validated {total_images} images - {valid_images} valid, {invalid_images} invalid",
            category='image_analysis',
            metadata=metadata
        )
    except Exception as e:
        print(f"Error logging validation: {e}")
        return False

def get_user_id_from_session():
    """Get user ID from session, with fallback"""
    try:
        return session.get('user_id')  
    except RuntimeError:
        # Handle case when called outside request context
        return 1

def segment_coral_lifeforms(image_path):
    """Segment coral lifeforms and calculate coverage - FIXED version"""
    if segmentation_model is None:
        print("❌ Segmentation model not available")
        return [], {}, None, None, 0
    
    try:
        # Load and preprocess image like mini-system
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not load image from {image_path}")
        
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        original_size = image.shape[:2]
        
        # Use the fixed predict_segmentation function
        predictions_resized = predict_segmentation(image)
        
        # Calculate coverage statistics
        total_pixels = predictions_resized.size
        unique_classes, pixel_counts = np.unique(predictions_resized, return_counts=True)
        
        coverage_data = []
        class_masks = {}
        
        for class_id, pixel_count in zip(unique_classes, pixel_counts):
            if class_id in CORAL_CLASSES:  
                percentage = (pixel_count / total_pixels) * 100
                
                coverage_data.append({
                    'class_id': int(class_id),
                    'class_name': CORAL_CLASSES[class_id]['name'],
                    'category': CORAL_CLASSES[class_id]['category'],
                    'color': CORAL_CLASSES[class_id]['color'],
                    'pixel_count': int(pixel_count),
                    'coverage_percent': round(percentage, 2)
                })
                
                class_mask = (predictions_resized == class_id).astype(np.uint8) * 255
                class_masks[class_id] = class_mask

        overlay_image = create_overlay(image, predictions_resized, alpha=0.5)
        mask_image = create_colored_mask(predictions_resized)
        
        return coverage_data, class_masks, overlay_image, mask_image, total_pixels
        
    except Exception as e:
        print(f"Segmentation error: {str(e)}")
        import traceback
        traceback.print_exc()
        return [], {}, None, None, 0

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

def create_segmentation_overlay(original_image, segmentation_mask, alpha=0.6):
    """Create an overlay of segmentation results on original image"""
    try:
        # Convert original image to RGB if needed
        if len(original_image.shape) == 3 and original_image.shape[2] == 3:
            if original_image.dtype == np.uint8:
                original_rgb = original_image
            else:
                original_rgb = (original_image * 255).astype(np.uint8)
        else:
            # Handle grayscale or other formats
            original_rgb = cv2.cvtColor(original_image, cv2.COLOR_GRAY2RGB)
        
        # Create colored mask
        colored_mask = np.zeros_like(original_rgb)
        for class_id, color in COLOR_MAP.items():
            if class_id > 0:  # Skip background
                mask_area = segmentation_mask == class_id
                colored_mask[mask_area] = color
        
        # Create overlay with transparency
        overlay = cv2.addWeighted(original_rgb, 1 - alpha, colored_mask, alpha, 0)
        
        return overlay
    except Exception as e:
        print(f"Error creating overlay: {e}")
        return original_image

@image_bp.route("/detect_custom", methods=["POST", "OPTIONS"])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def detect_and_crop_custom():
    """Updated single image detection with manual override support"""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    if not YOLO_AVAILABLE or detection_model is None:
        return jsonify({
            "error": "Coral quadrat detection is currently unavailable",
            "reason": "YOLO model not loaded due to compatibility issues"
        }), 503
    
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
            
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({"error": "Empty filename"}), 400
            
        allowed_extensions = {'jpg', 'jpeg', 'png', 'webp'}
        if '.' not in file.filename or file.filename.split('.')[-1].lower() not in allowed_extensions:
            return jsonify({"error": "Invalid file type"}), 400

        crop_intensity = request.form.get('intensity', 'conservative')
        manual_override = request.form.get('manual_override', 'false').lower() == 'true'
        user_id = get_user_id_from_session()
        
        log_image_upload(
            user_id=user_id,
            filename=file.filename,
            image_count=1
        )

        unique_id = str(uuid.uuid4())[:8]
        ext = file.filename.split('.')[-1].lower()
        safe_filename = f"{unique_id}.{ext}"
        image_path = os.path.join(UPLOAD_FOLDER, safe_filename)
        
        try:
            file.save(image_path)
        except Exception as e:
            return jsonify({"error": f"Failed to save file: {str(e)}"}), 500

        try:
            results = detection_model(image_path)
        except Exception as e:
            try:
                os.remove(image_path)
            except:
                pass
            return jsonify({"error": f"Model processing failed: {str(e)}"}), 500

        CONFIDENCE_THRESHOLD = 0.87
        
        if not results[0].boxes or len(results[0].boxes) == 0:
            if manual_override:
                # Process entire image as single crop
                print(f"Manual override: Processing entire image {file.filename}")
                
                img = cv2.imread(image_path)
                height, width = img.shape[:2]
                
                # Create full image crop with small margin
                margin = min(width, height) * 0.02  # 2% margin
                cropped = enhanced_crop_inside_quadrat(image_path, [margin, margin, width-margin, height-margin], crop_intensity)
                cropped = enhance_cropped_image(cropped)

                crop_filename = f"manual_override_{crop_intensity}_{safe_filename}"
                crop_path = os.path.join(OUTPUT_FOLDER, crop_filename)
                cropped.save(crop_path, quality=95)

                # Segment and create results
                coverage_data, class_masks, overlay_image, mask_image, total_pixels = segment_coral_lifeforms(crop_path)
                
                overlay_filename = f"overlay_{crop_filename}"
                overlay_path = os.path.join(MASKS_FOLDER, overlay_filename)
                if overlay_image is not None:
                    overlay_bgr = cv2.cvtColor(overlay_image, cv2.COLOR_RGB2BGR)
                    cv2.imwrite(overlay_path, overlay_bgr)

                mask_filename = f"mask_{crop_filename}"
                mask_path = os.path.join(MASKS_FOLDER, mask_filename)
                if mask_image is not None:
                    mask_bgr = cv2.cvtColor(mask_image, cv2.COLOR_RGB2BGR)
                    cv2.imwrite(mask_path, mask_bgr)

                try:
                    os.remove(image_path)
                except:
                    pass

                return jsonify({
                    "crops": [f"crops/{crop_filename}"],
                    "segmentation_data": [{
                        'crop_url': f"crops/{crop_filename}",
                        'overlay_url': f"masks/{overlay_filename}",
                        'mask_url': f"masks/{mask_filename}",
                        'coverage_data': coverage_data,
                        'total_pixels': total_pixels,
                        'detection_label': "manual_override",
                        'confidence': 0.5,
                        'manually_included': True
                    }],
                    "method": crop_intensity,
                    "original_filename": file.filename,
                    "manual_override": True,
                    "message": "Manual override: Processed entire image without quadrat detection"
                })
            else:
                try:
                    os.remove(image_path)
                except:
                    pass
                return jsonify({
                    "error": "No objects detected in this image",
                    "confidence_threshold": CONFIDENCE_THRESHOLD
                }), 400

        # Process detected objects
        valid_quadrats = []
        low_confidence_quadrats = []
        all_detections = []
        
        for i, box in enumerate(results[0].boxes):
            cls = int(box.cls)
            confidence = float(box.conf)
            label = detection_model.names[cls]
            
            detection_info = {
                "index": i,
                "label": label,
                "confidence": confidence,
                "class_id": cls,
                "bbox": box.xyxy[0].tolist() if hasattr(box.xyxy[0], 'tolist') else box.xyxy[0].cpu().tolist(),
                "box": box
            }
            
            if label.lower() in ['full_quadrat', 'half_quadrat']:
                if confidence >= CONFIDENCE_THRESHOLD:
                    detection_info["is_valid"] = True
                    valid_quadrats.append(detection_info)
                elif confidence >= 0.4:
                    detection_info["is_valid"] = False
                    low_confidence_quadrats.append(detection_info)
            
            all_detections.append(detection_info)

        # Determine which quadrats to process
        quadrats_to_process = valid_quadrats.copy()
        
        if manual_override and len(low_confidence_quadrats) > 0:
            print(f"Manual override: Including {len(low_confidence_quadrats)} low-confidence detections")
            quadrats_to_process.extend(low_confidence_quadrats)

        if len(quadrats_to_process) == 0:
            try:
                os.remove(image_path)
            except:
                pass
            
            if manual_override:
                return jsonify({
                    "error": "Manual override requested but no detections found to override",
                    "suggestion": "Try uploading the image through batch analysis for full-image processing"
                }), 400
            else:
                error_message = f"No valid coral quadrats detected above {CONFIDENCE_THRESHOLD:.0%} threshold"
                if low_confidence_quadrats:
                    highest_conf = max([d['confidence'] for d in low_confidence_quadrats])
                    error_message += f". Highest confidence: {highest_conf:.3f}"
                
                return jsonify({
                    "error": error_message,
                    "confidence_threshold": CONFIDENCE_THRESHOLD,
                    "low_confidence_detections": len(low_confidence_quadrats),
                    "manual_override_available": len(low_confidence_quadrats) > 0
                }), 400

        # Process the selected quadrats
        crops = []
        segmentation_results = []
        
        for i, detection in enumerate(quadrats_to_process):
            try:
                box = detection["box"]
                x1, y1, x2, y2 = detection["bbox"]
                confidence = detection["confidence"]
                label = detection["label"]
                is_low_confidence = confidence < CONFIDENCE_THRESHOLD

                cropped = enhanced_crop_inside_quadrat(image_path, [x1, y1, x2, y2], crop_intensity)
                cropped = enhance_cropped_image(cropped)

                # Add indicators to filename
                override_suffix = "_manual" if manual_override and is_low_confidence else ""
                crop_filename = f"{label}_{i}_{crop_intensity}{override_suffix}_{safe_filename}"
                crop_path = os.path.join(OUTPUT_FOLDER, crop_filename)
                cropped.save(crop_path, quality=95)

                # Segment and create overlay
                coverage_data, class_masks, overlay_image, mask_image, total_pixels = segment_coral_lifeforms(crop_path)
                
                # Save overlay
                overlay_filename = f"overlay_{crop_filename}"
                overlay_path = os.path.join(MASKS_FOLDER, overlay_filename)
                if overlay_image is not None:
                    overlay_bgr = cv2.cvtColor(overlay_image, cv2.COLOR_RGB2BGR)
                    cv2.imwrite(overlay_path, overlay_bgr)

                # Save mask
                mask_filename = f"mask_{crop_filename}"
                mask_path = os.path.join(MASKS_FOLDER, mask_filename)
                if mask_image is not None:
                    mask_bgr = cv2.cvtColor(mask_image, cv2.COLOR_RGB2BGR)
                    cv2.imwrite(mask_path, mask_bgr)

                # Add to results
                segmentation_results.append({
                    'crop_url': f"crops/{crop_filename}",
                    'overlay_url': f"masks/{overlay_filename}",
                    'mask_url': f"masks/{mask_filename}",
                    'coverage_data': coverage_data,
                    'total_pixels': total_pixels,
                    'detection_label': label,
                    'confidence': confidence,
                    'manually_included': manual_override and is_low_confidence,
                    'below_threshold': is_low_confidence
                })

                crops.append(f"crops/{crop_filename}")
                
            except Exception as e:
                print(f"Error processing quadrat {i}: {str(e)}")
                continue
                
        try:
            os.remove(image_path)
        except:
            pass

        if len(crops) == 0:
            return jsonify({
                "error": "Quadrats detected but could not be processed",
                "confidence_threshold": CONFIDENCE_THRESHOLD
            }), 400
        
        # Log the analysis
        detection_results_data = {
            'highest_confidence': max([d['confidence'] for d in quadrats_to_process]),
            'total_detections': len(all_detections),
            'valid_detections': len(valid_quadrats),
            'manual_overrides': len([d for d in quadrats_to_process if d['confidence'] < CONFIDENCE_THRESHOLD])
        }
        
        log_image_detection_activity(
            user_id=user_id,
            filename=file.filename,
            detection_results=detection_results_data,
            crop_count=len(crops),
            method=crop_intensity
        )

        return jsonify({
            "crops": crops,
            "segmentation_data": segmentation_results,
            "method": crop_intensity,
            "original_filename": file.filename,
            "valid_quadrats": len(valid_quadrats),
            "manual_overrides": len([d for d in quadrats_to_process if d['confidence'] < CONFIDENCE_THRESHOLD]),
            "confidence_threshold": CONFIDENCE_THRESHOLD,
            "total_detections": len(all_detections),
            "processing_details": {
                "manual_override_used": manual_override,
                "low_confidence_included": any(d['confidence'] < CONFIDENCE_THRESHOLD for d in quadrats_to_process)
            }
        })
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
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
        user_id = get_user_id_from_session()
        valid_count = sum(1 for result in validation_results if result['valid'])
        invalid_count = len(validation_results) - valid_count

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

        log_image_validation_activity(
            user_id=user_id,
            total_images=len(validation_results),
            valid_images=valid_count,
            invalid_images=invalid_count
        )
        
        return jsonify({
            "validation_results": validation_results,
            "total_images": len(validation_results),
            "valid_images": sum(1 for result in validation_results if result['valid']),
            "invalid_images": sum(1 for result in validation_results if not result['valid'])
        })
        
    except Exception as e:
        log_system_action(
            user_id=user_id,
            action='validation_error',
            description=f"Error during image validation",
            details={'error': str(e)}
        )
        print(f"Validation error: {str(e)}")
        return jsonify({"error": f"Validation failed: {str(e)}"}), 500

def detect_crop_and_segment():
    """Enhanced endpoint that saves to database"""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    user_id = get_user_id_from_session()
    
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
            
        file = request.files['image']
        uploader_id = request.form.get('uploader_id', 1)  # Default to user ID 1
        
        log_image_upload(
            user_id=user_id,
            filename=file.filename,
            image_count=1
        )

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
                image_id = save_image_to_database_with_override(
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
        if crops_data:
            for crop in crops_data:
                log_image_segmentation_activity(
                    user_id=user_id,
                    filename=crop['crop_url'],
                    coverage_data=crop['coverage_data'],
                    total_pixels=crop['total_pixels']
                )
        log_system_action(
            user_id=user_id,
            action='image_database_save',
            description=f"Saved {len(crops_data)} processed images to database from {file.filename}",
            details={
                'original_filename': file.filename,
                'crops_saved': len(crops_data),
                'segmentation_enabled': segmentation_model is not None
            }
        )
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
        log_system_action(
            user_id=user_id,
            action='segmentation_error',
            description=f"Error during detection and segmentation of {file.filename if 'file' in locals() else 'unknown file'}",
            details={'error': str(e)}
        )
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
    """Enhanced batch analysis with proper manual override support and shorter filenames"""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    user_id = get_user_id_from_session()
    
    try:
        files = request.files.getlist('images')
        if not files:
            return jsonify({"error": "No image files provided"}), 400

        # Get manual override information from form data
        manually_included = request.form.get('manually_included', '[]')
        debug_info = request.form.get('debug_info', '{}')
        
        try:
            manually_included_indices = json.loads(manually_included) if manually_included else []
            debug_data = json.loads(debug_info) if debug_info else {}
        except:
            manually_included_indices = []
            debug_data = {}

        uploader_id = user_id
        crop_intensity = request.form.get('intensity', 'conservative')
        
        # Enhanced debugging
        print(f"\n🔍 BATCH ANALYSIS DEBUG:")
        print(f"   📁 Total files received: {len(files)}")
        print(f"   🔧 Manually included indices: {manually_included_indices}")
        print(f"   📊 Debug info from frontend: {debug_data}")
        print(f"   🎯 Crop intensity: {crop_intensity}")
        
        # Log filenames for debugging
        for i, file in enumerate(files):
            is_manual = i in manually_included_indices
            print(f"   📄 File {i}: {file.filename} {'(MANUAL OVERRIDE)' if is_manual else ''}")
        
        log_system_action(
            user_id=user_id,
            action='batch_upload_started',
            description=f"Started batch analysis of {len(files)} images ({len(manually_included_indices)} manually included)",
            details={
                'file_count': len(files),
                'crop_intensity': crop_intensity,
                'manually_included_count': len(manually_included_indices),
                'manually_included_indices': manually_included_indices,
                'debug_info': debug_data
            }
        )

        if not ensure_user_exists(uploader_id):
            return jsonify({"error": f"Cannot create or find user with ID {uploader_id}"}), 400
        
        all_results = []
        batch_coverage_data = {}
        batch_total_pixels = 0
        rejected_images = []
        
        CONFIDENCE_THRESHOLD = 0.87
        
        for file_index, file in enumerate(files):
            if not file or file.filename == '':
                continue

            progress_percentage = ((file_index + 1) / len(files)) * 100
            print(f"🔄 Processing file {file_index + 1}/{len(files)} ({progress_percentage:.1f}%): {file.filename}")
                
            # Check if this file was manually included
            is_manually_included = file_index in manually_included_indices
            print(f"\n🔄 Processing file {file_index}: {file.filename}")
            print(f"   🔧 Manual override: {is_manually_included}")
                
            # Validate file extension
            allowed_extensions = {'png', 'jpg', 'jpeg', 'webp'}
            ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
            if ext not in allowed_extensions:
                rejected_images.append({
                    'filename': file.filename,
                    'reason': 'Invalid file type',
                    'file_index': file_index
                })
                continue
                
            # Process each file
            unique_id = str(uuid.uuid4())[:6]  # Shortened to 6 characters
            safe_filename = f"b{file_index}_{unique_id}.{ext}"  # Shortened batch filename
            image_path = os.path.join(UPLOAD_FOLDER, safe_filename)
            
            file.save(image_path)
            
            # Detection and processing
            try:
                detection_results = detection_model(image_path)
            except Exception as e:
                print(f"❌ Detection failed for {file.filename}: {e}")
                rejected_images.append({
                    'filename': file.filename,
                    'reason': f'Detection model failed: {str(e)}',
                    'file_index': file_index
                })
                try:
                    os.remove(image_path)
                except:
                    pass
                continue
            
            # Enhanced detection handling for manual overrides
            valid_detections = []
            low_confidence_detections = []
            
            if detection_results[0].boxes:
                print(f"   🎯 Found {len(detection_results[0].boxes)} detections")
                for box_idx, box in enumerate(detection_results[0].boxes):
                    cls = int(box.cls)
                    confidence = float(box.conf)
                    label = detection_model.names[cls]
                    
                    print(f"      Detection {box_idx}: {label} @ {confidence:.3f}")
                    
                    if label.lower() in ['full_quadrat', 'half_quadrat']:
                        if confidence >= CONFIDENCE_THRESHOLD:
                            print(f"      ✅ Valid detection (>= {CONFIDENCE_THRESHOLD})")
                            valid_detections.append(box)
                        elif confidence >= 0.4:
                            print(f"      ⚠️ Low confidence detection (>= 0.4)")
                            if is_manually_included:
                                print(f"      🔧 Including due to manual override")
                                valid_detections.append(box)
                            else:
                                print(f"      ❌ Skipping (not manually included)")
                                low_confidence_detections.append(box)
                        else:
                            print(f"      ❌ Very low confidence (< 0.4) - ignoring")
            else:
                print(f"   ❌ No detections found")
            
            # Handle different scenarios
            if len(valid_detections) == 0:
                if is_manually_included:
                    print(f"   🔧 Manual override: No valid detections, processing full image")
                    
                    img = cv2.imread(image_path)
                    if img is not None:
                        height, width = img.shape[:2]
                        
                        # Create a mock detection for the entire image
                        class MockBox:
                            def __init__(self, width, height):
                                margin_x = width * 0.05
                                margin_y = height * 0.05
                                
                                self.xyxy = [[
                                    margin_x, 
                                    margin_y, 
                                    width - margin_x, 
                                    height - margin_y
                                ]]
                                self.conf = 0.5
                                self.cls = None
                                
                        mock_detection = MockBox(width, height)
                        valid_detections.append(mock_detection)
                        print(f"   ✅ Created full-image mock detection")
                    else:
                        print(f"   ❌ Could not load image for manual processing")
                        rejected_images.append({
                            'filename': file.filename,
                            'reason': 'Could not load image for manual processing',
                            'file_index': file_index
                        })
                        try:
                            os.remove(image_path)
                        except:
                            pass
                        continue
                else:
                    print(f"   ❌ No valid detections and not manually included - rejecting")
                    rejected_images.append({
                        'filename': file.filename,
                        'reason': f'No coral quadrats detected above {CONFIDENCE_THRESHOLD:.0%} threshold',
                        'file_index': file_index,
                        'detection_details': {
                            'low_confidence_count': len(low_confidence_detections),
                            'highest_confidence': max([float(box.conf) for box in low_confidence_detections]) if low_confidence_detections else 0
                        }
                    })
                    try:
                        os.remove(image_path)
                    except:
                        pass
                    continue
            
            print(f"   🔬 Processing {len(valid_detections)} detections")
            
            # Process valid detections
            image_crops = []
            
            for i, box in enumerate(valid_detections):
                try:
                    print(f"      Processing detection {i+1}/{len(valid_detections)}")
                    
                    x1, y1, x2, y2 = box.xyxy[0].tolist() if hasattr(box.xyxy[0], 'tolist') else box.xyxy[0]
                    
                    # Determine label
                    if hasattr(box, 'cls') and box.cls is not None:
                        cls = int(box.cls)
                        label = detection_model.names[cls]
                    else:
                        label = "manual"  # Shortened
                    
                    # Get confidence
                    confidence = float(box.conf) if hasattr(box, 'conf') else 0.5

                    # Crop and segment
                    cropped = enhanced_crop_inside_quadrat(image_path, [x1, y1, x2, y2], crop_intensity)
                    cropped = enhance_cropped_image(cropped)

                    # FIXED: Much shorter filename generation
                    label_short = "fq" if label == "full_quadrat" else "hq" if label == "half_quadrat" else "m"
                    manual_suffix = "_m" if is_manually_included else ""
                    confidence_suffix = "_l" if confidence < CONFIDENCE_THRESHOLD else ""
                    
                    # Short filename: fq_0_1_m_l_abc123.jpg (maximum ~20 characters)
                    crop_filename = f"{label_short}_{i}_{file_index}{manual_suffix}{confidence_suffix}_{unique_id}.{ext}"
                    
                    print(f"         📝 Generated filename: {crop_filename} (length: {len(crop_filename)})")
                    
                    crop_path = os.path.join(OUTPUT_FOLDER, crop_filename)
                    cropped.save(crop_path, quality=95)

                    print(f"         💾 Saved crop: {crop_filename}")

                    # Segment the cropped image
                    coverage_data, class_masks, overlay_image, mask_image, total_pixels = segment_coral_lifeforms(crop_path)
                    
                    print(f"         🔬 Segmentation: {len(coverage_data)} coral types, {total_pixels} pixels")
                    
                    # Save overlay image
                    overlay_filename = f"ov_{crop_filename}"  # Shortened overlay prefix
                    overlay_path = os.path.join(MASKS_FOLDER, overlay_filename)
                    if overlay_image is not None:
                        overlay_bgr = cv2.cvtColor(overlay_image, cv2.COLOR_RGB2BGR)
                        cv2.imwrite(overlay_path, overlay_bgr)
                        print(f"         💾 Saved overlay: {overlay_filename}")

                    # Save mask image
                    mask_filename = f"mk_{crop_filename}"  # Shortened mask prefix
                    mask_path = os.path.join(MASKS_FOLDER, mask_filename)
                    if mask_image is not None:
                        mask_bgr = cv2.cvtColor(mask_image, cv2.COLOR_RGB2BGR)
                        cv2.imwrite(mask_path, mask_bgr)
                        print(f"         💾 Saved mask: {mask_filename}")

                    # Save to database with proper flags
                    image_id = save_image_to_database_with_override(
                        crop_filename, 
                        uploader_id, 
                        total_pixels, 
                        total_pixels, 
                        confidence,
                        is_manually_included,
                        file.filename
                    )
                    
                    if image_id is None:
                        print(f"         ❌ Failed to save to database")
                        continue
                    else:
                        print(f"         ✅ Saved to database with ID: {image_id}")
                    
                    # Save segmentation results to database
                    if image_id and coverage_data:
                        segmentation_saved = save_segmentation_results(
                            image_id, 
                            coverage_data, 
                            f"masks/{overlay_filename}"
                        )
                        
                        if segmentation_saved:
                            log_image_segmentation_activity(
                                user_id=user_id,
                                filename=crop_filename,
                                coverage_data=coverage_data,
                                total_pixels=total_pixels
                            )
                            print(f"         ✅ Saved segmentation results")
                        else:
                            print(f"         ❌ Failed to save segmentation results")

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

                    # Create the crop result object
                    crop_result = {
                        'crop_url': f"crops/{crop_filename}",
                        'overlay_url': f"masks/{overlay_filename}",
                        'mask_url': f"masks/{mask_filename}",
                        'visualization_url': f"masks/{overlay_filename}",
                        'coverage_data': coverage_data,
                        'total_pixels': total_pixels,
                        'detection_label': label,
                        'image_id': image_id,
                        'manually_included': is_manually_included,
                        'confidence': confidence,
                        'below_threshold': confidence < CONFIDENCE_THRESHOLD,
                        'detection_type': 'manual_override' if not hasattr(box, 'cls') else 'detected'
                    }
                    
                    image_crops.append(crop_result)
                    print(f"         ✅ Added crop result")

                except Exception as e:
                    print(f"         ❌ Error processing crop {i}: {e}")
                    import traceback
                    traceback.print_exc()
                    continue
            
            # Add results if we have crops
            if image_crops:
                result = {
                    'filename': file.filename,
                    'crops': image_crops,
                    'processed': True,
                    'manually_included': is_manually_included,
                    'file_index': file_index,
                    'detection_summary': {
                        'total_crops': len(image_crops),
                        'manual_override': is_manually_included,
                        'low_confidence_included': any(crop['below_threshold'] for crop in image_crops)
                    }
                }
                
                all_results.append(result)
                print(f"   ✅ Added result: {len(image_crops)} crops, manual: {is_manually_included}")
            else:
                print(f"   ❌ No crops generated")
            
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

        successful_images = len(all_results)
        total_crops = sum(len(result['crops']) for result in all_results)
        manually_included_count = sum(1 for result in all_results if result.get('manually_included', False))

        print(f"\n🎯 BATCH ANALYSIS SUMMARY:")
        print(f"   📊 Total files: {len(files)}")
        print(f"   ✅ Processed: {successful_images}")
        print(f"   🔧 Manually included: {manually_included_count}")
        print(f"   ❌ Rejected: {len(rejected_images)}")
        print(f"   🔬 Total crops: {total_crops}")
        
        # Debug: Show which files were processed
        for result in all_results:
            manual_status = "(MANUAL)" if result.get('manually_included', False) else ""
            print(f"      ✅ {result['filename']} -> {len(result['crops'])} crops {manual_status}")

        log_batch_analysis_activity(
            user_id=user_id,
            total_images=len(files),
            successful_images=successful_images,
            rejected_images=rejected_images,
            total_crops=total_crops
        )

        return jsonify({
            "results": all_results,
            "rejected_images": rejected_images,
            "batch_statistics": {
                "total_images_processed": len(all_results),
                "total_images_rejected": len(rejected_images),
                "manually_included_count": manually_included_count,
                "total_crops": total_crops,
                "total_pixels": batch_total_pixels,
                "coverage_summary": list(batch_coverage_data.values())
            },
            "method": crop_intensity,
            "manual_overrides": {
                "enabled": len(manually_included_indices) > 0,
                "count": manually_included_count,
                "indices": manually_included_indices
            },
            "processing_details": {
                "confidence_threshold": CONFIDENCE_THRESHOLD,
                "low_confidence_processed": sum(1 for result in all_results 
                                              if any(crop.get('below_threshold', False) for crop in result['crops'])),
                "debug_info": debug_data
            }
        })

    except Exception as e:
        log_system_action(
            user_id=user_id,
            action='batch_analysis_error',
            description=f"Error during batch analysis",
            details={'error': str(e), 'file_count': len(files) if 'files' in locals() else 0}
        )
        print(f"❌ Batch analysis error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Batch analysis failed: {str(e)}"}), 500    
    
def save_image_to_database_with_override(filename, uploader_id, total_pixels, analyzed_area_px, analysis_confidence, manually_included=False, original_filename=None):
    """Enhanced save function with manual override support"""
    conn = get_db_connection()
    if conn is None:
        return None
    
    try:
        with conn.cursor() as cur:
            # Get user role
            cur.execute("SELECT roletype FROM users WHERE id = %s", (uploader_id,))
            user_result = cur.fetchone()
            
            if user_result:
                user_role = user_result[0].lower()
                upload_status = 'approved' if user_role in ['admin', 'biologist'] else 'pending'
            else:
                upload_status = 'pending'
            
            # Determine processing status based on manual override
            if manually_included:
                processing_status = 'manually_included_completed'
            else:
                processing_status = 'completed'
            
            cur.execute("""
                INSERT INTO images (
                    filename, 
                    uploader_id, 
                    uploaded_at, 
                    total_pixels, 
                    analyzed_area_px, 
                    analysis_confidence, 
                    processing_status, 
                    upload_status,
                    original_image_path,
                    manual_override
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                filename, 
                uploader_id, 
                datetime.now(), 
                total_pixels, 
                analyzed_area_px, 
                analysis_confidence, 
                processing_status, 
                upload_status,
                original_filename,
                manually_included
            ))
            
            image_id = cur.fetchone()[0]
            conn.commit()
            
            log_system_action(
                user_id=uploader_id,
                action='image_saved_with_override_info',
                description=f"Saved image {filename} (manual override: {manually_included})",
                details={
                    'image_id': image_id,
                    'filename': filename,
                    'original_filename': original_filename,
                    'manually_included': manually_included,
                    'processing_status': processing_status,
                    'upload_status': upload_status
                }
            )

            return image_id
    except Exception as e:
        print(f"Database error saving image with override info: {e}")
        conn.rollback()
        return None
    finally:
        conn.close()

def save_segmentation_results(image_id, coverage_data, overlay_path):
    """Save segmentation results to database with improved error handling"""
    conn = get_db_connection()
    if conn is None:
        print("❌ Database connection failed in save_segmentation_results")
        return False
    
    try:
        with conn.cursor() as cur:
            
            if not coverage_data:
                print("⚠️ No coverage data to save")
                return True  # Not an error, just no data
            
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
                    print(f"❌ Could not find/create coral lifeform: {coral_data['class_name']}")
                    continue
                    
                class_id = result[0]
                try:
                    cur.execute("""
                        INSERT INTO segmentation_results 
                        (image_id, class_id, area_px, coverage_percent, overlay_path, mask_path)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (
                        image_id, 
                        class_id, 
                        coral_data['pixel_count'], 
                        coral_data['coverage_percent'], 
                        overlay_path,
                        overlay_path  # Use same path for both overlay and mask for now
                    ))
                   
                except psycopg2.errors.UndefinedColumn as e:
                    if "overlay_path" in str(e):
                        print("⚠️ overlay_path column doesn't exist, using mask_path only")
                        # Fallback to mask_path only
                        cur.execute("""
                            INSERT INTO segmentation_results 
                            (image_id, class_id, area_px, coverage_percent, mask_path)
                            VALUES (%s, %s, %s, %s, %s)
                        """, (
                            image_id, 
                            class_id, 
                            coral_data['pixel_count'], 
                            coral_data['coverage_percent'], 
                            overlay_path
                        ))
                        print(f"✅ Saved segmentation result with mask_path for {coral_data['class_name']}")
                    else:
                        raise e
            
            conn.commit()
            return True
            
    except Exception as e:
        print(f"❌ Database error saving segmentation: {e}")
        import traceback
        traceback.print_exc()
        conn.rollback()
        return False
    finally:
        conn.close()

def ensure_user_exists(uploader_id):
    """Ensure the user exists in the database"""
    conn = get_db_connection()
    if conn is None:
        return False
    
    try:
        with conn.cursor() as cur:
            # Check if user exists
            cur.execute("SELECT id FROM users WHERE id = %s", (uploader_id,))
            if cur.fetchone():
                return True
            
            # If user doesn't exist, create a default admin user
            print(f"User {uploader_id} not found, creating default admin user...")
            cur.execute("""
                INSERT INTO users (id, username, password, firstname, lastname, roletype, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())
                ON CONFLICT (id) DO NOTHING
            """, (
                uploader_id,
                f"admin{uploader_id}",
                "scrypt:32768:8:1$placeholder",  # Placeholder password hash
                "Default",
                "Admin",
                "admin"
            ))
            
            conn.commit()
            print(f"Created default user with ID {uploader_id}")
            return True
            
    except Exception as e:
        print(f"Error ensuring user exists: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

@image_bp.route("/analysis_stats", methods=["GET"])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def get_analysis_stats():
    """Get image analysis statistics for dashboard"""
    user_id = get_user_id_from_session()
    
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Get recent image analysis activities
            cur.execute("""
                SELECT activity_type, COUNT(*) as count, MAX(created_at) as last_activity
                FROM activities 
                WHERE category = 'image_analysis' 
                AND created_at >= NOW() - INTERVAL '30 days'
                GROUP BY activity_type
                ORDER BY count DESC
            """)
            
            activity_stats = []
            for row in cur.fetchall():
                activity_stats.append({
                    'activity_type': row[0],
                    'count': row[1],
                    'last_activity': row[2].isoformat() if row[2] else None
                })
            
            # Log the stats request
            log_system_action(
                user_id=user_id,
                action='analysis_stats_viewed',
                description="Viewed image analysis statistics",
                details={'stats_count': len(activity_stats)}
            )
            
            return jsonify({
                "analysis_stats": activity_stats,
                "period": "Last 30 days"
            })
            
    except Exception as e:
        log_system_action(
            user_id=user_id,
            action='stats_error',
            description="Error retrieving analysis statistics",
            details={'error': str(e)}
        )
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@image_bp.route("/upload_status_info", methods=["GET"])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def get_upload_status_info():
    """Get upload status information for the current user"""
    user_id = get_user_id_from_session()
    
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Get user role
            cur.execute("SELECT roletype FROM users WHERE id = %s", (user_id,))
            user_result = cur.fetchone()
            
            if not user_result:
                return jsonify({"error": "User not found"}), 404
            
            user_role = user_result[0].lower()
            auto_approved = user_role in ['admin', 'biologist']
            
            # Get upload statistics for the user
            cur.execute("""
                SELECT upload_status, COUNT(*) as count
                FROM images 
                WHERE uploader_id = %s 
                GROUP BY upload_status
            """, (user_id,))
            
            status_counts = {}
            for row in cur.fetchall():
                status_counts[row[0]] = row[1]
            
            return jsonify({
                "user_role": user_role,
                "auto_approved": auto_approved,
                "upload_status_message": f"Your uploads are {'automatically approved' if auto_approved else 'pending approval'}",
                "status_counts": status_counts
            })
            
    except Exception as e:
        log_system_action(
            user_id=user_id,
            action='upload_status_error',
            description="Error retrieving upload status information",
            details={'error': str(e)}
        )
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@image_bp.route("/manage_uploads", methods=["GET", "POST"])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def manage_uploads():
    """Manage image upload approvals (Admin only)"""
    user_id = get_user_id_from_session()
    
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Check if user is admin
            cur.execute("SELECT roletype FROM users WHERE id = %s", (user_id,))
            user_result = cur.fetchone()
            
            if not user_result or user_result[0].lower() != 'admin':
                return jsonify({"error": "Admin access required"}), 403
            
            if request.method == "GET":
                # Get pending uploads
                cur.execute("""
                    SELECT i.id, i.filename, i.uploader_id, i.uploaded_at, i.upload_status,
                           u.username, u.firstname, u.lastname, u.roletype
                    FROM images i
                    JOIN users u ON i.uploader_id = u.id
                    WHERE i.upload_status = 'pending'
                    ORDER BY i.uploaded_at DESC
                """)
                
                pending_uploads = []
                for row in cur.fetchall():
                    pending_uploads.append({
                        'image_id': row[0],
                        'filename': row[1],
                        'uploader_id': row[2],
                        'uploaded_at': row[3].isoformat() if row[3] else None,
                        'upload_status': row[4],
                        'uploader_username': row[5],
                        'uploader_name': f"{row[6]} {row[7]}",
                        'uploader_role': row[8]
                    })
                
                return jsonify({
                    "pending_uploads": pending_uploads,
                    "total_pending": len(pending_uploads)
                })
            
            elif request.method == "POST":
                # Approve or reject uploads
                data = request.get_json()
                image_ids = data.get('image_ids', [])
                action = data.get('action')  # 'approve' or 'reject'
                
                if not image_ids or action not in ['approve', 'reject']:
                    return jsonify({"error": "Invalid request data"}), 400
                
                new_status = 'approved' if action == 'approve' else 'rejected'
                
                # Update upload status
                placeholders = ','.join(['%s'] * len(image_ids))
                cur.execute(f"""
                    UPDATE images 
                    SET upload_status = %s 
                    WHERE id IN ({placeholders})
                """, [new_status] + image_ids)
                
                affected_rows = cur.rowcount
                conn.commit()
                
                log_system_action(
                    user_id=user_id,
                    action=f'uploads_{action}d',
                    description=f"{action.capitalize()}d {affected_rows} image upload(s)",
                    details={
                        'image_ids': image_ids,
                        'new_status': new_status,
                        'affected_count': affected_rows
                    }
                )
                
                return jsonify({
                    "message": f"Successfully {action}d {affected_rows} upload(s)",
                    "affected_count": affected_rows,
                    "new_status": new_status
                })
                
    except Exception as e:
        log_system_action(
            user_id=user_id,
            action='upload_management_error',
            description="Error managing upload approvals",
            details={'error': str(e)}
        )
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()


@image_bp.route("/guest_upload_only", methods=["POST", "OPTIONS"])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def guest_upload_only():
    """Dedicated endpoint for guest users - upload and save cropped images with pending status"""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    user_id = get_user_id_from_session()
    
    try:
        files = request.files.getlist('images')
        if not files:
            return jsonify({"error": "No image files provided"}), 400

        crop_intensity = request.form.get('intensity', 'conservative')
        
        # Verify user is guest
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            cur.execute("SELECT roletype FROM users WHERE id = %s", (user_id,))
            user_result = cur.fetchone()
            
            if not user_result:
                return jsonify({"error": "User not found"}), 404
            
            user_role = user_result[0].lower()
            
            if user_role != 'guest':
                return jsonify({"error": "This endpoint is for guest users only"}), 403
        
        conn.close()
        
        log_system_action(
            user_id=user_id,
            action='guest_upload_started',
            description=f"Guest started upload of {len(files)} images (upload-only mode with cropping)",
            details={
                'file_count': len(files),
                'crop_intensity': crop_intensity,
                'mode': 'upload_and_crop'
            }
        )
        
        uploaded_images = []
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
                
            # Validate file size
            if file.content_length and file.content_length > 10 * 1024 * 1024:  # 10MB limit
                rejected_images.append({
                    'filename': file.filename,
                    'reason': 'File too large (max 10MB)'
                })
                continue
            
            # Process each file for cropping and saving
            unique_id = str(uuid.uuid4())[:8]
            safe_filename = f"guest_upload_{file_index}_{unique_id}.{ext}"
            temp_path = os.path.join(UPLOAD_FOLDER, safe_filename)
            
            try:
                file.save(temp_path)
                
                # Basic image validation
                try:
                    img = cv2.imread(temp_path)
                    if img is None:
                        rejected_images.append({
                            'filename': file.filename,
                            'reason': 'Invalid image file'
                        })
                        os.remove(temp_path)
                        continue
                        
                    height, width = img.shape[:2]
                    if width < 200 or height < 200:
                        rejected_images.append({
                            'filename': file.filename,
                            'reason': 'Image too small (minimum 200x200 pixels)'
                        })
                        os.remove(temp_path)
                        continue
                        
                except Exception as e:
                    rejected_images.append({
                        'filename': file.filename,
                        'reason': f'Image validation failed: {str(e)}'
                    })
                    os.remove(temp_path)
                    continue
                
                # Run detection and crop quadrats
                try:
                    detection_results = detection_model(temp_path)
                    
                    valid_quadrats = []
                    
                    if detection_results[0].boxes:
                        for box in detection_results[0].boxes:
                            cls = int(box.cls)
                            confidence = float(box.conf)
                            label = detection_model.names[cls]
                            
                            if label.lower() in ['full_quadrat', 'half_quadrat'] and confidence > 0.4:
                                valid_quadrats.append({
                                    'box': box,
                                    'label': label,
                                    'confidence': confidence
                                })
                    
                    if len(valid_quadrats) == 0:
                        rejected_images.append({
                            'filename': file.filename,
                            'reason': 'No coral quadrats detected'
                        })
                        os.remove(temp_path)
                        continue
                    
                    # Process and save each detected quadrat as a separate cropped image
                    file_crops = []
                    
                    for quadrat_index, quadrat_data in enumerate(valid_quadrats):
                        box = quadrat_data['box']
                        label = quadrat_data['label']
                        confidence = quadrat_data['confidence']
                        
                        x1, y1, x2, y2 = box.xyxy[0].tolist()
                        
                        # Create enhanced crop
                        cropped = enhanced_crop_inside_quadrat(temp_path, [x1, y1, x2, y2], crop_intensity)
                        cropped = enhance_cropped_image(cropped)
                        
                        # Create unique filename for the cropped image
                        crop_filename = f"guest_crop_{label}_{quadrat_index}_{file_index}_{user_id}_{unique_id}.{ext}"
                        crop_path = os.path.join(OUTPUT_FOLDER, crop_filename)
                        
                        # Save cropped image
                        cropped.save(crop_path, quality=95)
                        
                        # Get cropped image dimensions for database
                        crop_width, crop_height = cropped.size
                        total_pixels = crop_width * crop_height
                        
                        # Save cropped image to database with pending status
                        image_id = save_guest_cropped_to_database(
                            crop_filename,
                            user_id,
                            total_pixels,
                            confidence,
                            file.filename,  # Original filename for reference
                            label,
                            crop_intensity,
                            quadrat_index + 1  # Quadrat number (1-based)
                        )
                        
                        if image_id:
                            file_crops.append({
                                'image_id': image_id,
                                'crop_filename': crop_filename,
                                'quadrat_type': label,
                                'confidence': round(confidence, 2),
                                'crop_url': f"crops/{crop_filename}",
                                'quadrat_number': quadrat_index + 1,
                                'total_pixels': total_pixels,
                                'status': 'pending'
                            })
                        else:
                            # If saving failed, remove the cropped file
                            try:
                                os.remove(crop_path)
                            except:
                                pass
                    
                    if file_crops:
                        uploaded_images.append({
                            'original_filename': file.filename,
                            'crops': file_crops,
                            'total_quadrats': len(file_crops),
                            'crop_intensity': crop_intensity,
                            'status': 'pending'
                        })
                    else:
                        rejected_images.append({
                            'filename': file.filename,
                            'reason': 'Failed to save cropped quadrats to database'
                        })
                        
                except Exception as e:
                    rejected_images.append({
                        'filename': file.filename,
                        'reason': f'Processing failed: {str(e)}'
                    })
                    
                finally:
                    # Clean up temporary original file
                    try:
                        os.remove(temp_path)
                    except:
                        pass
                        
            except Exception as e:
                rejected_images.append({
                    'filename': file.filename,
                    'reason': f'Upload failed: {str(e)}'
                })
                continue
        
        # Calculate totals
        total_crops_saved = sum(len(img['crops']) for img in uploaded_images)
        
        # Log the upload results
        log_batch_analysis_activity(
            user_id=user_id,
            total_images=len(files),
            successful_images=len(uploaded_images),
            rejected_images=rejected_images,
            total_crops=total_crops_saved
        )
        
        return jsonify({
            "uploaded_images": uploaded_images,
            "rejected_images": rejected_images,
            "upload_statistics": {
                "total_images_submitted": len(files),
                "successfully_uploaded": len(uploaded_images),
                "total_crops_saved": total_crops_saved,
                "rejected_images": len(rejected_images),
                "status": "pending_review"
            },
            "message": f"Successfully processed {len(uploaded_images)} images into {total_crops_saved} cropped quadrats. They are now pending review by coral experts."
        })

    except Exception as e:
        log_system_action(
            user_id=user_id,
            action='guest_upload_error',
            description=f"Error during guest upload",
            details={'error': str(e), 'file_count': len(files) if 'files' in locals() else 0}
        )
        print(f"Guest upload error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500

def save_guest_cropped_to_database(filename, uploader_id, total_pixels, confidence, original_filename, quadrat_type, crop_intensity, quadrat_number):
    """Save guest cropped quadrat image to database with pending status"""
    conn = get_db_connection()
    if conn is None:
        return None
    
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO images (
                    filename, 
                    uploader_id, 
                    uploaded_at, 
                    total_pixels,
                    analyzed_area_px,
                    analysis_confidence, 
                    processing_status, 
                    upload_status,
                    quadrat_crop_path,
                    original_image_path
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                filename,                    # The cropped filename
                uploader_id, 
                datetime.now(), 
                total_pixels,               # Pixels in cropped image
                total_pixels,               # All pixels are "analyzed area" for cropped image
                confidence,                 # Detection confidence
                'cropped_pending',          # Processing status indicating it's cropped but pending approval
                'pending',                  # Upload status
                filename,                   # Quadrat crop path (same as filename since it's already cropped)
                original_filename           # Original image path for reference
            ))
            
            image_id = cur.fetchone()[0]
            conn.commit()
            
            log_system_action(
                user_id=uploader_id,
                action='guest_cropped_image_saved',
                description=f"Guest saved cropped quadrat {filename} from {original_filename} (pending review)",
                details={
                    'image_id': image_id,
                    'cropped_filename': filename,
                    'original_filename': original_filename,
                    'quadrat_type': quadrat_type,
                    'crop_intensity': crop_intensity,
                    'quadrat_number': quadrat_number,
                    'confidence': confidence,
                    'total_pixels': total_pixels,
                    'status': 'pending'
                }
            )

            return image_id
    except Exception as e:
        print(f"Database error saving guest cropped image: {e}")
        conn.rollback()
        return None
    finally:
        conn.close()

@image_bp.route("/manual_override_analyze", methods=["POST", "OPTIONS"])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def manual_override_analyze():
    """Analyze a single image that was manually overridden"""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    user_id = get_user_id_from_session()
    
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
            
        file = request.files['image']
        crop_intensity = request.form.get('intensity', 'conservative')
        
        # Process the manually overridden image
        unique_id = str(uuid.uuid4())[:8]
        ext = file.filename.split('.')[-1].lower()
        safe_filename = f"manual_override_{unique_id}.{ext}"
        image_path = os.path.join(UPLOAD_FOLDER, safe_filename)
        
        file.save(image_path)
        
        # Skip detection and process entire image as one crop
        img = cv2.imread(image_path)
        height, width = img.shape[:2]
        
        # Create crop of entire image with margin
        cropped = enhanced_crop_inside_quadrat(image_path, [0, 0, width, height], crop_intensity)
        cropped = enhance_cropped_image(cropped)
        
        crop_filename = f"manual_override_{crop_intensity}_{safe_filename}"
        crop_path = os.path.join(OUTPUT_FOLDER, crop_filename)
        cropped.save(crop_path, quality=95)
        
        # Segment the image
        coverage_data, class_masks, visualization_mask, total_pixels = segment_coral_lifeforms(crop_path)
        
        # Save visualization
        viz_filename = f"manual_viz_{crop_filename}"
        viz_path = os.path.join(MASKS_FOLDER, viz_filename)
        if visualization_mask is not None:
            cv2.imwrite(viz_path, cv2.cvtColor(visualization_mask, cv2.COLOR_RGB2BGR))
        
        # Save to database with manual override flag
        image_id = save_image_to_database_with_override(
            crop_filename,
            user_id,
            total_pixels,
            total_pixels,
            0.5,  # Default confidence for manual override
            True,  # manually_included = True
            file.filename
        )
        
        if image_id and coverage_data:
            save_segmentation_results(image_id, coverage_data, f"masks/{viz_filename}")
        
        # Clean up
        try:
            os.remove(image_path)
        except:
            pass
        
        log_system_action(
            user_id=user_id,
            action='manual_override_analysis',
            description=f"Manually analyzed overridden image {file.filename}",
            details={
                'filename': file.filename,
                'image_id': image_id,
                'coral_types_found': len(coverage_data),
                'total_pixels': total_pixels
            }
        )
        
        return jsonify({
            "success": True,
            "crop_url": f"crops/{crop_filename}",
            "visualization_url": f"masks/{viz_filename}",
            "coverage_data": coverage_data,
            "total_pixels": total_pixels,
            "image_id": image_id,
            "manually_overridden": True,
            "message": "Manual override analysis completed successfully"
        })
        
    except Exception as e:
        log_system_action(
            user_id=user_id,
            action='manual_override_error',
            description=f"Error in manual override analysis",
            details={'error': str(e)}
        )
        return jsonify({"error": f"Manual override analysis failed: {str(e)}"}), 500