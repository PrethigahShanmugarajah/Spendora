import { ClipLoader } from "react-spinners";
import TimeFrame from "./TimeFrame";
import { Plus } from "lucide-react";

const OverviewHeader = ({
  title,
  description,
  buttonText,
  setShowModal,
  loading,
  timeFrame,
  setTimeFrame,
  gradientFrom = "from-purple-600",
  gradientTo = "to-purple-700",
  hoverFrom = "hover:from-purple-700",
  hoverTo = "hover:to-purple-800",
  timeFrameColor = "purple",
}) => {
  return (
    <div className="bg-white rounded-lg md:rounded-xl p-4 -mx-7 lg:-mx-7 overflow-x-hidden md:p-6 mb-6 md:mb-8 shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
            {title}
          </h1>

          <p className="text-gray-600 mt-1 text-sm md:text-base">
            {description}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          disabled={loading}
          className={`flex items-center gap-2 bg-linear-to-r ${gradientFrom} ${gradientTo} ${hoverFrom} ${hoverTo} text-white px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl transition-all shadow-md hover:shadow-lg font-medium text-sm md:text-base`}
        >
          {loading ? (
            <ClipLoader size={18} color="#FFFFFF" />
          ) : (
            <>
              <Plus size={18} className="md:size-5" />
              <span>{buttonText}</span>
            </>
          )}
        </button>
      </div>

      <div className="flex px-10 -mx-14 justify-center lg:mx-0 md:mx-0 lg:justify-end md:justify-end mt-4">
        <TimeFrame
          timeFrame={timeFrame}
          setTimeFrame={setTimeFrame}
          options={["daily", "weekly", "monthly", "yearly"]}
          color={timeFrameColor}
        />
      </div>
    </div>
  );
};

export default OverviewHeader;
