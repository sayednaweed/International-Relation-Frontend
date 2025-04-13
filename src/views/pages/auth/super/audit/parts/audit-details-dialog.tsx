import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import CachedImage from "@/components/custom-ui/image/CachedImage";

export default function AuditDetailsDialog() {
  const { t } = useTranslation();
  const { modelOnRequestHide } = useModelOnRequestHide();
  const oldValue = {
    canary: false,
    config: {
      autoSyncColumns: false,
      changeMethod: "PUT",
      configVersion: 0,
      contentType: "application/json",
      mappings: [],
      rowsPerBatch: 1000,
    },
    created_at: "2022-11-10T20:19:31",
    destination_id: 66595,
    draft: false,
  };

  const newValue = {
    canary: false,
    config: {
      autoSyncColumns: true,
      changeMethod: "POST",
      configVersion: 0,
      contentType: "application/json",
      mappings: [],
      rowsPerBatch: 1000,
    },
    created_at: "2022-11-10T20:19:31",
    destination_id: 66595,
    draft: true,
  };

  const highlightDifferences = (oldObj: any, newObj: any) => {
    const isObject = (val: any) => typeof val === "object" && val !== null;

    const walk = (oldVal: any, newVal: any): any => {
      if (!isObject(newVal)) {
        return oldVal !== newVal ? (
          <span className="text-red-500 font-semibold">
            {JSON.stringify(newVal)}
          </span>
        ) : (
          JSON.stringify(newVal)
        );
      }

      const entries = Object.keys(newVal).map((key) => (
        <div key={key} className="pl-4">
          <span className="text-sky-600">"{key}": </span>
          {walk(oldVal?.[key], newVal[key])}
        </div>
      ));

      return <div>{entries}</div>;
    };

    return walk(oldObj, newObj);
  };
  return (
    <Card className="w-fit self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40 mt-4">
      <CardContent>
        <Table className="bg-card rounded-md my-2 py-4 shadow-sm pointer-events-none mt-4">
          <TableBody>
            <TableRow className=" ">
              <TableHead className="">{t("profile")}</TableHead>
              <TableCell className=" rounded-full  text-start w-24  colSpan={2} p-0">
                <CachedImage
                  src={""}
                  alt="Avatar"
                  className=" size-[36px] object-center object-cover mx-auto shadow-lg border border-tertiary rounded-full "
                  routeIdentifier={"profile"}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-start  ">{t("user")}</TableHead>
              <TableCell className="text-start  ">Ahmad</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-start ">{t("table")}</TableHead>
              <TableCell className="text-start">ngo</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-start">{t("event")}</TableHead>
              <TableCell className="text-start">Updated</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-start w-24">{t("date")}</TableHead>
              <TableCell className="text-start">2025-03-27</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="mt-3">
          <div className="flex justify-evenly ">
            <h2 className=" text-lg font-semibold mb-2 ">Old_value</h2>
            <h2 className=" text-lg font-semibold mb-2">changes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted p-4 rounded border">
              <pre className="text-xs whitespace-pre-wrap text-start">
                {JSON.stringify(oldValue, null, 2)}
              </pre>
            </div>
            <div className="bg-muted p-4 rounded border">
              <pre className="text-xs whitespace-pre-wrap text-start">
                {highlightDifferences(oldValue, newValue)}
              </pre>
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
