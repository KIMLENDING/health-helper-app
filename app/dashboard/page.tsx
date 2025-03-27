import SessionData from "@/components/UserCpmponents/sessionData";
import ShowPlans from "@/components/UserCpmponents/showPlans";

export default async function Dashboard() {
  return (
    <section className="flex flex-1 flex-col gap-4 p-4 ">
      <SessionData />
      <ShowPlans />
    </section>
  );
}
