import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-indigo-900 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-indigo-900">ClassCraft</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#templates" className="hover:text-indigo-600 transition-colors">Templates</a>
            <Link to="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
            <Link to="/about" className="hover:text-indigo-600 transition-colors">About</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hidden md:block text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Log In</Link>
            <Link to="/dashboard" className="px-6 py-2.5 bg-indigo-900 text-white text-sm font-bold rounded-full shadow-lg shadow-indigo-900/20 hover:bg-amber-500 hover:shadow-amber-500/20 transition-all">Start for free</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
