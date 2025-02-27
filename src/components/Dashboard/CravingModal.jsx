import { useState } from "react";

const CravingModal = ({ onClose, onLogCraving }) => {
  const [severity, setSeverity] = useState(5);
  const [smoked, setSmoked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogCraving(severity, smoked);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full transition-colors duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Log a Craving
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

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Craving Severity (1-10)
              </label>
              <div className="flex items-center mb-2">
                <span className="text-gray-500 dark:text-gray-400 mr-3">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-500 dark:text-gray-400 ml-3">
                  10
                </span>
              </div>
              <div className="text-center font-bold text-lg dark:text-white">
                {severity}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  {severity <= 3
                    ? "(Mild)"
                    : severity <= 7
                    ? "(Moderate)"
                    : "(Severe)"}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Did you smoke?
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setSmoked(false)}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    !smoked
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  No, I resisted
                </button>
                <button
                  type="button"
                  onClick={() => setSmoked(true)}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    smoked
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Yes, I smoked
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CravingModal;
