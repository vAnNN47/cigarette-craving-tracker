import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UserInfoForm = () => {
  const [username, setUsername] = useState("");
  const [pricePerPack, setPricePerPack] = useState("");
  const [cigarettesPerDay, setCigarettesPerDay] = useState("");
  const [quitDate, setQuitDate] = useState(new Date());
  const [currency, setCurrency] = useState("USD");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setupUserData } = useAuth();
  const navigate = useNavigate();

  // Custom time input component for more intuitive time selection
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !pricePerPack || !cigarettesPerDay) {
      setError("Please fill in all fields");
      return;
    }

    if (isNaN(pricePerPack) || isNaN(cigarettesPerDay)) {
      setError("Price and cigarettes per day must be numbers");
      return;
    }

    if (Number(cigarettesPerDay) <= 0) {
      setError("Cigarettes per day must be a positive number");
      return;
    }

    if (Number(pricePerPack) <= 0) {
      setError("Price per pack must be a positive number");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await setupUserData({
        username,
        pricePerPack: Number(pricePerPack),
        cigarettesPerDay: Number(cigarettesPerDay),
        quitDate,
        currency,
        created: new Date(),
      });

      // Explicitly navigate to dashboard after successful setup
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to save user data: " + (err.message || ""));
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-2 dark:text-white">
        One Last Step
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
        We need a few details to help track your progress.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">$ (USD)</option>
              <option value="ILS">₪ (ILS)</option>
            </select>
          </div>
        </div>

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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter cigarettes per day"
            value={cigarettesPerDay}
            onChange={(e) => setCigarettesPerDay(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Quit Date
          </label>
          <DatePicker
            selected={quitDate}
            onChange={(date) => setQuitDate(date)}
            dateFormat="MMMM d, yyyy"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />

          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 mt-4">
            Quit Time
          </label>
          <CustomTimeInput
            date={quitDate}
            onChange={(date) => setQuitDate(date)}
          />

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Your progress will be tracked from this date and time.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          disabled={loading}
        >
          {loading ? "Saving..." : "Continue to Dashboard"}
        </button>
      </form>
    </div>
  );
};

export default UserInfoForm;
