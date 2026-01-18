"use client";

import { useState, useEffect } from "react";
import { FaUserEdit, FaCog, FaHistory, FaDownload, FaPhoneAlt, FaClock, FaUniversity, FaSignOutAlt, FaTimes, FaCamera, FaSpinner, FaEye, FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";

interface User {
    id: string;
    fullName: string;
    email: string;
    address: string;
    mobileNumber: string;
    profileImageUrl?: string;
}

interface Request {
    id: string;
    type: string;
    description: string;
    status: string;
    createdAt: string;
    imageUrl?: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Edit Form State
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            setEditName(data.user.fullName);
            setEditImage(data.user.profileImageUrl || null);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const fetchHistory = async () => {
      setLoadingRequests(true);
      try {
          const res = await fetch('/api/requests/list');
          if (res.ok) {
              const data = await res.json();
              setRequests(data.requests);
          }
      } catch (e) {
          console.error(e);
      } finally {
          setLoadingRequests(false);
      }
  };

  const openHistory = () => {
      setShowHistoryModal(true);
      fetchHistory();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setEditImage(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const saveProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      try {
          const res = await fetch('/api/user/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ fullName: editName, profileImageUrl: editImage })
          });
          if (res.ok) {
              const data = await res.json();
              setUser(data.user);
              setShowEditModal(false);
              alert('Profile updated successfully!');
          } else {
              alert('Failed to update profile');
          }
      } catch (error) {
          console.error(error);
          alert('An error occurred');
      } finally {
          setSaving(false);
      }
  };

  const generatePDF = async () => {
      setPdfGenerating(true);
      try {
            // Fetch latest data for PDF
            const res = await fetch('/api/requests/list');
            let dataRequests: Request[] = [];
            if (res.ok) {
                const data = await res.json();
                dataRequests = data.requests;
            }

            const jsPDF = (await import('jspdf')).default;
            const autoTable = (await import('jspdf-autotable')).default;

            const doc = new jsPDF();

            // Header
            doc.setFontSize(20);
            doc.setTextColor(16, 185, 129); // Emerald color
            doc.text('Bayanan Connect - Resident Report', 14, 20);
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
            doc.text(`Resident: ${user?.fullName}`, 14, 35);
            doc.text(`Email: ${user?.email}`, 14, 40);

            // Table Data
            const tableData = dataRequests.map(req => [
                new Date(req.createdAt).toLocaleDateString(),
                req.type,
                req.description,
                req.status
            ]);

            autoTable(doc, {
                startY: 50,
                head: [['Date', 'Type', 'Description', 'Status']],
                body: tableData,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [6, 78, 59] }, // Emerald-900 like
            });

            // Images Page (Optional - simplistic approach)
            const requestsWithImages = dataRequests.filter(r => r.imageUrl);
            if (requestsWithImages.length > 0) {
                 doc.addPage();
                 doc.setFontSize(16);
                 doc.text('Attached Evidence', 14, 20);
                 
                 let y = 30;
                 for (const req of requestsWithImages) {
                     if (y > 250) { doc.addPage(); y = 20; }
                     doc.setFontSize(12);
                     doc.text(`${req.type} - ${new Date(req.createdAt).toLocaleDateString()}`, 14, y);
                     y += 10;
                     try {
                         // This might fail if CORS blocks the image or if it's invalid base64
                         // Basic check for base64
                         if (req.imageUrl?.startsWith('data:image')) {
                            doc.addImage(req.imageUrl, 'JPEG', 14, y, 80, 60);
                            y += 70;
                         } else {
                             // Skip invalid or external URL images due to CORS in client-side JS without proxy
                             doc.setFontSize(10);
                             doc.setTextColor(150);
                             doc.text('[Image included in online dashboard]', 14, y);
                             y += 10;
                         }
                     } catch (e) {
                         console.error('Image add fail', e);
                     }
                 }
            }

            doc.save(`Bayanan_Report_${user?.fullName.replace(/\s+/g, '_')}.pdf`);

      } catch (e) {
          console.error(e);
          alert('Failed to generate PDF');
      } finally {
          setPdfGenerating(false);
      }
  };

  if (loading) return <div className="h-full flex items-center justify-center text-slate-500"><FaSpinner className="animate-spin text-2xl"/></div>;
  if (!user) return <div className="p-6 text-slate-400">User not found.</div>;

  return (
    <div className="h-full overflow-y-auto pb-20 p-6 bg-slate-900 scrollbar-hide animate-fadeIn">
      
      {/* Profile Card */}
      <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 p-8 mb-8 flex flex-col items-center text-center relative overflow-hidden group">
        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-slate-700/50 to-transparent"></div>
        
        <div className="w-32 h-32 rounded-full bg-slate-700 overflow-hidden mb-4 ring-4 ring-slate-600 shadow-2xl relative z-10 group-hover:ring-emerald-500 transition-all duration-500 group-hover:scale-105">
            <img 
                src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.fullName.replace(/\s+/g, "+")}&background=10b981&color=fff&bold=true&size=128`} 
                alt={user.fullName} 
                className="w-full h-full object-cover" 
            />
        </div>
        <h2 className="text-2xl font-bold text-white relative z-10">{user.fullName}</h2>
        <p className="text-slate-400 text-sm mb-3 relative z-10 font-medium">{user.email}</p>
        <div className="relative z-10">
            <span className="text-emerald-400 text-xs font-bold bg-emerald-900/30 border border-emerald-500/30 px-4 py-1.5 rounded-full shadow-sm shadow-emerald-900/20">
                {user.address}
            </span>
        </div>
        <button 
            onClick={() => setShowEditModal(true)}
            className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-slate-900/50 border border-slate-600 rounded-xl text-sm font-bold text-slate-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all duration-300 relative z-10 hover:shadow-lg hover:shadow-emerald-900/20"
        >
            <FaUserEdit /> Edit Profile
        </button>
      </div>

      {/* Settings & Activity */}
      <div className="grid gap-4 mb-8">
        <h3 className="text-xs font-bold text-slate-500 uppercase px-1 tracking-wider">Account Settings</h3>
        
        <button 
            onClick={openHistory}
            className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all group shadow-sm"
        >
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-slate-900 text-blue-400 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors border border-slate-700 group-hover:border-blue-500"><FaHistory /></div>
                <div className="text-left">
                    <span className="block font-medium text-slate-200 group-hover:text-white">Activity History</span>
                    <span className="text-xs text-slate-500">View past requests</span>
                </div>
            </div>
             <FaArrowRight className="text-slate-600 group-hover:text-white transition-colors" size={12}/>
        </button>
        
        <button 
            onClick={generatePDF}
            disabled={pdfGenerating}
            className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all group shadow-sm disabled:opacity-50"
        >
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-slate-900 text-emerald-400 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors border border-slate-700 group-hover:border-emerald-500"><FaDownload /></div>
                <div className="text-left">
                    <span className="block font-medium text-slate-200 group-hover:text-white">
                        {pdfGenerating ? 'Generating...' : 'Download Reports (PDF)'}
                    </span>
                    <span className="text-xs text-slate-500">Export requests & images</span>
                </div>
            </div>
             <FaArrowRight className="text-slate-600 group-hover:text-white transition-colors" size={12}/>
        </button>
        
        <button className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-purple-500/50 hover:bg-slate-700/50 transition-all group shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-slate-900 text-purple-400 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors border border-slate-700 group-hover:border-purple-500"><FaCog /></div>
                <div className="text-left">
                     <span className="block font-medium text-slate-200 group-hover:text-white">Notification Settings</span>
                     <span className="text-xs text-slate-500">Email, SMS</span>
                </div>
            </div>
        </button>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl p-6 animate-scaleIn">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">Edit Profile</h3>
                    <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white"><FaTimes/></button>
                </div>
                <form onSubmit={saveProfile} className="space-y-4">
                    <div className="flex flex-col items-center mb-4">
                         <div className="w-24 h-24 rounded-full bg-slate-700 relative overflow-hidden mb-2 group cursor-pointer border-2 border-slate-600 hover:border-emerald-500 transition-colors">
                            <img 
                                src={editImage || `https://ui-avatars.com/api/?name=${editName.replace(/\s+/g, "+")}&background=10b981&color=fff&bold=true`} 
                                className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <FaCamera className="text-white"/>
                            </div>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer"/>
                         </div>
                         <p className="text-xs text-slate-500">Click to change avatar</p>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Full Name</label>
                        <input 
                            type="text" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                            placeholder="Enter your name"
                        />
                    </div>

                    <button disabled={saving} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* Activity History Modal */}
      {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
              <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl animate-scaleIn">
                   <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                      <h3 className="font-bold text-white flex items-center gap-2"><FaHistory className="text-blue-400"/> Activity History</h3>
                      <button onClick={() => setShowHistoryModal(false)} className="bg-slate-700 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-600"><FaTimes/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                      {loadingRequests ? (
                          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
                              <FaSpinner className="animate-spin text-2xl"/>
                              <span>Loading history...</span>
                          </div>
                      ) : requests.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-slate-500">
                              <FaHistory className="text-4xl mb-2 opacity-20"/>
                              <p>No activity recorded yet.</p>
                          </div>
                      ) : (
                          <div className="space-y-3">
                              {requests.map((req, i) => (
                                  <div key={req.id} className="bg-slate-700/30 border border-slate-700/50 p-4 rounded-xl flex justify-between items-start hover:border-slate-600 transition-colors group">
                                      <div className="flex items-start gap-4">
                                          <div className={`mt-1 p-2 rounded-lg ${
                                              req.status === 'Resolved' || req.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                              req.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' :
                                              'bg-amber-500/10 text-amber-400'
                                          }`}>
                                              {req.status === 'Resolved' || req.status === 'Completed' ? <FaCheckCircle/> : <FaClock/>}
                                          </div>
                                          <div>
                                              <h4 className="font-bold text-slate-200">{req.type}</h4>
                                              <p className="text-sm text-slate-400 line-clamp-2">{req.description}</p>
                                              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                                  <span className="flex items-center gap-1"><FaCalendarAlt/> {new Date(req.createdAt).toDateString()}</span>
                                                  {req.imageUrl && <span className="flex items-center gap-1 text-emerald-500"><FaCamera/> Has Image</span>}
                                              </div>
                                          </div>
                                      </div>
                                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                                          req.status === 'Resolved' || req.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                          req.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                      }`}>
                                          {req.status}
                                      </span>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}

// Helper icons
const FaArrowRight = ({className, size}: any) => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className={className} height={size} width={size} xmlns="http://www.w3.org/2000/svg"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>;

import { FaCheckCircle } from "react-icons/fa";

