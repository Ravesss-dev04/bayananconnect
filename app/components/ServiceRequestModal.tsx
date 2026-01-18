"use client";

import { useState, useRef, useEffect } from "react";
import { FaTimes, FaCamera, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";

type ServiceRequestModalProps = {
  onClose: () => void;
  onSuccess?: () => void;
  location: { lat: number; lng: number } | null;
};

export default function ServiceRequestModal({ onClose, onSuccess, location }: ServiceRequestModalProps) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [otherType, setOtherType] = useState(""); // For manual input if "Other"
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Exact options requested by user
  const issueTypes = [
    "Garbage Collection", 
    "Pothole", 
    "Illegal Dumping", 
    "Noise Complaint", 
    "Other"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalType = type === "Other" ? otherType : type;
    
    // Default to Bayanan center or 0 if no location
    const finalLat = location?.lat || 14.4081;
    const finalLng = location?.lng || 121.0415;

    try {
        const res = await fetch("/api/requests/create", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                type: finalType,
                description: description,
                latitude: finalLat,
                longitude: finalLng,
                imageUrl: imagePreview, 
            })
        });

        if (res.ok) {
            setStep(3); // Success state
            setTimeout(() => {
                // If onSuccess is provided, call it to redirect/refresh
                if (onSuccess) {
                    onSuccess();
                } else {
                    onClose();
                }
            }, 2000);
        } else {
            alert("Failed to submit report. Please try again.");
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred.");
    } finally {
        setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-zoom-in">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Report an Issue</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><FaTimes /></button>
        </div>

        <div className="p-6">
            {step === 1 && (
                <div className="space-y-4">
                    <p className="text-gray-600 mb-4">What kind of problem are you seeing?</p>
                    <div className="grid grid-cols-2 gap-3">
                        {issueTypes.map(t => (
                            <button
                                key={t}
                                onClick={() => { setType(t); setStep(2); }}
                                className="p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 text-left transition-all text-sm font-medium text-gray-700 hover:text-emerald-700"
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium inline-block mb-2">
                        Reporting: {type}
                    </div>

                    { type === "Other" && (
                         <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Specify Problem</label>
                            <input 
                                type="text"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="E.g. Broken bench, graffiti..."
                                value={otherType}
                                onChange={(e) => setOtherType(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {/* Location */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
                        <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-700 items-center gap-2">
                            <FaMapMarkerAlt className="text-red-500" />
                            <span className="flex-1 truncate">
                                {location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : "Position not set (Will use default/current)"}
                            </span>
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Photo Evidence</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed ${imagePreview ? "border-emerald-500 bg-emerald-50" : "border-gray-300"} rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors cursor-pointer relative overflow-hidden`}
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                                    <div className="z-10 bg-white/80 p-2 rounded-full shadow-sm">
                                        <FaCamera className="text-2xl text-emerald-600" />
                                    </div>
                                    <span className="z-10 text-xs font-bold text-emerald-700 mt-2 bg-white/80 px-2 py-0.5 rounded">Change Photo</span>
                                </>
                            ) : (
                                <>
                                    <FaCamera className="text-2xl mb-2" />
                                    <span className="text-sm">Tap to take photo or upload</span>
                                </>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                        <textarea 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-800"
                            rows={3}
                            placeholder="Describe the issue in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Back</button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-transform active:scale-95 flex justify-center items-center gap-2"
                        >
                            {loading && <FaSpinner className="animate-spin" />}
                            Submit Report
                        </button>
                    </div>
                </form>
            )}

            {step === 3 && (
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Report Submitted!</h3>
                    <p className="text-gray-500 mt-2">Your Request ID is <span className="font-mono font-bold text-gray-800">#NEW</span></p>
                    <p className="text-sm text-gray-400 mt-1">We will notify you of updates.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
