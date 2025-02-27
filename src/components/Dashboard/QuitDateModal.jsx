import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../hooks/useAuth";

const QuitDateModal = ({ onClose, currentQuitDate }) => {
  const [quitDate, setQuitDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { userData, setupUserData } = useAuth();

  // Handle the date conversion in useEffect to ensure proper initialization
  useEffect(() => {
    if (currentQuitDate) {
      try {
        const dateValue =
          currentQuitDate instanceof Date
            ? currentQuitDate
            : currentQuitDate.toDate
            ? currentQuitDate.toDate()
            : new Date(currentQuitDate);

        if (!isNaN(dateValue.getTime())) {
          setQuitDate(dateValue);
        }
      } catch (err) {
        console.error("Error parsing quit date:", err);
        setQuitDate(new Date());
      }
    }
  }, [currentQuitDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await setupUserData({
        ...userData,
        quitDate,
      });

      onClose();
    } catch (err) {
      setError("Failed to update quit date: " + (err.message || ""));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Custom time input component for more flexibility
  const CustomTimeInput = ({ date, onChange }) => {
    const hours = date ? date.getHours() : 0;
    const minutes = date ? date.getMinutes() : 0;

    const handleHourChange = (e) => {
      const newHour = parseInt(e.target.value, 10);
      const newDate = new Date(date);
      newDate.setHours(newHour);
      onChange(newDate);
    };

    const handleMinuteChange = (e) => {
      const newMinute = parseInt(e.target.value, 10);
      const newDate = new Date(date);
      newDate.setMinutes(newMinute);
      onChange(newDate);
    };

    return (
      <div className="flex items-center space-x-2 mt-2">
        <select
          value={hours}
          onChange={handleHourChange}
          className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>
              {i.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
        <span className="dark:text-white">:</span>
        <select
          value={minutes}
          onChange={handleMinuteChange}
          className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {Array.from({ length: 60 }, (_, i) => (
            <option key={i} value={i}>
              {i.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full transition-colors duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Update Quit Date
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Quit Date
              </label>
              <DatePicker
                selected={quitDate}
                onChange={(date) => setQuitDate(date)}
                dateFormat="MMMM d, yyyy"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                wrapperClassName="dark:bg-gray-700"
              />

              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 mt-4">
                Quit Time
              </label>
              <CustomTimeInput
                date={quitDate}
                onChange={(date) => setQuitDate(date)}
              />

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                This will reset your progress tracking to the selected date and
                time.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Quit Date"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuitDateModal;
