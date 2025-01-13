import { cn } from "@/lib/utils";
import SingleTab from "./SingleTab";
import { ReactElement } from "react";
interface OptionalTabsProps {
  children: ReactElement<typeof SingleTab> | ReactElement<typeof SingleTab>[];
  className?: string;
  onClick?: () => void;
}

export default function OptionalTabs(props: OptionalTabsProps) {
  const { children, className } = props;
  return (
    <div {...props} className={cn("", className)}>
      {children}
    </div>
  );
}
