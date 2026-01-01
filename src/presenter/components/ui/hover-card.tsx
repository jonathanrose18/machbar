import React from "react";

import { cn } from "@/presenter/lib/utils";

export interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  hoverable?: boolean;
}

const HoverCard = React.forwardRef<HTMLDivElement, HoverCardProps>(
  ({ className, hoverable = true, ...props }, ref) => {
    return (
      <div
        className={cn(
          "w-full relative bg-muted/50 rounded-lg border border-border px-4 py-1.5",
          hoverable &&
            "cursor-pointer hover:shadow-md dark:hover:ring-1 dark:ring-border dark:ring-offset-1 transition-shadow duration-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

HoverCard.displayName = "HoverCard";

export { HoverCard };
