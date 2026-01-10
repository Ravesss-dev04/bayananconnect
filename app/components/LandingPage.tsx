"use client";

import { useEffect, useRef } from "react";
import Link from 'next/link';

export default function LandingPage() {
  const typeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Typewriter
    const text = "Real-time GIS mapping • Citizen feedback • Service requests";
    let i = 0;
    
    // Clear initial content
    if(typeRef.current) typeRef.current.textContent = '';

    const type = () => {
      if (typeRef.current && i < text.length) {
        typeRef.current.textContent += text.charAt(i);
        i++;
        setTimeout(type, 80);
      }
    };
    if(typeRef.current) setTimeout(type, 1000);
  }, []);

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* HEADER */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 mb-8">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
             <h2 className="text-xl font-bold tracking-tight text-emerald-900">Bayanan GIS</h2>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-5 py-2.5 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors">
              Log in
            </Link>
            <Link href="/register" className="px-5 py-2.5 text-sm font-medium bg-emerald-600 text-white rounded-full hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5">
              Register
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -z-10 opacity-10 transform translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-200 h-200 text-emerald-400 fill-current">
                <path fill="#10B981" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.4,82.2,23.1,70.8,34.5C59.4,45.9,47.9,55,35.6,63.2C23.3,71.4,10.2,78.7,-2.3,82.7C-14.8,86.7,-26.7,87.4,-38.4,82.2C-50.1,77,-61.6,65.9,-71.2,53.2C-80.8,40.5,-88.4,26.2,-87.3,12C-86.3,-2.2,-76.5,-16.3,-66.9,-29.9C-57.3,-43.5,-47.9,-56.6,-36.2,-65.3C-24.5,-74,-10.6,-78.3,4.6,-86.2C19.7,-94.1,43.2,-105.7,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold tracking-wider mb-6 border border-emerald-100">
               WEB PLATFORM BARANGAY SYSTEM
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
                Empowering Citizens with <br/>
                <span className="text-emerald-600">Geo-Integrated Insights</span>
            </h1>
            <div className="h-8 mb-8 flex justify-center">
                <p ref={typeRef} className="text-xl text-gray-500 border-r-2 border-emerald-400 pr-1 animate-pulse"></p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                <Link href="/login" className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all hover:-translate-y-1 block">
                    Login to Portal
                </Link>
                <a href="#map" className="px-8 py-4 bg-white text-emerald-700 border border-emerald-100 font-semibold rounded-lg hover:bg-emerald-50 transition-all block">
                    View Live Map
                </a>
            </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Capabilities</h2>
                <p className="text-gray-500 text-lg">Modern tools designated to streamline barangay management and citizen engagement.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { icon: "📍", title: "Geo-Pin Reporting", desc: "Pin exact locations for issues with GPS accuracy." },
                    { icon: "⚡", title: "Live Tracking", desc: "Real-time status updates and ETA predictions." },
                    { icon: "💬", title: "Community Voice", desc: "Interactive polls and satisfaction surveys." },
                    { icon: "📊", title: "Smart Analytics", desc: "Data-driven insights for better governance." }
                ].map((feature, i) => (
                    <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="text-4xl mb-6">{feature.icon}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-emerald-900 text-white">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-emerald-800/50">
                  <div>
                      <div className="text-4xl font-bold mb-2">1,245+</div>
                      <div className="text-emerald-200 text-sm">Requests Solved</div>
                  </div>
                  <div>
                      <div className="text-4xl font-bold mb-2">92%</div>
                      <div className="text-emerald-200 text-sm">Resolution Rate</div>
                  </div>
                  <div>
                      <div className="text-4xl font-bold mb-2">4.7</div>
                      <div className="text-emerald-200 text-sm">User Rating</div>
                  </div>
                  <div>
                      <div className="text-4xl font-bold mb-2">24h</div>
                      <div className="text-emerald-200 text-sm">Avg Response</div>
                  </div>
              </div>
          </div>
      </section>

      {/* MAP SECTION PLACEHOLDER */}
      <section id="map" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Live GIS Dashboard</h2>
              <div className="bg-emerald-50 rounded-3xl h-150 w-full flex items-center justify-center border-2 border-dashed border-emerald-200 relative overflow-hidden group">
                  <div className="text-center z-10">
                      <div className="inline-block p-4 rounded-full bg-white shadow-lg mb-4">
                        <span className="text-3xl">🗺️</span>
                      </div>
                      <h3 className="text-lg font-semibold text-emerald-900">Map Visualization Loading...</h3>
                      <p className="text-emerald-600">Interactive markers and heatmaps</p>
                  </div>
                 
                  {/* Fake map patterns */}
                  <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-teal-400 rounded-full blur-3xl"></div>
                  </div>
              </div>
          </div>
      </section>

       {/* FOOTER */}
       <footer className="bg-white border-t border-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <span className="font-bold text-gray-900">Bayanan GIS</span>
                    <span className="text-gray-400 ml-2">© 2026</span>
                </div>
                <div className="flex gap-6 text-gray-500 text-sm">
                    <a href="#" className="hover:text-emerald-600">Privacy</a>
                    <a href="#" className="hover:text-emerald-600">Terms</a>
                    <a href="#" className="hover:text-emerald-600">Contact</a>
                </div>
            </div>
       </footer>
    </div>
  );
}
