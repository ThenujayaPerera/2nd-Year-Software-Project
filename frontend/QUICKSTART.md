# Quick Start Guide

Get the NV-SHOP frontend running in 5 minutes! 🚀

## Step 1: Install Dependencies (2 minutes)

```bash
cd frontend
npm install
```

This installs all required packages including React, Vite, Tailwind CSS, and other dependencies.

## Step 2: Start Development Server (1 minute)

```bash
npm run dev
```

Open your browser and go to:
```
http://localhost:5173
```

## Step 3: Explore the App (2 minutes)

### Home Page
- Browse featured products
- View product categories
- See special offers

### Products Page
- Use filters (category, price, brand)
- Sort products
- Browse with pagination

### Shopping Cart
- Add/remove items
- Adjust quantities
- See order summary
- *Note: Uses local storage - data persists*

### Login
- Test login with any email
- Mock authentication enabled
- Try different user roles

### Admin Dashboard
- View sales statistics
- Manage products
- View orders
- Configure settings

## Key Features

### 🛒 Shopping
```javascript
// Add to cart automatically persists
addToCart({ id: 1, name: 'Product', price: 19.99 })
```

### 👤 Authentication
```javascript
// Login automatically saved
login({ email: 'user@example.com', role: 'user' })
```

### 🔍 Filtering
```javascript
// Use sidebar to filter products
// Filters are real-time and reactive
```

## Project Commands

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Check code style
```

## Environment Setup

1. **Copy environment template:**
```bash
cp .env.example .env
```

2. **Update API URL (optional):**
```
VITE_API_URL=http://localhost:8080/api
```

## Folder Navigation

```
frontend/
├── src/
│   ├── components/    ← Reusable UI components
│   ├── pages/        ← Page components
│   ├── services/     ← API calls
│   └── store.js      ← Global state
├── public/           ← Static files
└── package.json
```

## Common Tasks

### Add a New Product
Edit `src/data/products.js` to add mock products

### Change Colors
Edit `tailwind.config.js` theme colors

### Add a New Page
1. Create file in `src/pages/`
2. Add route in `App.jsx`
3. Import components and use Layout

### Modify Navigation
Edit `src/components/Navbar.jsx`

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 5174
```

### Clear Cache
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Tailwind Not Applying
Make sure you've:
1. Imported `index.css` in `main.jsx` ✓
2. Added content paths to `tailwind.config.js` ✓
3. Restarted dev server ✓

## Next Steps

1. **Connect Backend:**
   - Update API URL in `.env`
   - Implement real authentication
   - Connect to database

2. **Add Features:**
   - Payment integration
   - Product details page
   - User profile
   - Order history

3. **Deploy:**
   - Build: `npm run build`
   - Deploy `dist/` folder
   - Use Netlify, Vercel, or any static host

## Mock Data

Currently using mock data for:
- Products (48 items)
- Orders
- User authentication
- Cart operations (localStorage)

All ready to connect to real APIs!

## Resources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Happy coding! 🎉**

Need help? Check `ADVANCED_README.md` and `PROJECT_STRUCTURE.md` for detailed documentation.
