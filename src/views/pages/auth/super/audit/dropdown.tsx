import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomMultiDatePicker from "@/components/custom-ui/DatePicker/CustomMultiDatePicker";
import CustomSelect from "@/components/custom-ui/select/CustomSelect";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { Button } from "@/components/ui/button";

import { Users } from "lucide-react";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";

type Users = { label: string; value: string };
type Colums = { label: string; value: string };

type AuditDataProps = {
  users: Users;
  colums: Colums;
};

const userTypeOptions = [
  { label: "User", value: "user" },
  { label: "NGO", value: "ngo" },
  { label: "Director", value: "director" },
  { label: "Donor", value: "donor" },
];
const EventOptions = [
  { label: "Created", value: "created" },
  { label: "Updated", value: "updated" },
  { label: "Deleted", value: "deleted" },
];
const TableOptions = [
  { label: "Permission", value: "permission" },
  { label: "Ngo", value: "ngo" },
  { label: "User", value: "user" },
  { label: "Donor", value: "donor" },
  { label: "Audit", value: "audit" },
  { label: "User", value: "user" },
];

export default function AuditDropdown() {
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);
  const [auditData, setAuditData] = useState<AuditDataProps>({
    users: { label: "", value: "" },
    colums: { label: "", value: "" },
  });

  return (
    <div className="flex gap-4  items-baseline  ">
      <CustomSelect
        className="w-full"
        placeholder={t("select_userType")}
        paginationKey=""
        emptyPlaceholder=""
        rangePlaceholder=""
        options={userTypeOptions}
        onChange={(value: string) => {}}
        updateCache={async () => {}}
        getCache={async () => []}
      />
      <APICombobox
        className="w-full  py-2 mt-6"
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        onSelect={(selection: any) => {}}
        required={true}
        selectedItem={auditData["users"]?.label}
        placeHolder={t("select_user")}
        errorMessage={error.get("users")}
        apiUrl={"users"}
        mode="single"
      />

      <CustomSelect
        className="w-full "
        placeholder={t("select_event")}
        paginationKey=""
        emptyPlaceholder=""
        rangePlaceholder=""
        options={EventOptions}
        onChange={(value: string) => {
          setAuditData((prev) => ({ ...prev, event: value }));
        }}
        updateCache={async () => {}}
        getCache={async () => []}
      />

      <CustomSelect
        className="w-full"
        placeholder={t("select_table")}
        paginationKey=""
        emptyPlaceholder=""
        rangePlaceholder=""
        options={TableOptions}
        onChange={(value: string) => {}}
        updateCache={async () => {}}
        getCache={async () => []}
      />
      <APICombobox
        className="w-full py-2 mt-6"
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        onSelect={(selection: any) => {}}
        required={true}
        selectedItem={auditData["colums"]?.label}
        placeHolder={t("select_colum")}
        errorMessage={error.get("colum")}
        apiUrl={"users"}
        mode="single"
      />
      <CustomMultiDatePicker
        dateOnComplete={(selectedDates: DateObject[]) => {
          console.log("Selected Dates:", selectedDates);
        }}
        value={[]}
        className="mt-7"
      />

      <Button
        className="mt-6 bg-tertiary"
        onClick={() => console.log(auditData)}
      >
        Apply
      </Button>
    </div>
  );
}
