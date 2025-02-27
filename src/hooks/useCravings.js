import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from './useAuth';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';

export const useCravings = () => {
  const { currentUser, userData } = useAuth();
  const [cravings, setCravings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [smokedToday, setSmokedToday] = useState(false);
  const [stats, setStats] = useState({
    cigarettesNotSmoked: 0,
    cravingsResisted: 0,
    moneySaved: 0
  });

  // Calculate cigarettes per waking hour
  const cigarettesPerHour = userData ? userData.cigarettesPerDay / 24 : 0;
  
  // Price per cigarette
  const pricePerCigarette = userData ? 
    (userData.pricePerPack / 20) : 0; // Assuming 20 cigarettes per pack

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchCravings = async () => {
      try {
        // Get user's start date
        if (!userData || !userData.created) {
          setLoading(false);
          return;
        }

        const startDate = userData.created;
        
        // Get all cravings for this user
        const cravingsQuery = query(
          collection(db, 'cravings'),
          where('userId', '==', currentUser.uid),
          orderBy('timestamp', 'desc')
        );

        const querySnapshot = await getDocs(cravingsQuery);
        const fetchedCravings = [];
        querySnapshot.forEach((doc) => {
          fetchedCravings.push({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
          });
        });

        setCravings(fetchedCravings);
        
        // Check if user smoked today
        const today = new Date();
        const todayStart = startOfDay(today);
        const todayEnd = endOfDay(today);
        
        const smokedTodayEntry = fetchedCravings.find(
          craving => 
            craving.timestamp >= todayStart && 
            craving.timestamp <= todayEnd && 
            craving.smoked
        );
        
        setSmokedToday(!!smokedTodayEntry);
        
        // Calculate stats
        calculateStats(fetchedCravings, startDate);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cravings:", error);
        setLoading(false);
      }
    };

    fetchCravings();
  }, [currentUser, userData]);

  // Then update the calculateStats function:
const calculateStats = (cravingsList, startDate) => {
  if (!userData) return;
  
  // Use the quit date from user data if available, otherwise use created date
  const quitDateObj = userData.quitDate ? 
    (userData.quitDate instanceof Date ? userData.quitDate : userData.quitDate.toDate()) : 
    (startDate instanceof Date ? startDate : startDate.toDate());
  
  // Calculate time since quitting
  const now = new Date();
  const millisecondsDiff = now - quitDateObj;
  const daysDiff = millisecondsDiff / (1000 * 60 * 60 * 24); // Keep as float for more precision
  
  // Calculate cigarettes not smoked (if they haven't smoked today)
  let cigarettesNotSmoked = 0;
  
  if (!smokedToday) {
    cigarettesNotSmoked = daysDiff * userData.cigarettesPerDay;
  } else {
    // If they smoked today, count until the start of the day
    const todayStart = startOfDay(now);
    const daysUntilToday = (todayStart - quitDateObj) / (1000 * 60 * 60 * 24);
    cigarettesNotSmoked = daysUntilToday * userData.cigarettesPerDay;
  }
  
  // Count cravings resisted (all cravings where smoked = false)
  const cravingsResisted = cravingsList.filter(craving => craving.smoked === false).length;
  
  // Calculate money saved
  const moneySaved = cigarettesNotSmoked * pricePerCigarette;
  
  setStats({
    cigarettesNotSmoked: Math.round(cigarettesNotSmoked),
    cravingsResisted,
    moneySaved: moneySaved.toFixed(2)
  });
};

  const logCraving = async (severity, smoked) => {
    if (!currentUser) return;
    
    try {
      const cravingData = {
        severity,
        smoked,
        userId: currentUser.uid,
        timestamp: serverTimestamp(),
        date: format(new Date(), 'yyyy-MM-dd')
      };
      
      // Add a unique temporary ID using the current timestamp
      const newCraving = {
        ...cravingData,
        timestamp: new Date(),
        id: `temp-id-${Date.now()}` // Use timestamp to make it unique
      };
      
      // Update the UI immediately with the temp craving
      setCravings(prevCravings => [newCraving, ...prevCravings]);
      
      // Then save to Firebase
      const docRef = await addDoc(collection(db, 'cravings'), cravingData);
      
      // Update the temporary craving with the real ID
      setCravings(prevCravings => 
        prevCravings.map(craving => 
          craving.id === newCraving.id ? {...craving, id: docRef.id} : craving
        )
      );
      
      if (smoked) {
        setSmokedToday(true);
      }
      
      // Update stats
      calculateStats([...cravings, newCraving], userData.created);
      
      return true;
    } catch (error) {
      console.error("Error logging craving:", error);
      return false;
    }
  };

  const getCravingsByDate = () => {
    const cravingsByDate = {};
    
    cravings.forEach(craving => {
      const dateStr = format(craving.timestamp, 'yyyy-MM-dd');
      
      if (!cravingsByDate[dateStr]) {
        cravingsByDate[dateStr] = {
          date: dateStr,
          count: 0,
          totalSeverity: 0,
          averageSeverity: 0,
          cravings: []
        };
      }
      
      cravingsByDate[dateStr].count += 1;
      cravingsByDate[dateStr].totalSeverity += craving.severity;
      cravingsByDate[dateStr].cravings.push(craving);
      cravingsByDate[dateStr].averageSeverity = 
        cravingsByDate[dateStr].totalSeverity / cravingsByDate[dateStr].count;
    });
    
    // Convert to array and sort by date
    return Object.values(cravingsByDate)
      .sort((a, b) => parseISO(a.date) - parseISO(b.date));
  };

  return {
    cravings,
    logCraving,
    loading,
    smokedToday,
    stats,
    getCravingsByDate
  };
};