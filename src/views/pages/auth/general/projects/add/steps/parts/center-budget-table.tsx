import { useContext, useState } from "react";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import AddCenterBudgetPart from "./add-center-budget-part";
import { CenterBudget } from "@/database/tables";

export default function CenterBudgetTable() {
  const { userData, setUserData } = useContext(StepperContext);
  const [onEdit, setOnEdit] = useState<CenterBudget | undefined>();
  const { t } = useTranslation();

  const onCenterComplete = (center: CenterBudget) => {
    const centers = userData.centers_list;
    if (centers) {
      const alreadyExists = centers.some(
        (v: CenterBudget) => v?.province?.id === center?.province?.id
      );
      if (alreadyExists) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: t("item_exist"),
        });
        return false;
      } else {
        setUserData((prev: any) => ({
          ...prev,
          centers_list: [...prev.centers_list, center],
        }));
      }
    } else {
      setUserData((prev: any) => ({
        ...prev,
        centers_list: [center],
      }));
    }
    // Clear inpput data
    return true;
  };
  const removeCenter = (id: string) => {
    setUserData((prev: any) => ({
      ...prev,
      centers_list: prev.centers_list.filter(
        (center: CenterBudget) => center.id !== id
      ),
    }));
  };
  const onEditComplete = (updatedVac: CenterBudget) => {
    const centers = userData.centers_list;

    if (centers) {
      const alreadyExists = centers.some(
        (v: CenterBudget) =>
          v?.province?.id === updatedVac?.province?.id && v?.id != updatedVac.id
      );
      if (alreadyExists) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: t("item_exist"),
        });
        // do not clear input data
        return false;
      } else {
      }
      setUserData((prev: any) => {
        const filtered = prev.centers_list.filter(
          (v: CenterBudget) => v.id !== updatedVac.id
        );

        return {
          ...prev,
          centers_list: [...filtered, updatedVac],
        };
      });
      setOnEdit(undefined);
      // Clear inpput data
    }
    return true;
  };
  const editCenter = (vac: CenterBudget) => {
    setOnEdit(vac); // Just set for editing, don't remove yet
  };

  return (
    <div className="flex flex-col col-span-full gap-x-4 xl:gap-x-12 mt-4 gap-y-3 w-full lg:w-full">
      <AddCenterBudgetPart
        editCenter={onEdit}
        onEditComplete={onEditComplete}
        onComplete={onCenterComplete}
      />
      <div className="col-span-full flex flex-col border-t mt-5 pt-6 space-y-4 pb-12 relative">
        <h1 className="absolute uppercase text-tertiary font-bold ltr:text-[22px] bg-card -top-5">
          {t("centers")}
        </h1>
        <Table className="bg-card rounded-md">
          <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr bg-primary/5">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-start px-1">{t("province")}</TableHead>
              <TableHead className="text-start">{t("budget")}</TableHead>
              <TableHead className="text-start">{t("direct_benefi")}</TableHead>
              <TableHead className="text-center">
                {t("in_direct_benefi")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
            {userData.centers_list &&
              userData.centers_list.map((item: CenterBudget) => (
                <TableRow key={item.id}>
                  <TableCell className="text-start truncate px-1 py-0">
                    {item.province?.name}
                  </TableCell>
                  <TableCell className="text-start truncate px-1 py-0">
                    {item.budget}
                  </TableCell>
                  <TableCell className=" text-center truncate px-1 py-0">
                    {item.direct_benefi}
                  </TableCell>
                  <TableCell className=" text-center truncate px-1 py-0">
                    {item.in_direct_benefi}
                  </TableCell>
                  <TableCell className="flex gap-x-2 justify-center items-center">
                    <Trash2
                      onClick={() => removeCenter(item.id)}
                      className="text-red-400 size-[18px] transition cursor-pointer"
                    />
                    <Edit
                      onClick={() => editCenter(item)}
                      className="text-green-500 size-[18px] transition cursor-pointer"
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
