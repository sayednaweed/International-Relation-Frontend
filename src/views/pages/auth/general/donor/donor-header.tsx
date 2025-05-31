import HeaderCard from "@/components/custom-ui/card/HeaderCard";
import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";
import { UserRecordCount } from "@/lib/types";
import {
  UserRoundPen,
  UserRoundPlus,
  UserRoundX,
  UsersRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function DonorHeader() {
  const { t } = useTranslation();
  const [recordCount, setRecordCount] = useState<UserRecordCount>({
    activeUserCount: null,
    inActiveUserCount: null,
    userCount: null,
    todayCount: null,
  });
  const [loading, setLoading] = useState(true);
  const fetchCount = async () => {
    try {
      const response = await axiosClient.get(`/projects/statistics`);
      if (response.status == 200) {
        setRecordCount({
          activeUserCount: response.data.counts.activeCount,
          inActiveUserCount: response.data.counts.unRegisteredCount,
          userCount: response.data.counts.count,
          todayCount: response.data.counts.todayCount,
        });
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: "Error!",
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 justify-items-center gap-y-2 mt-4">
      <HeaderCard
        loading={loading}
        title={t("total")}
        total={recordCount.userCount}
        description1={t("total")}
        description2={t("donor")}
        icon={
          <UsersRound className=" size-[22px] bg-tertiary rounded-sm p-1 text-secondary" />
        }
      />
      <HeaderCard
        loading={loading}
        title={t("total_registered_today")}
        total={recordCount.todayCount}
        description1={t("total")}
        description2={t("donor")}
        icon={
          <UserRoundPlus className=" size-[22px] bg-orange-500 rounded-sm p-1 text-secondary" />
        }
      />
      <HeaderCard
        loading={loading}
        title={t("active")}
        total={recordCount.activeUserCount}
        description1={t("total")}
        description2={t("donor")}
        icon={
          <UserRoundX className=" size-[22px] bg-red-500 rounded-sm p-1 text-secondary" />
        }
      />
      <HeaderCard
        loading={loading}
        title={t("un_registered")}
        total={recordCount.inActiveUserCount}
        description1={t("total")}
        description2={t("donor")}
        icon={
          <UserRoundPen className=" size-[22px] bg-green-500 rounded-sm p-1 text-secondary" />
        }
      />
    </div>
  );
}
