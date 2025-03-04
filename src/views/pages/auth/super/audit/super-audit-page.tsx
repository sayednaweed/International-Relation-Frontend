import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Link } from "react-router";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import Dropdown from "./dropdown";
interface Option {
  id: number;
  label: string;
}

interface Audit {
  id: number;
  user_id: number;
  user: string;
  action: string;
  table: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export default function SuperReportsPage() {
  const { t } = useTranslation();
  const [userType, setUserType] = useState<Option | null>(null);
  const [users, setUsers] = useState<Option[]>([]);
  const [selectedUser, setSelectedUser] = useState<Option | null>(null);
  const [events, setEvents] = useState<Option[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Option | null>(null);
  const [tables, setTables] = useState<Option[]>([]);
  const [selectedTable, setSelectedTable] = useState<Option | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("/api/user-types").then((res) => setUsers(res.data));
    axios.get("/api/events").then((res) => setEvents(res.data));
    axios.get("/api/tables").then((res) => setTables(res.data));
  }, []);

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/audits", {
        params: {
          userType: userType?.id,
          userId: selectedUser?.id,
          eventId: selectedEvent?.id,
          table: selectedTable?.id,
          date,
        },
      });
      setAudits(response.data);
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDropdownChange =
    (setter: React.Dispatch<React.SetStateAction<Option | null>>) =>
    (selected: Option | Option[] | null) => {
      if (Array.isArray(selected)) {
        setter(selected[0] || null);
      } else {
        setter(selected);
      }
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

      <div className="px-2 pt-2 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Dropdown
              values={users}
              dropdownName="User Type"
              onChange={handleDropdownChange(setUserType)}
            />

            <Dropdown
              values={users}
              dropdownName="User"
              onChange={handleDropdownChange(setSelectedUser)}
            />

            <Dropdown
              values={events}
              dropdownName="Event"
              onChange={handleDropdownChange(setSelectedEvent)}
            />

            <Dropdown
              values={tables}
              dropdownName="Table"
              onChange={handleDropdownChange(setSelectedTable)}
            />

            <Button onClick={fetchAudits}>Apply</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("ID")}</TableHead>
                <TableHead>{t("User ID")}</TableHead>
                <TableHead>{t("User")}</TableHead>
                <TableHead>{t("Action")}</TableHead>
                <TableHead>{t("Table")}</TableHead>
                <TableHead>{t("IP Address")}</TableHead>
                <TableHead>{t("Browser")}</TableHead>
                <TableHead>{t("Date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8}>{t("Loading...")}</TableCell>
                </TableRow>
              ) : (
                audits.map((audit) => (
                  <TableRow key={audit.id}>
                    <TableCell>{audit.id}</TableCell>
                    <TableCell>{audit.user_id}</TableCell>
                    <TableCell>{audit.user}</TableCell>
                    <TableCell>{audit.action}</TableCell>
                    <TableCell>{audit.table}</TableCell>
                    <TableCell>{audit.ip_address}</TableCell>
                    <TableCell>{audit.user_agent}</TableCell>
                    <TableCell>{audit.created_at}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
