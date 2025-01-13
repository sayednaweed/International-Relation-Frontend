import { cn } from "@/lib/utils";

interface SingleTabProps {
  children: string;
  className?: string;
  onClick?: () => void;
}

export default function SingleTab({
  children,
  className,
  onClick,
}: SingleTabProps) {
  return (
    <div onClick={onClick} className={cn("", className)}>
      {children}
    </div>
  );
}
