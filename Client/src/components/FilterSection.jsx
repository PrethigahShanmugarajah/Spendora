// Client / src / components / FilterSection.jsx
import { Download } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { SelectInput } from "./FormField/SelectInput";

const FilterSection = ({
  filter,
  setFilter,
  handleExport,
  exportLoading,
  options = [],
  variant = "purple",
  loaderColor = "#8B5CF6",
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto">
      <div className="w-full sm:w-auto min-w-55">
        <SelectInput
          options={options}
          value={filter}
          onChange={(value) => setFilter(value)}
          placeholder="Filter transactions"
          size="m"
          variant={variant}
          isClearable={false}
        />
      </div>

      <button
        onClick={handleExport}
        disabled={exportLoading}
        className="flex items-center justify-center gap-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg transition-all text-sm hover:shadow-md w-full sm:w-auto"
      >
        {exportLoading ? (
          <div className="flex items-center justify-center">
            <ClipLoader size={18} color={loaderColor} />
          </div>
        ) : (
          <>
            <Download size={16} className="md:size-4" /> Export
          </>
        )}
      </button>
    </div>
  );
};

export default FilterSection;
