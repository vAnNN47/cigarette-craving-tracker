import { useState } from "react";

const ResetConfirmationModal = ({ onClose, onConfirm }) => {
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (confirmation !== "RESET") {
      return;
    }

    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full transition-colors duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
              Reset All Data
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

          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              This action will{" "}
              <span className="font-bold">permanently delete</span> all your
              cravings data, progress, and settings. You'll need to set up your
              profile again.
            </p>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              This cannot be undone. Are you absolutely sure?
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Type{" "}
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">
                  RESET
                </span>{" "}
                to confirm
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="RESET"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={confirmation !== "RESET" || loading}
              className={`px-4 py-2 bg-red-500 text-white rounded-md ${
                confirmation === "RESET" && !loading
                  ? "hover:bg-red-600"
                  : "opacity-50 cursor-not-allowed"
              } focus:outline-none transition-colors`}
            >
              {loading ? "Resetting..." : "Yes, Reset Everything"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmationModal;
