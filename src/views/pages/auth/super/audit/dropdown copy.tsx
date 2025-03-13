import CustomMultiDatePicker from "@/components/custom-ui/DatePicker/CustomMultiDatePicker";
import CustomSelect from "@/components/custom-ui/select/CustomSelect";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";

import axiosClient from "@/lib/axois-client";

type UserType = "user" | "ngo" | "director" | "donor";

type AuditDataProps = {
  usertype: UserType | null;
  users: string;
  event: string;
  table: string;
};

const userTypeOptions = [
  { label: "User", value: "user" },
  { label: "NGO", value: "ngo" },
  { label: "Director", value: "director" },
  { label: "Donor", value: "donor" },
];

export default function AuditDropdown() {
  const { t } = useTranslation();
  const [auditData, setAuditData] = useState<AuditDataProps>({
    usertype: null,
    users: "",
    event: "",
    table: "",
  });

  const [users, setUsers] = useState<{ label: string; value: string }[]>([]);
  const [events, setEvents] = useState<{ label: string; value: string }[]>([]);
  const [tables, setTables] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState({
    users: false,
    events: false,
    tables: false,
  });

  const fetchUsers = async (usertype: UserType) => {
    setLoading((prev) => ({ ...prev, users: true }));
    try {
      const response = await axiosClient.get(`/api/users?usertype=${usertype}`);
      setUsers(
        response.data.map((user: any) => ({ label: user.name, value: user.id }))
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const fetchEvents = async (userId: string) => {
    setLoading((prev) => ({ ...prev, events: true }));
    try {
      const response = await axiosClient.get(`/api/events?userId=${userId}`);
      setEvents(
        response.data.map((event: any) => ({
          label: event.name,
          value: event.id,
        }))
      );
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading((prev) => ({ ...prev, events: false }));
    }
  };

  const fetchTables = async (eventId: string) => {
    setLoading((prev) => ({ ...prev, tables: true }));
    try {
      const response = await axiosClient.get(`/api/tables?eventId=${eventId}`);
      setTables(
        response.data.map((table: any) => ({
          label: table.name,
          value: table.id,
        }))
      );
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setLoading((prev) => ({ ...prev, tables: false }));
    }
  };

  return (
    <div className="flex justify-center gap-4 items-baseline">
      <CustomSelect
        className="w-[180px]"
        placeholder={t("select_userType")}
        paginationKey=""
        emptyPlaceholder=""
        rangePlaceholder=""
        options={userTypeOptions}
        onChange={(value: string) => {
          setAuditData((prev) => ({
            ...prev,
            usertype: value as UserType,
            users: "",
            event: "",
            table: "",
          }));
          setUsers([]);
          setEvents([]);
          setTables([]);
          fetchUsers(value as UserType);
        }}
        updateCache={async () => {}}
        getCache={async () => []}
      />

      <CustomSelect
        className="w-[180px]"
        placeholder={t("select_user")}
        paginationKey=""
        emptyPlaceholder=""
        rangePlaceholder=""
        options={loading.users ? [{ label: "Loading...", value: "" }] : users}
        onChange={(value: string) => {
          setAuditData((prev) => ({
            ...prev,
            users: value,
            event: "",
            table: "",
          }));
          setEvents([]);
          setTables([]);
          fetchEvents(value);
        }}
        updateCache={async () => {}}
        getCache={async () => []}
      />

      <CustomSelect
        className="w-[180px]"
        placeholder={t("select_event")}
        paginationKey=""
        emptyPlaceholder=""
        rangePlaceholder=""
        options={loading.events ? [{ label: "Loading...", value: "" }] : events}
        onChange={(value: string) => {
          setAuditData((prev) => ({ ...prev, event: value, table: "" }));
          setTables([]);
          fetchTables(value);
        }}
        updateCache={async () => {}}
        getCache={async () => []}
      />

      <CustomSelect
        className="w-[180px]"
        placeholder={t("select_table")}
        paginationKey=""
        emptyPlaceholder=""
        rangePlaceholder=""
        options={loading.tables ? [{ label: "Loading...", value: "" }] : tables}
        onChange={(value: string) => {
          setAuditData((prev) => ({ ...prev, table: value }));
        }}
        updateCache={async () => {}}
        getCache={async () => []}
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
