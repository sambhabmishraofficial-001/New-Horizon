"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const folderCardVariants = cva("ire-folder-card", {
  variants: {
    variant: {
      default: "ire-folder-card--beacon",
      project: "ire-folder-card--violet",
      system: "ire-folder-card--emerald",
      context: "ire-folder-card--neutral",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface FolderCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof folderCardVariants> {
  icon: React.ReactNode;
  title: string;
  size: string;
}

export const FolderCard = React.forwardRef<HTMLDivElement, FolderCardProps>(
  ({ className, variant, icon, title, size, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        whileHover={{ y: -2, transition: { duration: 0.18 } }}
        className={cn(folderCardVariants({ variant }), className)}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
      >
        <div className="ire-folder-card__icon">{icon}</div>
        <div>
          <h3 className="ire-folder-card__title">{title}</h3>
          <p className="ire-folder-card__meta">{size}</p>
        </div>
      </motion.div>
    );
  }
);
FolderCard.displayName = "FolderCard";
