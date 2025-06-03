import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NBA Draft Companion',
  description: 'A fun tool for extra analytics in fantasy basketball drafts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
