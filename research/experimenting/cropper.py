import cv2
import torch
from PIL import Image
import os

# make a new venv, use python 3.10.x e.g. 3.10.9 
# full venv python tutorial very useful : https://youtu.be/B5U7LJOvH6g
# activate venv and always work with activated venv

# python -m venv venv
# cd venv
# cd scripts
# activate 
# cd..
# cd..
# pip install -r requirements.txt

# set your directorys and run as below
# python cropper.py

# Load the pre-trained YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'yolov5x')

# Aspect ratios to consider
# aspect_ratios = [(512, 512)]
aspect_ratios = [(512, 512), (512, 768), (768, 512),(768,768), (640, 960), (960, 640), (768, 1024), (1024, 768)]

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

        # Crop the image to the bounding box of the human
        x1, y1, x2, y2 = map(int, human[:4])
        orgx1,orgx2,orgy1,orgy2=  x1, y1, x2, y2
        orig_width, orig_height = x2 - x1, y2 - y1

        for ratio in aspect_ratios:
            width, height = ratio
            x1, y1, x2, y2 = orgx1,orgx2,orgy1,orgy2
            target_ratio = width / height
            print(target_ratio)
            current_width = x2 - x1
            current_height = y2 - y1
            current_ratio = current_width / current_height

            def within_bounds(x1, y1, x2, y2):
                return x1 >= 0 and y1 >= 0 and x2 < d1 and y2 < d2

            ratio_threshold = 0.9997
            while True:
                loop_counter = 0
                desired_ratio=current_ratio/target_ratio
                if(current_ratio>target_ratio):
                    desired_ratio=target_ratio/current_ratio
                if(desired_ratio>ratio_threshold):
                    break;
                while desired_ratio < ratio_threshold:
                    if(desired_ratio>=ratio_threshold):
                        break;
                    if loop_counter > 2000:
                        break
                    loop_counter += 1

                    if current_ratio < target_ratio:
                        if x1 > 0:
                            x1 -= 1
                        if x2 < img.shape[1] - 1:
                            x2 += 1
                    elif current_ratio > target_ratio:
                        if y1 > 0:
                            y1 -= 1
                        if y2 < img.shape[0] - 1:
                            y2 += 1

                    current_width = x2 - x1
                    current_height = y2 - y1
                    current_ratio = current_width / current_height
                    desired_ratio=current_ratio/target_ratio
                    if(current_ratio>target_ratio):
                        desired_ratio=target_ratio/current_ratio

                if within_bounds(x1, y1, x2, y2) and loop_counter <= 2000:
                    break

                ratio_threshold -= 0.005
                #x1, y1, x2, y2 = orgx1,orgx2,orgy1,orgy2
                if ratio_threshold < 0:
                    x1, y1, x2, y2 = orgx1,orgx2,orgy1,orgy2
                    break


            x1, y1, x2, y2 = map(int, (x1, y1, x2, y2))
            print(f"Final coords: {(x1, y1, x2, y2)}, Final ratio: {current_ratio}, Loops: {loop_counter}")

            # Crop the image
            cropped_img = img[y1:y2, x1:x2]

            # Convert BGR image to RGB for PIL
            cropped_img_rgb = cv2.cvtColor(cropped_img, cv2.COLOR_BGR2RGB)

            # Convert array to Image for visualization
            result_img = Image.fromarray(cropped_img_rgb)

            # Create a directory for each aspect ratio if it doesn't exist
            output_dir = os.path.join(output_base_dir, f"{width}x{height} ratio raw")
            os.makedirs(output_dir, exist_ok=True)

            # create the full output path and write the file
            output_path = os.path.join(output_dir, filename)
            result_img.save(output_path)

raw_dir = "./images/alex/raw"
processed_dir = "./images/alex/processed"
# usage
auto_zoom(raw_dir, processed_dir)
