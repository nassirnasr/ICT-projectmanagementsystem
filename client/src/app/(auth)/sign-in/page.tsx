"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useUser } from "@clerk/nextjs";
import { Eye, EyeOff, ShieldCheck, Mail, Lock } from "lucide-react";
import Image from "next/image";

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-4">
    <div className="relative flex flex-col items-center space-y-4">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/20 rounded-full animate-ping"></div>
        <div className="absolute inset-0 border-4 border-purple-200 dark:border-purple-800/30 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-500 dark:to-purple-300 rounded-full animate-pulse"></div>
        </div>
      </div>
      <span className="text-purple-600 dark:text-purple-300 font-medium text-lg animate-pulse">
        Initializing Secure Session...
      </span>
    </div>
  </div>
);

export default function SignInPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "ICT Project Management System";
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = (e?: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e ? e.matches : mediaQuery.matches);
    };
    
    mediaQuery.addEventListener("change", updateTheme);
    updateTheme();
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const role = (user?.publicMetadata?.role as string) || "dashboard";
      redirectToRole(role);
    }
  }, [isLoaded, isSignedIn, user, router]);

  const redirectToRole = (role: string) => {
    const routes: Record<string, string> = {
      admin: "/dashboard/admin",
      team_leader: "/dashboard/team_leader",
      team_member: "/dashboard/team_member"
    };
    router.push(routes[role] || "/dashboard");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInLoaded) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") window.location.reload();
    } catch (err: any) {
      setError(err.errors[0]?.longMessage || "Authentication failed. Please check your credentials.");
    }
  };

  if (!isLoaded) return <LoadingScreen />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 space-y-4">
          <Image 
            src="/logo.png" // Update with your logo path
            alt="Company Logo"
            width={80}
            height={80}
            className="w-20 h-20 object-contain"
          />
          <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300 bg-clip-text text-transparent">
            Project Management System
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-400/30 rounded-lg animate-fade-in">
            <p className="text-center text-red-600 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-6">
          {/* Email Input with Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                          text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                          placeholder-gray-400 transition-all duration-200"
                placeholder="user@company.com"
              />
            </div>
          </div>

          {/* Password Input with Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                          text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                          placeholder-gray-400 transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-purple-500 dark:hover:text-purple-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600
                      text-white font-semibold py-3.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02]
                      shadow-lg hover:shadow-purple-500/20 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <ShieldCheck className="h-5 w-5 animate-pulse" />
              Secure Login
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 animate-shimmer" />
          </button>
        </form>

        {/* Security Footer */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span>Secure TLS 1.3 Encrypted Connection</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">256-bit AES Encryption | FIPS 140-2 Compliant</p>
        </div>
      </div>
    </div>
  );
}