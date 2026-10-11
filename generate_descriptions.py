import json

products = [
    "Apple iPhone 17 Pro Max 256GB (X/A)",
    "Apple Original 20W USB-C Power Adapter",
    "Green Lion Gravix Smart Watch",
    "Green Lion Active SE Smart Watch",
    "Black Shark S3 Smart Watch",
    "Green Lion Hilux Smart Watch",
    "Black Shark A3 Smart Watch",
    "Green Lion Ridge Smart Watch",
    "WiWU SW05 Smart Watch",
    "Haylou RS5 Smart Watch",
    "Black Shark GT3 Neo Smart Watch",
    "Black Shark Watch S1",
    "UGREEN 300W 48000mAh Smart Digital Display Power Bank",
    "UGREEN 20000mAh 30W Fast Charging Power Bank",
    "UGREEN 20000mAh 165W Fast Charging Power Bank",
    "UGREEN 20000mAh 45W Fast Charging Power Bank with Built-in Cable",
    "UGREEN 20000mAh 67W Fast Charging Power Bank with Built-in Type-C Cable",
    "UGREEN 20000mAh 20W Fast Charging Power Bank",
    "UGREEN 25000mAh 145W Fast Charging Power Bank",
    "Baseus Magnetic Mini Power Bank 10000mAh 30W",
    "Anker PowerCore III Elite 26K 60W Power Bank",
    "Anker Power Bank 25K 165W with Built-In & Retractable Cables",
    "Baseus Bipow 2 20W 10000mAh Digital Display Power Bank",
    "Baseus QPOW Digital Display Power Bank 10000mAh 15W",
    "Baseus 10000mAh 22.5W Qpow Pro Digital Display Fast Charge",
    "Baseus EnerFill FM11 10000mAh 22.5W Magnetic Power Bank",
    "Baseus Star-Lord 30000mAh 22.5W Fast Charging Power Bank",
    "Baseus Bipow 30000mAh 20W Digital Display Power Bank",
    "Baseus Bipow 20000mAh 25W Fast Charging Power Bank",
    "Anker Zolo 20000mAh 22.5W Fast Charging Power Bank",
    "JBL Charge 6 Portable Bluetooth Speaker",
    "JBL Flip 7 Portable Bluetooth Speaker",
    "JBL Clip 5 Portable Bluetooth Speaker",
    "JBL Go 3 Portable Bluetooth Speaker",
    "Anker 30W USB-C Fast Charger Adapter",
    "Anker 20W USB-C Fast Charger Adapter",
    "Soundcore Space One Wireless Noise Cancelling Headphones",
    "Soundcore Q11i Wireless Over-Ear Headphones",
    "Soundcore Liberty 4 NC True Wireless Noise Cancelling Earbuds",
    "Anker R50i NC True Wireless Earbuds",
    "Anker Soundcore P20i True Wireless Earbuds",
    "Anker Soundcore K20i TWS Semi-In-Ear Earbuds",
    "Anker Soundcore Liberty 5 ANC Earbuds",
    "Spigen Ultra Hybrid Case for iPhone 15 Pro",
    "Spigen EZ Fit Tempered Glass Guard (2-Pack)",
    "Logitech MX Master 3S Wireless Performance Mouse",
    "SanDisk Extreme Pro 128GB MicroSDXC 200MB/s",
    "UGREEN Aluminum Foldable Desk Phone Stand"
]

