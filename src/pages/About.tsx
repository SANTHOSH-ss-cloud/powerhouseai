import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Target, Shield, HeartHandshake, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />
      
      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 font-headings">Our Mission: Empowering Classrooms</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We started ClassCraft Presentations because teachers spend too much time formatting slides and not enough time engaging with students. As the premier AI presentation builder for teachers and students, our goal is to eliminate busywork. Use our lesson plan to PPT converter to turn transcript to PPT or YouTube to PPT instantly, freeing up hours of weekly prep time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {[
              { title: "Accessibility First", desc: "Every output is designed to be readable, inclusive, and screen-reader friendly.", icon: <HeartHandshake className="w-8 h-8 text-amber-500" /> },
              { title: "Student Privacy", desc: "We adhere strictly to FERPA/COPPA guidelines. No student data is retained or sold.", icon: <Shield className="w-8 h-8 text-indigo-500" /> },
              { title: "Reliability", desc: "Our AI generation is backed by robust infrastructure so it won't fail during your prep period.", icon: <Zap className="w-8 h-8 text-teal-500" /> },
              { title: "Curriculum Aligned", desc: "Our templates reflect standard pedagogical needs—from K-12 rubrics to Higher Ed research.", icon: <Target className="w-8 h-8 text-rose-500" /> }
            ].map((value, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
                {value.icon}
                <h3 className="text-xl font-bold">{value.title}</h3>
                <p className="text-slate-600">{value.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight mb-12">Meet the Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Sarah Lin", role: "Founder & Product Lead", initials: "SL" },
                { name: "David Chen", role: "AI Engineer", initials: "DC" },
                { name: "Dr. A. Roberts", role: "Teacher Advisor", initials: "AR" },
                { name: "Michael T.", role: "Support Lead", initials: "MT" }
              ].map((member, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center hover:bg-white transition-colors">
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-700 font-bold text-xl rounded-full flex items-center justify-center mb-4">
                    {member.initials}
                  </div>
                  <h4 className="font-bold text-slate-900">{member.name}</h4>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1 text-center">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
