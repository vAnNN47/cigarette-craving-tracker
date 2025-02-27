import { format, parseISO, isSameDay, differenceInDays } from 'date-fns';

// Format a date to display in the UI
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : date.toDate();
  return format(dateObj, 'MMM dd, yyyy');
};

// Format a date to display in charts
export const formatChartDate = (date) => {
  if (!date) return '';
  
  if (typeof date === 'string') {
    return format(parseISO(date), 'MMM dd');
  }
  
  const dateObj = date instanceof Date ? date : date.toDate();
  return format(dateObj, 'MMM dd');
};

// Check if two dates are the same day
export const isSameDayCheck = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  const dateObj1 = date1 instanceof Date ? date1 : date1.toDate();
  const dateObj2 = date2 instanceof Date ? date2 : date2.toDate();
  
  return isSameDay(dateObj1, dateObj2);
};

// Get number of days passed since start date
export const getDaysSinceStart = (startDate) => {
  if (!startDate) return 0;
  
  const dateObj = startDate instanceof Date ? startDate : startDate.toDate();
  return differenceInDays(new Date(), dateObj);
};

// Group data by date
export const groupByDate = (data) => {
  if (!data || data.length === 0) return [];
  
  const groupedData = {};
  
  data.forEach(item => {
    // Ensure we have a date string in 'yyyy-MM-dd' format
    let dateStr;
    if (item.date) {
      dateStr = item.date;
    } else if (item.timestamp) {
      const dateObj = item.timestamp instanceof Date ? item.timestamp : item.timestamp.toDate();
      dateStr = format(dateObj, 'yyyy-MM-dd');
    } else {
      return; // Skip items without a date
    }
    
    if (!groupedData[dateStr]) {
      groupedData[dateStr] = {
        date: dateStr,
        items: []
      };
    }
    
    groupedData[dateStr].items.push(item);
  });
  
  // Convert to array and sort by date
  return Object.values(groupedData)
    .sort((a, b) => parseISO(a.date) - parseISO(b.date));
};