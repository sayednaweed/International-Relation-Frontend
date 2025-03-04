import APICombobox, {
  ComboboxItem,
} from "@/components/custom-ui/combobox/APICombobox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Option {
  id: number;
  label: string;
}

type DropdownProps = {
  values: Option[];
  enableSelectAll?: boolean;
  dropdownName?: string;
  type?: "radio" | "checkbox";
  onChange?: (selected: Option | null | Option[]) => void;
};

export default function Dropdown({
  values,
  enableSelectAll = false,
  dropdownName = "Select Option",
  type = "radio",
  onChange,
}: DropdownProps) {
  const [selected, setSelected] = useState<Option | Option[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelection = (option: Option) => {
    if (type === "radio") {
      // Handle radio selection (single selection)
      const newSelection =
        selected && (selected as Option).id === option.id ? null : option;
      setSelected(newSelection);
      onChange?.(newSelection);
    } else if (type === "checkbox") {
      // Handle checkbox selection (multiple selection)
      const newSelection = selected instanceof Array ? [...selected] : [];
      if (newSelection.some((item) => item.id === option.id)) {
        // Deselect the item
        const updatedSelection = newSelection.filter(
          (item) => item.id !== option.id
        );
        setSelected(updatedSelection);
        onChange?.(updatedSelection);
      } else {
        // Select the item
        newSelection.push(option);
        setSelected(newSelection);
        onChange?.(newSelection);
      }
    }
    setIsOpen(false);
  };

  const isSelected = (option: Option) => {
    if (selected === null) return false;
    if (Array.isArray(selected)) {
      return selected.some((item) => item.id === option.id);
    }
    return (selected as Option).id === option.id;
  };

  return (
    <>
      <div className="flex justify-center"></div>
      <APICombobox
        onSelect={function (items: ComboboxItem[] | ComboboxItem): void {
          throw new Error("Function not implemented.");
        }}
        placeHolder={""}
        mode={"multiple"}
        errorText={""}
        placeholderText={""}
      />
      {/* <div className="relative w-32 mt-2 z-[1000]">
        <button
          className="w-full px-4 py-2 bg-tertiary text-white rounded-md flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>
            {selected
              ? Array.isArray(selected)
                ? `${selected.length} selected`
                : (selected as Option).label
              : dropdownName}
          </span>
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
                  onChange?.(null);
                }}
              >
                Select All
              </div>
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
                  checked={isSelected(option)}
                  readOnly
                  className="mr-2"
                />
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div> */}
    </>
  );
}
