import PlayerSelectionTable from '@/components/tables/PlayerSelectionTable';
import WelcomeModalWrapper from '@/components/wrappers/WelcomeModalWrapper';
import ThemeToggle from '@/components/miscellaneous/ThemeToggle';

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 p-6 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900">
      <ThemeToggle />
      <WelcomeModalWrapper />
      <PlayerSelectionTable />
    </div>
  );
}
