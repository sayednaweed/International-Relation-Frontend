import { StatusEnum } from "@/lib/constants";

export interface StatusButtonProps {
  status_id: number;
  status: string;
}

export default function StatusButton(props: StatusButtonProps) {
  const { status_id, status } = props;
  const style =
    StatusEnum.registered === status_id
      ? "border-green-500"
      : StatusEnum.blocked === status_id
      ? "border-red-500"
      : StatusEnum.register_form_not_completed === status_id
      ? "border-slate-400"
      : "border-orange-500";

  return (
    <div
      className={`border-[1px] min-w-fit rtl:text-xl-rtl rtl:font-medium w-fit flex items-center gap-x-2 ltr:py-1 rtl:py-[2px] px-[8px] rounded-full ${style}`}
    >
      <div
        className={`size-[12px] min-h-[12px] min-w-[12px] rounded-full border-[3px] ${style}`}
      />
      <h1 className="text-nowrap">{status}</h1>
    </div>
  );
}
