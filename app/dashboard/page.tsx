'use client';
import SessionData from "@/components/UserCpmponents/sessionData";
import ShowPlans from "@/components/UserCpmponents/showPlans";


export default function Dashboard() {

  return (
    <section className="flex flex-1 flex-col gap-4 p-4">
      {/* 루틴 생성 기능
      주간 히스토리
      오늘의 운동 계획
      주간 목표 진행률
      요일별 운동 시간 통계
      이번주 운동 시간 통계
      최근 성과 및 기록 갱신
      운동 알림 및 팁 */}

      <SessionData />
      <ShowPlans />



    </section>
  );
}
