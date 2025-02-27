import { useState, useEffect } from "react";
import {
  differenceInDays,
  differenceInHours,
  differenceInSeconds,
} from "date-fns";

const TimeTracker = ({ quitDate }) => {
  const [showTimer, setShowTimer] = useState(true);
  const [timeInfo, setTimeInfo] = useState({
    days: 0,
    hours: 0,
    seconds: 0,
    formatted: "",
  });

  useEffect(() => {
    if (!quitDate) return;

    const quitDateObj =
      quitDate instanceof Date
        ? quitDate
        : quitDate.toDate
        ? quitDate.toDate()
        : new Date(quitDate);

    const updateTimer = () => {
      const now = new Date();
      const days = differenceInDays(now, quitDateObj);
      const totalHours = differenceInHours(now, quitDateObj);
      const hours = totalHours % 24;
      const totalSeconds = differenceInSeconds(now, quitDateObj);
      const seconds = totalSeconds % 60;

      let formatted = "";
      if (totalHours < 24) {
        // Less than 24 hours - show hours, minutes, seconds
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        formatted = `${hours} hours ${minutes} min ${seconds} sec`;
      } else {
        // More than 24 hours - show days and hours in short format
        formatted = `${days} ${days === 1 ? "day" : "days"} ${hours}h`;
      }

      setTimeInfo({
        days,
        hours,
        seconds,
        formatted,
      });
    };

    // Update initially
    updateTimer();

    // Set up an interval to update the timer every second
    const interval = setInterval(updateTimer, 1000);

    // Clean up interval
    return () => clearInterval(interval);
  }, [quitDate]);

  const toggleTimer = () => {
    setShowTimer(!showTimer);
  };

  if (!quitDate) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Smoke-Free Time
        </h2>
        <p className="text-gray-600">
          Please set a quit date to track your time.
        </p>
      </div>
    );
  }

  const formatQuitDate = () => {
    if (!quitDate) return "";

    const quitDateObj =
      quitDate instanceof Date
        ? quitDate
        : quitDate.toDate
        ? quitDate.toDate()
        : new Date(quitDate);

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return quitDateObj.toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Smoke-Free Time</h2>
        <button
          onClick={toggleTimer}
          className="text-blue-500 text-sm hover:text-blue-700 focus:outline-none"
        >
          {showTimer ? "Hide" : "Show"}
        </button>
      </div>

      {showTimer ? (
        <div className="text-center">
          <p className="text-4xl font-bold text-blue-600 mb-4">
            {timeInfo.formatted}
          </p>
          <p className="text-gray-500">Since: {formatQuitDate()}</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl text-gray-500">Timer hidden</p>
          <p className="text-gray-500 mt-2">Stay strong on your journey!</p>
        </div>
      )}
    </div>
  );
};

export default TimeTracker;
