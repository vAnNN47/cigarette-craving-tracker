import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from './useAuth';

export const useResetData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser, setupUserData } = useAuth();
  const navigate = useNavigate();

  const resetAllData = async () => {
    if (!currentUser || !currentUser.uid) {
      setError('No user is logged in');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Delete all cravings
      const cravingsQuery = query(
        collection(db, 'cravings'),
        where('userId', '==', currentUser.uid)
      );

      const querySnapshot = await getDocs(cravingsQuery);
      
      // Delete each craving document
      const deletePromises = [];
      querySnapshot.forEach((document) => {
        deletePromises.push(deleteDoc(doc(db, 'cravings', document.id)));
      });
      
      await Promise.all(deletePromises);
      
      // Reset user data (keeping only authentication info)
      await setupUserData({
        userId: currentUser.uid,
        email: currentUser.email,
        // Add a created flag so we know this is a new setup
        reset: true,
        resetTime: new Date()
      });
      
      // Navigate to setup page - needs to be last since other components 
      // might depend on user data being correctly reset first
      navigate('/setup');
      return true;
    } catch (err) {
      console.error('Error resetting data:', err);
      setError('Failed to reset data: ' + (err.message || 'Unknown error'));
      setLoading(false);
      return false;
    }
  };

  return {
    resetAllData,
    loading,
    error
  };
};