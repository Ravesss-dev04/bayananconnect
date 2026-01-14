"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FaUser, 
  FaLock, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaFileUpload,
  FaCheckCircle 
} from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/resident');
    }
  }, [user, authLoading, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const address = formData.get('address') as string;
    const email = formData.get('email') as string;
    const mobileNumber = formData.get('mobileNumber') as string;
    const password = formData.get('password') as string;

    try {
      const registrationData = {
        fullName,
        address,
        email,
        mobileNumber,
        password,
        residencyProofUrl: previewUrl || null
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render register form if user is already logged in
  if (user) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-3xl text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your resident account has been created. You can now login to access Barangay Bayanan services.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Redirecting to login page in 3 seconds...
            </p>
            <Link href="/login" className="block w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                Go to Login Now
            </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the Barangay Bayanan Digital Community
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            
            {/* Full Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                name="fullName"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>

            {/* Address */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-gray-400" />
              </div>
              <input
                name="address"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Address in Brgy. Bayanan"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Email Address"
              />
            </div>

            {/* Mobile */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                </div>
                <input
                    name="mobileNumber"
                    type="tel"
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                    placeholder="Mobile Number"
                />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Create Password (min. 8 characters)"
              />
            </div>

            {/* Upload Proof of Residency */}
            <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proof of Residency (Optional)
                </label>
                
                {previewUrl && (
                  <div className="mb-3">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Selected: {selectedFile?.name}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-emerald-500 transition-colors cursor-pointer group">
                    <div className="space-y-1 text-center">
                        <FaFileUpload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-emerald-500" />
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                                <span>Upload a file</span>
                                <input 
                                  id="file-upload" 
                                  name="file-upload" 
                                  type="file" 
                                  className="sr-only"
                                  accept=".jpg,.jpeg,.png,.pdf"
                                  onChange={handleFileChange}
                                />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                            PNG, JPG, PDF up to 10MB
                        </p>
                    </div>
                </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
        
        <div className="text-center">
            <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                    Sign in
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}