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
    async jwt({ token, user }: { token: any; user?: { id: string } }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: { id?: string } }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
    async redirect({ baseUrl }: RedirectCallbackParams) {
      // Redirect to dashboard after sign in
      return `${baseUrl}`;
    },
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
