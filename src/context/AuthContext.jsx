import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase/firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
          setNetworkError(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Handle offline case
          if (error.message.includes("offline")) {
            setNetworkError(true);
          }
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email, password) => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    return signOut(auth);
  };

  const googleSignIn = async () => {
    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  const updateUserProfile = async (displayName) => {
    try {
      return await updateProfile(currentUser, { displayName });
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  const setupUserData = async (data) => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userData = {
        ...data,
        created: new Date(),
        userId: currentUser.uid,
        email: currentUser.email,
      };

      await setDoc(userDocRef, userData);
      setUserData(userData);

      if (data.username) {
        await updateUserProfile(data.username);
      }

      return true;
    } catch (error) {
      console.error("Error setting up user data:", error);
      if (error.message.includes("offline")) {
        setNetworkError(true);
      }
      throw error;
    }
  };

  const hasUserSetupData = () => {
    return userData && userData.cigarettesPerDay && userData.pricePerPack;
  };

  const value = {
    currentUser,
    userData,
    register,
    login,
    logout,
    googleSignIn,
    setupUserData,
    hasUserSetupData,
    loading,
    networkError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
