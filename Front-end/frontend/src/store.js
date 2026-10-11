import { create } from 'zustand';
import { cartAPI, wishlistAPI } from './services/api';

// Helper to get authenticated user's email safely
const getAuthEmail = () => {
  try {
    return useAuthStore.getState()?.user?.email || JSON.parse(localStorage.getItem('user'))?.email || null;
  } catch {
    return null;
  }
};

// Cart Store
export const useCartStore = create((set, get) => ({
  cart: [],
  isLoading: false,

  fetchCart: async () => {
    const email = getAuthEmail();
    if (!email) return;
    try {
      set({ isLoading: true });
      const response = await cartAPI.fetchCart(email);
      const mappedCart = (response.data?.items || []).map((item) => ({
        ...item.product,
        quantity: item.quantity,
      }));
      set({ cart: mappedCart, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch cart from backend:', error);
      set({ isLoading: false });
    }
  },

  addToCart: async (product) => {
    const email = getAuthEmail();
    const qtyToAdd = product.quantity && product.quantity > 0 ? product.quantity : 1;

    if (email) {
      try {
        const response = await cartAPI.addToCartAPI(email, product.id, qtyToAdd);
        const mappedCart = (response.data?.items || []).map((item) => ({
          ...item.product,
          quantity: item.quantity,
        }));
        set({ cart: mappedCart });
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    } else {
      // Guest local cart fallback
      const state = get();
      const existing = state.cart.find((item) => item.id === product.id);
      let updatedCart;
      if (existing) {
        updatedCart = state.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      } else {
        updatedCart = [...state.cart, { ...product, quantity: qtyToAdd }];
      }
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      set({ cart: updatedCart });
    }
  },

  removeFromCart: async (productId) => {
    const email = getAuthEmail();
    if (email) {
      try {
        const response = await cartAPI.removeFromCartAPI(email, productId);
        const mappedCart = (response.data?.items || []).map((item) => ({
          ...item.product,
          quantity: item.quantity,
        }));
        set({ cart: mappedCart });
      } catch (error) {
        console.error('Failed to remove from cart:', error);
      }
    } else {
      const updatedCart = get().cart.filter((item) => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      set({ cart: updatedCart });
    }
  },

  updateQuantity: async (productId, quantity) => {
    const currentItem = get().cart.find((item) => item.id === productId);
    if (!currentItem) return;

    if (quantity <= 0) {
      return get().removeFromCart(productId);
    }

    const delta = quantity - currentItem.quantity;
    if (delta === 0) return;

    const email = getAuthEmail();
    if (email) {
      try {
        const response = await cartAPI.addToCartAPI(email, productId, delta);
        const mappedCart = (response.data?.items || []).map((item) => ({
          ...item.product,
          quantity: item.quantity,
        }));
        set({ cart: mappedCart });
      } catch (error) {
        console.error('Failed to update cart quantity:', error);
      }
    } else {
      const updatedCart = get().cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      set({ cart: updatedCart });
    }
  },

  clearCart: async () => {
    const email = getAuthEmail();
    if (email) {
      try {
        await cartAPI.clearCartAPI(email);
        set({ cart: [] });
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    } else {
      localStorage.removeItem('cart');
      set({ cart: [] });
    }
  },

  getCartTotal: () => {
    const state = useCartStore.getState();
    return state.cart.reduce((total, item) => total + ((Number(item.price) || 0) * (item.quantity || 1)), 0);
  },

  getCartCount: () => {
    const state = useCartStore.getState();
    return state.cart.reduce((count, item) => count + (item.quantity || 1), 0);
  },
}));

// Auth Store
export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),

  login: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData?.email) {
      setTimeout(() => {
        useWishlistStore.getState().fetchBackendWishlist(userData.email);
        useCartStore.getState().fetchCart();
      }, 0);
    }
    set({
      user: userData,
      isAuthenticated: true
    });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    useCartStore.setState({ cart: [] });
    set({
      user: null,
      isAuthenticated: false
    });
  },

  setUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData?.email) {
      setTimeout(() => {
        useWishlistStore.getState().fetchBackendWishlist(userData.email);
        useCartStore.getState().fetchCart();
      }, 0);
    }
    set({
      user: userData,
      isAuthenticated: true
    });
  },
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
  isLoading: false,

  addToWishlist: async (product) => {
    const state = get();
    if (state.wishlist.some((item) => item.id === product.id)) return;

    const normalizedItem = {
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      category: product.category || 'Accessories',
      brand: product.brand || 'NV-Original',
      image: product.image || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&auto=format&fit=crop',
      rating: product.rating || 4.8,
      stock: product.stock !== undefined ? product.stock : 10,
      discount: product.discount || (product.originalPrice && product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0),
      addedAt: product.addedAt || new Date().toISOString(),
    };

    const updated = [normalizedItem, ...state.wishlist];
    localStorage.setItem('wishlist', JSON.stringify(updated));
    set({ wishlist: updated });

    // Sync to backend if logged in
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.email) {
        await wishlistAPI.addItem({
          userEmail: user.email,
          productId: normalizedItem.id,
          productName: normalizedItem.name,
          price: normalizedItem.price,
          originalPrice: normalizedItem.originalPrice,
          category: normalizedItem.category,
          brand: normalizedItem.brand,
          image: normalizedItem.image,
          rating: normalizedItem.rating,
          stock: normalizedItem.stock,
        });
      }
    } catch (err) {
      console.warn('Backend wishlist sync skipped:', err.message);
    }
  },

  removeFromWishlist: async (productId) => {
    const updated = get().wishlist.filter((item) => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    set({ wishlist: updated });

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.email) {
        await wishlistAPI.removeItem(productId, user.email);
      }
    } catch (err) {
      console.warn('Backend wishlist removal skipped:', err.message);
    }
  },

  toggleWishlist: async (product) => {
    const exists = get().isInWishlist(product.id);
    if (exists) {
      await get().removeFromWishlist(product.id);
      return false; // removed
    } else {
      await get().addToWishlist(product);
      return true; // added
    }
  },

  isInWishlist: (productId) => {
    return get().wishlist.some((item) => item.id === productId);
  },

  clearWishlist: async () => {
    localStorage.removeItem('wishlist');
    set({ wishlist: [] });

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.email) {
        await wishlistAPI.clearWishlist(user.email);
      }
    } catch (err) {
      console.warn('Backend wishlist clear skipped:', err.message);
    }
  },

  moveToCart: (product) => {
    useCartStore.getState().addToCart(product);
    get().removeFromWishlist(product.id);
  },

  moveAllToCart: () => {
    const items = get().wishlist;
    const inStockItems = items.filter((item) => item.stock === undefined || item.stock > 0);
    inStockItems.forEach((item) => {
      useCartStore.getState().addToCart(item);
    });

    const remaining = items.filter((item) => item.stock !== undefined && item.stock === 0);
    localStorage.setItem('wishlist', JSON.stringify(remaining));
    set({ wishlist: remaining });

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.email && inStockItems.length > 0) {
        inStockItems.forEach((item) => {
          wishlistAPI.removeItem(item.id, user.email).catch(() => { });
        });
      }
    } catch (err) {
      console.warn('Backend wishlist sync skipped during moveAllToCart:', err.message);
    }

    return inStockItems.length;
  },

  fetchBackendWishlist: async (userEmail) => {
    if (!userEmail) return;
    try {
      set({ isLoading: true });
      const local = get().wishlist;
      if (local.length > 0) {
        const payload = local.map((item) => ({
          userEmail,
          productId: item.id,
          productName: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          category: item.category,
          brand: item.brand,
          image: item.image,
          rating: item.rating,
          stock: item.stock,
        }));
        const syncRes = await wishlistAPI.syncWishlist(userEmail, payload);
        if (syncRes?.data && Array.isArray(syncRes.data)) {
          const merged = syncRes.data.map((item) => ({
            id: item.productId,
            name: item.productName,
            price: item.price,
            originalPrice: item.originalPrice,
            category: item.category,
            brand: item.brand,
            image: item.image,
            rating: item.rating,
            stock: item.stock,
            addedAt: item.addedAt,
          }));
          localStorage.setItem('wishlist', JSON.stringify(merged));
          set({ wishlist: merged, isLoading: false });
          return;
        }
      }

      const res = await wishlistAPI.getWishlist(userEmail);
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((item) => ({
          id: item.productId,
          name: item.productName,
          price: item.price,
          originalPrice: item.originalPrice,
          category: item.category,
          brand: item.brand,
          image: item.image,
          rating: item.rating,
          stock: item.stock,
          addedAt: item.addedAt,
        }));
        localStorage.setItem('wishlist', JSON.stringify(mapped));
        set({ wishlist: mapped, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      console.warn('Could not sync backend wishlist:', err.message);
      set({ isLoading: false });
    }
  },

  getWishlistCount: () => {
    return get().wishlist.length;
  },

  getWishlistTotal: () => {
    return get().wishlist.reduce((total, item) => total + (item.price || 0), 0);
  },
}));

