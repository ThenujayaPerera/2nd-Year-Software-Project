import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";

// PRODUCTS SERVICE
export const firestoreProducts = {
  // Get all products from Firestore
  getAll: async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting products from Firestore:", error);
      throw error;
    }
  },

  // Add new product
  create: async (productData) => {
    try {
      const docRef = await addDoc(collection(db, "products"), {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...productData };
    } catch (error) {
      console.error("Error creating product in Firestore:", error);
      throw error;
    }
  },

  // Update existing product
  update: async (id, productData) => {
    try {
      const docRef = doc(db, "products", String(id));
      await updateDoc(docRef, {
        ...productData,
        updatedAt: serverTimestamp()
      });
      return { id, ...productData };
    } catch (error) {
      console.error("Error updating product in Firestore:", error);
      throw error;
    }
  },

  // Delete product
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, "products", String(id)));
    } catch (error) {
      console.error("Error deleting product from Firestore:", error);
      throw error;
    }
  }
};

// ORDERS SERVICE
export const firestoreOrders = {
  // Place new order
  create: async (orderData) => {
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...orderData };
    } catch (error) {
      console.error("Error placing order in Firestore:", error);
      throw error;
    }
  },

  // Get orders by customer email
  getByEmail: async (email) => {
    try {
      const q = query(collection(db, "orders"), where("userEmail", "==", email));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching user orders from Firestore:", error);
      throw error;
    }
  },

  // Get all orders for Admin
  getAll: async () => {
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching all orders from Firestore:", error);
      throw error;
    }
  }
};

// USERS SERVICE
export const firestoreUsers = {
  // Register or save user profile
  saveUser: async (uid, userData) => {
    try {
      await setDoc(doc(db, "users", uid), {
        ...userData,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
      throw error;
    }
  },

  // Get user by ID
  getUser: async (uid) => {
    try {
      const docSnap = await getDoc(doc(db, "users", uid));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user from Firestore:", error);
      throw error;
    }
  }
};
