import PlayerSelectionTable from "@/components/tables/PlayerSelectionTable";
import WelcomeModalWrapper from "@/components/wrappers/WelcomeModalWrapper";

export default async function Home() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-warm">
      <WelcomeModalWrapper />
      <PlayerSelectionTable />
    </div>
  );
}
