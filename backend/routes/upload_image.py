from flask import Blueprint, Flask, request, jsonify, send_from_directory
from flask_cors import CORS 
from ultralytics import YOLO 
from PIL import Image, ImageEnhance
import cv2
import numpy as np
import os
import uuid

image_bp = Blueprint('image', __name__)

model = YOLO("../models/autocrop_yolov11_best.pt")
UPLOAD_FOLDER = "../backend/coral_uploads"
OUTPUT_FOLDER = "../backend/coral_uploads/outputs"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
if not os.path.exists(OUTPUT_FOLDER):
    os.makedirs(OUTPUT_FOLDER)

@image_bp.route('/crops/<filename>')
def serve_crop(filename):
    return send_from_directory(OUTPUT_FOLDER, filename)

def enhanced_crop_inside_quadrat(image_path, bbox, crop_method='aggressive'):
    """Enhanced cropping to cut deeper inside the quadrat"""
    x1, y1, x2, y2 = bbox
    width = x2 - x1
    height = y2 - y1
    
    if crop_method == 'conservative':
        margin = 0.04  # 5% margin reduction
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
        
        # Additional validation for empty filename
        if file.filename == '':
            return jsonify({"error": "Empty filename"}), 400
            
        # Validate file extension
        allowed_extensions = {'jpg', 'jpeg', 'png', 'webp'}
        if '.' not in file.filename or file.filename.split('.')[-1].lower() not in allowed_extensions:
            return jsonify({"error": "Invalid file type"}), 400

        crop_intensity = request.form.get('intensity', 'aggressive')
        
        # Generate a completely unique filename to prevent any path-related issues
        unique_id = str(uuid.uuid4())[:8]
        ext = file.filename.split('.')[-1].lower()
        safe_filename = f"{unique_id}.{ext}"
        image_path = os.path.join(UPLOAD_FOLDER, safe_filename)
        
        try:
            file.save(image_path)
        except Exception as e:
            return jsonify({"error": f"Failed to save file: {str(e)}"}), 500

        try:
            results = model(image_path)
        except Exception as e:
            return jsonify({"error": f"Model processing failed: {str(e)}"}), 500

        crops = []
        for i, box in enumerate(results[0].boxes):
            try:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                cls = int(box.cls)
                label = model.names[cls]

                cropped = enhanced_crop_inside_quadrat(image_path, [x1, y1, x2, y2], crop_intensity)
                cropped = enhance_cropped_image(cropped)

                crop_filename = f"{label}_{i}_{crop_intensity}_{safe_filename}"
                crop_path = os.path.join(OUTPUT_FOLDER, crop_filename)
                cropped.save(crop_path, quality=95)

                crops.append(f"crops/{crop_filename}")
            except Exception as e:
                print(f"Error processing box {i}: {str(e)}")
                continue

        # Clean up original file
        try:
            os.remove(image_path)
        except:
            pass

        return jsonify({
            "crops": crops,
            "method": crop_intensity,
            "original_filename": file.filename  # Return original for reference
        })
        
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500