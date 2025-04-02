"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { PhoneInput, defaultCountries, parseCountry } from 'react-international-phone';
import { PhoneNumberUtil } from 'google-libphonenumber';
import 'react-international-phone/style.css';

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    console.error(error)
    return false;
  }
};

const ContactForm = () => {
  
  const countries = defaultCountries.filter((country) => {
    const { iso2 } = parseCountry(country);
    return ['it'].includes(iso2);
  });
  const { data: session, update } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin");
    },
  });
  
  const [phone, setPhone] = useState('');
  const [formData, setFormData] = useState({
    name: "",
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
     if (!isPhoneValid(phone)){
      setStatus({ loading: false, success: false, error: "Numero di telefono non valido" });
      return
     }
    setStatus({ loading: true, success: false, error: "" });

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, phone}),
      });
      console.log(response);
      
      if (!response.ok) {
        const data = await response.json();
        setStatus({ loading: false, success: false, error: data.error });
        return;
      }

      setStatus({ loading: false, success: true, error: "" });
      setPhone('');
      setFormData({ name: "", email: session?.user?.email || "" });

      await update();
    } catch (e) {
      console.error("Form submission error:", e);
      setStatus({ loading: false, success: false, error: "Error" });
    }
  };

  return (
    <div className="bg-[#fffaec] min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4 sm:px-6 md:px-8">
      <Image src="/logo_santinelli.png" alt="Logo" width={200} height={200} className="mb-6" />
      <Card className="w-full max-w-md space-y-8 p-10 rounded-2xl shadow-xl bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl md:text-3xl lg:text-3xl font-bold text-gray-900">Rimaniamo in contatto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="w-full max-w-md">
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
                Numero WhatsApp
              </label>
              <div className="mt-1">
                <PhoneInput
                  defaultCountry="it"
                  value={phone}
                  name="phone"
                  countries={countries}
                  hideDropdown={true}
                  required
                  placeholder="es. +393756593065"
                  onChange={setPhone}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
              </div>
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