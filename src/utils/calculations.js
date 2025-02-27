// Calculate the number of cigarettes not smoked based on time passed and user habits
export const calculateCigarettesNotSmoked = (startDate, cigarettesPerDay, smokedToday) => {
    if (!startDate || !cigarettesPerDay) return 0;
    
    const now = new Date();
    const startDateObj = startDate instanceof Date ? startDate : startDate.toDate();
    const millisecondsDiff = now - startDateObj;
    const daysDiff = Math.floor(millisecondsDiff / (1000 * 60 * 60 * 24));
    
    // Calculate cigarettes per waking hour (16 hours per day)
    const cigarettesPerWakingHour = cigarettesPerDay / 16;
    
    // Full days * cigarettes per day
    let cigarettesNotSmoked = daysDiff * cigarettesPerDay;
    
    // Add today's hours (unless they've already smoked today)
    if (!smokedToday) {
      const hoursPassed = now.getHours() + (now.getMinutes() / 60);
      cigarettesNotSmoked += Math.min(hoursPassed, 16) * cigarettesPerWakingHour;
    }
    
    return Math.round(cigarettesNotSmoked);
  };
  
  // Calculate money saved based on cigarettes not smoked and price per pack
  export const calculateMoneySaved = (cigarettesNotSmoked, pricePerPack) => {
    if (!cigarettesNotSmoked || !pricePerPack) return 0;
    
    // Assuming 20 cigarettes per pack
    const pricePerCigarette = pricePerPack / 20;
    
    return (cigarettesNotSmoked * pricePerCigarette).toFixed(2);
  };
  
  // Calculate average severity of cravings for a given day
  export const calculateAverageSeverity = (cravings) => {
    if (!cravings || cravings.length === 0) return 0;
    
    const totalSeverity = cravings.reduce((sum, craving) => sum + craving.severity, 0);
    return (totalSeverity / cravings.length).toFixed(1);
  };