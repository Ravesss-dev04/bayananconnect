"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserShield, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { demoAccounts } from "@/lib/mockData";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const account = demoAccounts.find(
      (acc) => acc.email === email && acc.password === password && acc.role === 'admin'
    );

    if (account) {
      router.push('/admin');
    } else {
      setError("Authorization invalid. Please check your admin credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
         <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-2xl mb-4 text-emerald-500 shadow-inner border border-slate-600">
            <FaUserShield className="text-3xl" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">COMMAND CENTER</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 text-red-200 text-xs text-center rounded border border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
             <label className="text-xs font-bold text-slate-500 uppercase ml-1">Admin ID</label>
             <input
              type="email"
              placeholder="admin@bayanan.gov"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-1">
             <label className="text-xs font-bold text-slate-500 uppercase ml-1">Security Code</label>
             <div className="relative">
                <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-600 pr-10"
                />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-500 hover:text-white transition-colors"
                >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
             </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-emerald-900/50 transform transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? (
                <span className="flex items-center gap-2 text-sm">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg> 
                    Authenticating...
                </span>
            ) : 'ACCESS SYSTEM'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-[10px] text-slate-500">
                Authorized use only. All activities are monitored and logged. <br/>
                System Version 2.4.0 (Build 2026.01.10)
            </p>
        </div>

      </div>
    </div>
  );
}
