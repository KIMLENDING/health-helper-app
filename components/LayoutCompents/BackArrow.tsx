"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";

export default function BackButton() {
    const router = useRouter();

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/"); // 기본 경로 (홈 등)
        }
    };
    return (
        <div>


            <Button onClick={handleBack} variant="outline" size="icon" className="shadow-none ring-0 border-0 focus-visible:ring-0 w-7 h-7">
                <ChevronLeft />
            </Button>
        </div>
    );
}
