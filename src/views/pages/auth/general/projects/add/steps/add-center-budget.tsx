import { Eye, EyeOff, Mail, Phone, RotateCcwSquare } from "lucide-react";
import { useContext, useState } from "react";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useTranslation } from "react-i18next";
import PasswordInput from "@/components/custom-ui/input/PasswordInput";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { generatePassword } from "@/validation/utils";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { DateObject } from "react-multi-date-picker";

export default function AddCenterBudget() {
  const { userData, setUserData, error } = useContext(StepperContext);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-x-4 xl:gap-x-12 lg:items-baseline mt-4 gap-y-3 w-full lg:w-full">
      <CustomDatePicker
        placeholder={t("select_a_date")}
        lable={t("start_date")}
        requiredHint={`* ${t("required")}`}
        required={true}
        value={userData.start_date}
        dateOnComplete={(date: DateObject) => {
          setUserData((prev: any) => ({
            ...prev,
            start_date: date,
          }));
        }}
        className="py-3 w-full"
        errorMessage={error.get("start_date")}
      />
      <CustomDatePicker
        placeholder={t("select_a_date")}
        lable={t("end_date")}
        requiredHint={`* ${t("required")}`}
        required={true}
        value={userData.end_date}
        dateOnComplete={(date: DateObject) => {
          setUserData((prev: any) => ({
            ...prev,
            end_date: date,
          }));
        }}
        className="py-3 w-full"
        errorMessage={error.get("end_date")}
      />
    </div>
  );
}
