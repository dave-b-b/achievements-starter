import type { Metadata } from 'next';
import { Shell } from '@/src/components/shell';
import './globals.css';
export const metadata: Metadata = {
  title: { default: 'LearnQuest — Small wins. Lasting progress.', template: '%s · LearnQuest' },
  description:
    'Try real achievement SDKs, customize a working preview, and build with a complete open-source Next.js starter.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
