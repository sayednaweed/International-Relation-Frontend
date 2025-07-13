import CustomInput from "@/components/custom-ui/input/CustomInput";
import { Schedule } from "@/views/pages/auth/features/schedules/add-or-edit-schedule";
import { Dispatch } from "react";
import { useTranslation } from "react-i18next";

export interface CustomProjectSelectProps {
  schedule: Schedule;
  setSchedule: Dispatch<any>;
  error: Map<string, string>;
}

export function NormalProjectSelect(props: CustomProjectSelectProps) {
  const { error, schedule, setSchedule } = props;
  const { t } = useTranslation();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (schedule.special_projects) {
      const sliced = schedule.special_projects.slice(1, value + 1);
      setSchedule((prev: any) => ({ ...prev, special_projects: sliced }));
    } else {
      setSchedule((prev: any) => ({ ...prev, [name]: value }));
    }
  };
  return (
    <div className="flex flex-col gap-x-4 gap-y-6 w-full sm:w-1/2 xl:w-1/3 2xl:h-1/4">
      <CustomInput
        size_="sm"
        dir="ltr"
        required={true}
        requiredHint={`* ${t("required")}`}
        className="rtl:text-end"
        placeholder={t("presentation_count")}
        defaultValue={schedule["presentation_count"]}
        type="text"
        name="presentation_count"
        errorMessage={error.get("presentation_count")}
        onChange={handleChange}
      />
    </div>
  );
}
