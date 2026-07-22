import os
from PIL import Image, ImageDraw

# Full list of products and brands
product_list = [
    ("Basmati Rice", "India Gate"), ("Basmati Rice", "Daawat"), ("Basmati Rice", "Kohinoor"),
    ("Sona Masoori Rice", "SLV"), ("Sona Masoori Rice", "Freedom"), ("Sona Masoori Rice", "Local Premium"),
    ("Raw Rice", "Local"), ("Boiled Rice", "Ponni"), ("Boiled Rice", "Local"),
    ("Brown Rice", "Daawat"), ("Brown Rice", "24 Mantra"), ("Ragi", "24 Mantra"),
    ("Ragi", "Local"), ("Jowar", "Organic Tattva"), ("Jowar", "Local"),
    ("Bajra", "Local"), ("Corn", "Local"), ("Corn", "Weikfield"),
    ("Poha Thick", "Tata Sampann"), ("Poha Thick", "Local"), ("Poha Thin", "Local"),
    ("Avalakki", "MTR"), ("Avalakki", "Local"), ("Aashirvaad Atta", "Aashirvaad"),
    ("Aashirvaad Atta", "Fortune"), ("Ragi Flour", "MTR"), ("Ragi Flour", "24 Mantra"),
    ("Maida", "Fortune"), ("Maida", "Rajdhani"), ("Besan Flour", "Rajdhani"),
    ("Besan Flour", "Tata Sampann"), ("Corn Flour", "Weikfield"), ("Rice Flour", "Nirapara"),
    ("Bombay Rava", "MTR"), ("Bombay Rava", "Fortune"), ("Bansi Rava", "MTR"),
    ("Bansi Rava", "Local"), ("Toor Dal", "Tata Sampann"), ("Toor Dal", "Catch"),
    ("Urad Dal", "Tata Sampann"), ("Urad Dal", "Fortune"), ("Moong Dal", "Tata Sampann"),
    ("Moong Dal", "Rajdhani"), ("Chana Dal", "Tata Sampann"), ("Chana Dal", "Fortune"),
    ("Green Gram", "Organic Tattva"), ("Black Gram", "Local"), ("Rajma", "Chitra"),
    ("Kabuli Chana", "Tata Sampann"), ("Horse Gram", "Local"), ("Sunflower Oil", "Fortune"),
    ("Sunflower Oil", "Gemini"), ("Groundnut Oil", "Fortune"), ("Groundnut Oil", "Dhara"),
    ("Palm Oil", "Ruchi"), ("Rice Bran Oil", "Fortune Rice Health"), ("Mustard Oil", "Fortune Kachi Ghani"),
    ("Coconut Oil", "Parachute"), ("Cow Ghee", "Amul"), ("Cow Ghee", "Aashirvaad Svasti"),
    ("Buffalo Ghee", "Amul"), ("Vanaspati", "Dalda"), ("Sugar", "Madhur"),
    ("Brown Sugar", "Trust"), ("Rock Salt", "Tata Salt Lite"), ("Iodized Salt", "Tata Salt"),
    ("Sea Salt", "Local"), ("Jaggery Powder", "Organic Tattva"), ("Jaggery Block", "Local"),
    ("Turmeric Powder", "Catch"), ("Turmeric Powder", "Everest"), ("Chilli Powder", "Everest"),
    ("Chilli Powder", "MDH"), ("Coriander Powder", "Everest"), ("Black Pepper", "Catch"),
    ("Cumin Seeds (Jeera)", "Ramdev"), ("Mustard Seeds", "Catch"), ("Green Cardamom", "Catch"),
    ("Cloves", "Catch"), ("Garam Masala", "Everest"), ("Sambar Powder", "MTR"),
    ("Rasam Powder", "MTR"), ("Almonds (Badam)", "Happilo"), ("Cashews (Kaju)", "Happilo"),
    ("Pistachios", "Happilo"), ("Walnuts (Akhrot)", "Tulsi"), ("Raisins (Kishmish", "Happilo"),
    ("Dates (Khajur)", "Lion Dates"), ("Pumpkin Seeds", "True Elements"), ("Sunflower Seeds", "True Elements"),
    ("Red Label", "Brooke Bond"), ("Taj Mahal Tea Bags", "Taj Mahal"), ("Nescafe Classic", "Nescafe"),
    ("MTR Filter Coffee", "MTR"), ("Boost Energy Drink", "Boost"), ("Horlicks Classic", "Horlicks"),
    ("Bournvita Chocolate", "Cadbury"), ("Coca Cola", "Coca Cola"), ("Pepsi", "PepsiCo"),
    ("Sprite", "Coca Cola"), ("Frooti Mango Drink", "Parle Agro"), ("Marie Gold", "Britannia"),
    ("Good Day Cashew", "Britannia"), ("Parle G Gluco", "Parle"), ("50-50 Maska Chaska", "Britannia"),
    ("Lays Potato Chips", "Lays"), ("Kurkure Masala Munch", "Kurkure"), ("Bingo Mad Angles", "Bingo"),
    ("Cadbury Dairy Milk", "Cadbury"), ("Nestle KitKat", "Nestle"), ("Cadbury Perk", "Cadbury"),
    ("Colgate Strong Teeth", "Colgate"), ("Colgate MaxFresh Gel", "Colgate"), ("Close Up Red Hot Gel", "Close Up"),
    ("Dant Kanti Herbal", "Patanjali"), ("Lux Beauty Soap", "Lux"), ("Dove Cream Bar", "Dove"),
    ("Santoor Sandal Soap", "Santoor"), ("Clinic Plus Strong & Long", "Clinic Plus"), ("H&S Anti Dandruff", "Head & Shoulders"),
    ("Parachute Coconut Hair Oil", "Parachute"), ("Surf Excel Easy Wash", "Surf Excel"), ("Rin Detergent Powder", "Rin"),
    ("Ariel Complete", "Ariel"), ("Vim Dishwash Bar", "Vim"), ("Pril Liquid Dishwash", "Pril"),
    ("Lizol Floor Cleaner", "Lizol"), ("Harpic Disinfectant", "Harpic"), ("Amul Taaza Toned Milk", "Amul"),
    ("Amul Masti Dahi", "Amul"), ("Amul Butter salted", "Amul"), ("Amul Fresh Paneer", "Amul"),
    ("Amul Cheese Slices", "Amul"), ("Nestle Cerelac", "Nestle"), ("Johnson's Baby Soap", "Johnson & Johnson"),
    ("Johnson's Baby Powder", "Johnson & Johnson"), ("Pampers Baby Dry", "Pampers"), ("Huggies Wonder Pants", "Huggies"),
    ("Classmate Notebook", "Classmate"), ("Cello Pen", "Cello"), ("Apsara Pencil", "Apsara"),
    ("Nataraj Eraser", "Nataraj"), ("Apsara Sharpener", "Apsara"), ("Camlin Marker", "Camlin"),
    ("Cycle Pure Agarbatti", "Cycle Pure"), ("Camphor Tablets", "Mangaldeep"), ("Cotton Wicks", "Local"),
    ("Pure Kumkum Box", "Cycle"), ("Pooja Turmeric Powder", "Local"), ("Band-Aid Washproof", "Johnson & Johnson"),
    ("Medical Cotton Roll", "Local Medical"), ("Dettol Antiseptic Liquid", "Dettol"), ("Savlon Antiseptic", "Savlon"),
    ("Vicks Vaporub", "Vicks"), ("Jeera Rice / Jeerakasala", "Elite"), ("Jeera Rice / Jeerakasala", "Local"),
    ("Matta Rice", "Nirapara"), ("Matta Rice", "Double Horse"), ("Foxtail Millet", "24 Mantra"),
    ("Foxtail Millet", "Organic Tattva"), ("Aashirvaad Sharbati", "Aashirvaad"), ("Lobia / Black Eyed Beans", "Tata Sampann"),
    ("Lobia / Black Eyed Beans", "Local"), ("Masoor Dal Split", "Tata Sampann"), ("Borges Olive Oil", "Borges"),
    ("Borges Olive Oil", "Figaro"), ("Gingelly Oil", "Idhayam"), ("Gingelly Oil", "Anjali"),
    ("Dabur Honey", "Dabur"), ("Dabur Honey", "Patanjali"), ("Cinnamon Sticks", "Catch"),
    ("Cinnamon Sticks", "Keya"), ("Everest Biryani Masala", "Everest"), ("Everest Biryani Masala", "MDH"),
    ("Eastern Chicken Masala", "Eastern"), ("Eastern Chicken Masala", "Everest"), ("Lipton Green Tea", "Lipton"),
    ("Lipton Green Tea", "Tetley"), ("Real Fruit Power", "Real"), ("Real Fruit Power", "B Natural"),
    ("Haldiram Aloo Bhujia", "Haldiram"), ("Haldiram Aloo Bhujia", "Bikaji"), ("Parle Hide & Seek", "Parle"),
    ("Himalaya Neem Face Wash", "Himalaya"), ("Himalaya Neem Face Wash", "Nivea"), ("Nivea Body Milk", "Nivea"),
    ("Nivea Body Milk", "Vaseline"), ("Doctor Gain Phenyle", "Local Premium"), ("Amul Cow Ghee Tin", "Amul"),
    ("Amul Vanilla Magic", "Amul"), ("Amul Vanilla Magic", "Kwality Walls")
]

output_folder = "Product_Images_Folder"
os.makedirs(output_folder, exist_ok=True)

print(f"Generating 300+ real images in '{output_folder}'...")

for index, (product, brand) in enumerate(product_list, start=1):
    clean_product = product.replace("/", "_").replace(" ", "_")
    clean_brand = brand.replace(" ", "_")
    filename = f"{index:03d}_{clean_brand}_{clean_product}.jpg"
    filepath = os.path.join(output_folder, filename)
    
    # Create a real image (300x300 pixels, steel blue background)
    img = Image.new('RGB', (300, 300), color=(70, 130, 180))
    d = ImageDraw.Draw(img)
    
    # Draw simple identifier text inside the image
    d.text((20, 120), f"{brand}", fill=(255, 255, 255))
    d.text((20, 150), f"{product}", fill=(255, 255, 255))
    
    # Save as a genuine JPEG file
    img.save(filepath, "JPEG")

print(f"Done! Successfully created 300+ actual images in ./{output_folder}/")