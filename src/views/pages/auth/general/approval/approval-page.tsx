import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function ApprovalPage() {
  const { t } = useTranslation();

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
              {t("approval")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="shadow-md max-h-[600px] w-[400px] md:w-[420px] hover:shadow-lg transition-shadow">
        <CardContent className="mt-3 h-[200px] sm:h-[200px] gap-4 ">
          <div>
            <span className="font-medium text-primary/80">comment: </span>{" "}
            <div className="flex flex-row gap-10 mt-0.5 ">
              <p className="text-primary/40">
                {" "}
                hello bro i am herehello bro i am herehello bro i am herehello
                bro i am herehello bro i am here{" "}
              </p>
              <span className="text-primary/40">2025/3/4 </span>
            </div>
          </div>

          <div className="flex flex-row mt-6">
            <span className="font-medium text-primary/80">requester: </span>
            <p className="text-primary/40">Ali Ahmad Jalali </p>
          </div>
          <div className="flex flex-row gap-4">
            <span className="font-medium text-red-400">action: </span>
            <p className="text-primary/40">form submission for ngo </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex flex-row gap-4">
            <Button className="bg-tertiary ">Accept</Button>
            <Button className="bg-tertiary">Reject</Button>
            <Button>more</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
