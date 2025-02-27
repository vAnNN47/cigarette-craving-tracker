import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatChartDate, groupByDate } from "../../utils/dateUtils";

const CravingGraph = ({ cravings, graphType }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!cravings || cravings.length === 0) {
      setChartData([]);
      return;
    }

    // Group cravings by date
    const cravingsByDate = {};

    cravings.forEach((craving) => {
      const date = craving.date || formatChartDate(craving.timestamp);

      if (!cravingsByDate[date]) {
        cravingsByDate[date] = {
          date,
          count: 0,
          totalSeverity: 0,
          cravings: [],
        };
      }

      cravingsByDate[date].count += 1;
      cravingsByDate[date].totalSeverity += craving.severity;
      cravingsByDate[date].cravings.push(craving);
    });

    // Convert to array and calculate averages
    const formattedData = Object.values(cravingsByDate).map((item) => ({
      date: item.date,
      count: item.count,
      averageSeverity: item.totalSeverity / item.count,
    }));

    // Sort by date
    const sortedData = formattedData.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    setChartData(sortedData);
  }, [cravings]);

  if (chartData.length < 2) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Not enough data to display the graph yet.</p>
        <p className="text-sm">
          Track your cravings for at least 2 days to see the graph.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => formatChartDate(date)}
          />
          <YAxis
            domain={graphType === "severity" ? [0, 10] : ["auto", "auto"]}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "averageSeverity") {
                return [value.toFixed(1), "Average Severity"];
              }
              return [value, "Number of Cravings"];
            }}
            labelFormatter={(label) => `Date: ${formatChartDate(label)}`}
          />
          {graphType === "count" ? (
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3B82F6"
              name="count"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          ) : (
            <Line
              type="monotone"
              dataKey="averageSeverity"
              stroke="#F59E0B"
              name="averageSeverity"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CravingGraph;
