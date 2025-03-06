import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after sign in
      return `${baseUrl}/contacts`;
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