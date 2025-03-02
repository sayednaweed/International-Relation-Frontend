import { useState } from "react";
import Dropdown from "./dropdown";
import CustomMultiDatePicker from "@/components/custom-ui/DatePicker/CustomMultiDatePicker";
import { Button } from "@/components/ui/button";

export default function Auth() {
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

  return (
    <div className="flex align-baseline gap-6">
      <Dropdown
        values={UserType}
        dropdownName="UserType"
        onChange={handleUserTypeChange}
      />

      <Dropdown
        values={filteredUsers}
        dropdownName="Users"
        type="checkbox"
        enableSelectAll={true}
      />

      <Dropdown values={Event} dropdownName="Event" />

      <Dropdown values={Table} dropdownName="Table" />
      <Button>Apply</Button>
    </div>
  );
}
