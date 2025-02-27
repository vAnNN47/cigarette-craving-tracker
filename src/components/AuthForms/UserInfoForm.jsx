import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UserInfoForm = () => {
  const [username, setUsername] = useState("");
  const [pricePerPack, setPricePerPack] = useState("");
  const [cigarettesPerDay, setCigarettesPerDay] = useState("");
  const [quitDate, setQuitDate] = useState(new Date());
  const [currency, setCurrency] = useState("USD"); // Default to USD
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setupUserData } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // [same validation logic as before]

    try {
      setError("");
      setLoading(true);

      await setupUserData({
        username,
        pricePerPack: Number(pricePerPack),
        cigarettesPerDay: Number(cigarettesPerDay),
        quitDate,
        currency, // Add currency to user data
      });
    } catch (err) {
      setError("Failed to save user data: " + (err.message || ""));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      {/* [same header content as before] */}

      <form onSubmit={handleSubmit}>
        {/* [username field stays the same] */}

        <div className="mb-4 flex space-x-4">
          <div className="w-2/3">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="pricePerPack"
            >
              Price per Pack
            </label>
            <input
              id="pricePerPack"
              type="number"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter price per pack"
              value={pricePerPack}
              onChange={(e) => setPricePerPack(e.target.value)}
              required
            />
          </div>
          <div className="w-1/3">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="currency"
            >
              Currency
            </label>
            <select
              id="currency"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
            >
              <option value="USD">$ (USD)</option>
              <option value="ILS">₪ (ILS)</option>
            </select>
          </div>
        </div>

        {/* [cigarettes per day field stays the same] */}

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Quit Date & Time
          </label>
          <DatePicker
            selected={quitDate}
            onChange={(date) => setQuitDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
