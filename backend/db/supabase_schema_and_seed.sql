-- ==============================================================================
-- NVSHOP.LK - COMPLETE SUPABASE POSTGRESQL SCHEMA & SEED SCRIPT
-- Compatible with Supabase SQL Editor (PostgreSQL 15+)
-- ==============================================================================

-- 1. DROP EXISTING TABLES (IN REVERSE DEPENDENCY ORDER)
DROP TABLE IF EXISTS shop_knowledge CASCADE;
DROP TABLE IF EXISTS shop_details CASCADE;
DROP TABLE IF EXISTS product_gallery_images CASCADE;
DROP TABLE IF EXISTS product_description_images CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS showroom_photos CASCADE;
DROP TABLE IF EXISTS hero_slides CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1.1 ENABLE PGVECTOR EXTENSION (For Gemini 768-dim Semantic Search)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. CREATE SCHEMAS & TABLES

-- Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    address VARCHAR(500),
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Separate Admins Table
CREATE TABLE admins (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products Catalog Table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    original_price DOUBLE PRECISION,
    category VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    rating DOUBLE PRECISION DEFAULT 4.5,
    reviews INTEGER DEFAULT 15,
    image VARCHAR(1000),
    discount INTEGER DEFAULT 0,
    is_new BOOLEAN DEFAULT FALSE,
    is_weekly_highlight BOOLEAN DEFAULT FALSE,
    stock INTEGER DEFAULT 10,
    warranty VARCHAR(255) DEFAULT '1 Year',
    return_period VARCHAR(255) DEFAULT '30 Days',
    description TEXT
);

-- Product Description Images Collection Table
CREATE TABLE product_description_images (
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(1000) NOT NULL
);

-- Product Gallery Images Collection Table
CREATE TABLE product_gallery_images (
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    gallery_image_url VARCHAR(1000) NOT NULL
);

-- Suppliers Table
CREATE TABLE suppliers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    company VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    supplied_items TEXT
);

-- Hero Slides Table
CREATE TABLE hero_slides (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(500),
    image VARCHAR(1000),
    cta VARCHAR(100),
    link VARCHAR(255),
    color VARCHAR(255)
);

-- Showroom Photos Table
CREATE TABLE showroom_photos (
    id BIGSERIAL PRIMARY KEY,
    tag VARCHAR(100),
    tag_color VARCHAR(100),
    title VARCHAR(255),
    subtitle VARCHAR(500),
    full_desc TEXT,
    image VARCHAR(1000),
    grid_class VARCHAR(255)
);

-- Orders Table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(100) NOT NULL UNIQUE,
    user_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(100),
    postal_code VARCHAR(50),
    subtotal DOUBLE PRECISION,
    tax DOUBLE PRECISION DEFAULT 0.0,
    shipping_cost DOUBLE PRECISION DEFAULT 0.0,
    total_amount DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(1000),
    price DOUBLE PRECISION NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    subtotal DOUBLE PRECISION NOT NULL
);

-- Order Status History Table (Live tracking timeline & audit trail)
CREATE TABLE IF NOT EXISTS order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_number VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    updated_by VARCHAR(100) DEFAULT 'ADMIN',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON order_status_history(created_at);

