"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/home" className="text-2xl font-extrabold tracking-wide">
          Money Gift Manager
        </Link>
        {status === "authenticated" ? (
          <div className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-blue-400 text-lg font-semibold hover:text-blue-500 "
            >
              Dashboard
            </Link>
            <Link
              href="/events"
              className="text-blue-400 text-lg font-semibold hover:text-blue-500"
            >
              Events
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
