"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserShield, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("admin@bayanan.gov");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin');
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Quick test button - uses default credentials
  const useDefaultCredentials = () => {
    setEmail("admin@bayanan.gov");
    setPassword("admin123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-sm bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-2xl mb-4">
            <FaUserShield className="text-3xl text-emerald-500" />
          </div>
          <h1 className="text-xl font-bold text-white">ADMIN ACCESS</h1>
          <p className="text-sm text-slate-400 mt-2">Enter any credentials for first-time setup</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 text-red-200 text-sm text-center rounded border border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter any email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter any password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={useDefaultCredentials}
              className="text-sm text-emerald-500 hover:text-emerald-400"
            >
         
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg mt-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? 'LOGGING IN...' : 'ENTER ADMIN PANEL'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
         
          
        </div>
      </div>
    </div>
  );
}