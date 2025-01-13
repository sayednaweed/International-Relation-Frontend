import { useTranslation } from "react-i18next";
import { BarChart2, PersonStanding } from "lucide-react";
import DashboardCard from "@/components/custom-ui/card/DashboardCard";
import BarChartTwo from "@/components/custom-ui/charts/bar/BarChartTwo";
import BarChartOne from "@/components/custom-ui/charts/bar/BarChartOne";
import PieChartOne from "@/components/custom-ui/charts/pie/PieChartOne";
import BarChartThree from "@/components/custom-ui/charts/bar/BarChartThree";
import BarChartFour from "@/components/custom-ui/charts/bar/BarChartFour";
import BarChartFive from "@/components/custom-ui/charts/bar/BarChartFive";
import BarChartSix from "@/components/custom-ui/charts/bar/BarChartSix";
import BarChartSeven from "@/components/custom-ui/charts/bar/BarChartSeven";
import BarChartEight from "@/components/custom-ui/charts/bar/BarChartEight";
import BarChartNine from "@/components/custom-ui/charts/bar/BarChartNine";
import PieChartTwo from "@/components/custom-ui/charts/pie/PieChartTwo";
import PieChartThree from "@/components/custom-ui/charts/pie/PieChartThree";
import PieChartFour from "@/components/custom-ui/charts/pie/PieChartFour";
import PieChartSix from "@/components/custom-ui/charts/pie/PieChartSix";
import PieChartSeven from "@/components/custom-ui/charts/pie/PieChartSeven";
import PieChartEight from "@/components/custom-ui/charts/pie/PieChartEight";
import PieChartNine from "@/components/custom-ui/charts/pie/PieChartNine";
import PieChartTen from "@/components/custom-ui/charts/pie/PieChartTen";
import PieChartEleven from "@/components/custom-ui/charts/pie/PieChartEleven";
import LineChartOne from "@/components/custom-ui/charts/line/LineChartOne";
import LineChartTwo from "@/components/custom-ui/charts/line/LineChartTwo";
import LineChartThree from "@/components/custom-ui/charts/line/LineChartThree";
import LineChartFour from "@/components/custom-ui/charts/line/LineChartFour";
import LineChartFive from "@/components/custom-ui/charts/line/LineChartFive";
import LineChartSix from "@/components/custom-ui/charts/line/LineChartSix";
import LineChartSeven from "@/components/custom-ui/charts/line/LineChartSeven";
import LineChartEight from "@/components/custom-ui/charts/line/LineChartEight";
import LineChartNine from "@/components/custom-ui/charts/line/LineChartNine";
import LineChartTen from "@/components/custom-ui/charts/line/LineChartTen";
import RadarChartOne from "@/components/custom-ui/charts/radar/RadarChartOne";
import RadarChartTwo from "@/components/custom-ui/charts/radar/RadarChartTwo";
import RadarChartThree from "@/components/custom-ui/charts/radar/RadarChartThree";
import RadarChartFour from "@/components/custom-ui/charts/radar/RadarChartFour";
import RadarChartSix from "@/components/custom-ui/charts/radar/RadarChartSix";
import RadarChartSeven from "@/components/custom-ui/charts/radar/RadarChartSeven";
import RadarChartEight from "@/components/custom-ui/charts/radar/RadarChartEight";
import RadarChartNine from "@/components/custom-ui/charts/radar/RadarChartNine";
import RadarChartTen from "@/components/custom-ui/charts/radar/RadarChartTen";
import RadarChartEleven from "@/components/custom-ui/charts/radar/RadarChartEleven";
import RadarChartTwelve from "@/components/custom-ui/charts/radar/RadarTwelve";
import RadarChartThirtheen from "@/components/custom-ui/charts/radar/RadarChartThirteen";
import RadarChartFourteen from "@/components/custom-ui/charts/radar/RadarChartFourteen";
import RadarChartFive from "@/components/custom-ui/charts/radar/RadarChartFive";
import RadialChartOne from "@/components/custom-ui/charts/radial/RadialChartOne";
import RadialChartTwo from "@/components/custom-ui/charts/radial/RadialChartTwo";
import RadialChartThree from "@/components/custom-ui/charts/radial/RadialChartThree";
import RadialChartFour from "@/components/custom-ui/charts/radial/RadialChartFour";
import RadialChartFive from "@/components/custom-ui/charts/radial/RadialChartFive";
import RadialChartSix from "@/components/custom-ui/charts/radial/RadialChartSix";
import TooltipChartOne from "@/components/custom-ui/charts/tooltip/TooltipChartOne";
import TooltipChartTwo from "@/components/custom-ui/charts/tooltip/TooltipChartTwo";
import TooltipChartThree from "@/components/custom-ui/charts/tooltip/TooltipChartThree";
import TooltipChartFour from "@/components/custom-ui/charts/tooltip/TooltipChartFour";
import TooltipChartFive from "@/components/custom-ui/charts/tooltip/TooltipChartFive";
import TooltipChartSix from "@/components/custom-ui/charts/tooltip/TooltipChartSix";
import TooltipChartSeven from "@/components/custom-ui/charts/tooltip/TooltipChartSeven";
import TooltipChartEight from "@/components/custom-ui/charts/tooltip/TooltipChartEight";
import TooltipChartNine from "@/components/custom-ui/charts/tooltip/TooltipChartNine";
import AreaChartOne from "@/components/custom-ui/charts/area/AreaChartOne";
import AreaChartTow from "@/components/custom-ui/charts/area/AreaChartTwo";
import { AreaChartThree } from "@/components/custom-ui/charts/area/AreaChartThree";
import { AreaChartFour } from "@/components/custom-ui/charts/area/AreaChartFour";
import { AreaChartFive } from "@/components/custom-ui/charts/area/AreaChartFive";
import { AreaChartSix } from "@/components/custom-ui/charts/area/AreaChartSix";
import { AreaChartSeven } from "@/components/custom-ui/charts/area/AreaChartSeven";
import { AreaChartEight } from "@/components/custom-ui/charts/area/AreaChartEight";
import AreaChartNine from "@/components/custom-ui/charts/area/AreaChartNine";
import { AreaChartTen } from "@/components/custom-ui/charts/area/AreaChartTen";
import { AreaChartEleven } from "@/components/custom-ui/charts/area/AreaChartEleven";

