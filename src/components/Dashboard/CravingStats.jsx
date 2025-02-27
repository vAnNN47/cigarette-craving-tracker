const CravingStats = ({
  cigarettesNotSmoked,
  cravingsResisted,
  smokedToday,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Your Progress
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-1">
            Cigarettes Not Smoked
          </p>
          <p className="text-3xl font-bold text-blue-500 dark:text-blue-400">
            {cigarettesNotSmoked}
          </p>
        </div>

        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-1">
            Cravings Resisted
          </p>
          <p className="text-3xl font-bold text-green-500 dark:text-green-400">
            {cravingsResisted}
          </p>
        </div>

        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-1">
            Today's Status
          </p>
          {smokedToday ? (
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
              <p className="text-red-500 dark:text-red-400 font-medium">
                Smoked Today
              </p>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <p className="text-green-500 dark:text-green-400 font-medium">
                Smoke-Free Today
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CravingStats;
