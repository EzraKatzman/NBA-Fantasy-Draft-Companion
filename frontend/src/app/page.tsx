import PlayerSelectionTable from "@/components/PlayerSelectionTable";
import WelcomeModalWrapper from "@/components/wrappers/WelcomeModalWrapper";

export default async function Home() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f8f7f2]">
      <WelcomeModalWrapper />
      <PlayerSelectionTable />
    </div>
  );
}
