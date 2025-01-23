import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Link } from "react-router";
import { t } from "i18next";
const ViewNewsItem = () => {
  return (
    <>
      {" "}
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
                {t("news")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-col justify-center items-center   ">
        <Card className="bg-primary/5 mb-10 rounded-xl">
          <CardHeader className=" flex  flex-row  justify-between ltr:text-4xl-ltr text-black font-bold">
            <div>This Is A Latest News About Taliban </div>
            <h3 className="text-primary/25">2025/1/23</h3>
          </CardHeader>
          <CardContent className="p-0 max-w-[800px] max-h-[660px]  ">
            <div>
              <img
                src="../src/views/site/tabs/news/photo/ground.jpg"
                alt="smile image"
                className="min-w-full h-full object-fill rounded"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 mb-10 rounded-xl">
          <CardContent className="px-4 py-4 text-3xl-ltr w-[1200px]  font-medium ltr:text-left rtl:text-right ">
            <div className="font-bold mb-3  text-justify">
              This all About Taliban and About Afghaistan This all About Taliban
              and About Afghaistan This all About Taliban and About Afghaistan
              This all About Taliban and About Afghaistan This all About Taliban
              and About Afghaistan This all About Taliban and About Afghaistan
              This all About Taliban and About Afghaistan This all About Taliban
              and About Afghaistan This all About Taliban and About Afghaistan
              This all About Taliban and About Afghaistan This all About Taliban
              and About Afghaistan This all About Taliban and About Afghaistan
              This all About Taliban and About Afghaistan This all About Taliban
              and About Afghaistan This all About Taliban and About Afghaistan
              This all About Taliban and About Afghaistan This all About Taliban
              and About Afghaistan This all About Taliban and About Afghaistan
              This all About Taliban and About Afghaistan This all About Taliban
              and About Afghaistan.
            </div>
          </CardContent>
          <CardFooter className="mt-10">
            <div className="flex  flex-row  gap-16">
              <div>
                <div className="font-bold">Saved by:</div>
                <p>Sayed Naweed Sayedi</p>
              </div>
              <div>
                <div className="font-bold">Type:</div>
                <p>Health</p>
              </div>
              <div>
                <div className="font-bold">Priority:</div>
                <p>High</p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
export default ViewNewsItem;
