import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Option {
  id: number;
  label: string;
}

type DropdownProps = {
  values: Option[];
  enableSelectAll?: boolean;
  dropdownName?: string;
  type?: "radio" | "checkbox";
  onChange?: (selected: Option | null) => void;
};

export default function Dropdown({
  values,
  enableSelectAll = false,
  dropdownName = "Select Option",
  type = "radio",
  onChange,
}: DropdownProps) {
  const [selected, setSelected] = useState<Option | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelection = (option: Option) => {
    const newSelection = selected?.id === option.id ? null : option;
    setSelected(newSelection);
    setIsOpen(false);

    if (onChange) {
      onChange(newSelection);
    }
  };

  return (
    <div className="relative ">
      <button
        className="w-fit px-4 py-2 bg-card text-white rounded-md flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selected ? selected.label : dropdownName}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      {isOpen && (
        <div className="absolute w-full bg-white border rounded-md shadow-md mt-2">
          {enableSelectAll && (
            <div
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setSelected(null);
                setIsOpen(false);
                if (onChange) onChange(null);
              }}
            ></div>
          )}
          {values.map((option) => (
            <div
              key={option.id}
              className="p-2 cursor-pointer hover:bg-gray-200 flex items-center"
              onClick={() => handleSelection(option)}
            >
              <input
                type={type}
                name={dropdownName}
                checked={selected?.id === option.id}
                readOnly
                className="mr-2"
              />
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
