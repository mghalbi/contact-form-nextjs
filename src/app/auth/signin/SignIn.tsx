// pages/auth/signin/SignIn.tsx
'use client'

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Image from "next/image";
import { FcGoogle } from 'react-icons/fc';

export default function SignIn() {
  const searchParams = useSearchParams();  // Using search params in a client component
  const callbackUrl = searchParams.get('callbackUrl') || '';
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl });
  };

  return (
    <div className="bg-[#fffaec] min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4">
      <Image src="/logo_santinelli.png" alt="Logo" width={200} height={200} className="mb-6" />
      <div className="w-full max-w-md space-y-8 p-10 rounded-2xl shadow-xl bg-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Benvenuto, proseguire per iscrizione alla nostra WhatsApp Newsletter</h2>
          <p className="mt-2 text-sm text-gray-600">Accedere con account Google</p>
        </div>
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <FcGoogle className="text-xl" />
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}
