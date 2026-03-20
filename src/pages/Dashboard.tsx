import React, { useState, useEffect } from 'react';
import { 
  auth, db, googleProvider, 
  UserProfile, GenerationRecord, 
  OperationType, handleFirestoreError 
} from '../lib/firebase';
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
} from '../services/gemini';
import { 
  Layout, FileText, Presentation, FileCode, 
  LogOut, Plus, History, Coins, 
  Loader2, Download, Trash2, Video, 
  FileUp, Sparkles, ChevronRight, AlertCircle, Search, Bell, Menu, Users, CreditCard, Settings, Youtube
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<GenerationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
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

  const handleLogout = () => {
    signOut(auth);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to ClassCraft</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">Sign in to your dashboard to organize your classroom presentations and documents.</p>
          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-indigo-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-800 transition-all shadow-lg hover:-translate-y-0.5"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 bg-white rounded-full p-0.5" alt="Google" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200">
        <div className="p-6 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-indigo-900">ClassCraft</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Workspace</p>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold"><Presentation className="w-5 h-5" /> My Presentations</a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900"><FileText className="w-5 h-5" /> My Documents</a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900"><Layout className="w-5 h-5" /> Templates</a>
          
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-8">Organization</p>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900"><Users className="w-5 h-5" /> Classrooms</a>
          <Link to="/pricing" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900"><CreditCard className="w-5 h-5" /> Billing & Plan</Link>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900"><Settings className="w-5 h-5" /> Settings</a>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-slate-700">Credits</span>
            </div>
            <span className="text-sm font-extrabold text-indigo-900">{profile?.credits || 0}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full text-slate-500 hover:text-rose-600 font-medium text-sm transition-colors rounded-lg hover:bg-rose-50">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top bar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden p-2 text-slate-500"><Menu className="w-6 h-6" /></button>
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search your lessons and materials..." className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-sm" />
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-slate-900">{user.displayName}</span>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">Pro Teacher</span>
              </div>
              <img src={user.photoURL || ''} className="w-10 h-10 rounded-full border-2 border-indigo-100 shadow-sm" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Create New Actions */}
            <section>
              <h2 className="text-xl font-extrabold text-slate-900 mb-6 tracking-tight">Create new lesson material</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "From Topic", icon: <Sparkles className="w-6 h-6 text-amber-500" />, type: "topic" },
                  { title: "From File", icon: <FileUp className="w-6 h-6 text-indigo-500" />, type: "file" },
                  { title: "From Transcript", icon: <FileText className="w-6 h-6 text-teal-500" />, type: "transcript" },
                  { title: "From YouTube", icon: <Youtube className="w-6 h-6 text-rose-500" />, type: "youtube" },
                ].map((action, i) => (
                  <button key={i} onClick={() => navigate('/editor?type=' + action.type)} className="bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-900/5 p-6 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      {action.icon}
                    </div>
                    <span className="font-bold text-sm text-slate-700">{action.title}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Recent Projects */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Projects</h2>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">View all</button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col group">
                    <div className="h-40 bg-slate-100 flex items-center justify-center relative overflow-hidden group-hover:bg-slate-200 transition-colors cursor-pointer" onClick={() => navigate('/editor?id=' + item.id)}>
                      {item.type === 'ppt' ? <Presentation className="w-10 h-10 text-slate-400" /> : <FileText className="w-10 h-10 text-slate-400" />}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <span className="px-2 py-1 bg-white/80 backdrop-blur-sm text-slate-700 font-bold text-[10px] uppercase rounded shadow-sm border border-slate-200">{item.type}</span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-slate-900 truncate mb-1" title={item.title}>{item.title}</h3>
                      <p className="text-xs text-slate-500 mb-4">{new Date(item.createdAt.toMillis()).toLocaleDateString()}</p>
                      
                      <div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-100">
                        <button onClick={() => navigate('/editor?id=' + item.id)} className="flex-1 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg hover:bg-indigo-100 transition-colors">Open</button>
                        <button className="px-3 py-1.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-50 transition-colors">Duplicate</button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {history.length === 0 && (
                  <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                    <History className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                    <h3 className="font-bold text-slate-900 mb-1">No recent projects</h3>
                    <p className="text-sm text-slate-500 mb-6">Start by creating a new presentation or document from the top menu.</p>
                  </div>
                )}
              </div>
            </section>
            
          </div>
        </div>

      </main>
    </div>
  );
}
