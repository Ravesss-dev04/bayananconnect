"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaMapMarkedAlt } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);



  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/resident');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        router.push('/resident');
      } else {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Test credentials button
  const useTestCredentials = () => {
    setEmail("resident@bayanan.gov");
    setPassword("resident123");
  };
  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  
  // Don't render login form if user is already logged in

  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full text-emerald-500 fill-current" xmlns="http://www.w3.org/2000/svg">
            <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
        </svg>
      </div>
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 transform transition-all hover:shadow-2xl">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4 text-emerald-600 shadow-inner">
            <FaMapMarkedAlt className="text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Resident Portal</h1>
          <p className="text-sm text-emerald-600 font-medium mt-1">Barangay Bayanan GIS Platform</p>
          
          {/* Test Credentials Button */}
          <button
            onClick={useTestCredentials}
            className="mt-4 text-xs text-emerald-600 hover:text-emerald-800 underline"
            type="button"
          >
            Use Test Credentials
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Email Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaUser className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium placeholder:text-gray-400"
            />
          </div>
          
          {/* Password Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaLock className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-emerald-600 transition-colors"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center cursor-pointer text-gray-600 hover:text-gray-800">
              <input type="checkbox" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 transition-colors mr-2 accent-emerald-600" />
              Remember me
            </label>
            <a href="#" className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-emerald-200 transform transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'ENTER BAYANAN'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 space-y-2">
          <p>
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-emerald-600 hover:text-emerald-800 transition-colors">
              Register Now
            </Link>
          </p>
          <div className="border-t border-gray-100 pt-3 mt-3">
             <Link href="/admin/login" className="text-xs font-semibold text-gray-400 hover:text-emerald-600 transition-colors uppercase tracking-wide">
                Official Access
             </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative footer text */}
      <div className="absolute bottom-6 text-xs text-gray-400 text-center w-full">
        &copy; 2026 Barangay Bayanan Data Systems. All rights reserved.
      </div>
    </div>
  );
}