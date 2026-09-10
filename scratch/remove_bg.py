from PIL import Image

def remove_background(input_path, output_path, threshold=240):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # Change all white (also shades of whites)
        # to transparent
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # crop bounding box
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")

remove_background(
    "/home/devcleon/.gemini/antigravity-ide/brain/facf8eb6-55c3-41bb-af1b-71772f9fac9e/forme_logo_raw_1789045683770.jpg",
    "/home/devcleon/fromme/public/images/forme-logo.png",
    threshold=220
)
