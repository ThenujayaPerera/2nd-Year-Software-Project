# NV-SHOP Frontend - Advanced E-Commerce Platform

A modern, fully-featured e-commerce frontend built with React, Vite, and Tailwind CSS for a mobile accessories shop.

## 🎯 Features

### ✨ Core Features
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Product Catalog** - Advanced filtering, sorting, and pagination
- **Shopping Cart** - Persistent cart with local storage
- **User Authentication** - Login and signup with auth context
- **Admin Dashboard** - Full store management interface
- **Product Search** - Real-time search functionality
- **Category Browsing** - Organized product categories

### 🛠️ Technical Features
- **State Management** - Zustand for lightweight global state
- **API Integration** - Axios with interceptors for API calls
- **Component Architecture** - Modular, reusable components
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Hot Module Replacement** - Fast development workflow with Vite

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── Footer.jsx       # Footer component
│   │   ├── ProductCard.jsx  # Product card
│   │   ├── Sidebar.jsx      # Filter sidebar
│   │   ├── CartItem.jsx     # Cart item component
│   │   ├── Alert.jsx        # Alert notifications
│   │   ├── Modal.jsx        # Modal dialog
│   │   ├── Loading.jsx      # Loading spinner
│   │   └── Layout.jsx       # Main layout wrapper
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Home page
│   │   ├── Products.jsx     # Products listing
│   │   ├── Cart.jsx         # Shopping cart
│   │   ├── Login.jsx        # Login/Signup
│   │   └── Admin.jsx        # Admin dashboard
│   ├── services/            # API services
│   │   └── api.js           # Axios API configuration
│   ├── store.js             # Zustand stores (Cart, Auth, Filters)
│   ├── data/
│   │   └── products.js      # Mock product data
│   ├── App.jsx              # Root app component
│   ├── main.jsx             # React DOM entry point
│   ├── index.css            # Tailwind & global styles
│   └── App.css              # App-specific styles
├── public/                  # Static assets
├── package.json             # Project dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── eslint.config.js        # ESLint configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Install Tailwind CSS and dependencies:**
```bash
npm install -D tailwindcss postcss autoprefixer
```

### Development

1. **Start the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

2. **Build for production:**
```bash
npm run build
```

3. **Preview production build:**
```bash
npm run preview
```

## 🎨 Available Components

### Navbar
- Navigation links
- Search bar
- User account menu
- Shopping cart indicator

### ProductCard
- Product image with discount badge
- Rating and reviews
- Price display
- Add to cart button
- View details link

### Sidebar (Filter)
- Category filter
- Price range slider
- Brand filter
- Stock availability
- Rating filter

### CartItem
- Product details
- Quantity controls
- Item removal
- Price calculation

### Pages

#### Home
- Hero section
- Featured products showcase
- Category browsing
- Newsletter signup CTA

#### Products
- Full product catalog
- Advanced filtering
- Sorting options
- Pagination
- Responsive grid

#### Cart
- Cart items display
- Order summary
- Subtotal, tax, shipping calculation
- Checkout button
- Continue shopping link

#### Login
- Email/password login
- Social login options
- Remember me checkbox
- Forgot password link
- Sign up redirect

#### Admin
- Dashboard with stats
- Product management
- Order management
- User management
- Store settings

## 🔌 State Management (Zustand)

### useCartStore
```javascript
const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCartStore();
```

### useAuthStore
```javascript
const { user, isAuthenticated, login, logout, setUser } = useAuthStore();
```

### useFilterStore
```javascript
const { filters, setCategory, setPriceRange, setBrand, setInStock, resetFilters } = useFilterStore();
```

## 🌐 API Integration

Base URL configured in `src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
```

### Available Endpoints

**Products**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Auth**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/logout` - Logout

**Cart**
- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add item
- `PUT /api/cart/items/:id` - Update item
- `DELETE /api/cart/items/:id` - Remove item

**Orders**
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order

## 🎨 Tailwind CSS Customization

Edit `tailwind.config.js` to customize:
- Colors
- Typography
- Spacing
- Shadows
- Animations

## 📱 Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔐 Security Notes

- Tokens stored in localStorage
- CSRF protection via token headers
- Input validation on forms
- XSS protection via React JSX escaping

## 🐛 Development Tips

1. **Local Storage:**
   - Cart data persists across sessions
   - User data stored after login

2. **Error Handling:**
   - Alert component for notifications
   - API error interceptors

3. **Performance:**
   - Component lazy loading ready
   - Memoization for expensive renders
   - Code splitting via React Router

## 📦 Build & Deployment

### Build Process
```bash
npm run build
```

Output in `dist/` directory ready for deployment.

### Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:8080/api
```

## 🤝 Contributing

1. Create feature branches
2. Follow component structure
3. Use Tailwind classes
4. Keep components reusable

## 📝 License

All rights reserved © 2024 NV-SHOP

## 📧 Support

For issues and questions, contact: info@nvshop.com

---

**Built with ❤️ for mobile accessories enthusiasts**
