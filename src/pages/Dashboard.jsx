import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCravings } from "../hooks/useCravings";
import { formatDate } from "../utils/dateUtils";
import CravingModal from "../components/Dashboard/CravingModal";
import QuitDateModal from "../components/Dashboard/QuitDateModal";
import CravingStats from "../components/Dashboard/CravingStats";
import TimeTracker from "../components/Dashboard/TimeTracker";
import QuitReason from "../components/Dashboard/QuitReason";
import CravingGraph from "../components/Dashboard/CravingGraph";
import SavedMoney from "../components/Dashboard/SavedMoney";
import Navbar from "../components/UI/Navbar";

const DashboardPage = () => {
  const [showCravingModal, setShowCravingModal] = useState(false);
  const [showQuitDateModal, setShowQuitDateModal] = useState(false);
  const [graphType, setGraphType] = useState("count"); // 'count' or 'severity'

  const { currentUser, userData } = useAuth();
  const { cravings, logCraving, loading, smokedToday, stats } = useCravings();

  const handleLogCraving = async (severity, smoked) => {
    await logCraving(severity, smoked);
    setShowCravingModal(false);
  };

  const getCurrencySymbol = () => {
    return userData?.currency === "ILS" ? "₪" : "$";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      <Navbar />

      {showCravingModal && (
        <CravingModal
          onClose={() => setShowCravingModal(false)}
          onLogCraving={handleLogCraving}
        />
      )}

      {showQuitDateModal && (
        <QuitDateModal
          onClose={() => setShowQuitDateModal(false)}
          currentQuitDate={userData?.quitDate}
        />
      )}

      <div className="flex-grow p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Welcome, {userData?.username || currentUser?.email}
              </h1>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCravingModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                >
                  Log a Craving
                </button>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap justify-between items-center">
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  Quit Date:{" "}
                  {formatDate(userData?.quitDate || userData?.created)}
                </p>
                {smokedToday && (
                  <p className="text-red-500 dark:text-red-400 font-medium mt-2">
                    You've logged that you smoked today. Stay strong, tomorrow
                    is a new day!
                  </p>
                )}
              </div>

              <button
                onClick={() => setShowQuitDateModal(true)}
                className="mt-2 sm:mt-0 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
              >
                Update Quit Date
              </button>
            </div>
          </div>

          {/* Time Tracker */}
          <div className="mb-6">
            <TimeTracker quitDate={userData?.quitDate || userData?.created} />
          </div>

          {/* Quit Reason */}
          <div className="mb-6">
            <QuitReason />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <CravingStats
              cigarettesNotSmoked={stats.cigarettesNotSmoked}
              cravingsResisted={stats.cravingsResisted}
              smokedToday={smokedToday}
            />

            <SavedMoney
              savedAmount={stats.moneySaved}
              pricePerPack={userData?.pricePerPack}
              currencySymbol={getCurrencySymbol()}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Craving Analysis
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setGraphType("count")}
                  className={`px-3 py-1 rounded-md ${
                    graphType === "count"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  } transition-colors`}
                >
                  Craving Count
                </button>
                <button
                  onClick={() => setGraphType("severity")}
                  className={`px-3 py-1 rounded-md ${
                    graphType === "severity"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  } transition-colors`}
                >
                  Severity
                </button>
              </div>
            </div>

            <CravingGraph cravings={cravings} graphType={graphType} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Recent Cravings
            </h2>

            {cravings.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">
                No cravings logged yet. Use the "Log a Craving" button to track
                your progress.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">
                        Severity
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">
                        Smoked?
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cravings.slice(0, 5).map((craving, index) => (
                      <tr
                        key={craving.id || `craving-${index}`}
                        className="border-t border-gray-200 dark:border-gray-700"
                      >
                        <td className="px-4 py-2 dark:text-gray-300">
                          {formatDate(craving.timestamp)}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center">
                            <span className="mr-2 dark:text-gray-300">
                              {craving.severity}
                            </span>
                            <div className="w-24 h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div
                                className="h-full"
                                style={{
                                  width: `${(craving.severity / 10) * 100}%`,
                                  backgroundColor:
                                    craving.severity <= 3
                                      ? "#10B981" // green
                                      : craving.severity <= 7
                                      ? "#F59E0B" // yellow
                                      : "#EF4444", // red
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          {craving.smoked ? (
                            <span className="text-red-500 dark:text-red-400">
                              Yes
                            </span>
                          ) : (
                            <span className="text-green-500 dark:text-green-400">
                              No
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
