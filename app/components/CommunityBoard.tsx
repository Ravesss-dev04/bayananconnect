"use client";

import { useState, useEffect } from "react";
import { FaBullhorn, FaPoll, FaStar, FaCommentDots, FaSpinner, FaCheckCircle } from "react-icons/fa";

export default function CommunityBoard() {
  const [activeTab, setActiveTab] = useState<'feedback' | 'polls'>('feedback');
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [pollsList, setPollsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Feedback Form State
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackRating, setFeedbackRating] = useState("5");
  const [submitting, setSubmitting] = useState(false);

  // Polls State
  const [voting, setVoting] = useState<string | null>(null);

  const fetchData = async () => {
    try {
        const [feedbackRes, pollsRes] = await Promise.all([
            fetch('/api/feedback'),
            fetch('/api/polls')
        ]);

        if (feedbackRes.ok) {
            const data = await feedbackRes.json();
            setFeedbackList(data.feedback);
        }
        if (pollsRes.ok) {
            const data = await pollsRes.json();
            setPollsList(data.polls);
        }
    } catch (e) {
        console.error("Error fetching community data", e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Poll every 15s to reduce flicker/load
    return () => clearInterval(interval);
  }, []);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!feedbackContent) return;
      setSubmitting(true);
      try {
          const res = await fetch('/api/feedback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: feedbackContent, rating: feedbackRating })
          });
          if (res.ok) {
              setFeedbackContent("");
              fetchData(); // Refresh immediately
          }
      } catch (e) {
          console.error(e);
      } finally {
          setSubmitting(false);
      }
  };

  const handleVote = async (pollId: string, optionIndex: number) => {
      setVoting(pollId);
      try {
          const res = await fetch('/api/polls/vote', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pollId, optionIndex })
          });
          if (res.ok) {
              fetchData();
          } else {
              alert("You may have already voted or poll is inactive.");
          }
      } catch (e) {
          console.error(e);
      } finally {
        setVoting(null);
      }
  };

  if (loading && feedbackList.length === 0 && pollsList.length === 0) {
       return <div className="p-8 text-center text-slate-500 font-medium h-full flex items-center justify-center"><FaSpinner className="animate-spin inline mr-2 text-emerald-500"/> Loading community data...</div>;
  }

  return (
    <div className="h-full overflow-y-auto pb-20 p-6 bg-slate-900 scrollbar-hide space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-200 tracking-tight">Community Board</h2>
        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button 
                onClick={() => setActiveTab('feedback')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'feedback' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
                Feedback
            </button>
             <button 
                onClick={() => setActiveTab('polls')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'polls' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
                Active Polls
            </button>
        </div>
      </div>

      {activeTab === 'feedback' ? (
          <div className="space-y-6 animate-fadeIn">
                {/* Give Feedback Section */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden ring-1 ring-emerald-500/50">
                    <div className="relative z-10 max-w-lg">
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FaStar className="text-yellow-300"/> How are we doing?</h3>
                        <p className="text-emerald-50 text-sm mb-4">Share your thoughts to help us improve Barangay services.</p>
                        
                        <form onSubmit={handleSubmitFeedback} className="space-y-3">
                            <textarea 
                                value={feedbackContent}
                                onChange={(e) => setFeedbackContent(e.target.value)}
                                placeholder="Write your feedback here..."
                                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-sm text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all resize-none h-20"
                            />
                            <div className="flex items-center gap-2">
                                <select 
                                    value={feedbackRating}
                                    onChange={(e) => setFeedbackRating(e.target.value)}
                                    className="bg-emerald-800/50 border border-white/20 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
                                >
                                    <option value="5">★★★★★ Excellent</option>
                                    <option value="4">★★★★☆ Good</option>
                                    <option value="3">★★★☆☆ Fair</option>
                                    <option value="2">★★☆☆☆ Poor</option>
                                    <option value="1">★☆☆☆☆ Terrible</option>
                                </select>
                                <button 
                                    disabled={submitting || !feedbackContent}
                                    type="submit" 
                                    className="px-6 py-2 bg-white text-emerald-700 font-bold rounded-lg text-sm shadow-md hover:bg-emerald-50 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                                >
                                    {submitting ? <FaSpinner className="animate-spin"/> : "Submit Feedback"}
                                </button>
                            </div>
                        </form>
                    </div>
                     <FaCommentDots className="absolute -right-4 -bottom-8 text-[10rem] text-emerald-500 opacity-20 rotate-12 pointer-events-none" />
                </div>

                {/* Feedback List */}
                <div className="space-y-4">
                    <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider px-1">Recent Feedback</h3>
                    {feedbackList.map((item) => (
                        <div key={item.id} className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-sm relative">
                             <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                     <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold ring-1 ring-slate-600">
                                         {item.userFullName ? item.userFullName[0] : 'A'}
                                     </div>
                                     <div>
                                         <p className="text-sm font-bold text-slate-200">{item.userFullName || 'Anonymous'}</p>
                                         <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                                     </div>
                                </div>
                                <div className="text-yellow-400 text-xs tracking-widest bg-slate-900/50 px-2 py-1 rounded-full border border-slate-700">
                                    {"★".repeat(Number(item.rating) || 0)}
                                    <span className="text-slate-700">{"★".repeat(5 - (Number(item.rating) || 0))}</span>
                                </div>
                             </div>
                             <p className="text-slate-300 text-sm leading-relaxed pl-10">"{item.content}"</p>
                        </div>
                    ))}
                    {feedbackList.length === 0 && <p className="text-slate-500 text-center py-4 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">No feedback yet.</p>}
                </div>
          </div>
      ) : (
          <div className="space-y-6 animate-fadeIn">
              {/* Polls List */}
              {pollsList.map((poll) => {
                  const totalVotes = poll.results.reduce((a: number, b: number) => a + b, 0);
                  const hasVoted = poll.userVotedOption !== null;

                  return (
                      <div key={poll.id} className="bg-slate-800 rounded-xl border border-slate-700 shadow-md p-6 relative overflow-hidden hover:shadow-emerald-900/10 transition-shadow">
                           <div className="flex items-center gap-3 mb-4">
                               <div className="p-2 bg-blue-900/30 text-blue-400 rounded-lg border border-blue-500/30"><FaPoll /></div>
                               <h3 className="font-bold text-white text-lg">{poll.question}</h3>
                           </div>
                           
                           <div className="space-y-3 mb-4">
                               {poll.options.map((opt: string, idx: number) => {
                                   const percent = totalVotes > 0 ? Math.round((poll.results[idx] / totalVotes) * 100) : 0;
                                   const isSelected = poll.userVotedOption === idx;
                                   
                                   return (
                                       <button 
                                            key={idx}
                                            disabled={hasVoted || voting === poll.id}
                                            onClick={() => handleVote(poll.id, idx)}
                                            className={`w-full relative h-12 rounded-lg overflow-hidden border transition-all ${
                                                hasVoted 
                                                    ? isSelected 
                                                        ? 'border-emerald-500 bg-emerald-900/20' 
                                                        : 'border-slate-700 bg-slate-800 opacity-50 grayscale'
                                                    : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700 hover:border-slate-500'
                                            }`}
                                       >
                                           <div 
                                             className={`absolute top-0 left-0 h-full transition-all duration-1000 ${isSelected ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`} 
                                             style={{ width: hasVoted ? `${percent}%` : '0%' }}
                                           ></div>
                                           <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                                               <span className={`text-sm font-medium ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>
                                                    {opt} {isSelected && <FaCheckCircle className="inline ml-2 text-emerald-500"/>}
                                               </span>
                                               {hasVoted && <span className="text-xs font-bold text-slate-400">{percent}%</span>}
                                           </div>
                                       </button>
                                   );
                               })}
                           </div>
                           
                           <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-700 pt-3">
                               <span>{totalVotes} total votes</span>
                               <span className={hasVoted ? "text-emerald-500 font-medium" : ""}>{hasVoted ? "Vote Recorded" : "Tap an option to vote"}</span>
                           </div>
                      </div>
                  );
              })}
              {pollsList.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-slate-700 rounded-xl bg-slate-800/30">
                      <FaPoll className="text-4xl mb-4 opacity-50"/>
                      <p>No active polls at the moment.</p>
                  </div>
              )}
          </div>
      )}
    </div>
  );
}