def generate_desc(name):
    if "iPhone 17" in name:
        return """Experience the future of smartphones with the Apple iPhone 17 Pro Max. Crafted with aerospace-grade titanium, it features a revolutionary 6.9-inch Super Retina XDR display with ProMotion for impossibly smooth scrolling. Powered by the all-new A19 Pro chip, it delivers console-level gaming and unprecedented battery life. The pro camera system introduces a groundbreaking 48MP main sensor with advanced low-light performance and 5x optical zoom.\n\nKey Features:\n- Aerospace-Grade Titanium – Incredibly strong and surprisingly lightweight design\n- A19 Pro Chip – The industry's fastest processor for gaming and AI workflows\n- 48MP Pro Camera System – Capture breathtaking photos with incredible detail\n- 5x Optical Zoom – Get closer to the action from further away\n- Dynamic Island – Stay on top of alerts and live activities seamlessly"""
    elif "20W USB-C Power" in name and "Apple" in name:
        return """The Apple 20W USB‑C Power Adapter offers fast, efficient charging at home, in the office, or on the go. While the power adapter is compatible with any USB‑C-enabled device, Apple recommends pairing it with the iPhone 15 Pro and iPhone 15 Pro Max for optimal charging performance. You can also pair it with iPhone 8 or later to take advantage of the fast-charging feature.\n\nKey Features:\n- 20W Fast Charging – Power up your iPhone to 50% in just 30 minutes\n- USB-C Connectivity – Modern and reversible interface for universal compatibility\n- Apple Certified – Guaranteed safe and optimized for Apple devices\n- Compact Design – Perfect for travel and minimal desk setups"""
    elif "Smart Watch" in name or "Watch S1" in name:
        return f"""Elevate your daily routine with the {name}. Designed for the modern active lifestyle, this premium smartwatch combines stunning aesthetics with cutting-edge health and fitness tracking capabilities. Stay connected without ever taking out your phone thanks to crystal-clear Bluetooth calling and instant smart notifications. The ultra-bright AMOLED display ensures perfect readability even in direct sunlight, while the massive battery life keeps you powered up for days on a single charge.\n\nKey Features:\n- Brilliant AMOLED Display – Vibrant colors and sharp text for easy viewing\n- 24/7 Health Monitoring – Track your heart rate, sleep patterns, and blood oxygen levels\n- Seamless Bluetooth Calling – Answer and make calls directly from your wrist\n- Multiple Sports Modes – Automatically tracks your workouts and calories burned\n- Long-Lasting Battery – Go days without needing to recharge"""
    elif "Power Bank" in name or "Fast Charge" in name and "Baseus" in name:
        return f"""Never run out of battery again with the powerful {name}. Engineered with high-density lithium-polymer cells, this high-capacity power bank delivers fast and safe charging for all your essential devices. Whether you are commuting, traveling, or working remotely, it provides enough juice to charge your smartphone multiple times over. The smart digital display lets you know exactly how much power is left, while the advanced multi-protect safety system ensures your devices are guarded against overcharging and short circuits.\n\nKey Features:\n- High-Capacity Output – Keeps your smartphone, tablet, and accessories powered up\n- PD & QC Fast Charging – Smart voltage regulation for lightning-fast charging speeds\n- Digital LED Display – Know exactly how much battery percentage is remaining\n- Multi-Device Charging – Charge multiple devices simultaneously with ease\n- MultiProtect Safety System – Advanced temperature control and overcharge protection"""
    elif "Speaker" in name:
        return f"""Bring the party wherever you go with the {name}. Engineered for pristine audio quality, this portable Bluetooth speaker delivers massive sound with deep, punchy bass that you can feel. The rugged, waterproof, and dustproof design means it can survive beach days, pool parties, and hiking trails without skipping a beat. With long-lasting battery life and seamless wireless connectivity, your favorite playlists will sound better than ever, anywhere you take them.\n\nKey Features:\n- Immersive Stereo Sound – Crystal-clear highs and deep, resonating bass\n- IP67 Waterproof & Dustproof – Built to survive the elements and keep playing\n- Extended Playtime – Enjoy hours of continuous wireless music streaming\n- Bluetooth 5.3 – Fast, stable, and seamless connection to your devices\n- Rugged & Portable Design – Easy to carry and tough enough for outdoor adventures"""
    elif "Headphones" in name or "Earbuds" in name:
        return f"""Immerse yourself in pure, uninterrupted sound with the {name}. Featuring advanced Active Noise Cancelling (ANC) technology, these premium audio devices block out the world so you can focus on your music, podcasts, or calls. The custom-tuned drivers deliver Hi-Res audio with stunning clarity and rich bass. Ergonomically designed for all-day comfort, they offer incredible battery life and crystal-clear microphone quality for phone calls and video meetings.\n\nKey Features:\n- Active Noise Cancelling – Blocks out ambient noise for a pure listening experience\n- Hi-Res Audio Quality – Custom drivers deliver rich bass and crystal-clear vocals\n- Ergonomic Comfort – Lightweight design for fatigue-free all-day wear\n- Crystal-Clear Calls – Multi-mic array with AI noise reduction for perfect voice clarity\n- Ultra-Long Battery Life – Extended playtime with quick-charge capabilities"""
    elif "Charger Adapter" in name:
        return f"""Supercharge your devices with the {name}. This high-speed wall charger uses advanced GaN technology to deliver massive power in an incredibly compact form factor. It intelligently identifies your connected device to provide the optimal charging speed while keeping temperatures low. Perfect for smartphones, tablets, and lightweight laptops, it's the only charger you need to pack for your daily commute or international travel.\n\nKey Features:\n- Ultra-Fast Charging – Power up your devices up to 3x faster than standard chargers\n- Advanced GaN Technology – Smaller, cooler, and more efficient power delivery\n- Universal Compatibility – Works seamlessly with Apple, Samsung, and Android devices\n- Smart Power Allocation – Delivers the exact wattage your device needs safely\n- Compact & Travel-Ready – Space-saving design fits perfectly in any bag"""
    elif "Case" in name or "Screen Protector" in name or "Guard" in name:
        return f"""Protect your valuable investment with the {name}. Precision-engineered for a perfect fit, this premium accessory offers military-grade protection against drops, scratches, and daily wear and tear. It maintains the original sleek profile of your device without adding unnecessary bulk. The advanced materials prevent yellowing over time and feature a special coating that resists fingerprints and smudges, keeping your device looking pristine.\n\nKey Features:\n- Military-Grade Protection – Absorbs shocks and impacts from accidental drops\n- Perfect Precision Fit – Exact cutouts for buttons, ports, and cameras\n- Anti-Yellowing Technology – Stays crystal clear for longer (for clear variants)\n- Smudge & Fingerprint Resistant – Keeps your device looking clean and premium\n- Slim & Lightweight – Maximum protection with minimal bulk"""
    elif "Mouse" in name:
        return f"""Boost your productivity to new heights with the {name}. This premium wireless mouse is meticulously crafted for maximum ergonomic comfort during long working hours. It features an advanced high-precision sensor that tracks flawlessly on almost any surface, including glass. With customizable buttons, ultra-fast scrolling, and seamless multi-device connectivity, it is the ultimate tool for creatives, coders, and power users.\n\nKey Features:\n- Ergonomic Sculpted Design – Perfectly contours to your hand for all-day comfort\n- High-Precision Tracking – Flawless tracking on any surface, including glass\n- MagSpeed Scrolling – Scroll through 1,000 lines of code or spreadsheets in a second\n- Multi-Device Workflow – Seamlessly switch between up to 3 computers\n- Customizable Buttons – Map specific actions for different applications"""
    elif "MicroSDXC" in name:
        return f"""Expand your storage and capture every moment with the {name}. Designed for high-performance devices, this memory card delivers blazing-fast read and write speeds, making it perfect for recording 4K UHD video, high-resolution burst photography, and expanding the storage of your smartphone or gaming console. Built to withstand extreme conditions, it is temperature-proof, waterproof, shockproof, and x-ray proof.\n\nKey Features:\n- Blazing-Fast Speeds – Load apps faster and transfer large files in seconds\n- 4K UHD Ready – Perfect for recording high-resolution videos without dropped frames\n- Massive Storage Capacity – Keep all your photos, videos, and games in one place\n- Extreme Durability – Waterproof, shockproof, and temperature-proof design\n- A2 App Performance – Run smartphone apps directly from the card seamlessly"""
    elif "Stand" in name:
        return f"""Enhance your desk setup with the {name}. Crafted from premium aluminum alloy, this highly adjustable stand provides the perfect viewing angle for your smartphone or tablet. Whether you are watching videos, making FaceTime calls, reading, or following a recipe, it keeps your device securely in place while freeing up your hands. The foldable design makes it incredibly portable, while the silicone pads protect your device from scratches and slipping.\n\nKey Features:\n- Premium Aluminum Build – Sturdy, durable, and aesthetically pleasing design\n- Multi-Angle Adjustability – Find the perfect ergonomic viewing angle\n- Anti-Slip Silicone Pads – Keeps your device secure and prevents scratching\n- Fully Foldable & Portable – Folds flat for easy storage in your bag or pocket\n- Universal Compatibility – Fits all standard smartphones and tablets"""
    
    return f"""Discover the premium quality and exceptional performance of the {name}. Designed with the modern consumer in mind, this product combines state-of-the-art technology with elegant design to deliver an unparalleled user experience. Engineered for durability and reliability, it is the perfect addition to your tech collection, ensuring you stay connected, productive, and entertained wherever you go.\n\nKey Features:\n- Premium Build Quality – Designed with advanced technology and premium materials\n- Fast & Reliable Performance – Ensure your devices are always ready to go\n- Multi-Device Compatibility – Works seamlessly with all standard accessories\n- Sleek & Modern Aesthetics – Looks great in any environment or setup\n- Official Warranty – Backed by a comprehensive company warranty"""

lines = []
lines.append("package com.example.back_end.config;")
lines.append("")
lines.append("public class ProductDescriptions {")
lines.append("    public static String getDescription(String name, String fallback) {")
lines.append("        switch (name) {")

for p in products:
    desc = generate_desc(p)
    desc_escaped = desc.replace('"', '\\"').replace('\n', '\\n')
    lines.append(f'            case "{p}":')
    lines.append(f'                return "{desc_escaped}";')

lines.append("            default:")
lines.append("                return fallback;")
lines.append("        }")
lines.append("    }")
lines.append("}")

with open('d:/git/2nd-Year-Software-Project/backend/src/main/java/com/example/back_end/config/ProductDescriptions.java', 'w', encoding='utf-8') as f:
    f.write("\n".join(lines) + "\n")

print("File generated successfully")
