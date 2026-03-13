// Client / src / pages / Income / Components / IncomeChart.jsx
import { BarChart2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { INCOME_COLORS } from "../../../constants/theme";

const IncomeChart = ({ chartData, timeFrame, timeFrameRange }) => {
  return (
    <div className="hidden md:block -mx-7 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-5 flex items-center gap-2 md:gap-3">
          <BarChart2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
          {timeFrame === "daily"
            ? "Hourly"
            : timeFrame === "yearly"
              ? "Monthly"
              : "Daily"}{" "}
          Income Trends
          <span className="text-sm text-gray-500 font-normal">
            {" "}
            ({timeFrameRange.label})
          </span>
        </h3>
      </div>

      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          >
            <defs>
              <linearGradient
                id="incomeBarGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#00C49F" />
                <stop offset="100%" stopColor="#00B894" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F3F4F6"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              width={50}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value) => [
                `$${Math.round(value).toLocaleString()}`,
                "Income",
              ]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #E5E7EB",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                padding: "12px",
                backdropFilter: "blur(4px)",
              }}
            />
            <Bar
              dataKey="income"
              name="Income"
              radius={[6, 6, 0, 0]}
              barSize={20}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={INCOME_COLORS[index % INCOME_COLORS.length]}
                />
              ))}
            </Bar>

            {chartData.map(
              (point, index) =>
                point.isCurrent && (
                  <ReferenceLine
                    key={index}
                    x={point.label}
                    stroke="#00C49F"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                  />
                ),
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeChart;
