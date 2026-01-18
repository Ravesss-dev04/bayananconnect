"use client";

import { useEffect, useState } from "react";
import { FaBullhorn, FaPoll, FaTrash, FaPlus, FaCheckCircle, FaStar, FaSpinner, FaTimes } from "react-icons/fa";

interface FeedbackItem {
    id: string;
    content: string;
    rating: string;
    createdAt: string;
    userFullName: string;
    userEmail: string;
    adminResponse?: string;
}

interface PollItem {
    id: string;
    question: string;
    options: string[];
    results: number[];
    totalVotes: number;
    isActive: boolean;
    createdAt: string;
    dueDate: string | null;
}

export default function Feedback() {
    const [activeTab, setActiveTab] = useState<'feedback' | 'polls'>('feedback');
    const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
    const [pollsList, setPollsList] = useState<PollItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Reply State
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [submittingReply, setSubmittingReply] = useState(false);
    
    // Poll Creation State
    const [isCreatingPoll, setIsCreatingPoll] = useState(false);
    const [newPollQuestion, setNewPollQuestion] = useState("");
    const [newPollOptions, setNewPollOptions] = useState<string[]>(["", ""]);
    const [submittingPoll, setSubmittingPoll] = useState(false);

    const handleReplySubmit = async (id: string) => {
        setSubmittingReply(true);
        try {
            await fetch('/api/admin/feedback', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, response: replyContent })
            });
            fetchData();
            setReplyingTo(null);
            setReplyContent("");
        } catch (e) {
            console.error(e);
        } finally {
            setSubmittingReply(false);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [feedbackRes, pollsRes] = await Promise.all([
                fetch('/api/admin/feedback'),
                fetch('/api/admin/polls')
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
            console.error("Error fetching data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteFeedback = async (id: string) => {
        if (!confirm('Delete this feedback?')) return;
        try {
            const res = await fetch(`/api/admin/feedback?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setFeedbackList(prev => prev.filter(f => f.id !== id));
            }
        } catch (e) { console.error(e); }
    };

    const handleDeletePoll = async (id: string) => {
        if (!confirm('Delete this poll? This will remove all votes associated with it.')) return;
        try {
            const res = await fetch(`/api/admin/polls?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPollsList(prev => prev.filter(p => p.id !== id));
            }
        } catch (e) { console.error(e); }
    };

    const handleAddOption = () => {
        setNewPollOptions([...newPollOptions, ""]);
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...newPollOptions];
        newOptions[index] = value;
        setNewPollOptions(newOptions);
    };

    const handleRemoveOption = (index: number) => {
        if (newPollOptions.length <= 2) return;
        setNewPollOptions(newPollOptions.filter((_, i) => i !== index));
    };

    const handleCreatePoll = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPollQuestion || newPollOptions.some(o => !o.trim())) return;

        setSubmittingPoll(true);
        try {
            const res = await fetch('/api/admin/polls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: newPollQuestion,
                    options: newPollOptions
                })
            });

            if (res.ok) {
                setIsCreatingPoll(false);
                setNewPollQuestion("");
                setNewPollOptions(["", ""]);
                fetchData(); // Refresh list to see new poll
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSubmittingPoll(false);
        }
    };

    if (loading && feedbackList.length === 0 && pollsList.length === 0) {
        return <div className="p-8 text-center text-slate-400"><FaSpinner className="animate-spin text-2xl mx-auto mb-2"/> Loading data...</div>;
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex w-full md:w-fit bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button 
                    onClick={() => setActiveTab('feedback')}
                    className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'feedback' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <FaBullhorn/> <span className="hidden sm:inline">Residents</span> Feedback
                </button>
                <button 
                    onClick={() => setActiveTab('polls')}
                    className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'polls' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <FaPoll/> Polls <span className="hidden sm:inline">& Voting</span>
                </button>
            </div>
            {activeTab === 'feedback' && (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {feedbackList.length === 0 ? (
                        <p className="text-slate-500 col-span-full text-center py-10">No feedback received yet.</p>
                    ) : feedbackList.map(item => (
                        <div key={item.id} className="bg-slate-800 p-5 rounded-xl border border-slate-700 relative group hover:border-emerald-500/50 transition-colors flex flex-col h-full">
                            <button 
                                onClick={() => handleDeleteFeedback(item.id)}
                                className="absolute top-4 right-4 text-slate-600 hover:text-red-500 transition-colors"
                            >
                                <FaTrash size={14}/>
                            </button>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xs">
                                    {item.userFullName.charAt(0)}
                                </span>
                                <div>
                                    <h4 className="text-white font-bold text-sm">{item.userFullName}</h4>
                                    <p className="text-[10px] text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex gap-1 text-yellow-500 mb-2 text-xs">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < Number(item.rating) ? "" : "text-slate-600"} />
                                ))}
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-4 flex-grow">{item.content}</p>
                            
                            {/* Admin Reply Section */}
                            <div className="pt-3 border-t border-slate-700 bg-slate-800/50 -mx-5 -mb-5 p-4 rounded-b-xl">
                                {replyingTo === item.id ? (
                                    <div className="space-y-2">
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Write a response..."
                                            className="w-full text-xs bg-slate-900 border border-slate-600 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                                            rows={2}
                                            autoFocus
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => setReplyingTo(null)}
                                                className="text-xs text-slate-400 hover:text-white"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={() => handleReplySubmit(item.id)}
                                                className="text-xs bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-500 disabled:opacity-50 flex items-center gap-1"
                                                disabled={submittingReply || !replyContent}
                                            >
                                                {submittingReply ? <FaSpinner className="animate-spin"/> : 'Send Reply'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {item.adminResponse && (
                                            <p className="text-xs text-emerald-400 bg-emerald-900/10 border border-emerald-900/30 p-2 rounded">
                                                <span className="font-bold block mb-1">Your Reply:</span> 
                                                {item.adminResponse}
                                            </p>
                                        )}
                                        <button 
                                            onClick={() => {
                                                setReplyingTo(item.id);
                                                setReplyContent(item.adminResponse || "");
                                            }}
                                            className="text-xs text-slate-500 hover:text-emerald-400 flex items-center gap-1 self-start"
                                        >
                                           <FaBullhorn size={10}/> {item.adminResponse ? 'Edit Response' : 'Reply to Resident'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {activeTab === 'polls' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Active Polls</h2>
                        <button 
                            onClick={() => setIsCreatingPoll(true)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                        >
                            <FaPlus/> Create New Poll
                        </button>
                    </div>

        
                    {isCreatingPoll && (
                        <div className="bg-slate-800 p-6 rounded-xl border border-emerald-500/50 animate-fadeInLeft">
                             <div className="flex justify-between mb-4">
                                <h3 className="text-white font-bold">Create New Poll</h3>
                                <button onClick={() => setIsCreatingPoll(false)} className="text-slate-400 hover:text-white"><FaTimes/></button>
                             </div>
                             <form onSubmit={handleCreatePoll} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Question</label>
                                    <input 
                                        required
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white active:ring-2 active:ring-emerald-500 outline-none"
                                        placeholder="What should we improve next?"
                                        value={newPollQuestion}
                                        onChange={e => setNewPollQuestion(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-500">Options</label>
                                    {newPollOptions.map((opt, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input 
                                                required
                                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none"
                                                placeholder={`Option ${i+1}`}
                                                value={opt}
                                                onChange={e => handleOptionChange(i, e.target.value)}
                                            />
                                            {newPollOptions.length > 2 && (
                                                <button type="button" onClick={() => handleRemoveOption(i)} className="text-red-500 hover:bg-slate-700 px-2 rounded">
                                                    <FaTrash size={12}/>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={handleAddOption} className="text-xs text-emerald-500 font-bold hover:underline">+ Add Option</button>
                                </div>
                                <div className="pt-2 flex justify-end">
                                    <button 
                                        disabled={submittingPoll}
                                        type="submit" 
                                        className="bg-white text-slate-900 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        {submittingPoll ? 'Creating...' : 'Launch Poll'}
                                    </button>
                                </div>
                             </form>
                        </div>
                    )}

                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                        {pollsList.map(poll => (
                            <div key={poll.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-white text-lg">{poll.question}</h3>
                                    <button 
                                        onClick={() => handleDeletePoll(poll.id)}
                                        className="text-slate-500 hover:text-red-500 transition-colors"
                                    >
                                        <FaTrash/>
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {poll.options.map((opt, i) => {
                                        const count = poll.results[i] || 0;
                                        const percentage = poll.totalVotes > 0 ? Math.round((count / poll.totalVotes) * 100) : 0;
                                        return (
                                            <div key={i} className="relative">
                                                <div className="flex justify-between text-xs text-slate-300 mb-1">
                                                    <span>{opt}</span>
                                                    <span>{count} votes ({percentage}%)</span>
                                                </div>
                                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between text-xs text-slate-500">
                                    <span>Total Votes: {poll.totalVotes}</span>
                                    <span>Created: {new Date(poll.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}





