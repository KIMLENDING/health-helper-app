// chartConfig.ts

import { ChartConfig } from "@/components/ui/chart";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
  title: {
    label: "Title",
    color: "#2563eb",
  },
  totalWeight: {
    label: "횟수 x 무게(kg)",
    color: "#2563eb",
  },
  day: {
    label: "요일",
    color: "#2563eb",
  },
  totalTime: {
    label: "운동시간(s)",
    color: "#2563eb",
  },
  part: {
    label: "운동부위",
    color: "#2563eb",
  }



} satisfies ChartConfig;