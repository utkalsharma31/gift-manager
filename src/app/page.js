"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    city: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isLogin) {
      // Login flow
      console.log("Attempting to sign in with:", formData);
      const result = await signIn("credentials", {
        redirect: false,
        mobileNo: formData.phone,
        password: formData.password,
      });

      console.log("Sign in result:", result);

      if (result.error) {
        console.error("Login in error:", result.error);
        setError("Invalid credentials, please try again.");
      } else {
        console.log("Logged in successfull.");
        // Refresh session after successful login
        const session = await getSession();
        console.log("Session after login:", session);

        if (session) {
          router.push("/home"); // Redirect to dashboard only if session exists
        } else {
          console.log("Session is still null");
        }
      }
    } else {
      // Sign-up flow
      try {
        const response = await fetch("/api/user/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        console.log("Response from server:", response);

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Error response text:", errorData);
          setError(errorData.message || "Sign-up failed, please try again.");
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("User signed up successfully:", result);

        // Check if the guest is invited to any events
        // const guestResponse = await fetch(`/api/events/guest/${formData.email}/${formData.phone}`);
        // const guestEvents = await guestResponse.json();

        // if (guestEvents && guestEvents.length > 0) {
        //   console.log("Guest is invited to events:", guestEvents);
        // }

        
        setIsLogin(true);
      } catch (error) {
        console.error("Sign-up error:", error);
        setError("An error occurred during sign-up, please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                name="name"
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full p-2 border rounded"
              />
              <input
                name="email"
                onChange={handleChange}
                placeholder="Email"
                required
                type="email"
                className="w-full p-2 border rounded"
              />
              <input
                name="city"
                onChange={handleChange}
                placeholder="City"
                required
                className="w-full p-2 border rounded"
              />
            </>
          )}
          <input
            name="phone"
            onChange={handleChange}
            placeholder="Mobile Number"
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="password"
            onChange={handleChange}
            placeholder="Password"
            required
            type="password"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
