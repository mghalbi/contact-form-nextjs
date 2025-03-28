"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

const isValidItalianPhone = (phone: string) => {
  const trimmedPhone = phone.trim();
  const italianPhoneRegex = /^(?:\+39)?3\d{8,9}$/;
  return italianPhoneRegex.test(trimmedPhone);
};

const ContactForm = () => {
  const { data: session, update } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin");
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: session?.user?.email || "",
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: "" });

    if (!isValidItalianPhone(formData.phone)) {
      setStatus({ loading: false, success: false, error: "Invalid Italian phone number format" });
      return;
    }

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        setStatus({ loading: false, success: false, error: data.error });
        return;
      }

      setStatus({ loading: false, success: true, error: "" });
      setFormData({ name: "", phone: "", email: session?.user?.email || "" });

      await update();
    } catch (e) {
      console.error("Form submission error:", e);
      setStatus({ loading: false, success: false, error: "Error" });
    }
  };

  return (
    <div className="bg-[#fffaec] min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4 sm:px-6 md:px-8">
      <Image src="/logo_santinelli.png" alt="Logo" width={150} height={150} className="mb-6" />
      <Card className="w-full max-w-md sm:max-w-lg lg:max-w-xl space-y-8 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl bg-white text-center">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
        Rimaniamo in contatto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-left">
          <label htmlFor="name" className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
          Nome
          </label>
          <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          placeholder="Inserire il nome"
          />
        </div>
        <div className="text-left">
          <label htmlFor="phone" className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
          Numero WhatsApp (+39 iniziale e senza spazi)
          </label>
          <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          placeholder="es. +393756593065"
          inputMode="numeric"
          pattern="\+39[0-9]{9,10}"
          />
        </div>
        <button
          type="submit"
          disabled={status.loading}
          className="w-full flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base lg:text-lg"
        >
          {status.loading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={18} />
            Invio in corso...
          </>
          ) : (
          "Conferma"
          )}
        </button>
        </form>
      </CardContent>
      </Card>
    </div>
  );
};

export default ContactForm;
