"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.replace("/");
    }, 3000); // Small delay for better UX

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>
        <p className="text-gray-600">Redirecting you to the home page...</p>
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-700" />
      </div>
    </div>
  );
}