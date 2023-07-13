import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { sql } from '@vercel/postgres';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 bg-white">
      <h1 className="text-3xl font-bold text-black">look</h1>
      <EmailSignUp />
    </main>
  );
}

type FormData = {
  email: string;
};

function EmailSignUp() {
  const [joined, setJoined] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async ({ email }: any) => {
    const response = await fetch('/api/add-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      // Show success message to user
      setJoined(true);
    } else {
      console.log('error response:', response);
      // Show error to user
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users');
      const data = await response.json();
      console.log(data);
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex-col">
      {!joined ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-row items-center justify-center gap-3"
        >
          <input
            {...register('email', { required: true })}
            type="email"
            className="px-3 py-2 border-2 border-gray-300 text-black"
            placeholder="your email"
          />
          <button type="submit" className="px-4 py-[9px] bg-black text-white">
            join waitlist
          </button>
        </form>
      ) : (
        <p className="text-black">You&apos;re on the waitlist!</p>
      )}
    </div>
  );
}
