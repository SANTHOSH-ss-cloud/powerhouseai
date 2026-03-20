import React from 'react';
import { Link } from 'react-router-dom';
import { FileUp, Youtube, FileText, FileCode, CheckCircle2, ChevronRight, Play, Presentation, Layers, Users, Star, MonitorPlay, FileVideo, ShieldCheck, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      
      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
              ClassCraft AI 2.0 is live! The leading education presentation maker.
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
              Turn lesson plans into <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">
                beautiful slides
              </span> in minutes.
            </h1>
            
            <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              The premium AI presentation maker for teachers and AI PPT generator for students. Effortlessly convert PDF to PPT, DOCX to PPT, transcript to PPT, and YouTube to PPT instantly.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2">
                Create a presentation <ChevronRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 border border-slate-200 hover:-translate-y-1 transition-all shadow-lg flex items-center justify-center gap-2">
                <Play className="w-5 h-5 fill-slate-700" /> Watch demo
              </button>
            </div>
          </div>
          
          {/* Hero Mockup */}
          <div className="relative max-w-6xl mx-auto mt-20 px-4">
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-900/10 border border-slate-100 p-4 transform perspective-1000 rotate-x-2">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[500px]">
                <div className="w-full md:w-64 bg-white border-r border-slate-200 p-6">
                  <h3 className="font-bold mb-4">Input Source</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 font-medium text-sm">
                      <Youtube className="w-5 h-5" /> YouTube Link
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl text-slate-600 font-medium text-sm transition-colors">
                      <FileUp className="w-5 h-5" /> PDF Document
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl text-slate-600 font-medium text-sm transition-colors">
                      <FileText className="w-5 h-5" /> Transcript
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-8 bg-slate-50 grid grid-cols-2 gap-6 overflow-hidden">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:border-indigo-300 transition-colors">
                    <div className="w-16 h-2 bg-indigo-100 rounded-full mb-4"></div>
                    <h4 className="font-bold text-lg mb-2">Introduction to Photosynthesis</h4>
                    <p className="text-xs text-slate-400 flex-1">Overview of how plants convert sunlight into energy.</p>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SLIDE 1</span>
                      <Presentation className="w-4 h-4 text-indigo-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:border-indigo-300 transition-colors">
                    <div className="w-24 h-2 bg-teal-100 rounded-full mb-4"></div>
                    <h4 className="font-bold text-lg mb-2">The Chloroplast</h4>
                    <p className="text-xs text-slate-400 flex-1">Cellular structure where photosynthesis occurs.</p>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SLIDE 2</span>
                      <Presentation className="w-4 h-4 text-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Key Features Section */}
        <section id="features" className="py-24 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-2">Built for Education</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">Everything you need to teach</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Upload Anything", desc: "Easily convert PDF to PPT, DOCX to PPT, transcript to PPT, or YouTube to PPT with one click.", icon: <FileUp className="w-6 h-6" aria-label="Convert PDF to PPT" />, color: "bg-indigo-50 text-indigo-600" },
                { title: "Multi-Format Export", desc: "Download your lessons as interactive PowerPoint (.pptx), Word (.docx), or PDF formats for offline use.", icon: <FileCode className="w-6 h-6" aria-label="Education presentation maker export options" />, color: "bg-teal-50 text-teal-600" },
                { title: "Education Templates", desc: "Get access to beautiful templates specifically crafted for lesson plans, lectures, assignments, and research.", icon: <Presentation className="w-6 h-6" />, color: "bg-amber-50 text-amber-600" },
                { title: "Smart Customization", desc: "Our AI editor allows you to simplify text, outline quizzes, rewrite content for specific grade levels, and more.", icon: <Sparkles className="w-6 h-6" />, color: "bg-purple-50 text-purple-600" },
                { title: "Classroom Collaboration", desc: "Share secure links directly with students, or export your slides seamlessly to Google Slides and PowerPoint.", icon: <Users className="w-6 h-6" />, color: "bg-blue-50 text-blue-600" },
                { title: "Student Privacy First", desc: "We prioritize security. Your educational materials and recorded sessions are never shared publicly or used to train public models.", icon: <ShieldCheck className="w-6 h-6" />, color: "bg-rose-50 text-rose-600" },
              ].map((feature, i) => (
                <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:shadow-lg hover:bg-white transition-all cursor-default group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 \${feature.color} group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. How It Works - Horizontal Flow */}
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-teal-400 font-bold tracking-wide uppercase text-sm mb-2">Process</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight">Three steps to your perfect lesson deck</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-teal-500 via-indigo-500 to-amber-500 opacity-30"></div>
              
              {[
                { step: "01", title: "Provide Context", desc: "Upload your syllabus, paste a topic, or link a YouTube instructional video.", icon: <FileVideo /> },
                { step: "02", title: "Select Format", desc: "Choose your desired output—a dynamic PowerPoint, a printable Word handout, or a sleek PDF.", icon: <Layers /> },
                { step: "03", title: "Tweak & Export", desc: "Use the AI editor to modify the grade-level tone or layout, then export instantly.", icon: <MonitorPlay /> }
              ].map((item, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-slate-800 border-4 border-slate-900 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 text-white shadow-xl">
                    {item.icon}
                  </div>
                  <span className="text-teal-400 font-bold font-mono mb-2">{item.step}</span>
                  <h4 className="text-2xl font-bold mb-3">{item.title}</h4>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Templates Gallery Preview */}
        <section id="templates" className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <h2 className="text-amber-600 font-bold tracking-wide uppercase text-sm mb-2">Quality Designs</h2>
                <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Education presentation maker templates</h3>
              </div>
              <div className="mt-6 md:mt-0 flex gap-2 overflow-x-auto pb-2">
                {["All", "Science", "History", "Math", "Literature"].map((filter, i) => (
                  <button key={i} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap \${i === 0 ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl hover:shadow-indigo-900/5 transition-all cursor-pointer">
                  <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                    <div className={`absolute inset-0 opacity-20 bg-gradient-to-br \${i % 2 === 0 ? 'from-indigo-500 to-purple-500' : 'from-teal-400 to-amber-300'}`}></div>
                    <Presentation className="w-12 h-12 text-slate-300 relative z-10" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-lg">Modern Minimalist</h4>
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold tracking-widest uppercase">PRO</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Clean, academic layout perfect for university lectures and extensive research presentations.</p>
                    <div className="flex gap-2">
                      <span className="text-xs font-semibold text-slate-400 border border-slate-100 px-2 py-1 rounded-md">16:9</span>
                      <span className="text-xs font-semibold text-slate-400 border border-slate-100 px-2 py-1 rounded-md">PPTX/PDF</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link to="/dashboard" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800">
                Explore all 50+ templates <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Social Proof */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-center text-slate-400 font-bold tracking-wider uppercase text-sm mb-12">Trusted by educators and students worldwide</h3>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-40 grayscale mb-20">
              <h2 className="text-2xl font-extrabold italic">Harvard Ed</h2>
              <h2 className="text-2xl font-extrabold font-serif">STANFORD</h2>
              <h2 className="text-2xl font-extrabold tracking-widest">MIT</h2>
              <h2 className="text-2xl font-extrabold">Oxford Academy</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Dr. Sarah Jenkins", role: "High School Science Teacher", quote: "ClassCraft saves me 5 hours a week minimum. I paste a transcript from a YouTube biology video and BOOM – a ready-to-teach PowerPoint and an accompaniment handout for my students." },
                { name: "Marcus Chen", role: "University Student", quote: "I use this to turn my messy lecture notes and PDFs into structured study guides and presentation outlines for my group projects. The AI rewrite is insanely accurate." },
                { name: "Prof. Elena Rodriguez", role: "History Department Lead", quote: "The templates are actually professional and not cluttered. I can quickly convert my lengthy syllabus into an introductory slide deck on day one with zero hassle." }
              ].map((testimonial, i) => (
                <div key={i} className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                  <div className="flex text-amber-500 mb-6">
                    {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed mb-8 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900">{testimonial.name}</h5>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Pricing Preview */}
        <section className="py-24 bg-slate-900 text-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-16">Start for free, upgrade when you need to power up your classroom.</p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
              {[
                { name: "Free Student", price: "$0", desc: "Perfect for quick assignments.", features: ["3 AI Presentations/mo", "Basic Templates", "PDF & Web Export"] },
                { name: "Pro Teacher", price: "$9", period: "/mo", desc: "For educators who need scale.", popular: true, features: ["Unlimited Presentations", "Premium Templates", "PPT, Word, & PDF Export", "YouTube/Video Import"] },
                { name: "Campus", price: "Custom", desc: "Institution-wide deploy.", features: ["Everything in Pro", "Priority Support", "Admin Controls", "LMS Integration"] }
              ].map((plan, i) => (
                <div key={i} className={`bg-slate-800 rounded-3xl p-8 border \${plan.popular ? 'border-teal-500 transform md:-translate-y-4 shadow-2xl shadow-teal-500/20 relative' : 'border-slate-700'}`}>
                  {plan.popular && <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</span>}
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-6 h-10">{plan.desc}</p>
                  <div className="mb-8">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    {plan.period && <span className="text-slate-400 font-medium">{plan.period}</span>}
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                        <CheckCircle2 className={`w-5 h-5 \${plan.popular ? 'text-teal-400' : 'text-indigo-400'}`} /> {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/pricing" className={`block text-center w-full py-3 rounded-xl font-bold transition-colors \${plan.popular ? 'bg-teal-500 text-slate-900 hover:bg-teal-400' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
                    Choose Plan
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/pricing" className="text-teal-400 font-bold hover:text-teal-300">Compare all features &rarr;</Link>
            </div>
          </div>
        </section>

        {/* 7. SEO Content Strip */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl font-bold text-slate-900 mb-4">The ultimate AI tool for teachers and students</h2>
            <p className="text-slate-500 text-sm leading-loose">
              ClassCraft Presentations is a comprehensive AI slides generator for classrooms. Whether you are generating lesson plans, converting textbooks into PPT, analyzing lectures, or summarizing an educational video, our tool drastically reduces prep time. Experience the fastest lesson plan to PPT converter that ensures your curriculum alignment remains precise while granting you full control over final PowerPoint, Word, and PDF exports.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
