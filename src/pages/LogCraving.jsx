import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCravings } from "../hooks/useCravings";
import { useTheme } from "../hooks/useTheme";
import Navbar from "../components/UI/Navbar";

const LogCraving = () => {
  const [severity, setSeverity] = useState(5);
  const [smoked, setSmoked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { logCraving } = useCravings();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await logCraving(severity, smoked);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to log craving: " + (err.message || ""));
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      <Navbar />

      <div className="flex-grow p-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Log a Craving
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-4">
                  Craving Severity (1-10)
                </label>
                <div className="flex items-center mb-4">
                  <span className="text-gray-500 dark:text-gray-400 mr-3 text-lg">
                    1
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={severity}
                    onChange={(e) => setSeverity(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer touch-action-manipulation"
                    style={{
                      WebkitAppearance: "none",
                      appearance: "none",
                    }}
                  />
                  <span className="text-gray-500 dark:text-gray-400 ml-3 text-lg">
                    10
                  </span>
                </div>
                <div className="text-center font-bold text-2xl dark:text-white mb-2">
                  {severity}
                </div>
                <div className="text-center text-gray-600 dark:text-gray-400">
                  {severity <= 3
                    ? "Mild craving"
                    : severity <= 7
                    ? "Moderate craving"
                    : "Severe craving"}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-4">
                  Did you smoke?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSmoked(false)}
                    className={`py-4 rounded-md text-center font-medium text-lg transition-colors ${
                      !smoked
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    No, I resisted
                  </button>
                  <button
                    type="button"
                    onClick={() => setSmoked(true)}
                    className={`py-4 rounded-md text-center font-medium text-lg transition-colors ${
                      smoked
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Yes, I smoked
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md font-medium text-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 px-6 bg-blue-500 text-white rounded-md font-medium text-lg"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogCraving;