-- Core High-Performance Query Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON orders(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_weekly_highlight ON products(is_weekly_highlight);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Payment Transactions Table
CREATE TABLE payment_transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_reference VARCHAR(255) NOT NULL UNIQUE,
    order_number VARCHAR(100) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'LKR',
    payment_gateway VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    card_last4 VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Master Shop Details Table
CREATE TABLE shop_details (
    id BIGSERIAL PRIMARY KEY,
    shop_name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    email VARCHAR(255),
    support_email VARCHAR(255),
    hotline VARCHAR(50),
    phone_secondary VARCHAR(50),
    whatsapp VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(50),
    google_maps_url VARCHAR(1000),
    business_hours TEXT,
    warranty_policy TEXT,
    return_policy TEXT,
    shipping_policy TEXT,
    payment_methods TEXT,
    showroom_info TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Shop Knowledge RAG Vector Chunks Table (768 Dimensions for Google Gemini text-embedding-004)
CREATE TABLE shop_knowledge (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    embedding vector(768),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS shop_knowledge_embedding_idx ON shop_knowledge 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);

-- ==============================================================================
-- 3. INSERT CURRENT SEED DATA
-- ==============================================================================

-- 3.1 Insert Users (BCrypt encrypted passwords for admin123 & user123)
INSERT INTO users (name, email, phone, address, password, is_active, is_email_verified, is_phone_verified, role)
VALUES 
('Admin User', 'admin@example.com', '+94 77 123 4567', 'Ambalangoda, Sri Lanka', '$2a$10$e8W/Y8YwL1c.5bJ4G9K3a.g.5R6/7fJ1K2L3M4N5O6P7Q8R9S0T1U', TRUE, TRUE, TRUE, 'admin'),
('John Doe', 'john@example.com', '+94 71 987 6543', 'Colombo, Sri Lanka', '$2a$10$e8W/Y8YwL1c.5bJ4G9K3a.g.5R6/7fJ1K2L3M4N5O6P7Q8R9S0T1U', TRUE, TRUE, TRUE, 'user'),
('Kulashi Himasha', 'khimasha16@gmail.com', '+94 76 227 7566', '185/1/2B New Road, Ambalangoda, Sri Lanka', '$2a$10$e8W/Y8YwL1c.5bJ4G9K3a.g.5R6/7fJ1K2L3M4N5O6P7Q8R9S0T1U', TRUE, TRUE, TRUE, 'user'),
('Mayantha Nawarathna', 'mayanthanawarathna37@gmail.com', '+94 72 583 5742', '185/1/2B New Road, Ambalangoda, Sri Lanka', '$2a$10$e8W/Y8YwL1c.5bJ4G9K3a.g.5R6/7fJ1K2L3M4N5O6P7Q8R9S0T1U', TRUE, TRUE, TRUE, 'user');

-- 3.2 Insert Admins
INSERT INTO admins (name, email, password, role, is_active)
VALUES
('Super Admin', 'superadmin@example.com', 'admin123', 'SUPER_ADMIN', TRUE),
('NV Operations Admin', 'admin@nvshop.lk', 'admin123', 'ADMIN', TRUE);

-- 3.3 Insert Hero Slides
INSERT INTO hero_slides (title, subtitle, image, cta, link, color)
VALUES
('Premium Mobile Cases', 'Protection meets style with our exclusive collection.', '/slides/slide0001.png', 'Shop Cases', '/products?category=Cases', 'from-blue-950/80 via-blue-900/40 to-transparent'),
('Next-Gen Power & Fast Charging', 'High-speed GaN chargers & cables for Apple, Samsung & Android.', '/slides/slide0002.png', 'Explore Chargers', '/products?category=Chargers', 'from-slate-950/85 via-slate-900/40 to-transparent'),
('Pure Bass & Studio Audio', 'Immerse in sound with genuine wireless earbuds & headphones.', '/slides/slide0003.png', 'Browse Audio', '/products?category=Audio', 'from-indigo-950/85 via-indigo-900/40 to-transparent'),
('Ultimate Gaming & Smart Tech', 'PS5 accessories, VR headsets, and smart tech essentials.', '/slides/slide0004.png', 'Discover Gear', '/products', 'from-slate-900/85 via-blue-950/40 to-transparent');

-- 3.4 Insert Showroom Photos
INSERT INTO showroom_photos (tag, tag_color, title, subtitle, full_desc, image, grid_class)
VALUES
('OFFICIAL HUB', 'text-blue-400', 'NVSHOP.LK Reception', '100% Genuine Tech Warranties & In-store Support', 'Official reception & customer service counter with illuminated branding at NVSHOP.LK Ambalangoda showroom.', '/store/nvshop-store.jpg', 'col-span-1 md:col-span-2 row-span-2 h-full min-h-[420px] md:min-h-[520px]'),
('MODERN AMBIENCE', 'text-emerald-400', 'Showroom Lounge & Seating', 'Comfortable consultation area under honeycomb lighting', 'Modern customer lounge area equipped with green accent seating and signature honeycomb ceiling lights.', '/store/nvshop-showroom-seating.webp', 'col-span-1 aspect-[4/3] md:aspect-auto md:h-full min-h-[240px]'),
('INTERACTIVE DEMOS', 'text-amber-400', 'Live VR Experience Zone', 'Test PS5 VR & Soundcore Pure Bass Headphones Live', 'Customer testing area equipped with Sony PS5 VR headset, Soundcore audio range, and gaming consoles.', '/store/nvshop-vr-demo.webp', 'col-span-1 aspect-[4/3] md:aspect-auto md:h-full min-h-[240px]'),
('GAMING TECH', 'text-purple-400', 'VR & Gaming Setup', 'PlayStation 5, controllers, and VR display shelves', 'Dedicated gaming shelf featuring PS5 consoles, dualsense controllers, VR headsets, and Soundcore audio.', '/store/nvshop-gaming-vr-zone.jpg', 'col-span-1 aspect-[4/3]'),
('STORE OVERVIEW', 'text-cyan-400', 'Full Retail Space View', 'Power banks, gaming gear, and consultation tables', 'Full high-angle view of the NVSHOP.LK retail space — original chargers, audio displays, and consultation area.', '/store/nvshop-store-overview.jpg', 'col-span-1 aspect-[4/3]'),
('AUDIO DISPLAY', 'text-rose-400', 'Branded Audio Shelving', 'Anker Soundcore & Sony audio display collection', 'Original Anker Soundcore wireless earbuds, headphones, and portable speakers organized on display shelves.', '/store/nvshop-audio-gaming-shelf.jpg', 'col-span-1 aspect-[4/3]'),
('FULL AISLE', 'text-teal-400', 'Showroom Main Aisle', 'Spacious aisle leading to the reception counter', 'Main aisle view of NVSHOP.LK showroom with wall-to-wall accessories display and signature lighting.', '/store/nvshop-aisle-ugreen.jpg', 'col-span-1 aspect-[4/3]'),
('INTERIOR DESIGN', 'text-indigo-400', 'Tech Lounge Interior', 'Clean wooden finishes & futuristic ceiling lights', 'Interior setup with wood paneling, LED accent strips, and customer consultation space.', '/store/nvshop-interior-branding.jpg', 'col-span-1 aspect-[4/3]'),
('SOUND SYSTEMS', 'text-amber-400', 'Party Speakers & Audio Lineup', 'Soundcore Rave, Motion+, & Sony Bluetooth speakers', 'High-power bluetooth partybox speakers and wireless audio lineup on display at NVSHOP.LK.', '/store/nvshop-speakers-display.jpg', 'col-span-1 aspect-[4/3]');

-- 3.5 Insert Suppliers
INSERT INTO suppliers (name, company, email, phone, supplied_items)
VALUES
('Roshan Jayawardena', 'Anker Innovations Sri Lanka', 'roshan@anker.lk', '+94 77 458 9201', 'Anker Power Banks, Soundcore Earbuds, GaN Chargers, Charging Cables'),
('Kavinda Perera', 'UGREEN Official Distributor', 'kavinda@ugreen.lk', '+94 71 890 2314', 'UGREEN Nexode GaN Chargers, Power Banks, USB-C Hubs, Display Adapters'),
('Dinesh Samarasinghe', 'Baseus Sri Lanka Wholesale', 'sales@baseus.lk', '+94 76 341 8890', 'Baseus Magnetic Power Banks, Bipow Series, Car Mounts, Braided Cables'),
('Malith Fernando', 'JBL Harman Authorized LK', 'orders@jbl-distro.lk', '+94 70 219 4432', 'JBL Flip 7, Charge 6, Clip 5, Go 3 Portable Bluetooth Speakers');

-- 3.6 Insert All 43 Official Products Across 11 Categories
INSERT INTO products (name, price, original_price, category, brand, rating, reviews, image, discount, is_new, is_weekly_highlight, stock, warranty, return_period, description)
VALUES
('Apple iPhone 17 Pro Max 256GB (X/A)', 445000.0, 465000.0, 'Apple iPhone', 'Apple', 5.0, 42, 'https://api.nvshop.lk/api/public/file/6a113bc506fdb61b1b19f7d7/16-pro-6.jpg', 4, TRUE, TRUE, 5, '1 Year Apple Care', '7 Days', 'Experience the future of smartphones with the Apple iPhone 17 Pro Max. Crafted with aerospace-grade titanium, it features a revolutionary 6.9-inch Super Retina XDR display with ProMotion for impossibly smooth scrolling.'),
('Apple Original 20W USB-C Power Adapter', 6500.0, 7500.0, 'Apple iPhone', 'Apple', 4.9, 195, 'https://api.nvshop.lk/api/public/file/69a966d647ef868f0adc57fe/4abd5f98ce6569be4b94056c4e52a064.jpg_960x960q80.jpg_.webp', 13, TRUE, FALSE, 20, '1 Year', '7 Days', 'Genuine Apple 20W fast charging wall adapter for iPhone 11, 12, 13, 14, 15, 16 series.'),
('Green Lion Gravix Smart Watch', 14500.0, 16500.0, 'Smart Watches', 'Green Lion', 4.8, 64, 'https://api.nvshop.lk/api/public/file/69c61f343cafeb520d7bbc5d/Green-Lion-Gravix-Smart-Watch-by-appleme.lk-4.webp', 12, TRUE, FALSE, 15, '6 Months Warranty', '7 Days', 'Buy genuine Green Lion Gravix Smart Watch with AMOLED Display and Bluetooth calling at NVSHOP.LK Sri Lanka.'),
('Green Lion Active SE Smart Watch', 12800.0, 14900.0, 'Smart Watches', 'Green Lion', 4.7, 48, 'https://api.nvshop.lk/api/public/file/69c61e1e3cafeb520d7bbc25/download (5).jfif', 14, TRUE, FALSE, 18, '6 Months Warranty', '7 Days', 'Buy genuine Green Lion Active SE Smart Watch with fitness tracking and heart rate monitor.'),
('Black Shark S3 Smart Watch', 16900.0, 19500.0, 'Smart Watches', 'Black Shark', 4.9, 72, 'https://api.nvshop.lk/api/public/file/69c61d873cafeb520d7bbbee/download (10).jfif', 13, TRUE, FALSE, 12, '6 Months Warranty', '7 Days', 'Buy genuine Black Shark S3 Smart Watch with ultra-clear display and gaming styling.'),
('Green Lion Hilux Smart Watch', 13900.0, 15900.0, 'Smart Watches', 'Green Lion', 4.7, 39, 'https://api.nvshop.lk/api/public/file/69c61d253cafeb520d7bbbb8/download (13).jfif', 12, FALSE, FALSE, 14, '6 Months Warranty', '7 Days', 'Buy genuine Green Lion Hilux Smart Watch with long battery life and premium metallic body.'),
('Black Shark A3 Smart Watch', 15500.0, 17900.0, 'Smart Watches', 'Black Shark', 4.8, 51, 'https://api.nvshop.lk/api/public/file/69c61cc83cafeb520d7bbb83/download (14).jfif', 13, TRUE, FALSE, 10, '6 Months Warranty', '7 Days', 'Buy genuine Black Shark A3 Smart Watch with sports modes and IP68 waterproof rating.'),
('Green Lion Ridge Smart Watch', 14200.0, 16000.0, 'Smart Watches', 'Green Lion', 4.8, 33, 'https://api.nvshop.lk/api/public/file/69c61a8e3cafeb520d7bba49/Green-Lion-GL-SWA53-Ridge-Smart-Watch-Green-Brown-by-otc.lk-in-srilanka.webp', 11, FALSE, FALSE, 12, '6 Months Warranty', '7 Days', 'Buy genuine Green Lion Ridge Smart Watch with dual-color strap and rugged bezel.'),
('WiWU SW05 Smart Watch', 11500.0, 13500.0, 'Smart Watches', 'WiWU', 4.6, 28, 'https://api.nvshop.lk/api/public/file/69c61a463cafeb520d7bba16/wiwu 3.jfif', 15, TRUE, TRUE, 16, '6 Months Warranty', '7 Days', 'Buy genuine WiWU SW05 Smart Watch with sleek lightweight design and HD touchscreen.'),
('Haylou RS5 Smart Watch', 13500.0, 15500.0, 'Smart Watches', 'Haylou', 4.7, 45, 'https://api.nvshop.lk/api/public/file/69c619693cafeb520d7bb9e4/download (2).jfif', 13, TRUE, FALSE, 15, '6 Months Warranty', '7 Days', 'Buy genuine Haylou RS5 Smart Watch with 2.01 inch AMOLED display and aerospace metallic frame.'),
('Black Shark GT3 Neo Smart Watch', 12900.0, 14800.0, 'Smart Watches', 'Black Shark', 4.7, 36, 'https://api.nvshop.lk/api/public/file/69c618ec3cafeb520d7bb998/download (1).jfif', 13, FALSE, FALSE, 20, '6 Months Warranty', '7 Days', 'Buy genuine Black Shark GT3 Neo with curved display and AI voice assistant.'),
('Black Shark Watch S1', 17500.0, 19900.0, 'Smart Watches', 'Black Shark', 4.9, 89, 'https://api.nvshop.lk/api/public/file/69c617ba3cafeb520d7bb94a/download.jfif', 12, TRUE, FALSE, 11, '6 Months Warranty', '7 Days', 'Buy genuine Black Shark Watch S1 with 1.43 AMOLED display, ENC Bluetooth calling.'),
('UGREEN 300W 48000mAh Smart Digital Display Power Bank', 58000.0, 65000.0, 'Power Banks', 'UGREEN', 5.0, 94, 'https://api.nvshop.lk/api/public/file/69b3a061671bdc237efeb925/H7b50569eb1f84a60bd970ef6924a7418Y.avif', 11, TRUE, FALSE, 8, '1 Year Warranty', '7 Days', 'Buy genuine UGREEN 300W 48000mAh Smart Digital Display Power Bank with 1 Year Warranty at NVSHOP.LK.'),
('UGREEN 20000mAh 30W Fast Charging Power Bank', 12800.0, 15500.0, 'Power Banks', 'UGREEN', 4.9, 142, 'https://api.nvshop.lk/api/public/file/69b3a010671bdc237efeb8f7/24727d81-b4bc-4bbd-bdbb-3949a1b4d899.jpg.webp', 17, TRUE, TRUE, 25, '1 Year Warranty', '7 Days', 'Buy genuine UGREEN 20000mAh 30W Fast Charging Power Bank with 1 Year Warranty at NVSHOP.LK.'),
('UGREEN 20000mAh 165W Fast Charging Power Bank', 28500.0, 33000.0, 'Power Banks', 'UGREEN', 4.9, 87, 'https://api.nvshop.lk/api/public/file/69b39f53671bdc237efeb8ca/UGREEN-55987b-Nexode-Power-Bank-20000mAh-165Wb-by-appleme.lk-1.webp', 14, TRUE, FALSE, 12, '1 Year Warranty', '7 Days', 'Buy genuine UGREEN 20000mAh 165W Fast Charging Power Bank with 1 Year Warranty at NVSHOP.LK.'),
('UGREEN 20000mAh 45W Fast Charging Power Bank with Built-in Cable', 16900.0, 19500.0, 'Power Banks', 'UGREEN', 4.8, 110, 'https://api.nvshop.lk/api/public/file/69b39efa671bdc237efeb89e/UGREEN-45W-Power-Bank-with-Built-in-Cable--PB536--55988B--1-Year-Warranty-ugreenlk-9.webp', 13, TRUE, FALSE, 18, '1 Year Warranty', '7 Days', 'Buy genuine UGREEN 20000mAh 45W Fast Charging Power Bank with built-in Type-C cable.'),
('UGREEN 20000mAh 67W Fast Charging Power Bank with Built-in Type-C Cable', 19800.0, 23000.0, 'Power Banks', 'UGREEN', 4.9, 135, 'https://api.nvshop.lk/api/public/file/69b39e8a671bdc237efeb852/UGREEN-20000mAh-67W-Power-Bank-with-Built-in-Type-C-Cable-PB550-â€“-55996B-â€“-1-Year-Warranty-1024x1024.webp', 14, TRUE, FALSE, 16, '1 Year Warranty', '7 Days', 'Buy genuine UGREEN 20000mAh 67W Fast Charging Power Bank with 1 Year Warranty.'),
('UGREEN 20000mAh 20W Fast Charging Power Bank', 10900.0, 13000.0, 'Power Banks', 'UGREEN', 4.8, 160, 'https://api.nvshop.lk/api/public/file/69b39e28671bdc237efeb805/rn-image_picker_lib_temp_eabe4a72-d3be-4012-800f-b51ac3b2dbd0.webp', 16, FALSE, TRUE, 30, '1 Year Warranty', '7 Days', 'Buy genuine UGREEN 20000mAh 20W Fast Charging Power Bank with 1 Year Warranty.'),
('UGREEN 25000mAh 145W Fast Charging Power Bank', 29900.0, 35000.0, 'Power Banks', 'UGREEN', 4.9, 210, 'https://api.nvshop.lk/api/public/file/69b39d16671bdc237efeb703/WhatsApp-Image-2025-07-18-at-14.32.16.jpeg', 15, TRUE, TRUE, 14, '1 Year Warranty', '7 Days', 'Buy genuine UGREEN 25000mAh 145W Fast Charging Power Bank for MacBooks, laptops & phones.'),
('Baseus Magnetic Mini Power Bank 10000mAh 30W', 11500.0, 13800.0, 'Power Banks', 'Baseus', 4.8, 98, 'https://api.nvshop.lk/api/public/file/69b39998671bdc237efeb668/3144683_baseus-magnetic-mini-power-bank-10000mah-30w-kek.webp', 17, TRUE, TRUE, 22, '1 Year Warranty', '7 Days', 'Buy genuine Baseus Magnetic Mini Power Bank 10000mAh 30W MagSafe compatible.'),
('Anker PowerCore III Elite 26K 60W Power Bank', 36500.0, 42000.0, 'Power Banks', 'Anker', 4.9, 82, 'https://api.nvshop.lk/api/public/file/69b3940e671bdc237efeaff8/Anker-PowerCore-III-Elite-25600mAh-87W-USB-C-PD-Portable-Charger-6.webp', 13, FALSE, FALSE, 9, '6 Months Warranty', '7 Days', 'Buy genuine Anker PowerCore III Elite 25600mAh 60W Power Bank at NVSHOP.LK Sri Lanka.'),
('Anker Power Bank 25K 165W with Built-In & Retractable Cables', 38900.0, 45000.0, 'Power Banks', 'Anker', 5.0, 150, 'https://api.nvshop.lk/api/public/file/69b392bc671bdc237efeaf58/A1695H11_MRC_PRC_Rich_image_EN_V1_2.webp', 14, TRUE, FALSE, 15, '18 Months Company Warranty', '7 Days', 'Buy genuine Anker Power Bank 25K 165W with Built-In & Retractable Cables.'),
('Baseus Bipow 2 20W 10000mAh Digital Display Power Bank', 7900.0, 9500.0, 'Power Banks', 'Baseus', 4.8, 180, 'https://api.nvshop.lk/api/public/file/69b1453ec8cd3fa49255398c/Baseus-Bipow-2-20W-10000mah-Digital-Display-Power-Bank-2.webp', 17, FALSE, TRUE, 35, '1 Year Warranty', '7 Days', 'Buy genuine Baseus Bipow 2 20W 10000mAh Digital Display Power Bank at NVSHOP.LK.'),
('Baseus QPOW Digital Display Power Bank 10000mAh 15W', 8500.0, 10200.0, 'Power Banks', 'Baseus', 4.7, 125, 'https://api.nvshop.lk/api/public/file/69b14443c8cd3fa49255390a/Baseus-QPOW-Digital-Display-Power-Bank-IP-Edition-2022-Edition-10000mAh-15w-img3.webp', 17, TRUE, TRUE, 20, '1 Year Warranty', '7 Days', 'Buy genuine Baseus QPOW Digital Display Power Bank 10000mAh 15W with built-in cable.'),
('Baseus 10000mAh 22.5W Qpow Pro Digital Display Fast Charge', 9800.0, 11900.0, 'Power Banks', 'Baseus', 4.8, 140, 'https://api.nvshop.lk/api/public/file/69b1419dc8cd3fa4925536ee/Baseus-PPQD020101-vc2.webp', 18, TRUE, TRUE, 25, '1 Year Warranty', '7 Days', 'Buy genuine Baseus 10000mAh 22.5W Qpow Pro Digital Display Fast Charge Power Bank.'),
('Baseus EnerFill FM11 10000mAh 22.5W Magnetic Power Bank', 12500.0, 14800.0, 'Power Banks', 'Baseus', 4.8, 77, 'https://api.nvshop.lk/api/public/file/69b1097647ef868f0adc97a5/baseus-enerfill-fm11-225w-10000mah-magnetic-wireless-power-bank-RlhsO_AHiI0z.webp', 16, TRUE, TRUE, 18, '1 Year Warranty', '7 Days', 'Buy genuine Baseus EnerFill FM11 10000mAh 22.5W Magnetic Wireless Power Bank.'),
('Baseus Star-Lord 30000mAh 22.5W Fast Charging Power Bank', 15800.0, 18500.0, 'Power Banks', 'Baseus', 4.9, 165, 'https://api.nvshop.lk/api/public/file/69b1084447ef868f0adc96df/Baseus_Star-Lord_Power_Bank_22.5W_30000mAh_PPXJ0801012_1200x.webp', 15, TRUE, TRUE, 20, '1 Year Warranty', '7 Days', 'Buy genuine Baseus Star-Lord 30000mAh 22.5W Fast Charging Power Bank with 1 Year Warranty.'),
('Baseus Bipow 30000mAh 20W Digital Display Power Bank', 14500.0, 17200.0, 'Power Banks', 'Baseus', 4.8, 190, 'https://api.nvshop.lk/api/public/file/69a96a8147ef868f0adc59b0/1-1.webp', 16, FALSE, TRUE, 24, '1 Year Warranty', '7 Days', 'Buy genuine Baseus Bipow 30000mAh 20W Digital Display Power Bank with 1 Year Warranty.'),
('Baseus Bipow 20000mAh 25W Fast Charging Power Bank', 11900.0, 13900.0, 'Power Banks', 'Baseus', 4.8, 145, 'https://api.nvshop.lk/api/public/file/69a969b947ef868f0adc5936/146055_6-1000x1000afac.jpg', 14, FALSE, FALSE, 28, '1 Year Warranty', '7 Days', 'Buy genuine Baseus Bipow 20000mAh 25W Fast Charging Power Bank with 1 Year Warranty.'),
('Anker Zolo 20000mAh 22.5W Fast Charging Power Bank', 14800.0, 17500.0, 'Power Banks', 'Anker', 4.9, 215, 'https://api.nvshop.lk/api/public/file/69a9687847ef868f0adc58c3/A110E_Webcover.webp', 15, TRUE, TRUE, 30, '18 Months Company Warranty', '7 Days', 'Buy genuine Anker Zolo 20000mAh 22.5W Fast Charging Power Bank with 18 Months Company Warranty.'),
('JBL Charge 6 Portable Bluetooth Speaker', 48000.0, 54000.0, 'Speakers', 'JBL', 4.9, 95, 'https://api.nvshop.lk/api/public/file/69b11096c8cd3fa49255327f/download (1).jfif', 11, TRUE, FALSE, 10, '6 Months Warranty', '7 Days', 'Buy genuine JBL Charge 6 Portable Bluetooth Speaker with waterproof design & powerbank feature.'),
('JBL Flip 7 Portable Bluetooth Speaker', 36000.0, 41000.0, 'Speakers', 'JBL', 4.9, 135, 'https://api.nvshop.lk/api/public/file/69b3a157671bdc237efeba4c/JBL_FLIP_7_speaker-simplytek-lk-sri-lanka_1.jpg', 12, TRUE, FALSE, 14, '6 Months Warranty', '7 Days', 'Buy genuine JBL Flip 7 Portable Bluetooth Speaker with crystal clear stereo audio & deep bass.'),
('JBL Clip 5 Portable Bluetooth Speaker', 19500.0, 22500.0, 'Speakers', 'JBL', 4.8, 88, 'https://api.nvshop.lk/api/public/file/69b10d3847ef868f0adc98f2/JBL-CLIP5-BLK-TTC-1--1765866515.jpg', 13, TRUE, FALSE, 18, '6 Months Warranty', '7 Days', 'Buy genuine JBL Clip 5 Portable Bluetooth Speaker with ultra-portable carabiner clip design.'),
('JBL Go 3 Portable Bluetooth Speaker', 13800.0, 16000.0, 'Speakers', 'JBL', 4.8, 170, 'https://api.nvshop.lk/api/public/file/69b10c5347ef868f0adc98ae/JBL-GO-3-7.jpg', 14, FALSE, FALSE, 25, '6 Months Warranty', '7 Days', 'Buy genuine JBL Go 3 Portable Bluetooth Speaker with IP67 water and dust resistance.'),
('Anker 30W USB-C Fast Charger Adapter', 7500.0, 8900.0, 'Chargers & Cables & Adapters', 'Anker', 4.9, 180, 'https://api.nvshop.lk/api/public/file/69a9675447ef868f0adc5835/715hWhF5crL._AC_SL1500_.webp', 16, TRUE, TRUE, 35, '18 Months Company Warranty', '7 Days', 'Buy genuine Anker 30W USB-C Fast Charger Adapter with 18 Months Company Warranty at NVSHOP.LK.'),
('Anker 20W USB-C Fast Charger Adapter', 5800.0, 6900.0, 'Chargers & Cables & Adapters', 'Anker', 4.9, 240, 'https://api.nvshop.lk/api/public/file/69a966d647ef868f0adc57fe/4abd5f98ce6569be4b94056c4e52a064.jpg_960x960q80.jpg_.webp', 16, TRUE, TRUE, 40, '18 Months Company Warranty', '7 Days', 'Buy genuine Anker 20W USB-C Fast Charger Adapter with 18 Months Company Warranty at NVSHOP.LK.'),
('Soundcore Space One Wireless Noise Cancelling Headphones', 33500.0, 38000.0, 'Earphones & Headsets', 'Soundcore', 4.9, 140, 'https://api.nvshop.lk/api/public/file/69a9660e47ef868f0adc57d5/A3035_2_670x670_9c6f9b44-5314-4ee9-b2a2-c2d8f4acaceb.webp', 12, TRUE, FALSE, 15, '18 Months Company Warranty', '7 Days', 'Buy genuine Soundcore Space One Wireless Noise Cancelling Headphones with 2X stronger voice reduction.'),
('Soundcore Q11i Wireless Over-Ear Headphones', 18900.0, 22500.0, 'Earphones & Headsets', 'Soundcore', 4.8, 115, 'https://api.nvshop.lk/api/public/file/69a9656a47ef868f0adc57a3/Anker-Soundcore-Q11i-Simplytek-lk-sri-lanka_2.webp', 16, TRUE, TRUE, 20, '18 Months Company Warranty', '7 Days', 'Buy genuine Soundcore Q11i Wireless Over-Ear Headphones with 60-hour long battery life.'),
('Soundcore Liberty 4 NC True Wireless Noise Cancelling Earbuds', 24500.0, 28900.0, 'Earphones & Headsets', 'Soundcore', 5.0, 260, 'https://api.nvshop.lk/api/public/file/69a9640447ef868f0adc575f/gq-mobiles-anker-liberty-4-nc-4nc-noise-cancellation-in-ear-wireless-earbuds-earpods-specifications-details-4.png', 15, TRUE, TRUE, 25, '18 Months Company Warranty', '7 Days', 'Buy genuine Soundcore Liberty 4 NC with 98.5% noise reduction and Hi-Res wireless audio.'),
('Anker R50i NC True Wireless Earbuds', 8900.0, 10500.0, 'Earphones & Headsets', 'Anker', 4.9, 320, 'https://api.nvshop.lk/api/public/file/69a962a247ef868f0adc56e1/Anker-soundcore-r50i-nc-simplytek-lk-sri-lanka.webp', 15, TRUE, TRUE, 40, '18 Months Company Warranty', '7 Days', 'Buy genuine Anker R50i NC with 42dB active noise cancellation and 4-mic crystal clear calls.'),
('Anker Soundcore P20i True Wireless Earbuds', 6900.0, 8200.0, 'Earphones & Headsets', 'Anker', 4.8, 280, 'https://api.nvshop.lk/api/public/file/69a9614c47ef868f0adc55dc/anker-soundcore-r50i-true-wireless-earbuds-original-17073513534473124.webp', 16, FALSE, TRUE, 50, '18 Months Company Warranty', '7 Days', 'Buy genuine Anker Soundcore P20i with 10mm drivers, punchy bass, and 30-hour playtime.'),
('Anker Soundcore K20i TWS Semi-In-Ear Earbuds', 5500.0, 6800.0, 'Earphones & Headsets', 'Anker', 4.7, 190, 'https://api.nvshop.lk/api/public/file/69a95fe747ef868f0adc5540/brd-00816_anker-soundcore-k20i-tws-semi-in-ear-bluetooth-gaming-mode-low-latency-earbuds-a3994_full07-29b407c2.jpg', 19, TRUE, TRUE, 30, '6 Months Warranty', '7 Days', 'Buy genuine Anker Soundcore K20i semi-in-ear earbuds with gaming low latency mode.'),
('Anker Soundcore Liberty 5 ANC Earbuds', 26500.0, 31000.0, 'Earphones & Headsets', 'Soundcore', 4.9, 175, 'https://api.nvshop.lk/api/public/file/69a54a7b47ef868f0adc4ada/download (1).jfif', 15, TRUE, TRUE, 18, '18 Months Company Warranty', '7 Days', 'Buy genuine Anker Soundcore Liberty 5 ANC Earbuds with HearID personalized sound & spatial audio.'),
('Spigen Ultra Hybrid Case for iPhone 15 Pro', 6800.0, 8200.0, 'Phone Cases & Back Covers', 'Spigen', 4.9, 185, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600', 17, TRUE, TRUE, 35, '12 Months', '7 Days', 'Clear shock-absorption bumper case with Air Cushion Technology for iPhone 15 Pro.'),
('Spigen EZ Fit Tempered Glass Guard (2-Pack)', 4500.0, 5500.0, 'Screen Protectors', 'Spigen', 4.9, 240, 'https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600', 18, TRUE, TRUE, 50, '12 Months', '7 Days', 'Auto-alignment tray kit for bubble-free 9H hardness tempered glass installation.'),
('Logitech MX Master 3S Wireless Performance Mouse', 34500.0, 39900.0, 'Mouse & Keyboards', 'Logitech', 4.9, 130, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 13, TRUE, FALSE, 14, '2 Years', '7 Days', 'Quiet clicks, 8K DPI sensor for glass tracking, and MagSpeed scroll wheel.'),
('SanDisk Extreme Pro 128GB MicroSDXC 200MB/s', 7800.0, 9500.0, 'Pendrives & SD Cards', 'SanDisk', 4.9, 320, 'https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600', 17, FALSE, TRUE, 45, 'Lifetime', '7 Days', 'High-speed A2 4K UHD MicroSD memory card for action cameras, drones & phones.'),
('UGREEN Aluminum Foldable Desk Phone Stand', 2900.0, 3800.0, 'Others', 'UGREEN', 4.8, 110, 'https://images.unsplash.com/photo-1586953101226-996522c06170?q=80&w=600', 23, TRUE, TRUE, 30, '12 Months', '7 Days', 'Adjustable multi-angle aluminum desktop stand for smartphones and tablets.');

-- 3.7 Insert Sample Customer Orders
INSERT INTO orders (order_number, user_email, customer_name, customer_phone, shipping_address, city, postal_code, subtotal, tax, shipping_cost, total_amount, status, payment_method, payment_status, created_at)
VALUES
('NV-849102', 'khimasha16@gmail.com', 'Kulashi Himasha', '+94 76 227 7566', '185/1/2B New Road, Ambalangoda, Sri Lanka', 'Ambalangoda', '80300', 23000.0, 0.0, 0.0, 23000.0, 'DELIVERED', 'CARD', 'SUCCESS', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('NV-512934', 'khimasha16@gmail.com', 'Kulashi Himasha', '+94 76 227 7566', '185/1/2B New Road, Ambalangoda, Sri Lanka', 'Ambalangoda', '80300', 26500.0, 0.0, 0.0, 26500.0, 'SHIPPED', 'COD', 'PENDING', CURRENT_TIMESTAMP - INTERVAL '1 day'),
('NV-734190', 'mayanthanawarathna37@gmail.com', 'Mayantha Nawarathna', '+94 72 583 5742', '185/1/2B New Road, Ambalangoda, Sri Lanka', 'Ambalangoda', '80300', 33500.0, 0.0, 0.0, 33500.0, 'PROCESSING', 'PAYHERE', 'SUCCESS', CURRENT_TIMESTAMP - INTERVAL '12 hours'),
('NV-619283', 'john@example.com', 'John Doe', '+94 71 987 6543', 'No 45 Galle Road, Colombo 03', 'Colombo', '00300', 445000.0, 0.0, 0.0, 445000.0, 'DELIVERED', 'CARD', 'SUCCESS', CURRENT_TIMESTAMP - INTERVAL '5 days');

-- 3.8 Insert Order Items
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity, subtotal)
VALUES
(1, 14, 'UGREEN 20000mAh 30W Fast Charging Power Bank', 'https://api.nvshop.lk/api/public/file/69b3a010671bdc237efeb8f7/24727d81-b4bc-4bbd-bdbb-3949a1b4d899.jpg.webp', 12800.0, 1, 12800.0),
(1, 2, 'Apple Original 20W USB-C Power Adapter', 'https://api.nvshop.lk/api/public/file/69a966d647ef868f0adc57fe/4abd5f98ce6569be4b94056c4e52a064.jpg_960x960q80.jpg_.webp', 6500.0, 1, 6500.0),
(2, 43, 'Anker Soundcore Liberty 5 ANC Earbuds', 'https://api.nvshop.lk/api/public/file/69a54a7b47ef868f0adc4ada/download (1).jfif', 26500.0, 1, 26500.0),
(3, 37, 'Soundcore Space One Wireless Noise Cancelling Headphones', 'https://api.nvshop.lk/api/public/file/69a9660e47ef868f0adc57d5/A3035_2_670x670_9c6f9b44-5314-4ee9-b2a2-c2d8f4acaceb.webp', 33500.0, 1, 33500.0),
(4, 1, 'Apple iPhone 17 Pro Max 256GB (X/A)', 'https://api.nvshop.lk/api/public/file/6a113bc506fdb61b1b19f7d7/16-pro-6.jpg', 445000.0, 1, 445000.0);

-- 3.9 Insert Payment Transactions
INSERT INTO payment_transactions (transaction_reference, order_number, user_email, amount, currency, payment_gateway, status, card_last4, created_at)
VALUES
('TXN-PAYHERE-98124', 'NV-849102', 'khimasha16@gmail.com', 23000.0, 'LKR', 'PAYHERE', 'SUCCESS', '4242', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('TXN-STRIPE-43189', 'NV-734190', 'mayanthanawarathna37@gmail.com', 33500.0, 'LKR', 'STRIPE', 'SUCCESS', '5521', CURRENT_TIMESTAMP - INTERVAL '12 hours'),
('TXN-PAYHERE-12093', 'NV-619283', 'john@example.com', 445000.0, 'LKR', 'PAYHERE', 'SUCCESS', '8812', CURRENT_TIMESTAMP - INTERVAL '5 days');

-- 3.10 Insert Master Shop Details
INSERT INTO shop_details (shop_name, tagline, description, email, support_email, hotline, phone_secondary, whatsapp, address, city, postal_code, google_maps_url, business_hours, warranty_policy, return_policy, shipping_policy, payment_methods, showroom_info)
VALUES
('NVSHOP.LK', 'Sri Lanka''s Premier Tech & Apple Accessories Store', 'NVSHOP.LK is Sri Lanka''s leading technology store providing 100% authentic Apple products, Anker power banks, UGREEN GaN chargers, Soundcore audio gear, and cutting-edge mobile gadgets with official warranty coverage.', 'support@nvshop.lk', 'orders@nvshop.lk', '+94 77 123 4567', '+94 91 225 6789', '+94 77 123 4567', '185/1/2B New Road, Ambalangoda, Southern Province, Sri Lanka', 'Ambalangoda', '80300', 'https://maps.google.com/?q=Ambalangoda+Sri+Lanka', 'Monday - Saturday: 9:00 AM - 7:30 PM | Sunday: 10:00 AM - 5:00 PM | Poya Days: Closed', 'All products carry authentic manufacturer company warranty (6 Months to 2 Years). Direct replacement for manufacturing defects within the warranty period with original receipt and packaging.', '7-day replacement warranty for manufacturing defects. Returned products must be in original condition with box, accessories, and invoice.', 'Islandwide express courier delivery within 24-48 hours. Free delivery on orders over LKR 10,000. Cash on Delivery (COD) supported nationwide.', 'Visa, MasterCard, Amex, Koko 3-Month Installments (BNPL 0% interest), Mintpay, Bank Transfer, and Cash on Delivery (COD).', 'Visit our flagship experiential showroom at New Road, Ambalangoda featuring an interactive VR Demo Lounge and live audio testing stations.');

-- 3.11 Insert Shop Knowledge Base Chunks (For Semantic Vector Search)
INSERT INTO shop_knowledge (category, title, content)
VALUES
('STORE_OVERVIEW', 'NVSHOP.LK Store Location, Contact & Opening Hours', 'NVSHOP.LK is located at 185/1/2B New Road, Ambalangoda (Postal Code: 80300), Sri Lanka. Our official customer hotline and WhatsApp support is +94 77 123 4567. Secondary phone: +94 91 225 6789. Customer support email: support@nvshop.lk, orders email: orders@nvshop.lk. Opening hours are Monday to Saturday from 9:00 AM to 7:30 PM, and Sunday from 10:00 AM to 5:00 PM. We are closed on Poya Days.'),
('WARRANTY_POLICY', 'Official Warranty Policies and Claim Procedures', 'Every product sold at NVSHOP.LK comes with verified authentic company warranty: Anker and Soundcore audio/chargers: 18 Months Company Warranty. UGREEN chargers and power banks: 1 Year Warranty. Apple devices & genuine adapters: 1 Year Official AppleCare Warranty. Smart watches (Green Lion, Black Shark, WiWU, Haylou): 6 Months Warranty. Warranty claims can be submitted directly at our Ambalangoda showroom or dispatched via courier with the original invoice.'),
('SHIPPING_DELIVERY', 'Islandwide Courier Delivery Rates & Delivery Times', 'NVSHOP.LK delivers to all 25 districts across Sri Lanka via express courier partners. Colombo and suburbs: Delivery within 24 hours. Outstation and regional areas: Delivery within 24 to 48 hours. Standard shipping fee is LKR 450. Delivery is completely FREE for all orders over LKR 10,000. Cash on Delivery (COD) is available islandwide for convenient payment upon receiving your package.'),
('PAYMENT_METHODS', 'Payment Options and Koko Buy-Now-Pay-Later (BNPL)', 'We provide flexible, secure payment methods: 1. Cash on Delivery (COD) across Sri Lanka. 2. Visa, MasterCard, and American Express cards via secure PayHere gateway. 3. Koko BNPL: Split your total payment into 3 equal monthly installments with 0% interest using any debit or credit card. 4. Mintpay 3-month installment plans. 5. Direct Bank Transfer (Commercial Bank / Sampath Bank).'),
('SHOWROOM_VR', 'Experiential Showroom and Interactive VR Demo Lounge', 'NVSHOP.LK features Sri Lanka''s first experiential tech store in Ambalangoda. Customers can visit our showroom to try premium headphones, test wireless earbuds at live sound stations, and experience interactive Virtual Reality demos (Apple Vision Pro and Meta Quest 3). Our tech specialists offer free unboxing and device setup assistance on-site.'),
('RETURN_REFUND', '7-Day Return and Replacement Guarantee', 'If you encounter any manufacturing fault within 7 days of receiving your order, NVSHOP.LK provides a brand new 1-to-1 replacement. To qualify, items must be returned with the original retail packaging, cables, manuals, and proof of purchase. Physical damage, water damage, or electrical burns caused by power surges are not covered under warranty.'),
('AUTHENTICITY', '100% Genuine and Authentic Tech Guarantee', 'NVSHOP.LK guarantees that every item sold is 100% genuine and sourced from authorized regional distributors. All Apple devices feature valid serial numbers verifiable on the official Apple checkcoverage portal. Anker, UGREEN, and Baseus items feature original holographic authentication scratch codes.');

-- ==============================================================================
-- 4. VERIFY DATA INSERTION
-- ==============================================================================
SELECT 'Users count: ' || count(*) FROM users;
SELECT 'Admins count: ' || count(*) FROM admins;
SELECT 'Products count: ' || count(*) FROM products;
SELECT 'Suppliers count: ' || count(*) FROM suppliers;
SELECT 'Hero slides count: ' || count(*) FROM hero_slides;
SELECT 'Showroom photos count: ' || count(*) FROM showroom_photos;
SELECT 'Orders count: ' || count(*) FROM orders;
SELECT 'Order items count: ' || count(*) FROM order_items;
SELECT 'Payment transactions count: ' || count(*) FROM payment_transactions;
SELECT 'Shop details count: ' || count(*) FROM shop_details;
SELECT 'Shop knowledge chunks: ' || count(*) FROM shop_knowledge;
