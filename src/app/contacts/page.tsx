import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ContactForm from "@/components/ContactForm";

export default async function AddContactPage() {
  const user = await getCurrentUser();
  
  // If not logged in, redirect to sign in
  if (!user) {
    redirect("/auth/signin");
  }
  
  return (
    <div >
      <ContactForm />
    </div>
  );
}
