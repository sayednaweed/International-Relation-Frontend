import { cn } from "@/lib/utils";

export interface BooleanStatusButtonProps {
  getColor: () => {
    style: string;
    value?: string;
  };
  className?: string;
}

export default function BooleanStatusButton(props: BooleanStatusButtonProps) {
  const { getColor, className } = props;
  const data = getColor();

  return (
    <div
      className={cn(
        `border-[1px] mx-auto min-w-fit rtl:text-xl-rtl rtl:font-medium w-fit flex items-center gap-x-2 ltr:py-1 rtl:py-[2px] px-[8px] rounded-full ${data.style}`,
        className
      )}
    >
      <div
        className={`size-[12px] min-h-[12px] min-w-[12px] rounded-full border-[3px] ${data.style}`}
      />
      <h1 className="text-nowrap">{data.value}</h1>
    </div>
  );
}
