"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { FaMapMarkedAlt, FaBullhorn, FaClipboardCheck, FaUsers, FaArrowRight, FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function LandingPage() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Real-time GIS analytics • Interactive resident polls • Efficient request tracking";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
        if (index <= fullText.length) {
            setDisplayText(fullText.slice(0, index));
            index++;
        } else {
            clearInterval(interval);
        }
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="bg-white text-gray-800 font-sans selection:bg-emerald-500/30">
      {/* HEADER */}

      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100 transition-all duration-300">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20">B</div>
             <h2 className="text-xl font-bold tracking-tight text-slate-800">Bayanan GIS</h2>
          </div>
          <div className="flex gap-2 md:gap-3">
            <Link href="/login" className="px-3 md:px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-2">
              <FaSignInAlt className="text-xs"/> Log In
            </Link>
            <Link href="/register" className="px-3 md:px-5 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10">
              <FaUserPlus className="text-xs"/> Register
            </Link>
          </div>
        </nav>
      </header>
      {/* HERO */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Animated Background blobs */}
        <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4">
            <div className="w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-emerald-100/40 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/3 translate-y-1/4">
             <div className="w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-100/40 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-emerald-50 border border-emerald-100 mb-8 animate-fadeInUp">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-emerald-700 text-xs font-bold tracking-wide uppercase">Official Wen Barangay Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1] animate-fadeInUp delay-100">
                Empowering Citizens with<br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">Geo-Integrated Insights</span>
            </h1>
            
            <div className="min-h-[5rem] px-4 mb-2 md:mb-10 flex justify-center items-center animate-fadeInUp delay-200">
                <p className="text-lg md:text-xl text-slate-500 font-medium text-center leading-relaxed">
                    {displayText}
                    <span className="inline-block w-0.5 h-5 bg-slate-400 animate-pulse ml-1 align-middle"></span>
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4 md:mt-8 animate-fadeInUp delay-300 px-4 sm:px-0">
                <Link href="/login" className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group w-full sm:w-auto">
                    Get Started <FaArrowRight className="group-hover:translate-x-1 transition-transform"/>
                </Link>
                <a href="#features" className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-100 font-bold rounded-xl hover:border-emerald-200 hover:text-emerald-700 transition-all block w-full sm:w-auto">
                    Explore Features
                </a>
            </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 animate-on-scroll">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Core Capabilities</h2>
                <p className="text-slate-500 text-lg leading-relaxed">Everything you need to report issues, monitor progress, and participate in community decision-making.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { 
                        icon: FaMapMarkedAlt, 
                        color: "text-blue-500", 
                        bg: "bg-blue-50",
                        title: "Interactive GIS Map", 
                        desc: "Visualize community data, public services, and ongoing projects on a live, interactive map." 
                    },
                    { 
                        icon: FaClipboardCheck, 
                        color: "text-emerald-500", 
                        bg: "bg-emerald-50",
                        title: "Issue Reporting", 
                        desc: "Easily report concerns like uncollected garbage or potholes with precise location tracking." 
                    },
                    { 
                        icon: FaUsers, 
                        color: "text-violet-500", 
                        bg: "bg-violet-50",
                        title: "Community Board", 
                        desc: "Participate in local polls, share feedback, and voice your opinion on barangay matters." 
                    },
                    { 
                        icon: FaBullhorn, 
                        color: "text-amber-500", 
                        bg: "bg-amber-50",
                        title: "Real-time Updates", 
                        desc: "Track the status of your requests from submission to resolution with instant notifications." 
                    }
                ].map((feature, i) => (
                    <div key={i} className="group bg-slate-50/50 p-8 rounded-3xl border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300">
                        <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                            <feature.icon />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                        <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          {/* Decorative lines */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#10B981 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                  {[
                      { num: "24/7", label: "System Availability" },
                      { num: "100%", label: "Secure Data" },
                      { num: "Fast", label: "Response Time" },
                      { num: "500+", label: "Active Residents" }
                  ].map((stat, i) => (
                      <div key={i} className="space-y-2">
                          <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-200">
                              {stat.num}
                          </div>
                          <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-gradient-to-b from-white to-emerald-50/50">
          <div className="max-w-5xl mx-auto px-6 text-center">
             <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-emerald-900/5 border border-emerald-100 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600"></div>
                 <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Ready to make a difference?</h2>
                 <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto">Join thousands of residents who are already contributing to a cleaner, safer, and more connected community.</p>
                 <div className="flex flex-col sm:flex-row justify-center gap-4">
                     <Link href="/register" className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:-translate-y-1 w-full sm:w-auto">
                         Create an Account
                     </Link>
                     <Link href="/login" className="px-10 py-4 bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 font-bold rounded-xl transition-all w-full sm:w-auto">
                         Already a Member?
                     </Link>
                 </div>
             </div>
          </div>
      </section>

       {/* FOOTER */}
       <footer className="bg-white border-t border-slate-100 py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">B</div>
                     <span className="font-bold text-slate-900">Bayanan GIS</span>
                     <span className="text-slate-400 text-sm ml-2">© 2026</span>
                </div>
                <div className="flex gap-8 text-slate-500 text-sm font-medium">
                    <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-emerald-600 transition-colors">Contact Support</a>
                </div>
            </div>
       </footer>
    </div>
  );
}
