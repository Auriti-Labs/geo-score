"use client";

import { useState, useId } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CATEGORIES, type CategoryKey } from "@/lib/constants";

interface CategoryCardProps {
  category: CategoryKey;
  children: React.ReactNode;
}

// Card espandibile per ogni categoria audit
export function CategoryCard({ category, children }: CategoryCardProps) {
  const [open, setOpen] = useState(false);
  const info = CATEGORIES[category];
  const contentId = useId();

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setOpen(!open)}
        role="button"
        aria-expanded={open}
        aria-controls={contentId}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{info.label}</CardTitle>
            <p className="text-sm text-muted-foreground">{info.description}</p>
          </div>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </CardHeader>
      {open && <CardContent id={contentId}>{children}</CardContent>}
    </Card>
  );
}
