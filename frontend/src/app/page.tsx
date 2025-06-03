import PlayerSelectionTable from "@/components/tables/PlayerSelectionTable";
import WelcomeModalWrapper from "@/components/wrappers/WelcomeModalWrapper";

export default async function Home() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100">
      <WelcomeModalWrapper />
      <PlayerSelectionTable />
    </div>
  );
}
