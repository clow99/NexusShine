import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import { prisma } from "./prisma";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "database",
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
                return {
                    id: profile.sub,
                    email: profile.email,
                    username: profile.email?.split("@")[0] ?? profile.name,
                    name: profile.name,
                    emailVerified: profile.email_verified ? new Date() : null,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
                session.user.username = user.username;
                session.user.emailVerified = user.emailVerified;
                session.user.isAdmin = user.isAdmin === 1;
                session.user.active = user.active === 1;
            }
            return session;
        },
        async signIn({ user }) {
            // Block inactive users
            return user.active !== 0;
        },
    },
    events: {
        async createUser({ user }) {
            const userCount = await prisma.user.count();
            if (userCount === 1) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { isAdmin: 1 },
                });
            }
        },
    },
    pages: {
        signIn: "/login",
    },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
