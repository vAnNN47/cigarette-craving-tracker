const SavedMoney = ({ savedAmount, pricePerPack, currencySymbol = "$" }) => {
  // Calculate some milestones based on saved money
  const milestones = [
    { name: "Coffee", value: 5, icon: "☕" },
    { name: "Movie Ticket", value: 15, icon: "🎬" },
    { name: "Nice Dinner", value: 50, icon: "🍽️" },
    { name: "New Shoes", value: 100, icon: "👟" },
    { name: "Weekend Trip", value: 300, icon: "✈️" },
    { name: "New Smartphone", value: 700, icon: "📱" },
    { name: "Vacation", value: 1500, icon: "🏖️" },
  ];

  // Find the highest milestone achieved and the next milestone
  const savedAmountNum = parseFloat(savedAmount);
  const achievedMilestones = milestones.filter(
    (m) => savedAmountNum >= m.value
  );
  const nextMilestone = milestones.find((m) => savedAmountNum < m.value);

  const highestAchieved =
    achievedMilestones.length > 0
      ? achievedMilestones[achievedMilestones.length - 1]
      : null;

  const packsNotBought = Math.floor(savedAmountNum / pricePerPack);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 col-span-2 transition-colors duration-200">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Money Saved
      </h2>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-1">Total Saved</p>
          <p className="text-4xl font-bold text-green-500 dark:text-green-400">
            {currencySymbol}
            {savedAmount}
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <p className="text-gray-600 dark:text-gray-300 mb-1">
            Packs Not Bought
          </p>
          <p className="text-2xl font-bold text-blue-500 dark:text-blue-400">
            {packsNotBought}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Milestone Progress
        </p>
        {highestAchieved && (
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">{highestAchieved.icon}</span>
            <p className="text-gray-700 dark:text-gray-300">
              You've saved enough for {highestAchieved.name} ({currencySymbol}
              {highestAchieved.value})
            </p>
          </div>
        )}

        {nextMilestone && (
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-1">
              Next milestone: {nextMilestone.icon} {nextMilestone.name} (
              {currencySymbol}
              {nextMilestone.value})
            </p>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 dark:bg-green-600"
                style={{
                  width: `${Math.min(
                    100,
                    (savedAmountNum / nextMilestone.value) * 100
                  )}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>
                {currencySymbol}
                {savedAmountNum.toFixed(2)}
              </span>
              <span>
                {currencySymbol}
                {nextMilestone.value}
              </span>
            </div>
          </div>
        )}
      </div>

      <div>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          What you could buy instead:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {milestones.slice(0, 3).map((milestone) => (
            <div
              key={milestone.name}
              className={`p-2 rounded-md text-center ${
                savedAmountNum >= milestone.value
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              <div className="text-2xl mb-1">{milestone.icon}</div>
              <p className="text-xs">{milestone.name}</p>
              <p className="text-xs font-bold">
                {currencySymbol}
                {milestone.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedMoney;
