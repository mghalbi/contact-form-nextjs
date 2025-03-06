import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Import from shared auth config

const handler = NextAuth(authOptions);

// Correctly wrap NextAuth for App Router
export { handler as GET, handler as POST };
