"use client";

import { useState } from "react";
import { FaTimes, FaCamera, FaMapMarkerAlt } from "react-icons/fa";

export default function ServiceRequestModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("");
  
  const issueTypes = [
    "Garbage Collection", "Streetlight not working", "Pothole", "Clogged Drainage", 
    "Illegal Dumping", "Stray Animals", "Noise Complaint", "Other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Success state
    setTimeout(() => {
        onClose();
    }, 2000);
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

                    {/* Location */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
                        <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-700 items-center gap-2">
                            <FaMapMarkerAlt className="text-red-500" />
                            <span className="flex-1 truncate">Near Block 5, Lot 2 (Auto-detected)</span>
                            <button type="button" className="text-xs text-blue-600 hover:underline">Edit</button>
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Photo Evidence</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors cursor-pointer">
                            <FaCamera className="text-2xl mb-2" />
                            <span className="text-sm">Tap to take photo or upload</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                        <textarea 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            rows={3}
                            placeholder="Describe the issue in detail..."
                            required
                        ></textarea>
                    </div>

                    {/* Urgency */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Urgency</label>
                        <div className="flex gap-2">
                            {['Low', 'Medium', 'High'].map(u => (
                                <label key={u} className="flex-1 cursor-pointer">
                                    <input type="radio" name="urgency" className="peer sr-only" />
                                    <div className="text-center py-2 rounded-lg border border-gray-200 text-sm peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:border-emerald-600 transition-all hover:bg-gray-50">
                                        {u}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Back</button>
                        <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-transform active:scale-95">Submit Report</button>
                    </div>
                </form>
            )}

            {step === 3 && (
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Report Submitted!</h3>
                    <p className="text-gray-500 mt-2">Your Request ID is <span className="font-mono font-bold text-gray-800">#BRG-00125</span></p>
                    <p className="text-sm text-gray-400 mt-1">We'll notify you of updates.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
