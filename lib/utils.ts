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
  titleWeight: {
    label: "총 무게(kg)",
    color: "#3b82f6", // blue-500
  },
  totalWeight: {
    label: "횟수 x 무게(kg)",
    color: "#22c55e", // green-500
  },
  day: {
    label: "요일",
    color: "#3b82f6",
  },
  totalTime: {
    label: "운동시간(s)",
    color: "#a855f7", // purple-500
  },
  part: {
    label: "운동부위",
    color: "#f97316", // orange-500
  },
  weight: {
    label: "총 무게(kg)",
    color: "#f97316", // orange-500
  }
} satisfies ChartConfig;

export function formatDate(dateString: string) {
  // dateString이 ISO 8601 형식이어야 합니다. 예: "2023-10-01T00:00:00Z"
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}