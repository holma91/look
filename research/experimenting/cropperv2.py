import cv2
import torch
from PIL import Image
import os

# Load the pre-trained YOLOv5 model
model = torch.hub.load("ultralytics/yolov5", "yolov5x")


def auto_zoom(input_dir, output_base_dir):
    # loop over all files in the input directory
    for filename in os.listdir(input_dir):
        # create the full input path and read the file
        input_path = os.path.join(input_dir, filename)
        img = cv2.imread(input_path)

        if img is None:
            continue
        height, width, _ = img.shape

        # Assign the image bounds to c1, c2, d1, d2
        c1, c2, d1, d2 = 0, 0, width, height

        # Run the image through the model
        results = model(img)

        # Find the first human detected in the image
        human = next((x for x in results.xyxy[0] if int(x[5]) == 0), None)

        if human is None:
            print(f"No human detected in the image {input_path}.")
            os.remove(input_path)
            continue

        x1, y1, x2, y2 = map(int, human[:4])

        center_x, center_y = (x1 + x2) // 2, (
            y1 + y2
        ) // 2  # Find the center of the human bounding box

        # Define the cropping coordinates for 1024x1024 centered on the detected human
        crop_x1 = max(center_x - 512, 0)
        crop_y1 = max(center_y - 512, 0)
        crop_x2 = min(center_x + 512, img.shape[1])
        crop_y2 = min(center_y + 512, img.shape[0])

        cropped_img = img[crop_y1:crop_y2, crop_x1:crop_x2]

        # Convert BGR image to RGB for PIL
        cropped_img_rgb = cv2.cvtColor(cropped_img, cv2.COLOR_BGR2RGB)

        # Convert array to Image for visualization
        result_img = Image.fromarray(cropped_img_rgb)

        # Create a directory for 1024x1024 if it doesn't exist
        output_dir = os.path.join(output_base_dir, "1024x1024 ratio")
        os.makedirs(output_dir, exist_ok=True)

        # create the full output path and write the file
        output_path = os.path.join(output_dir, filename)
        result_img.save(output_path)


raw_dir = "./images/tony/raw"
processed_dir = "./images/tony/processed"
# usage
auto_zoom(raw_dir, processed_dir)
