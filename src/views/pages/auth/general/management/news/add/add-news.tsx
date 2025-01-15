import { ChangeEvent } from "react";

import "quill/dist/quill.snow.css";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";

import { Pencil } from "lucide-react";
import IconButton from "@/components/custom-ui/button/IconButton";
import { t } from "i18next";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { DateObject } from "react-multi-date-picker";
import CustomInput from "@/components/custom-ui/input/CustomInput";

function AddNews() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const priority = [
    {
      value: "high",
      label: "High",
    },
    {
      value: "medium",
      label: "Medium",
    },
    {
      value: "low",
      label: "Low",
    },
  ];
  return (
    <>
      <form className="max-w-4xl mx-auto mt-10 ">
        <div className="w-72">
          <CustomInput size_="sm" lable="News Title:"></CustomInput>
        </div>
        <IconButton className="hover:bg-primary/20 transition-all text-primary mt-2 mb-2">
          <label
            className={`flex w-fit gap-x-1 items-center cursor-pointer justify-center`}
          >
            <Pencil className={`size-[13px] pointer-events-none`} />
            <h1 className={`rtl:text-lg-rtl ltr:text-md-ltr`}>{t("Choose")}</h1>
            <input
              type="file"
              className={`block w-0 h-0`}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {}}
            />
          </label>
        </IconButton>
        <div className="flex flex-row gap-6 mt-10 items-baseline">
          <CustomInput
            lable="News Type:"
            size_="lg"
            className="w-72 "
          ></CustomInput>
          <CustomDatePicker
            dateOnComplete={function (date: DateObject): void {
              throw new Error("Function not implemented.");
            }}
            value={undefined}
            placeholder={"News Date"}
          ></CustomDatePicker>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {value
                  ? priority.find((priority) => priority.value === value)?.label
                  : "Select Priority..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList>
                  <CommandEmpty>No Priority found.</CommandEmpty>
                  <CommandGroup>
                    {priority.map((priority) => (
                      <CommandItem
                        key={priority.value}
                        value={priority.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        {priority.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === priority.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div>
            <Checkbox />
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Duration Visibility
            </label>
          </div>
        </div>{" "}
        <div className="mt-10">
          <PrimaryButton>Submit</PrimaryButton>
        </div>
      </form>
    </>
  );
}

export default AddNews;
