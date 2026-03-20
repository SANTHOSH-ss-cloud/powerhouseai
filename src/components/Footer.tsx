import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <span className="text-xl font-extrabold tracking-tight text-indigo-900">ClassCraft</span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
              AI presentation builder for teachers and students. The best lesson plan to PPT converter that turns YouTube to PPT seamlessly.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"><Github className="w-4 h-4" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-slate-600 font-medium">
              <li><Link to="/#features" className="hover:text-indigo-600">Features</Link></li>
              <li><Link to="/#templates" className="hover:text-indigo-600">Templates</Link></li>
              <li><Link to="/pricing" className="hover:text-indigo-600">Pricing</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-600 font-medium">
              <li><a href="#" className="hover:text-indigo-600">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-600">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-600">Teacher Guides</a></li>
              <li><a href="#" className="hover:text-indigo-600">API Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-slate-600 font-medium">
              <li><Link to="/about" className="hover:text-indigo-600">About Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-600">Terms of Service</Link></li>
              <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} ClassCraft Presentations. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-slate-900">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-900">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
