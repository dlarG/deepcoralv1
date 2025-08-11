from flask import Blueprint, Flask, request, jsonify, send_from_directory
from flask_cors import CORS 
from ultralytics import YOLO 
from PIL import Image, ImageEnhance
import cv2
import numpy as np
import os

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
    """
    Enhanced cropping to cut deeper inside the quadrat
    Methods:
    - 'conservative': 5% margin reduction
    - 'moderate': 12% margin reduction  
    - 'aggressive': 18% margin reduction
    - 'smart': Uses edge detection + margin reduction
    """
    
    x1, y1, x2, y2 = bbox
    width = x2 - x1
    height = y2 - y1
    
    if crop_method == 'conservative':
        margin = 0.05  # 5% margin reduction
    elif crop_method == 'moderate':
        margin = 0.12  # 12% margin reduction
    elif crop_method == 'aggressive':
        margin = 0.18  # 18% margin reduction
    elif crop_method == 'smart':
        # Use smart cropping with edge detection
        return smart_crop_quadrat(image_path, bbox)
    
    # Apply margin reduction
    x1 += width * margin
    y1 += height * margin
    x2 -= width * margin
    y2 -= height * margin
    
    # Ensure coordinates are within image bounds
    img = Image.open(image_path)
    img_width, img_height = img.size
    
    x1 = max(0, min(x1, img_width))
    y1 = max(0, min(y1, img_height))
    x2 = max(0, min(x2, img_width))
    y2 = max(0, min(y2, img_height))
    
    return img.crop((x1, y1, x2, y2))


def smart_crop_quadrat(image_path, bbox):
    """
    Smart cropping using edge detection to find inner quadrat boundaries
    """
    try:
        # Load image with OpenCV
        cv_img = cv2.imread(image_path)
        x1, y1, x2, y2 = map(int, bbox)
        
        # Extract region of interest
        roi = cv_img[y1:y2, x1:x2]
        
        # Convert to grayscale
        gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Apply edge detection
        edges = cv2.Canny(blurred, 30, 100)
        
        # Find contours
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            # Find the largest rectangular contour
            best_contour = None
            best_area = 0
            
            for contour in contours:
                # Approximate contour to polygon
                epsilon = 0.02 * cv2.arcLength(contour, True)
                approx = cv2.approxPolyDP(contour, epsilon, True)
                
                # Look for rectangular shapes (4 corners)
                if len(approx) >= 4:
                    area = cv2.contourArea(contour)
                    if area > best_area and area > (roi.shape[0] * roi.shape[1] * 0.1):  # At least 10% of ROI
                        best_contour = contour
                        best_area = area
            
            if best_contour is not None:
                # Get bounding rectangle of the best contour
                cx, cy, cw, ch = cv2.boundingRect(best_contour)
                
                # Add some padding inside the detected contour
                inner_padding = 0.05  # 5% inner padding
                cx += int(cw * inner_padding)
                cy += int(ch * inner_padding)
                cw -= int(cw * inner_padding * 2)
                ch -= int(ch * inner_padding * 2)
                
                # Convert back to original image coordinates
                final_x1 = x1 + cx
                final_y1 = y1 + cy
                final_x2 = x1 + cx + cw
                final_y2 = y1 + cy + ch
                
                # Load original image and crop
                pil_img = Image.open(image_path)
                return pil_img.crop((final_x1, final_y1, final_x2, final_y2))
        
        # Fallback to aggressive cropping if edge detection fails
        return enhanced_crop_inside_quadrat(image_path, bbox, 'aggressive')
        
    except Exception as e:
        print(f"Smart crop failed: {e}")
        # Fallback to aggressive cropping
        return enhanced_crop_inside_quadrat(image_path, bbox, 'aggressive')
    
def enhance_cropped_image(cropped_img):
    """Optional: Enhance the cropped image quality"""
    # Slightly enhance contrast and sharpness
    enhancer = ImageEnhance.Contrast(cropped_img)
    cropped_img = enhancer.enhance(1.1)  # 10% more contrast
    
    enhancer = ImageEnhance.Sharpness(cropped_img)
    cropped_img = enhancer.enhance(1.05)  # 5% more sharpness
    
    return cropped_img

@image_bp.route("/detect", methods=["POST"])
def detect_and_crop():
    try:
        file = request.files["image"]
        image_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(image_path)

        results = model(image_path)

        crops = []
        for i, box in enumerate(results[0].boxes):
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            cls = int(box.cls)
            label = model.names[cls]

            # Try different cropping methods in order of preference
            try:
                # First try smart cropping
                cropped = enhanced_crop_inside_quadrat(image_path, [x1, y1, x2, y2], 'smart')
            except:
                try:
                    # Fallback to aggressive cropping
                    cropped = enhanced_crop_inside_quadrat(image_path, [x1, y1, x2, y2], 'aggressive')
                except:
                    # Final fallback to moderate cropping
                    cropped = enhanced_crop_inside_quadrat(image_path, [x1, y1, x2, y2], 'moderate')

            # Optional: Enhance image quality
            cropped = enhance_cropped_image(cropped)

            crop_filename = f"{label}_{i}_{file.filename}"
            crop_path = os.path.join(OUTPUT_FOLDER, crop_filename)
            cropped.save(crop_path, quality=95)  # High quality save

            crops.append(f"crops/{crop_filename}")

        return jsonify({"crops": crops})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@image_bp.route("/detect_custom", methods=["POST", "OPTIONS"])
def detect_and_crop_custom():
    """Custom endpoint to test different cropping intensities"""
    if request.method == "OPTIONS":
        # Handle preflight request
        return jsonify({}), 200
    
    try:
        file = request.files["image"]
        crop_intensity = request.form.get('intensity', 'aggressive')  # conservative, moderate, aggressive, smart
        
        image_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(image_path)

        results = model(image_path)

        crops = []
        for i, box in enumerate(results[0].boxes):
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            cls = int(box.cls)
            label = model.names[cls]

            cropped = enhanced_crop_inside_quadrat(image_path, [x1, y1, x2, y2], crop_intensity)
            cropped = enhance_cropped_image(cropped)

            crop_filename = f"{label}_{i}_{crop_intensity}_{file.filename}"
            crop_path = os.path.join(OUTPUT_FOLDER, crop_filename)
            cropped.save(crop_path, quality=95)

            crops.append(f"crops/{crop_filename}")

        return jsonify({"crops": crops, "method": crop_intensity})
    except Exception as e:
        return jsonify({"error": str(e)}), 500