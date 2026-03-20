import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />
      
      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">Simple Pricing for Educators</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Start generating lesson slides for free. Upgrade whenever you need more power and custom layouts completely built for classrooms.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-slate-500 text-sm mb-6 h-10">Best for students and quick single assignments.</p>
              <div className="mb-6">
                <span className="text-5xl font-extrabold">$0</span>
                <span className="text-slate-400 font-medium">/mo</span>
              </div>
              <ul className="space-y-4 flex-1 mb-8 text-sm font-medium">
                <li className="flex gap-3 text-slate-700"><Check className="text-teal-500 w-5 h-5 shrink-0" /> 3 AI Presentations/mo</li>
                <li className="flex gap-3 text-slate-700"><Check className="text-teal-500 w-5 h-5 shrink-0" /> Web & PDF Export</li>
                <li className="flex gap-3 text-slate-700"><Check className="text-teal-500 w-5 h-5 shrink-0" /> Basic Educational Templates</li>
                <li className="flex gap-3 text-slate-400"><X className="text-slate-300 w-5 h-5 shrink-0" /> No Word & PPTX Export</li>
                <li className="flex gap-3 text-slate-400"><X className="text-slate-300 w-5 h-5 shrink-0" /> Output Branding</li>
              </ul>
              <Link to="/dashboard" className="w-full block text-center py-4 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-800 transition-colors">Get Started Free</Link>
            </div>

            {/* Pro Teacher Tier */}
            <div className="bg-indigo-900 rounded-[2rem] p-8 border border-indigo-700 shadow-xl shadow-indigo-900/20 flex flex-col transform md:-translate-y-4 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-indigo-950 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest shadow-sm">
                Recommended
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Teacher Pro</h3>
              <p className="text-indigo-200 text-sm mb-6 h-10">For educators converting entire syllabus and lectures.</p>
              <div className="mb-6 text-white">
                <span className="text-5xl font-extrabold">$9</span>
                <span className="text-indigo-300 font-medium">/mo</span>
              </div>
              <ul className="space-y-4 flex-1 mb-8 text-sm font-medium text-white">
                <li className="flex gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> Unlimited Presentations</li>
                <li className="flex gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> Video & YouTube Import</li>
                <li className="flex gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> PPTX, Word, & PDF Export</li>
                <li className="flex gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> Premium Templates</li>
                <li className="flex gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> No Watermarks</li>
                <li className="flex gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> Advanced AI Tone Adjuster</li>
              </ul>
              <Link to="/dashboard" className="w-full block text-center py-4 bg-amber-500 hover:bg-amber-400 rounded-xl font-bold text-indigo-950 transition-colors">Start 7-Day Free Trial</Link>
            </div>

            {/* Campus / Institution Tier */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Campus</h3>
              <p className="text-slate-500 text-sm mb-6 h-10">For entire institutions, schools, and administration.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold flex items-center h-12">Custom</span>
              </div>
              <ul className="space-y-4 flex-1 mb-8 text-sm font-medium">
                <li className="flex gap-3 text-slate-700"><Check className="text-teal-500 w-5 h-5 shrink-0" /> Everything in Teacher Pro</li>
                <li className="flex gap-3 text-slate-700"><Check className="text-teal-500 w-5 h-5 shrink-0" /> Admin Organization Controls</li>
                <li className="flex gap-3 text-slate-700"><Check className="text-teal-500 w-5 h-5 shrink-0" /> LMS Integrations (Canvas/BB)</li>
                <li className="flex gap-3 text-slate-700"><Check className="text-teal-500 w-5 h-5 shrink-0" /> Shared Campus Templates</li>
                <li className="flex gap-3 text-slate-700"><Check className="text-teal-500 w-5 h-5 shrink-0" /> Dedicated Success Manager</li>
              </ul>
              <a href="mailto:sales@classcraft.io" className="w-full block text-center py-4 bg-slate-900 hover:bg-slate-800 rounded-xl font-bold text-white transition-colors">Contact Sales</a>
            </div>
          </div>

          {/* FAQs section */}
          <div className="mt-32 max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Do you offer student discounts?", a: "Yes, students with a valid .edu email can contact support for a 50% discount on the Teacher Pro plan." },
                { q: "Can I cancel my subscription anytime?", a: "Absolutely. You can manage your billing directly from the dashboard and cancel with one click." },
                { q: "Do you train AI on my uploaded teaching materials?", a: "No. Your lesson plans, syllabus, and videos are kept 100% private and are NOT used to train the public AI models." },
              ].map((faq, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-lg mb-2">{faq.q}</h4>
                  <p className="text-slate-600">{faq.a}</p>
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
