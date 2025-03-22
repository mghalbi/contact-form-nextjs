"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

const isValidItalianPhone = (phone: string) => {
  const trimmedPhone = phone.trim();

  // Italian phone numbers should start with +39 or 3XX and be 9-10 digits long (excluding +39)
  const italianPhoneRegex = /^(?:\+39)?3\d{8,9}$/;

  return italianPhoneRegex.test(trimmedPhone);
};

const ContactForm = () => {
  const { data: session, update } = useSession();

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
      console.log(response);
      
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
    <div className="bg-[#fffaec] min-h-screen flex items-center justify-center bg-cover bg-center px-4">
      <Card className="w-full max-w-md space-y-8 p-10 rounded-2xl shadow-xl bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-900">Rimaniamo in contatto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Inserire il nome"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Numero WhatsApp (+39 iniziale e senza spazi) 
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="es. +393756593065"
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

            {status.success && (
              <div className="p-4 bg-green-100 text-green-700 rounded-md">
                Grazie mille! Invieremo al suo numero un messaggio di benvenuto!
              </div>
            )}

            {status.error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-md">
                {status.error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactForm;
