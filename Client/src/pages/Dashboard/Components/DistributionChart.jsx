// Client / src / pages / Dashboard / Components / DistributionChart.jsx
import { PieChart as PieChartIcon } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CURRENCY } from "../../../utils/helpers";

const DistributionChart = ({
  title,
  chartData = [],
  timeFrameRange,
  colors = [],
  iconColor = "text-gray-500",
  tooltipLabel = "Amount",
}) => {
  return (
    <div className="hidden md:block bg-white lg:-mx-5.5 md:-mx-4 lg:p-1 xl:-mx-3 rounded-xl p-5 shadow-sm border border-gray-100 relative overflow-hidden mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
        <h3 className="text-xl lg:pt-3 xl:pl-3 font-bold text-gray-800 mb-5 flex items-center gap-3">
          <PieChartIcon className={`w-6 h-6 ${iconColor}`} />
          {title}
          <span className="text-sm text-gray-500 font-normal">
            {" "}
            ({timeFrameRange.label})
          </span>
        </h3>
      </div>

      <div className="h-90">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart className="lg:-px-5 lg:text-xs xl:text-xl">
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${((percent || 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {(chartData || []).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [
                `${CURRENCY} ${Math.round(value).toLocaleString()}`,
                tooltipLabel,
              ]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #E5E7EB",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                padding: "12px",
              }}
              itemStyle={{ fontWeight: 400 }}
            />

            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(v) => (
                <span className="text-sm font-medium text-gray-600">{v}</span>
              )}
              iconSize={10}
              iconType="circle"
              wrapperStyle={{ paddingTop: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DistributionChart;
