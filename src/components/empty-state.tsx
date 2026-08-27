import { cn } from "@/lib/cn";
import { ReactNode } from "react";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: {
    wrap: "py-6",
    icon: "w-5 h-5",
    title: "text-sm",
    desc: "text-xs",
    iconWrap: "w-8 h-8",
  },
  md: {
    wrap: "py-10",
    icon: "w-6 h-6",
    title: "text-base",
    desc: "text-sm",
    iconWrap: "w-9 h-9",
  },
  lg: {
    wrap: "py-12",
    icon: "w-7 h-7",
    title: "text-lg",
    desc: "text-sm",
    iconWrap: "w-10 h-10",
  },
};

const DefaultIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  const s = sizes[size];
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-4",
        s.wrap,
        className,
      )}
    >
      <div
        className={cn(
          "mb-3 flex items-center justify-center text-muted-foreground",
          s.iconWrap,
        )}
      >
        {icon ? (
          <span className={cn("inline-flex items-center justify-center text-muted-foreground", s.icon)}>{icon}</span>
        ) : (
          <DefaultIcon className={cn("text-muted-foreground", s.icon)} />
        )}
      </div>
      <p className={cn("font-semibold text-foreground", s.title)}>
        {title}
      </p>
      {description && (
        <p className={cn("mt-1.5 max-w-sm leading-5 text-muted-foreground", s.desc)}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
