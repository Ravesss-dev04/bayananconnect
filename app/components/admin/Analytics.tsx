"use client";

export default function Analytics() {
    return (
        <div className="grid lg:grid-cols-2 gap-6 animate-fadeIn">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                 <h3 className="font-bold text-lg text-white mb-6">Request Distribution</h3>
                 <div className="h-64 flex items-end justify-around gap-4 px-4 pb-4 border-b border-slate-700">
                     {[40, 70, 30, 85, 50].map((h, i) => (
                         <div key={i} className="w-full bg-emerald-600/20 rounded-t-lg relative group">
                             <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg transition-all group-hover:bg-emerald-400"></div>
                         </div>
                     ))}
                 </div>
                 <div className="flex justify-between text-xs text-slate-400 mt-2">
                     <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                 </div>
            </div>
    
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-center justify-center">
                 <h3 className="font-bold text-lg text-white mb-6 w-full text-left">Incident Types</h3>
                 <div className="relative w-64 h-64 rounded-full border-8 border-slate-700 flex items-center justify-center">
                     <div className="absolute inset-0 rounded-full border-8 border-emerald-500 border-r-transparent rotate-45"></div>
                     <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-l-transparent border-t-transparent -rotate-12"></div>
                     <div className="text-center">
                         <p className="text-3xl font-bold text-white">842</p>
                         <p className="text-xs text-slate-400">Total Incidents</p>
                     </div>
                 </div>
            </div>
        </div>
    );
}
