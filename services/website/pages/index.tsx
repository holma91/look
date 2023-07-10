import Image from 'next/image';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2 bg-white">
      <h1 className="text-3xl font-bold text-black">look!</h1>
    </main>
  );
}
