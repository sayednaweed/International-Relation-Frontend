import { useTranslation } from "react-i18next";
import { BarChart2, PersonStanding } from "lucide-react";
import DashboardCard from "@/components/custom-ui/card/DashboardCard";
import BarChartNine from "@/components/custom-ui/charts/bar/BarChartNine";
import PieChartSix from "@/components/custom-ui/charts/pie/PieChartSix";
import LineChartThree from "@/components/custom-ui/charts/line/LineChartThree";
import LineChartFive from "@/components/custom-ui/charts/line/LineChartFive";
import RadialChartFive from "@/components/custom-ui/charts/radial/RadialChartFive";
import { AreaChartSix } from "@/components/custom-ui/charts/area/AreaChartSix";

export default function AdminDashboardPage() {
  const { t } = useTranslation();

  // const cardLoader = (
  //   <Shimmer className="flex-1 space-y-2 p-4 h-full w-full overflow-hidden">
  //     <ShimmerItem className="font-bold ml-1 mt-1 pl-1 w-1/2 rounded-[5px]" />
  //     <ShimmerItem className="ml-1 mt-1 pl-1 w-1/3 rounded-[5px]" />
  //     <ShimmerItem className=" pl-1 mt-8 mb-1 w-full h-[64px] animate-none rounded-[5px]" />
  //   </Shimmer>
  // );

  return (
    <>
      {/* Cards */}
      <div className="px-1 sm:px-2 pt-4 grid grid-cols-2 md:grid-cols-4">
        {/* {loading ? (
            <>
              {cardLoader}
              {cardLoader}
              {cardLoader}
              {cardLoader}
              {cardLoader}
            </>
          ) : ( */}
        <>
          <DashboardCard
            loading={false}
            key={"country"}
            title={t("country")}
            description={t("january")}
            className="overflow-hidden flex-1 space-y-2 h-full p-4"
            value={100}
            symbol="+"
            icon={
              <BarChart2 className="sm:size-[54px] min-w-[32px] min-h-[32px]" />
            }
          />
          <DashboardCard
            loading={false}
            key={"district"}
            title={t("district")}
            description={t("january")}
            className="overflow-hidden flex-1 space-y-2 h-full p-4"
            value={20000}
            symbol="+"
            icon={
              <BarChart2 className="sm:size-[54px] min-w-[32px] min-h-[32px]" />
            }
          />
          <DashboardCard
            loading={false}
            key={"area"}
            title={t("area")}
            description={t("area")}
            className="overflow-hidden flex-1 space-y-2 h-full p-4"
            value={566000}
            symbol="+"
            icon={
              <BarChart2 className="sm:size-[54px] min-w-[32px] min-h-[32px]" />
            }
          />
          <DashboardCard
            loading={false}
            key={"job"}
            title={t("job")}
            description={t("job")}
            className="overflow-hidden flex-1 space-y-2 h-full p-4"
            value={600}
            symbol="+"
            icon={
              <PersonStanding className="sm:size-[54px] min-w-[32px] min-h-[32px]" />
            }
          />
        </>
        {/* )} */}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Area Charts  */}
        <AreaChartSix />
        {/**Bar Charts */}
        <BarChartNine />
        {/**Pie Charts */}
        <PieChartSix />
        {/** Line Charts */}
        <LineChartThree />
        <LineChartFive />
        {/**Radial Charts */}
        <RadialChartFive />
      </div>
    </>
  );
}
