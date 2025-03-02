import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import Dropdown from "./dropdown";
import { Button } from "@/components/ui/button";
import { DateObject } from "react-multi-date-picker";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import CustomMultiDatePicker from "@/components/custom-ui/DatePicker/CustomMultiDatePicker";
import { AuditTable } from "./audit-table";

export default function SuperReportsPage() {
  const { t } = useTranslation();
  const [date, setDate] = useState<DateObject[]>([]);
  const { modelOnRequestHide } = useModelOnRequestHide();
  const UserType = [
    { id: 1, label: "User" },
    { id: 2, label: "Ngo" },
    { id: 3, label: "Director" },
    { id: 4, label: "Donor" },
  ];

  const allUsers = [
    { id: 1, label: "Ahmad", type: "User" },
    { id: 2, label: "Mahmood", type: "Ngo" },
    { id: 3, label: "Jalal", type: "Director" },
    { id: 4, label: "Sara", type: "Donor" },
    { id: 5, label: "Hassan", type: "User" },
  ];

  const Event = [
    { id: 1, label: "Updated" },
    { id: 2, label: "Deleted" },
    { id: 3, label: "Created" },
  ];

  const Table = [
    { id: 1, label: "User" },
    { id: 2, label: "Permission" },
    { id: 3, label: "Donor" },
    { id: 4, label: "News" },
    { id: 5, label: "Ngo" },
  ];

  const [filteredUsers, setFilteredUsers] = useState(allUsers);

  const handleUserTypeChange = (
    selected: { id: number; label: string } | null
  ) => {
    if (selected) {
      setFilteredUsers(allUsers.filter((user) => user.type === selected.label));
    } else {
      setFilteredUsers(allUsers);
    }
  };
  const handleDate = (selectedDates: DateObject[]) => {
    setDate(selectedDates);
    if (selectedDates.length == 2) modelOnRequestHide();
  };
  return (
    <div className="px-2 pt-2 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
      <Breadcrumb className="bg-card w-fit py-1 ltr:ps-3 ltr:pe-8 rtl:pe-3 rtl:ps-8 rounded-md border">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/dashboard">
              <AnimHomeIcon />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rtl:rotate-180" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-tertiary">
              {t("audit")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex bg-card w-full  h-14 align-baseline  justify-center gap-x-10">
        <Dropdown
          values={UserType}
          dropdownName="UserType"
          onChange={handleUserTypeChange}
        />

        <Dropdown
          values={filteredUsers}
          dropdownName="Users"
          type="checkbox"
          enableSelectAll={false}
        />

        <Dropdown values={Event} dropdownName="Event" />

        <Dropdown values={Table} dropdownName="Table" />
        <CustomMultiDatePicker
          value={date}
          dateOnComplete={handleDate}
          className="mt-3"
        />
        <Button className="bg-primary mt-3">Apply</Button>
      </div>
      <AuditTable />
    </div>
  );
}
