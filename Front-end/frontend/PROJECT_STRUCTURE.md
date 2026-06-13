# Project Structure Overview

## 📂 Folder Organization

### `/src/components`
Reusable, self-contained components used across multiple pages.

- **Layout Components:**
  - `Layout.jsx` - Main layout wrapper with Navbar and Footer
  - `Navbar.jsx` - Navigation bar with user menu
  - `Footer.jsx` - Footer with links and info

- **Product Components:**
  - `ProductCard.jsx` - Individual product display card
  - `Sidebar.jsx` - Filter sidebar for products

- **Shopping Components:**
  - `CartItem.jsx` - Single cart item with quantity controls

- **UI Components:**
  - `Alert.jsx` - Notification/alert messages
  - `Modal.jsx` - Reusable modal dialog
  - `Loading.jsx` - Loading spinner

### `/src/pages`
Full-page components representing different routes.

- `Home.jsx` - Landing page with featured products
- `Products.jsx` - Product listing with filters and pagination
- `Cart.jsx` - Shopping cart and checkout flow
- `Login.jsx` - Authentication (login/signup)
- `Admin.jsx` - Admin dashboard and store management

### `/src/services`
API and external service integrations.

- `api.js` - Axios instance with base configuration and endpoint definitions

### `/src/store.js`
Global state management using Zustand.

**Stores:**
- `useCartStore` - Shopping cart state
- `useAuthStore` - User authentication state
- `useFilterStore` - Product filters state

### `/src/data`
Mock data and constants.

- `products.js` - Sample product data and categories

### `/src`
Root level files.

- `App.jsx` - Root component with routing
- `main.jsx` - React DOM entry point
- `index.css` - Tailwind CSS and global styles
- `App.css` - App-specific styles

## 🎯 Component Hierarchy

```
App.jsx
├── Router (React Router)
│   ├── Home
│   │   ├── Layout
│   │   │   ├── Navbar
│   │   │   ├── [Page Content]
│   │   │   └── Footer
│   │   └── ProductCard (multiple)
│   ├── Products
│   │   ├── Layout
│   │   ├── Sidebar
│   │   └── ProductCard (grid)
│   ├── Cart
│   │   ├── Layout
│   │   └── CartItem (multiple)
│   ├── Login
│   │   ├── Layout
│   │   └── Alert
│   └── Admin
│       ├── Layout
│       └── [Multiple Tabs]
```

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - React rendering
- `react-router-dom` - Routing
- `zustand` - State management
- `axios` - HTTP client

### Styling
- `tailwindcss` - Utility-first CSS
- `postcss` - CSS transformation
- `autoprefixer` - Browser prefixes

### Development
- `vite` - Build tool
- `eslint` - Code linting

## 🔄 Data Flow

```
User Interaction
    ↓
Component Handler
    ↓
Zustand Store (State Update)
    ↓
Component Re-render
    ↓
UI Update

API Call Flow:
User Action → API Call → Store Update → Component Update
```

## 🎨 Styling Approach

- **Tailwind CSS** - Utility classes for styling
- **Custom Components** - Pre-defined button and card styles in `index.css`
- **Responsive Design** - Mobile-first with breakpoints

## 🚀 Performance Optimizations

1. **Code Splitting** - React Router enables automatic code splitting
2. **Memoization** - Components don't re-render unnecessarily
3. **Local Storage** - Persist cart and user data
4. **Lazy Loading** - Ready for lazy component loading

## 🔐 State Persistence

- **Cart** - Persisted in localStorage
- **User** - Stored after authentication
- **Token** - Stored for API authorization

## 🧪 Testing Ready

Components are structured for easy testing with:
- Clear prop interfaces
- Separated concerns
- Mockable state management
- Isolated API layer

## 📚 Best Practices

1. **Component Reusability** - Shared components used across pages
2. **Prop Drilling Avoidance** - Zustand for global state
3. **Clear Naming** - Descriptive component and function names
4. **Tailwind Utilities** - Minimal custom CSS
5. **Responsive Design** - Mobile-first approach
