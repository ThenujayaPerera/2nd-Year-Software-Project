import { create } from 'zustand';

// Cart Store
export const useCartStore = create((set) => ({
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  
  addToCart: (product) => set((state) => {
    const existingItem = state.cart.find(item => item.id === product.id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = state.cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...state.cart, { ...product, quantity: 1 }];
    }
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    return { cart: updatedCart };
  }),

  removeFromCart: (productId) => set((state) => {
    const updatedCart = state.cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    return { cart: updatedCart };
  }),

  updateQuantity: (productId, quantity) => set((state) => {
    const updatedCart = state.cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ).filter(item => item.quantity > 0);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    return { cart: updatedCart };
  }),

  clearCart: () => set(() => {
    localStorage.removeItem('cart');
    return { cart: [] };
  }),

  getCartTotal: () => {
    const state = useCartStore.getState();
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getCartCount: () => {
    const state = useCartStore.getState();
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  },
}));

// Auth Store
export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),

  login: (userData) => set(() => {
    localStorage.setItem('user', JSON.stringify(userData));
    return { 
      user: userData,
      isAuthenticated: true 
    };
  }),

  logout: () => set(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return { 
      user: null,
      isAuthenticated: false 
    };
  }),

  setUser: (userData) => set(() => {
    localStorage.setItem('user', JSON.stringify(userData));
    return { 
      user: userData,
      isAuthenticated: true 
    };
  }),
}));

// Filter Store
export const useFilterStore = create((set) => ({
  filters: {
    category: '',
    priceRange: [0, 100000],
    brand: '',
    inStock: false,
    rating: 0,
  },

  setCategory: (category) => set((state) => ({
    filters: { ...state.filters, category }
  })),

  setPriceRange: (priceRange) => set((state) => ({
    filters: { ...state.filters, priceRange }
  })),

  setBrand: (brand) => set((state) => ({
    filters: { ...state.filters, brand }
  })),

  setInStock: (inStock) => set((state) => ({
    filters: { ...state.filters, inStock }
  })),

  setRating: (rating) => set((state) => ({
    filters: { ...state.filters, rating }
  })),

  resetFilters: () => set(() => ({
    filters: {
      category: '',
      priceRange: [0, 100000],
      brand: '',
      inStock: false,
      rating: 0,
    }
  })),
}));

// Comparison Store
export const useComparisonStore = create((set) => ({
  comparison: JSON.parse(localStorage.getItem('comparison')) || [],

  addToComparison: (product) => set((state) => {
    const alreadyAdded = state.comparison.find(item => item.id === product.id);
    if (alreadyAdded) {
      return { comparison: state.comparison };
    }
    if (state.comparison.length >= 4) {
      return { comparison: state.comparison };
    }
    const updatedComparison = [...state.comparison, product];
    localStorage.setItem('comparison', JSON.stringify(updatedComparison));
    return { comparison: updatedComparison };
  }),

  removeFromComparison: (productId) => set((state) => {
    const updatedComparison = state.comparison.filter(item => item.id !== productId);
    localStorage.setItem('comparison', JSON.stringify(updatedComparison));
    return { comparison: updatedComparison };
  }),

  clearComparison: () => set(() => {
    localStorage.removeItem('comparison');
    return { comparison: [] };
  }),

  isInComparison: (productId) => {
    const state = useComparisonStore.getState();
    return state.comparison.some(item => item.id === productId);
  },
}));
