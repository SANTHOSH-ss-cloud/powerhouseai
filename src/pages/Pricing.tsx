import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, X, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, UserProfile } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Pricing() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handlePayment = async (type: 'one_time' | 'subscription') => {
    if (!user) {
      alert("Please login first to purchase credits or subscribe.");
      navigate('/dashboard');
      return;
    }
    setLoading(true);

    try {
      if (type === 'one_time') {
        const res = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 50 })
        });
        const order = await res.json();
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock',
          amount: order.amount,
          currency: order.currency,
          name: 'ClassCraft',
          description: '5 Generation Credits',
          order_id: order.id,
          handler: async function (response: any) {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { credits: increment(5) });
            alert("Payment successful! 5 credits added to your account.");
            navigate('/dashboard');
          },
          prefill: { email: user.email },
          theme: { color: '#4f46e5' }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const res = await fetch('/api/create-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId: '' }) // Empty handles the mock in backend for demo
        });
        const sub = await res.json();
        
        if (sub.mock) {
            const today = new Date().toISOString().split('T')[0];
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { 
              isSubscribed: true, 
              planType: 'monthly_pro',
              credits: increment(5),
              lastDailyCreditReset: today
            });
            alert("Subscription successful! You are now on the Monthly Pro plan with a 1-month free trial.");
            navigate('/dashboard');
            return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock',
          subscription_id: sub.id,
          name: 'ClassCraft',
          description: 'Monthly Pro Subscription',
          handler: async function (response: any) {
            const today = new Date().toISOString().split('T')[0];
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { 
              isSubscribed: true, 
              planType: 'monthly_pro',
              credits: increment(5),
              lastDailyCreditReset: today
            });
            alert("Subscription successful! You are now on the Monthly Pro plan.");
            navigate('/dashboard');
          },
          prefill: { email: user.email },
          theme: { color: '#4f46e5' }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error(error);
      alert("Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };
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
            {/* One Time Tier */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Basic Pass</h3>
              <p className="text-slate-500 text-sm mb-6 h-10">Best for students and quick single assignments.</p>
              <div className="mb-6 flex items-end gap-2">
                <span className="text-5xl font-extrabold text-slate-900">₹50</span>
                <span className="text-slate-500 font-medium mb-1">/ one-time</span>
              </div>
              <ul className="space-y-4 flex-1 mb-8 text-sm font-medium">
                <li className="flex gap-3 text-slate-700"><Check className="text-teal-500 w-5 h-5 shrink-0" /> 5 Generation Credits</li>
                <li className="flex gap-3 text-slate-700"><Check className="text-teal-500 w-5 h-5 shrink-0" /> PPTX, Word & PDF Export</li>
                <li className="flex gap-3 text-slate-700"><Check className="text-teal-500 w-5 h-5 shrink-0" /> Basic Educational Templates</li>
                <li className="flex gap-3 text-slate-400"><X className="text-slate-300 w-5 h-5 shrink-0" /> No Daily Free Credits</li>
                <li className="flex gap-3 text-slate-400"><X className="text-slate-300 w-5 h-5 shrink-0" /> Output Branding</li>
              </ul>
              <button disabled={loading} onClick={() => handlePayment('one_time')} className="w-full block text-center py-4 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-800 transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Buy 5 Credits"}
              </button>
            </div>

            {/* Pro Teacher Tier */}
            <div className="bg-indigo-900 rounded-[2rem] p-8 border border-indigo-700 shadow-xl shadow-indigo-900/20 flex flex-col transform md:-translate-y-4 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-indigo-950 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest shadow-sm">
                1 Month Free Trial
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Teacher Pro</h3>
              <p className="text-indigo-200 text-sm mb-6 h-10">Monthly subscription for educators converting entire syllabus.</p>
              <div className="mb-6 flex items-end gap-2 text-white">
                <span className="text-5xl font-extrabold">₹300</span>
                <span className="text-indigo-300 font-medium mb-1">/mo</span>
              </div>
              <ul className="space-y-4 flex-1 mb-8 text-sm font-medium text-white">
                <li className="flex gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> 5 Free Credits Every Day</li>
                <li className="flex gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> Video & YouTube Import</li>
                <li className="flex gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> Premium Templates</li>
                <li className="flex gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> No Watermarks</li>
                <li className="flex gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> Detailed Generation Content</li>
                <li className="flex gap-3"><Check className="text-amber-400 w-5 h-5 shrink-0" /> Auto-renews after 1st month</li>
              </ul>
              <button disabled={loading} onClick={() => handlePayment('subscription')} className="w-full block text-center py-4 bg-amber-500 hover:bg-amber-400 rounded-xl font-bold text-indigo-950 transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Start 1-Month Free Trial"}
              </button>
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
