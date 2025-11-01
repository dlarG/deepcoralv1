# test_compatibility.py
import sys
print(f"Python: {sys.version}")

try:
    import numpy as np
    print(f"✅ NumPy: {np.__version__}")
    
    # Test numpy operations
    arr = np.array([1, 2, 3])
    print(f"✅ NumPy operations work: {arr.sum()}")
except Exception as e:
    print(f"❌ NumPy error: {e}")

try:
    import pandas as pd
    print(f"✅ Pandas: {pd.__version__}")
    
    # Test pandas operations
    df = pd.DataFrame({'a': [1, 2, 3]})
    print(f"✅ Pandas operations work: {len(df)}")
except Exception as e:
    print(f"❌ Pandas error: {e}")

try:
    import torch
    print(f"✅ PyTorch: {torch.__version__}")
except Exception as e:
    print(f"❌ PyTorch error: {e}")

try:
    from ultralytics import YOLO
    print("✅ Ultralytics imported")
except Exception as e:
    print(f"❌ Ultralytics error: {e}")

try:
    import segmentation_models_pytorch as smp
    print("✅ SMP imported")
except Exception as e:
    print(f"❌ SMP error: {e}")

try:
    import cv2
    print("✅ OpenCV imported")
except Exception as e:
    print(f"❌ OpenCV error: {e}")