-- Official NVSHOP.LK Database Seed File

-- Insert Sample Users
INSERT INTO users (name, email, password, is_active, created_at, updated_at) 
VALUES 
('Admin User', 'admin@example.com', '$2a$10$e8W/Y8YwL1c.5bJ4G9K3a.g.5R6/7fJ1K2L3M4N5O6P7Q8R9S0T1U', true, NOW(), NOW()),
('John Doe', 'john@example.com', '$2a$10$e8W/Y8YwL1c.5bJ4G9K3a.g.5R6/7fJ1K2L3M4N5O6P7Q8R9S0T1U', true, NOW(), NOW());

-- Insert Products under 11 Official Categories (Prices in LKR)
INSERT INTO products (name, price, original_price, category, brand, rating, reviews, image, discount, is_new, stock, warranty, return_period, description) 
VALUES 
('Apple Original 20W USB-C Power Adapter', 6500.0, 7500.0, 'Apple iPhone', 'Apple', 4.9, 210, 'https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=600', 13, true, 20, '1 Year', '7 Days', 'Genuine Apple 20W fast charging wall adapter for iPhone 12, 13, 14, 15 series.'),
('Anker Soundcore Life Q30 ANC Headphones', 24500.0, 28900.0, 'Earphones & Headsets', 'Anker', 4.9, 310, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 15, true, 18, '18 Months', '7 Days', 'Advanced hybrid active noise cancellation with Hi-Res Audio and 40-hour playtime.'),
('Anker 737 Power Bank 24000mAh 140W', 42000.0, 48000.0, 'Power Banks', 'Anker', 4.9, 145, 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=600', 12, true, 10, '18 Months', '7 Days', 'Ultra-powerful 140W output power bank with smart digital display for laptops & phones.'),
('Anker Soundcore Motion+ 30W Speaker', 29800.0, 34500.0, 'Speakers', 'Anker', 4.9, 220, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600', 13, true, 12, '18 Months', '7 Days', 'Ultra-wide frequency range Hi-Res bluetooth speaker with BassUp technology.'),
('UGREEN Nexode 65W GaN 3-Port Fast Charger', 9800.0, 12500.0, 'Chargers & Cables & Adapters', 'UGREEN', 4.9, 142, 'https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=600', 21, true, 22, '12 Months', '7 Days', 'Compact 65W GaN charger with 2 USB-C and 1 USB-A ports for laptops & phones.'),
('Spigen Ultra Hybrid Case for iPhone 15 Pro', 6800.0, 8200.0, 'Phone Cases & Back Covers', 'Spigen', 4.9, 175, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600', 17, true, 35, '12 Months', '7 Days', 'Clear shock-absorption bumper case with Air Cushion Technology for iPhone 15 Pro.'),
('Spigen EZ Fit Tempered Glass Guard (2-Pack)', 4500.0, 5500.0, 'Screen Protectors', 'Spigen', 4.9, 240, 'https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600', 18, true, 50, '12 Months', '7 Days', 'Auto-alignment tray kit for bubble-free 9H hardness tempered glass installation.'),
('Apple Watch Series 9 GPS 45mm Midnight', 128000.0, 145000.0, 'Smart Watches', 'Apple', 4.9, 65, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600', 11, true, 8, '1 Year', '7 Days', 'Advanced health sensors, Double Tap gesture control, and bright Always-On Retina display.'),
('Logitech MX Master 3S Wireless Mouse', 34500.0, 39900.0, 'Mouse & Keyboards', 'Logitech', 4.9, 130, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 13, true, 14, '2 Years', '7 Days', 'Quiet clicks, 8K DPI sensor for glass tracking, and MagSpeed scroll wheel.'),
('SanDisk Extreme Pro 128GB MicroSDXC 200MB/s', 7800.0, 9500.0, 'Pendrives & SD Cards', 'SanDisk', 4.9, 320, 'https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600', 17, false, 45, 'Lifetime', '7 Days', 'High-speed A2 4K UHD MicroSD memory card for action cameras, drones & phones.'),
('UGREEN Aluminum Foldable Desk Phone Stand', 2900.0, 3800.0, 'Others', 'UGREEN', 4.8, 110, 'https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600', 23, true, 30, '12 Months', '7 Days', 'Adjustable multi-angle aluminum desktop stand for smartphones and tablets.');
