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

  return (
    <Card className="w-fit self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40 mt-4">
      <CardContent>
        <Table className=" bg-card rounded-md my-2 py-4 shadow-sm pointer-events-none mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="text-start">{t("profile")}</TableHead>
              <TableHead className="text-start ">{t("user")}</TableHead>
              <TableHead className="text-start">{t("table")}</TableHead>
              <TableHead className="text-start">{t("event")}</TableHead>
              <TableHead className="text-start">{t("date")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="">
              <TableCell className="  w-0">
                <CachedImage
                  src={""}
                  alt="Avatar"
                  className="size-[36px] object-center object-cover mx-auto shadow-lg border border-tertiary rounded-full"
                  routeIdentifier={"profile"}
                />
              </TableCell>
              <TableCell className="truncate text-start">Ahmad</TableCell>
              <TableCell className="text-start">ngo</TableCell>
              <TableCell className="truncate text-start">Updated</TableCell>
              <TableCell className="truncate text-start">2025-03-27</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table
          className="bg-card rounded-md my-2 py-4 shadow-sm
        "
        >
          <TableBody>
            <TableRow>
              {" "}
              <TableHead className="ltr:text-start">{t("field")}</TableHead>
              <TableCell className="text-center text-red-500" colSpan={2}>
                {t("old_value")}
              </TableCell>
              <TableCell className="text-center text-green-500" colSpan={2}>
                {t("new_value")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-start font-medium">ID</TableHead>
              <TableCell className="text-center text-red-500" colSpan={2}>
                <pre>{JSON.stringify({ id: 1 }, null, 2)}</pre>
              </TableCell>
              <TableCell className="text-center text-green-500" colSpan={2}>
                <pre>{JSON.stringify({ id: 23 }, null, 2)}</pre>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-start font-medium">Type</TableHead>
              <TableCell className="text-center text-red-500" colSpan={2}>
                <pre>{JSON.stringify({ type: "Admin" }, null, 2)}</pre>
              </TableCell>
              <TableCell className="text-center text-green-500" colSpan={2}>
                <pre>{JSON.stringify({ type: "SuperAdmin" }, null, 2)}</pre>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-start font-medium">Table</TableHead>
              <TableCell className="text-center text-red-500" colSpan={2}>
                <pre>{JSON.stringify({ table: "ngo" }, null, 2)}</pre>
              </TableCell>
              <TableCell className="text-center text-green-500" colSpan={2}>
                <pre>{JSON.stringify({ table: "permission" }, null, 2)}</pre>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-start font-medium">Table ID</TableHead>
              <TableCell className="text-center text-red-500" colSpan={2}>
                <pre>{JSON.stringify({ table_id: 22 }, null, 2)}</pre>
              </TableCell>
              <TableCell className="text-center text-green-500" colSpan={2}>
                <pre>{JSON.stringify({ table_id: 21 }, null, 2)}</pre>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-start font-medium">URL</TableHead>
              <TableCell className="text-center text-red-500" colSpan={2}>
                <pre>{JSON.stringify({ url: "www.oldurl.com" }, null, 2)}</pre>
              </TableCell>
              <TableCell className="text-center text-green-500" colSpan={2}>
                <pre>{JSON.stringify({ url: "www.newurl.com" }, null, 2)}</pre>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-start font-medium">
                IP Address
              </TableHead>
              <TableCell className="text-center text-red-500" colSpan={2}>
                <pre>{JSON.stringify({ ip: "192.168.1.1" }, null, 2)}</pre>
              </TableCell>
              <TableCell className="text-center text-green-500" colSpan={2}>
                <pre>{JSON.stringify({ ip: "172.16.5.67" }, null, 2)}</pre>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-start font-medium">
                User Agent
              </TableHead>
              <TableCell className="text-center text-red-500" colSpan={2}>
                <pre>{JSON.stringify({ user_agent: "Firefox" }, null, 2)}</pre>
              </TableCell>
              <TableCell className="text-center text-green-500" colSpan={2}>
                <pre>{JSON.stringify({ user_agent: "Chrome" }, null, 2)}</pre>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-start font-medium">
                Created At
              </TableHead>
              <TableCell className="text-center text-red-500" colSpan={2}>
                <pre>
                  {JSON.stringify({ created_at: "2024-03-01" }, null, 2)}
                </pre>
              </TableCell>
              <TableCell className="text-center text-green-500" colSpan={2}>
                <pre>
                  {JSON.stringify({ created_at: "2025-01-01" }, null, 2)}
                </pre>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-start font-medium">
                Updated At
              </TableHead>
              <TableCell className="text-center text-red-500" colSpan={2}>
                <pre>
                  {JSON.stringify({ updated_at: "2024-03-01" }, null, 2)}
                </pre>
              </TableCell>
              <TableCell className="text-center text-green-500" colSpan={2}>
                <pre>
                  {JSON.stringify({ updated_at: "2025-03-27" }, null, 2)}
                </pre>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
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
