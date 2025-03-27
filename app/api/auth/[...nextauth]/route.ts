// eslint-disable-next-line @typescript-eslint/no-explicit-any
import NextAuth from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connect from "@/utils/db";

export const authOptions: any = {
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any) {
        await connect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
          return null;
        } catch (err: any) {
          throw new Error(err);
        }
      },

    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: '/login',
  },

  callbacks: {
    async signIn({ user, account, profile }: { profile: any, user: AuthUser; account: Account }) {

      if (account?.provider == "credentials") {
        return true;
      }
      if (account.provider === "github" || account.provider === "google") {
        await connect(); // db연결
        try {
          const existingUser = await User.findOne({ email: user.email, provider: account.provider });
          if (!existingUser) { // user가 없으면
            const newUser = new User({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account.provider,
            });
            await newUser.save(); // user 생성
          }

          return true;
        } catch (err) {
          console.log("Error saving user", err);
          return false;
        }
      }
      return false;

    },
    async jwt({ token, user, trigger, session, profile }: { token: any; user?: any; trigger: string; session: any, profile: any }) {

      if (trigger === 'update' && session?.user) {  // 세션이 업데이트 될 때마다 실행
        // console.log("Session User----", session.user);
        return { ...token, ...session.user };
      }
      if (user) { // 로그인할 때마다 실행
        token.role = user.role || 'user'; // user의 role을 token에 추가
        token.image = user.image || profile?.avatar_url; // user의 image를 token에 추가
        if (!user._id) {
          connect();
          const userId = await User.findOne({ email: user.email });
          token._id = userId?._id; // user의 _id를 token에 추가
        } else {
          token._id = user._id; // user의 _id를 token에 추가
        }
        return token;
      }
      return token; //  페이지를 새로고침할 때마다 실행
    },
    async session({ session, token }: { session: any; token: any, }) { //사용자가 로그인 후 세션을  처음 요청 할 떄 , 페이지를 새로고침 할 때, 세션을 확인 할 때, getSession을 호출 할 때
      session.user = { ...token };
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };