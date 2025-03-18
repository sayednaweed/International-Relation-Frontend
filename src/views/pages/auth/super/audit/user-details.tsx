import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";

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

export default function UserDetails() {
  const { t } = useTranslation();
  const [oldData, setOldData] = useState<UserData | null>(null);
  const [newData, setNewData] = useState<UserData | null>(null);
  const { modelOnRequestHide } = useModelOnRequestHide();
  useEffect(() => {
    axios
      .get("http://localhost/api/user/1/old")
      .then((response) => setOldData(response.data))
      .catch((error) => console.error("Error fetching old user data:", error));

    axios
      .get("http://localhost/api/user/1")
      .then((response) => setNewData(response.data))
      .catch((error) => console.error("Error fetching new user data:", error));
  }, []);

  return (
    <Card className="w-fit self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
      <CardHeader className="relative text-start">
        <CardTitle className="text-2xl text-tertiary text-center border-b-2">
          {t("user_details")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* {oldData && newData ? ( */}
        <div className="flex justify-between w-[700px] h-auto ">
          <div className="p-3 ltr:text-start">
            <p className="font-semibold">Field</p>
            <p>ID:</p>
            <p>Type:</p>
            <p>Event:</p>
            <p>Table:</p>
            <p>Table ID:</p>
            <p>URL:</p>
            <p>IP Address:</p>
            <p>User Agent:</p>
            <p>Created At:</p>
            <p>Updated At:</p>
          </div>
          <div className="text-primary/50 font-normal p-3 ltr:text-start">
            <p className="font-semibold">Old Value</p>
            {/* <p>{oldData.id}</p>
              <p>{oldData.type}</p>
              <p>{oldData.event}</p>
              <p>{oldData.table}</p>
              <p>{oldData.table_id}</p>
              <p>{oldData.url}</p>
              <p>{oldData.ip_address}</p>
              <p>{oldData.user_agent}</p>
              <p>{new Date(oldData.created_at).toLocaleString()}</p>
              <p>{new Date(oldData.updated_at).toLocaleString()}</p> */}
            <p>23</p>
            <p>Admin</p>
            <p>Updated</p>
            <p>ngo</p>
            <p>22</p>
            <p>www.url.com</p>
            <p>172.16.5.67</p>
            <p>grome </p>
            <p>2025/2/3</p>
            <p>2024/3/2</p>
          </div>
          <div className="text-green-500 font-normal p-3 ltr:text-start">
            <p className="font-semibold">New Value</p>
            {/* <p>{newData.id}</p>
              <p>{newData.type}</p>
              <p>{newData.event}</p>
              <p>{newData.table}</p>
              <p>{newData.table_id}</p>
              <p>{newData.url}</p>
              <p>{newData.ip_address}</p>
              <p>{newData.user_agent}</p>
              <p>{new Date(newData.created_at).toLocaleString()}</p>
              <p>{new Date(newData.updated_at).toLocaleString()}</p> */}
            <p>23</p>
            <p>Admin</p>
            <p>Updated</p>
            <p>ngo</p>
            <p>22</p>
            <p>www.url.com</p>
            <p>172.16.5.67</p>
            <p>grome </p>
            <p>2025/2/3</p>
            <p>2024/3/2</p>
          </div>
        </div>
        {/* ) : (
          <p className="text-center">Loading...</p>
        )} */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="text-lg"
          onClick={() => {
            modelOnRequestHide();
          }}
        >
          {t("cancel")}
        </Button>
      </CardFooter>
    </Card>
  );
}