export default function DebuggerDashboardPage() {
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
        <AreaChartOne />
        <AreaChartTow />
        <AreaChartThree />
        <AreaChartFour />
        <AreaChartFive />
        <AreaChartSix />
        <AreaChartSeven />
        <AreaChartEight />
        <AreaChartNine />
        <AreaChartTen />
        <AreaChartEleven />

        {/**Bar Charts */}
        <BarChartOne />
        <BarChartTwo />
        <BarChartThree />
        <BarChartFour />
        <BarChartFive />
        <BarChartSix />
        <BarChartSeven />
        <BarChartEight />
        <BarChartNine />

        {/**Pie Charts */}
        <PieChartOne />
        <PieChartTwo />
        <PieChartThree />
        <PieChartFour />
        <PieChartSix />
        <PieChartSeven />
        <PieChartEight />
        <PieChartNine />
        <PieChartTen />
        <PieChartEleven />
        {/** Line Charts */}
        <LineChartOne />
        <LineChartTwo />
        <LineChartThree />
        <LineChartFour />
        <LineChartFive />
        <LineChartSix />
        <LineChartSeven />
        <LineChartEight />
        <LineChartNine />
        <LineChartTen />
        {/**Radar Charts */}
        <RadarChartOne />
        <RadarChartTwo />
        <RadarChartThree />
        <RadarChartFour />
        <RadarChartFive />
        <RadarChartSix />
        <RadarChartSeven />
        <RadarChartEight />
        <RadarChartNine />
        <RadarChartTen />
        <RadarChartEleven />
        <RadarChartTwelve />
        <RadarChartThirtheen />
        <RadarChartFourteen />
        {/**Radial Charts */}
        <RadialChartOne />
        <RadialChartTwo />
        <RadialChartThree />
        <RadialChartFour />
        <RadialChartFive />
        <RadialChartSix />
        {/**Tooltip Charts */}
        <TooltipChartOne />
        <TooltipChartTwo />
        <TooltipChartThree />
        <TooltipChartFour />
        <TooltipChartFive />
        <TooltipChartSix />
        <TooltipChartSeven />
        <TooltipChartEight />
        <TooltipChartNine />
      </div>
    </>
  );
}
