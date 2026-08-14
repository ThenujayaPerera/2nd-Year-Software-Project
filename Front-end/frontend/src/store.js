import { create } from 'zustand';
import { cartAPI } from './services/api';

// Helper to get email
const getAuthEmail = () => useAuthStore.getState().user?.email;

// Cart Store
export const useCartStore = create((set, get) => ({
  cart: [],
  
  fetchCart: async () => {
    const email = getAuthEmail();
    if (!email) return;
    try {
      console.log("Fetching cart from backend...");
      const response = await cartAPI.fetchCart(email);
      const mappedCart = response.data.items.map(item => ({ ...item.product, quantity: item.quantity }));
      set({ cart: mappedCart });
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  },

  addToCart: async (product) => {
    const email = getAuthEmail();
    if (!email) {
      console.error("Must be logged in to add to cart");
      return;
    }
    try {
      const response = await cartAPI.addToCartAPI(email, product.id, 1);
      const mappedCart = response.data.items.map(item => ({ ...item.product, quantity: item.quantity }));
      set({ cart: mappedCart });
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  },

  removeFromCart: async (productId) => {
    const email = getAuthEmail();
    if (!email) return;
    try {
      const response = await cartAPI.removeFromCartAPI(email, productId);
      const mappedCart = response.data.items.map(item => ({ ...item.product, quantity: item.quantity }));
      set({ cart: mappedCart });
    } catch (error) {
      console.error("Failed to remove from cart", error);
    }
  },

  updateQuantity: (productId, quantity) => {
     // Optional: If you need it later
  },

  clearCart: async () => {
    const email = getAuthEmail();
    if (!email) return;
    try {
      await cartAPI.clearCartAPI(email);
      set({ cart: [] });
    } catch (error) {
      console.error("Failed to clear cart", error);
    }
  },

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

// Wishlist Store
export const useWishlistStore = create((set, get) => ({
  wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],

  toggleWishlist: (product) => set((state) => {
    const exists = state.wishlist.some((item) => item.id === product.id);
    let updated;
    if (exists) {
      updated = state.wishlist.filter((item) => item.id !== product.id);
    } else {
      updated = [...state.wishlist, product];
    }
    localStorage.setItem('wishlist', JSON.stringify(updated));
    return { wishlist: updated };
  }),

  isInWishlist: (productId) => {
    return get().wishlist.some((item) => item.id === productId);
  },

  clearWishlist: () => set(() => {
    localStorage.removeItem('wishlist');
    return { wishlist: [] };
  }),
}));

