import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function TasksLoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {new Array(3).fill("_").map((_, index) => (
        <Skeleton key={index} className="w-full h-28" />
      ))}
    </div>
  );
}
