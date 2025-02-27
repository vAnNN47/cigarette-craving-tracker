import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useResetData } from "../hooks/useResetData"; // Import the new hook
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../components/UI/Navbar";
import ResetConfirmationModal from "../components/Settings/ResetConfirmationModal";

const Settings = () => {
  const { currentUser, userData, setupUserData, logout, hasUserSetupData } =
    useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const {
    resetAllData,
    loading: resetLoading,
    error: resetError,
  } = useResetData();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [pricePerPack, setPricePerPack] = useState("");
  const [cigarettesPerDay, setCigarettesPerDay] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [quitDate, setQuitDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);

  // Load existing user data
  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }

    if (userData) {
      setUsername(userData.username || "");
      setPricePerPack(userData.pricePerPack?.toString() || "");
      setCigarettesPerDay(userData.cigarettesPerDay?.toString() || "");
      setCurrency(userData.currency || "USD");

      // Handle the date conversion
      if (userData.quitDate) {
        try {
          const dateValue =
            userData.quitDate instanceof Date
              ? userData.quitDate
              : userData.quitDate.toDate
              ? userData.quitDate.toDate()
              : new Date(userData.quitDate);

          if (!isNaN(dateValue.getTime())) {
            setQuitDate(dateValue);
          }
        } catch (err) {
          console.error("Error parsing quit date:", err);
          setQuitDate(new Date());
        }
      }
    }
  }, [currentUser, userData, navigate]);

  useEffect(() => {
    if (resetError) {
      setError(resetError);
    }
  }, [resetError]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      setError("Failed to log out. Please try again.");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!username || !pricePerPack || !cigarettesPerDay) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isNaN(pricePerPack) || isNaN(cigarettesPerDay)) {
      setError("Price and cigarettes per day must be numbers.");
      return;
    }

    if (Number(pricePerPack) <= 0 || Number(cigarettesPerDay) <= 0) {
      setError("Price and cigarettes per day must be positive numbers.");
      return;
    }

    try {
      setLoading(true);

      await setupUserData({
        ...userData,
        username,
        pricePerPack: Number(pricePerPack),
        cigarettesPerDay: Number(cigarettesPerDay),
        currency,
        quitDate,
      });

      setSuccessMessage("Settings updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError("Failed to update settings: " + (err.message || ""));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    await resetAllData();
    setShowResetModal(false);
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Navbar />

      {showResetModal && (
        <ResetConfirmationModal
          onClose={() => setShowResetModal(false)}
          onConfirm={handleConfirmReset}
        />
      )}

      <div className="flex-grow p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 dark:text-white">Settings</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md dark:bg-green-900 dark:text-green-200">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Profile Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white">
                Profile Settings
              </h2>

              <div className="mb-4">
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                  value={currentUser?.email || ""}
                  disabled
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>

            {/* Smoking Details Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white">
                Smoking Details
              </h2>

              <div className="mb-4">
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="cigarettesPerDay"
                >
                  Cigarettes per Day
                </label>
                <input
                  id="cigarettesPerDay"
                  type="number"
                  min="1"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter cigarettes per day"
                  value={cigarettesPerDay}
                  onChange={(e) => setCigarettesPerDay(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    htmlFor="pricePerPack"
                  >
                    Price per Pack
                  </label>
                  <input
                    id="pricePerPack"
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter price per pack"
                    value={pricePerPack}
                    onChange={(e) => setPricePerPack(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    htmlFor="currency"
                  >
                    Currency
                  </label>
                  <select
                    id="currency"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    required
                  >
                    <option value="USD">$ (USD)</option>
                    <option value="ILS">₪ (ILS)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quit Journey Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white">
                Quit Journey
              </h2>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Quit Date
                </label>
                <DatePicker
                  selected={quitDate}
                  onChange={(date) => setQuitDate(date)}
                  dateFormat="MMMM d, yyyy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />

                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 mt-4">
                  Quit Time
                </label>
                <CustomTimeInput
                  date={quitDate}
                  onChange={(date) => setQuitDate(date)}
                />

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Changing your quit date will reset your progress tracking.
                </p>
              </div>
            </div>

            {/* App Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white">
                App Preferences
              </h2>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium dark:text-white">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Switch between light and dark themes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none"
                  aria-pressed={darkMode}
                >
                  <span className="sr-only">Toggle dark mode</span>
                  <span
                    className={`${
                      darkMode ? "bg-blue-600" : "bg-gray-200"
                    } block w-11 h-6 rounded-full transition`}
                  />
                  <span
                    className={`${
                      darkMode
                        ? "translate-x-6 bg-gray-800"
                        : "translate-x-1 bg-white"
                    } absolute left-0 inline-block w-4 h-4 transform rounded-full transition-transform`}
                  />
                </button>
              </div>
            </div>

            {/* Reset Data Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">
                Reset Data
              </h2>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This will permanently delete all your cravings data, progress
                statistics, and settings. You'll need to set up your profile
                again.
              </p>

              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                disabled={resetLoading}
              >
                {resetLoading ? "Processing..." : "Reset All Data"}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
              >
                Logout
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
