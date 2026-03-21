import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  auth, db, 
  UserProfile, GenerationRecord, 
  OperationType, handleFirestoreError 
} from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  doc, getDoc, updateDoc, increment, 
  collection, Timestamp, addDoc
} from 'firebase/firestore';
import { 
  generatePptContent, generateDocumentContent, PptStructure 
} from '../services/gemini';
import { 
  generatePptFile, generatePdfFile, generateWordFile 
} from '../services/documentGenerator';
import { 
  FileText, Presentation, FileCode, ChevronLeft,
  Loader2, Download, Video, FileUp, Sparkles, AlertCircle, Layout, Palette, Settings2, Pencil, RefreshCw, Send
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for Tailwind
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Editor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sourceType = searchParams.get('type') || 'topic';
  const docId = searchParams.get('id');

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Editor states
  const [generating, setGenerating] = useState(false);
  const [input, setInput] = useState('');
  const [docType, setDocType] = useState<'ppt' | 'pdf' | 'word'>('ppt');
  const [preview, setPreview] = useState<{ title: string; content: any } | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const [options, setOptions] = useState({
    pages: 10,
    font: 'Arial',
    size: '16px',
    images: false,
    helpNotes: false,
    detailedContent: false
  });

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        navigate('/');
        return;
      }
      setUser(firebaseUser);
      const userDoc = doc(db, 'users', firebaseUser.uid);
      getDoc(userDoc).then(docSnap => {
        if(docSnap.exists()){
          setProfile(docSnap.data() as UserProfile);
        }
        setLoading(false);
      });
    });
    return () => unsubscribe();
  }, [navigate]);

  // Handle Generating New Content
  const handleGenerate = async () => {
    if (!user || !profile || profile.credits <= 0) {
      alert("Not enough credits or user not authenticated.");
      return;
    }
    if (!input.trim()) return;

    setGenerating(true);
    try {
      let result: any;
      if (docType === 'ppt') result = await generatePptContent(input, options);
      else result = await generateDocumentContent(input, docType, options);

      setPreview({ title: result.title, content: result });
      setActiveSlide(0);

      // Save to Firebase
      const genData = {
        userId: user.uid, type: docType, prompt: input,
        title: result.title, content: JSON.stringify(result),
        createdAt: Timestamp.now()
      };
      
      await addDoc(collection(db, 'generations'), genData);
      await updateDoc(doc(db, 'users', user.uid), { credits: increment(-1) });
      setProfile(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);

    } catch (error: any) {
      console.error(error);
      alert("Error: " + (error.message || "Unknown error occurred"));
    } finally {
      setGenerating(false);
    }
  };

  // Handle Download
  const handleDownload = async (format: 'ppt' | 'pdf' | 'word' = docType) => {
    if (!preview?.content) return;
    try {
      if (format === 'ppt') await generatePptFile(preview.title, preview.content.slides);
      else if (format === 'pdf') await generatePdfFile(preview.title, preview.content.content);
      else if (format === 'word') await generateWordFile(preview.title, preview.content.content);
    } catch (error) {
      alert("Failed to generate file for download.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>;

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      
      {/* Editor Top Bar */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-900 rounded-md flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900">{preview ? preview.title : "Untitled Lesson"}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-bold">
            {(['ppt', 'pdf', 'word'] as const).map(type => (
              <button key={type} onClick={() => setDocType(type)} className={cn("px-3 py-1.5 rounded-md transition-all uppercase", docType === type ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
                {type}
              </button>
            ))}
          </div>

          <button onClick={() => handleDownload('ppt')} disabled={!preview} className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Thumbnails List (Only if PPT) */}
        {preview && docType === 'ppt' && (
          <aside className="w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto flex flex-col p-4 gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Slides</h3>
            {preview.content.slides.map((slide: any, idx: number) => (
              <div 
                key={idx} 
                onClick={() => setActiveSlide(idx)}
                className={cn("p-3 rounded-xl border cursor-pointer transition-all aspect-video flex flex-col hover:border-indigo-300 relative", activeSlide === idx ? "bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500" : "bg-white border-slate-200 opacity-70")}
              >
                <span className="absolute top-2 left-2 text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 rounded">{idx + 1}</span>
                <h4 className="text-xs font-bold mt-4 line-clamp-2 text-slate-700 leading-tight">{slide.title}</h4>
              </div>
            ))}
          </aside>
        )}

        {/* Center Canvas */}
        <main className="flex-1 overflow-y-auto relative flex flex-col bg-slate-100">
          
          {/* Active Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-8">
            {!preview ? (
              <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 transform transition-all">
                <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-2xl font-bold">
                    {sourceType === 'youtube' ? <Video /> : sourceType === 'file' ? <FileUp /> : sourceType === 'transcript' ? <FileText /> : <Pencil />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">Generate from {sourceType}</h2>
                    <p className="text-slate-500 text-sm">Paste content below and choose format in the top bar.</p>
                  </div>
                </div>
                <textarea 
                  value={input} onChange={e => setInput(e.target.value)}
                  placeholder="Paste context, syllabus, link or prompt..."
                  className="w-full h-40 bg-slate-50/50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-slate-700 font-medium mb-6"
                />
                <button onClick={handleGenerate} disabled={generating || !input.trim()} className="w-full py-4 bg-indigo-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50">
                  {generating ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing & Generating...</> : <><Sparkles className="w-5 h-5 text-amber-400" /> Start Generation</>}
                </button>
              </div>
            ) : (
              <div className={cn("w-full h-full max-w-4xl mx-auto flex items-center justify-center", docType === 'ppt' ? "aspect-video" : "max-w-3xl")}>
                <div className="w-full h-full bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative group">
                  
                  {/* PPT rendering inside large canvas */}
                  {docType === 'ppt' ? (
                     <div className="w-full h-full p-12 md:p-16 flex flex-col bg-slate-50 overflow-y-auto">
                        <div className="w-16 h-2 bg-indigo-500 rounded-full mb-8 shrink-0"></div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight" style={{ fontFamily: options.font }}>{preview.content.slides[activeSlide]?.title}</h2>
                        <ul className="space-y-4 mb-8">
                          {preview.content.slides[activeSlide]?.content.map((pt: string, i: number) => (
                            <li key={i} className="flex gap-4 items-start text-slate-700 font-medium" style={{ fontFamily: options.font, fontSize: options.size }}>
                              <span className="w-2 h-2 rounded-full bg-amber-500 mt-2.5 shrink-0 shadow-sm"></span>
                              <span className="leading-relaxed">{pt}</span>
                            </li>
                          ))}
                        </ul>
                        {preview.content.slides[activeSlide]?.imagePrompt && (
                           <div className="mt-4 p-4 bg-teal-50 rounded-xl border border-teal-100 flex items-start gap-3">
                              <Layout className="w-5 h-5 text-teal-600 mt-0.5" />
                              <div>
                                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block mb-1">Suggested Image</span>
                                <span className="text-sm text-teal-700">{preview.content.slides[activeSlide].imagePrompt}</span>
                              </div>
                           </div>
                        )}
                        {preview.content.slides[activeSlide]?.helpNotes && (
                           <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                              <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
                              <div>
                                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">Help / Speaker Notes</span>
                                <span className="text-sm text-amber-700">{preview.content.slides[activeSlide].helpNotes}</span>
                              </div>
                           </div>
                        )}
                     </div>
                  ) : (
                    <div className="w-full h-full p-12 overflow-y-auto prose prose-slate">
                      <ReactMarkdown>{preview.content.content}</ReactMarkdown>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Properties Panel */}
        <aside className="w-72 bg-white border-l border-slate-200 p-6 overflow-y-auto flex flex-col shadow-[-4px_0_24px_-4px_rgba(0,0,0,0.05)] z-10 shrink-0">
          {!preview ? (
            <>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Generation Settings</h3>
              <div className="space-y-5 mb-8">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Number of Pages/Slides</label>
                  <input type="number" min="1" max="50" value={options.pages} onChange={e => setOptions({...options, pages: Number(e.target.value)})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Font Style</label>
                  <select value={options.font} onChange={e => setOptions({...options, font: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all cursor-pointer">
                    <option value="Inter, sans-serif">Modern (Inter)</option>
                    <option value="Georgia, serif">Academic (Georgia)</option>
                    <option value="'Comic Sans MS', cursive">Playful (Comic Sans)</option>
                    <option value="monospace">Code (Monospace)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Font Size</label>
                  <select value={options.size} onChange={e => setOptions({...options, size: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all cursor-pointer">
                    <option value="14px">Small (14px)</option>
                    <option value="18px">Medium (18px)</option>
                    <option value="22px">Large (22px)</option>
                    <option value="28px">Extra Large (28px)</option>
                  </select>
                </div>
                
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  {docType === 'ppt' && (
                    <>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" checked={options.images} onChange={e => setOptions({...options, images: e.target.checked})} className="peer sr-only" />
                          <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Suggest Images</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" checked={options.helpNotes} onChange={e => setOptions({...options, helpNotes: e.target.checked})} className="peer sr-only" />
                          <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-amber-600 transition-colors">Generate Help Notes</span>
                      </label>
                    </>
                  )}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input type="checkbox" checked={options.detailedContent} onChange={e => setOptions({...options, detailedContent: e.target.checked})} className="peer sr-only" />
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Detailed Explanations</span>
                  </label>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">AI Adjustments</h3>
              
              <div className="space-y-4 mb-8">
                <button className="w-full p-3 flex flex-col items-start gap-1 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors text-left text-indigo-900 group">
                  <span className="font-bold flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-600" /> Simplify for Grade 5</span>
                  <span className="text-xs text-indigo-600/80 font-medium">Rewrite active slide tone.</span>
                </button>
                <button className="w-full p-3 flex flex-col items-start gap-1 bg-amber-50 border border-amber-100 rounded-xl hover:bg-amber-100 transition-colors text-left text-amber-900 group">
                  <span className="font-bold flex items-center gap-2"><RefreshCw className="w-4 h-4 text-amber-600" /> Expand Details</span>
                  <span className="text-xs text-amber-600/80 font-medium">Add more bullet points.</span>
                </button>
                <button className="w-full p-3 flex flex-col items-start gap-1 bg-teal-50 border border-teal-100 rounded-xl hover:bg-teal-100 transition-colors text-left text-teal-900 group">
                  <span className="font-bold flex items-center gap-2"><FileText className="w-4 h-4 text-teal-600" /> Add Quiz Slide</span>
                  <span className="text-xs text-teal-600/80 font-medium">Generate pop-quiz questions.</span>
                </button>
              </div>
            </>
          )}

          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Quick Export</h3>
          <div className="space-y-3">
             <button onClick={() => handleDownload('ppt')} disabled={!preview} className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-3 hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm">
                <Presentation className="w-4 h-4 text-indigo-500" /> Save as PPTX
             </button>
             <button onClick={() => handleDownload('pdf')} disabled={!preview} className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-3 hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm">
                <FileText className="w-4 h-4 text-rose-500" /> Save as PDF
             </button>
             <button onClick={() => handleDownload('word')} disabled={!preview} className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-3 hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm">
                <FileCode className="w-4 h-4 text-blue-500" /> Save as DOCX
             </button>
             <button disabled className="w-full mt-4 py-2.5 px-4 bg-slate-900 border border-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-3 hover:bg-slate-800 transition-colors opacity-50 cursor-not-allowed shadow-sm">
                <Send className="w-4 h-4" /> Send to Google Slides
             </button>
          </div>
        </aside>

      </div>
    </div>
  );
}
