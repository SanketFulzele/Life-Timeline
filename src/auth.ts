import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export function isOwnerEmail(email: string | null | undefined) {
  const owner = process.env.OWNER_EMAIL?.trim().toLowerCase();
  return !!owner && !!email && email.trim().toLowerCase() === owner;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    // Only the owner's Google account is allowed to sign in at all.
    signIn({ profile }) {
      return profile?.email_verified === true && isOwnerEmail(profile.email);
    },
  },
});
