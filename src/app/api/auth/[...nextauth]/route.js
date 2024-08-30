import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoDB";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        mobileNo: { label: "Mobile Number", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize function called with credentials:", credentials);
        
        try {
          await dbConnect();
          const user = await User.findOne({ phone: credentials.mobileNo });
          console.log("User found:", user);

          if (!user) {
            console.log("No user found with this mobile number");
            throw new Error("No account found for this mobile number.");
          }

          console.log("Hashed password in database:", user.password);

          //const isValid = await bcrypt.compare(credentials.password, user.password);
          //console.log("Password valid:", isValid);

          if (credentials.password === user.password) {
            console.log("Returning user object:", { id: user._id, name: user.name, email: user.email, mobileNo: user.phone });
            return { id: user._id.toString(), name: user.name, email: user.email, mobileNo: user.phone };
          } else {
            console.log("Invalid password");
            throw new Error("Invalid password.");
          }
        } catch (error) {
          console.error("Error in authorize function:", error);
          throw new Error(error.message || "Authentication failed.");
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; 
      }
      return token;
    },
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/',
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };