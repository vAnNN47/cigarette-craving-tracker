import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const QuitReason = () => {
  const { userData, setupUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [reason, setReason] = useState(userData?.quitReason || "");
  const [loading, setLoading] = useState(false);

  const handleSaveReason = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await setupUserData({
        ...userData,
        quitReason: reason,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving quit reason:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Your Quit Motivation
          </h2>
        </div>

        <div>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are you quitting smoking?"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white min-h-[100px]"
          />

          <div className="flex justify-end mt-4 space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveReason}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Your Quit Motivation
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500 dark:text-blue-400 text-sm hover:text-blue-700 dark:hover:text-blue-300"
        >
          {userData?.quitReason ? "Edit" : "Add"}
        </button>
      </div>

      {userData?.quitReason ? (
        <p className="text-gray-700 dark:text-gray-300 italic border-l-4 border-blue-500 pl-4 py-2">
          "{userData.quitReason}"
        </p>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          Add your motivation for quitting to help stay on track.
        </p>
      )}
    </div>
  );
};

export default QuitReason;
