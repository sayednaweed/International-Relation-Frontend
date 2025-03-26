import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import { Heading, Table } from "lucide-react";

interface UserData {
  id: number;
  type: string;
  event: string;
  table: string;
  table_id: number;
  url: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  updated_at: string;
}

export default function AuditDetailsDialog() {
  const { t } = useTranslation();
  const [oldData, setOldData] = useState<UserData | null>(null);
  const [newData, setNewData] = useState<UserData | null>(null);
  const { modelOnRequestHide } = useModelOnRequestHide();

  return (
    <Card className="w-fit self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
      <CardHeader className="relative text-start">
        <CardTitle className="text-2xl text-tertiary text-center border-b-2">
          {t("user_details")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-center py-1">
          <div className="relative flex flex-col  md:flex-row  justify-start md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
            <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
              <div className=" flex items-center bg-primary/10 px-8 py-1 rounded-full text-xs font-medium text-gray-800  w-28">
                Field
              </div>
              <h3 className="flex flex-row  font-semibold  gap-7 text-primary/90 md:text-3xl text-xl">
                <Table>
                  <Heading>ID</Heading>
                  <Heading>Type</Heading>
                  <Heading>Event</Heading>
                  <Heading>Table</Heading>
                  <Heading>Table_ID</Heading>
                  <Heading>URL</Heading>
                  <Heading>IP_Address</Heading>
                  <Heading>User_Agent</Heading>
                  <Heading>URL</Heading>
                </Table>
                <p></p>
                <p></p>
                <p>Event</p>
                <p>Table</p>
                <p>Table_ID</p>
                <p>URL</p>
                <p>IP_Address</p>
                <p>User_Agent</p>
                <p>Created_At</p>
                <p>Updated_At</p>
              </h3>
              <div className="flex flex-row md:text-lg gap-6 text-gray-500 text-base">
                <p>23</p>
                <p>Admin</p>
                <p>Update</p>
                <p>ngo</p>
                <p>22</p>
                <p>www.url.com</p>
                <p>172.16.5.67</p>
                <p>Chrome</p>
                <p>2025/2/3</p>
                <p>2024/3/2</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center ">
          <div className="relative flex flex-col  md:flex-row  justify-start md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
            <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
              <div className=" flex items-center bg-primary/10 px-8 py-1 rounded-full text-xs font-medium text-green-400  w-28">
                Old_Value
              </div>

              <div className="flex flex-row md:text-lg gap-6 px-4 text-gray-500 text-base">
                <p>23</p>
                <p>Admin</p>
                <p>Update</p>
                <p>ngo</p>
                <p>22</p>
                <p>www.url.com</p>
                <p>172.16.5.67</p>
                <p>Chrome</p>
                <p>2025/2/3</p>
                <p>2024/3/2</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center py-1 ">
          <div className="relative flex flex-col  md:flex-row  justify-start md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
            <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
              <div className=" flex items-center bg-primary/10 px-8 py-1 rounded-full text-xs font-medium text-red-400  w-28">
                New_value
              </div>

              <div className="flex flex-row md:text-lg gap-6 px-4 text-gray-500 text-base">
                <p>23</p>
                <p>Admin</p>
                <p>Update</p>
                <p>ngo</p>
                <p>22</p>
                <p>www.url.com</p>
                <p>172.16.5.67</p>
                <p>Chrome</p>
                <p>2025/2/3</p>
                <p>2024/3/2</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="text-lg"
          onClick={() => modelOnRequestHide()}
        >
          {t("cancel")}
        </Button>
      </CardFooter>
    </Card>
  );
}
