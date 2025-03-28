import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Define the type for the redirect callback parameters
interface RedirectCallbackParams {
  baseUrl: string;
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async redirect({ baseUrl }: RedirectCallbackParams) {
      // Redirect to dashboard after sign in
      return `${baseUrl}`;
    },
  },
  pages: {
    signIn: '/auth/signin',
    // error: '/auth/error', // Error code passed in query string as ?error=
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

