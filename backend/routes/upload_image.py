from flask import Blueprint, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import os

image_bp = Blueprint('image', __name__)

@image_bp.route("/detect_custom", methods=["POST", "OPTIONS"])
def detect_and_crop_custom():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    return jsonify({
        "message": "Image detection temporarily disabled",
        "status": "success",
        "note": "ML features under maintenance"
    }), 200

@image_bp.route("/upload", methods=["POST", "OPTIONS"])
def upload_image():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    return jsonify({
        "message": "Image upload temporarily disabled", 
        "status": "success"
    }), 200

# Add any other routes that might be expected
@image_bp.route("/test", methods=["GET"])
def test_route():
    return jsonify({"message": "Image routes working - ML disabled"}), 200