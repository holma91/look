# import necessary libraries
from deepface import DeepFace
import cv2
import os
import matplotlib.pyplot as plt
import glob
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
import re

# define the paths to the original (training) images folder and the generated images folder
org_images_folder_path = r"C:\script test\training_images_folder"
generated_images_folder_path = r"C:\automatic_web_ui\generated_images_folder"

# define the name of the model to use
model_name = 'Facenet512'

# define the path to the folder where the detected faces of the training images will be saved
detected_faces_folder_path = r"C:\script test\detected_faces"

# create a list to hold the original images
org_images = []

# create the detected faces folder if it doesn't exist
if not os.path.exists(detected_faces_folder_path):
    os.makedirs(detected_faces_folder_path)

def print_red(text):
  print(text)

print("Detecting faces in the given original training images folder...")
# loop through the original images folder and detect faces using DeepFace
for org_image_file in os.listdir(org_images_folder_path):
    if org_image_file.endswith('.jpg') or org_image_file.endswith('.png')  or org_image_file.endswith('.JPG'):
        try:
            org_image_path = os.path.join(org_images_folder_path, org_image_file)
            generated_image_path = os.path.join(generated_images_folder_path, org_image_file)
            org_image = cv2.imread(org_image_path)
            
            # detect faces using DeepFace
            detected_face = DeepFace.detectFace(org_image_path, detector_backend='opencv')

            # save the detected face in the detected faces folder
            new_image_path = os.path.join(detected_faces_folder_path, org_image_file)
            plt.imshow(detected_face)
            detected_face = detected_face * 255
            cv2.imwrite(new_image_path, detected_face[:, :, ::-1])
            print("Detected face saved in:", new_image_path)
            org_images.append(org_image)

        except Exception as e:
            print("")
            print("!!!! The image "+org_image_file+" is not detectable as a face.!!!!")
            print("!!!! Please use a face detectable images in original images folder. !!!!")
            print("!!!! This image won't be used. !!!!")
            print("")


# set the number of threads to use for image comparison
num_threads = 5
counter = 1
# calculate the distance score for each generated image in the folder
distance_scores = []

png_files = glob.glob(generated_images_folder_path + "/*.png")
jpg_files = glob.glob(generated_images_folder_path + "/*.jpg")
jpeg_files = glob.glob(generated_images_folder_path + "/*.jpeg")

image_files = png_files + jpg_files + jpeg_files

# count the total number of PNG, JPG, and JPEG files
num_files = len(png_files) + len(jpg_files) + len(jpeg_files)

with ThreadPoolExecutor(max_workers=num_threads) as executor:
    for generated_image_file in image_files:
        avg_distance = 0
        try:
            org_img_counter=1
            for org_image in org_images:
                generated_image_path = os.path.join(generated_images_folder_path, generated_image_file)
                generated_image = cv2.imread(generated_image_path)

                # submit each image comparison to the executor
                future = executor.submit(DeepFace.verify, org_image, generated_image, model_name=model_name)
                distance_score = future.result()["distance"]

                print(f"Distance of AI image #{counter} to org image #{org_img_counter}: {distance_score}")
                avg_distance = avg_distance + distance_score
                org_img_counter=org_img_counter+1
            distance_score = avg_distance / len(org_images)
            distance_scores.append((generated_image_file, distance_score))
            print(f"AI image {counter} / {len(image_files)} - {distance_score}")
        except Exception as e: 
            print(f"Error occurred while processing {generated_image_file}: {str(e)}")

        counter += 1
        if counter == 5:
            break


# get model info to append to text easier to see used model added upon a request of Patreon supporter

def extract_model(info):
    start = info.find('Model: ')
    if start != -1:
        start += len('Model: ')
        end = info.find('\n', start) if info.find('\n', start) != -1 else len(info)
        model = info[start:end]
        # Remove special characters not allowed in file names
        model = re.sub(r'[\\/:*?"<>|]', '', model)

        # Look for <lora:...> info and append it to model
        lora_info = re.search(r'<lora:.*?>', info)
        if lora_info is not None:
            lora_info = lora_info.group(0)
            lora_info = re.sub(r'[<>:]', '-', lora_info)
            model += ' ' + lora_info
             
        return model
    else:
        return ''

# sort the distance scores in ascending order
distance_scores.sort(key=lambda x: x[1])

# rename the generated images based on their distance score
for i, (filename, score) in enumerate(distance_scores):
    formattedScore=round(score, 3)

    try:
               
        img = Image.open(os.path.join(generated_images_folder_path, filename))
        modelname = extract_model(img.info['parameters'])
        img.close()
        new_filename = f"{i+1} - {formattedScore} - {modelname}.png" # rename to 1.png, 2.png, 3.png, ...  
        os.rename(os.path.join(generated_images_folder_path, filename), os.path.join(generated_images_folder_path, new_filename))
    except Exception as e:
        print("Error occurred while processing " + filename + ": " + str(e))

print("")
print("all processing completed")