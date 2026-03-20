import React, { useState, useEffect, useRef } from 'react';
import { 
  auth, db, googleProvider, 
  UserProfile, GenerationRecord, 
  OperationType, handleFirestoreError 
} from './lib/firebase';
import { 
  signInWithPopup, onAuthStateChanged, signOut, User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, getDoc, setDoc, updateDoc, increment, 
  collection, query, where, orderBy, onSnapshot, 
  Timestamp, addDoc, deleteDoc 
} from 'firebase/firestore';
import { 
  generatePptContent, generateDocumentContent, 
  analyzeVideoOrTranscript, PptStructure 
} from './services/gemini';
import { 
  generatePptFile, generatePdfFile, generateWordFile 
} from './services/documentGenerator';
import { 
  Layout, FileText, Presentation, FileCode, 
  LogOut, Plus, History, Coins, 
  Loader2, Download, Trash2, Video, 
  FileUp, Sparkles, ChevronRight, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="w-8 h-8" />
              <h2 className="text-xl font-bold">Something went wrong</h2>
            </div>
            <p className="text-zinc-600 mb-6">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<GenerationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [input, setInput] = useState('');
  const [docType, setDocType] = useState<'ppt' | 'pdf' | 'word'>('ppt');
  const [preview, setPreview] = useState<{ title: string; content: any } | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Load or Create Profile
        const userDoc = doc(db, 'users', firebaseUser.uid);
        try {
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'User',
              credits: 5,
              createdAt: Timestamp.now()
            };
            await setDoc(userDoc, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, 'users');
        }
      } else {
        setProfile(null);
        setHistory([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // History Listener
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'generations'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GenerationRecord));
      setHistory(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'generations');
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleBuyCredits = async (creditsAmount: number, priceInINR: number) => {
    if (!user) return;
    
    try {
      // 1. Create order on backend
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: priceInINR })
      });
      const order = await orderRes.json();
      
      if (!order.id) throw new Error("Could not create order");

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: 'rzp_test_STLcatTcBrF54V',
        amount: order.amount,
        currency: order.currency,
        name: "Powerhouse AI",
        description: `Purchase ${creditsAmount} Credits`,
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });
          const verifyData = await verifyRes.json();
          
          if (verifyData.success) {
            // Update credits in Firestore upon successful verification
            await updateDoc(doc(db, 'users', user.uid), {
              credits: increment(creditsAmount)
            });
            setProfile(prev => prev ? { ...prev, credits: prev.credits + creditsAmount } : null);
            alert(`Successfully added ${creditsAmount} credits!`);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.displayName || '',
          email: user.email || ''
        },
        theme: {
          color: "#18181b"
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
         alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
      
    } catch (error: any) {
      console.error(error);
      alert("Failed to initiate payment: " + error.message);
    }
  };

  const handleGenerate = async () => {
    if (!user) {
      handleLogin();
      return;
    }
    if (!profile || profile.credits <= 0) {
      alert("Not enough credits! Please contact support to buy more.");
      return;
    }
    if (!input.trim()) return;

    setGenerating(true);
    try {
      let result: any;
      if (docType === 'ppt') {
        result = await generatePptContent(input);
      } else {
        result = await generateDocumentContent(input, docType);
      }

      setPreview({ title: result.title, content: result });

      // Save to History & Deduct Credit
      const genData = {
        userId: user!.uid,
        type: docType,
        prompt: input,
        title: result.title,
        content: JSON.stringify(result),
        createdAt: Timestamp.now()
      };
      
      await addDoc(collection(db, 'generations'), genData);
      await updateDoc(doc(db, 'users', user!.uid), {
        credits: increment(-1)
      });
      
      // Update local profile state
      setProfile(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);

    } catch (error) {
      console.error("Generation failed", error);
      alert("AI Generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (record?: GenerationRecord) => {
    const data = record ? JSON.parse(record.content) : preview?.content;
    const type = record ? record.type : docType;
    const title = record ? record.title : preview?.title || "Document";

    if (!data) return;

    try {
      if (type === 'ppt') {
        await generatePptFile(title, data.slides);
      } else if (type === 'pdf') {
        await generatePdfFile(title, data.content);
      } else if (type === 'word') {
        await generateWordFile(title, data.content);
      }
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to generate file for download.");
    }
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'generations', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'generations');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-80 bg-white border-r border-zinc-200 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Powerhouse AI</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-8">
            {/* User Info */}
            {user ? (
              <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                <div className="flex items-center gap-3 mb-4">
                  <img src={user.photoURL || ''} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Avatar" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{user.displayName}</p>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-zinc-100 shadow-sm mb-2">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium">Credits</span>
                  </div>
                  <span className="text-lg font-bold">{profile?.credits || 0}</span>
                </div>
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={() => handleBuyCredits(5, 50)}
                    className="flex-1 py-2 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors border border-amber-100 flex flex-col items-center justify-center p-2"
                  >
                    <span className="flex items-center gap-1"><Plus className="w-3 h-3" /> 5 Credits</span>
                    <span className="text-[10px] opacity-75 mt-0.5">₹50</span>
                  </button>
                  <button 
                    onClick={() => handleBuyCredits(10, 100)}
                    className="flex-1 py-2 bg-neutral-50 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-100 transition-colors border border-neutral-200 flex flex-col items-center justify-center p-2 shadow-sm"
                  >
                    <span className="flex items-center gap-1"><Plus className="w-3 h-3" /> 10 Credits</span>
                    <span className="text-[10px] opacity-75 mt-0.5">₹100</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 text-center shadow-sm">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-zinc-100">
                  <Sparkles className="w-6 h-6 text-zinc-900" />
                </div>
                <h3 className="font-bold text-zinc-900 mb-1">Create an account</h3>
                <p className="text-xs text-zinc-500 mb-4 px-2">Sign in to save generations and get 5 free credits.</p>
                <button 
                  onClick={handleLogin}
                  className="w-full py-2.5 bg-zinc-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all text-sm active:scale-95"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4 bg-white rounded-full p-0.5" alt="Google" />
                  Sign in with Google
                </button>
              </div>
            )}

            {/* History */}
            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">History</h3>
                <History className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="space-y-2">
                {history.map((item) => (
                  <motion.div 
                    layout
                    key={item.id}
                    className="group relative bg-white border border-zinc-100 rounded-xl p-3 hover:border-zinc-300 transition-all cursor-pointer"
                    onClick={() => handleDownload(item)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        item.type === 'ppt' ? "bg-orange-50 text-orange-600" : 
                        item.type === 'pdf' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                      )}>
                        {item.type === 'ppt' ? <Presentation className="w-4 h-4" /> : 
                         item.type === 'pdf' ? <FileText className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-[10px] text-zinc-400 uppercase font-bold">{item.type}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteHistory(item.id); }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-600 rounded-md transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
                {history.length === 0 && (
                  <p className="text-center text-zinc-400 text-sm py-4">No history yet</p>
                )}
              </div>
            </div>
          </div>

          {user && (
            <button 
              onClick={handleLogout}
              className="mt-6 flex items-center gap-3 text-zinc-400 hover:text-zinc-900 transition-colors px-2 py-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-white border-b border-zinc-200 px-8 flex items-center justify-between shrink-0">
            <h2 className="text-lg font-bold">Document Generator</h2>
            <div className="flex items-center gap-4">
              <div className="flex bg-zinc-100 p-1 rounded-xl">
                {(['ppt', 'pdf', 'word'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setDocType(type)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                      docType === type ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                    )}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Input Section */}
              <section className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
                    <Video className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">What are we creating today?</h3>
                    <p className="text-sm text-zinc-500">Paste a YouTube link, transcript, or just a topic.</p>
                  </div>
                </div>

                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. 'Photosynthesis for 8th grade students' or 'https://youtube.com/watch?v=...'"
                  className="w-full h-32 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none mb-6"
                />

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 transition-colors" title="Upload Transcript">
                      <FileUp className="w-5 h-5" />
                    </button>
                  </div>
                  <button 
                    onClick={handleGenerate}
                    disabled={generating || !input.trim()}
                    className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-zinc-200"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate {docType.toUpperCase()}
                      </>
                    )}
                  </button>
                </div>
              </section>

              {/* Preview Section */}
              <AnimatePresence>
                {preview && (
                  <motion.section 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden"
                  >
                    <div className="bg-zinc-900 p-6 flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          {docType === 'ppt' ? <Presentation className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <h3 className="font-bold truncate max-w-md">{preview.title}</h3>
                      </div>
                      <button 
                        onClick={() => handleDownload()}
                        className="bg-white text-zinc-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-zinc-100 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>

                    <div className="p-8">
                      {docType === 'ppt' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {(preview.content as PptStructure).slides.map((slide, idx) => (
                            <div key={idx} className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 aspect-video flex flex-col">
                              <h4 className="font-bold text-lg mb-4 text-zinc-900 border-b border-zinc-200 pb-2">{slide.title}</h4>
                              <ul className="space-y-2 flex-1 overflow-y-auto">
                                {slide.content.map((point, pIdx) => (
                                  <li key={pIdx} className="text-sm text-zinc-600 flex gap-2">
                                    <span className="text-zinc-400">•</span>
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="prose prose-zinc max-w-none">
                          <ReactMarkdown>{preview.content.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
