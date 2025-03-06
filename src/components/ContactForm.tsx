"use client"

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useSession } from "next-auth/react";


const ContactForm = () => {
  
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: {}
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });
  
  // Set email from session when component loads or session changes
  useEffect(() => {
    if (session?.user?.email) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || ''
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response
        setStatus({ loading: false, success: false, error: data.error   });
        return
      }
      
      setStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', phone: '', email: '' });
    } catch (e) {
      console.error('Form submission error:', e);
      setStatus({ loading: false, success: false, error: 'Error'  });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
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
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>

          {status.success && (
            <div className="p-4 bg-green-100 text-green-700 rounded-md">
              Thank you! Your information has been submitted successfully.
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
  );
};

export default ContactForm;