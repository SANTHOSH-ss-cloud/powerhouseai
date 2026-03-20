import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />
      
      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-slate-500 mb-12">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-slate max-w-none">
            <p>
              At ClassCraft Presentations, we take the privacy of our educators, administrators, and students extremely seriously. This Privacy Policy outlines what information we collect, how it is processed safely, and your rights as an educator. We adhere strongly to standards similar to FERPA and COPPA.
            </p>

            <h2>Data We Collect</h2>
            <p>
              When using ClassCraft Presentations, we only automatically collect essential data needed for functionality, such as basic authentication via Google. Any lesson plans, transcripts, or URLs you upload are processed entirely for your direct benefit to generate targeted presentations.
            </p>

            <h2>How We Use Your Content</h2>
            <p>
              <strong>Your content is never used to train public AI models.</strong> The materials you upload (PDFs, Word documents, YouTube videos, and transcripts) are only passed securely to generation models to return your generated slides and documents. We claim no intellectual property rights over your original content.
            </p>

            <h2>Storage & Security</h2>
            <p>
              Student privacy is our top priority. The presentations you generate are stored securely using industry-standard encryption. Only authenticated users from your account have access to these files. We employ standard web security practices to ensure data breaches are mitigated proactively.
            </p>

            <h2>Third-Party Services</h2>
            <p>
              To process payments, we use Razorpay. To authenticate you securely, we rely on Firebase Authentication. To process AI text and slide content, we leverage secure API integrations that operate under strict zero-retention policies for public model training.
            </p>
            
            <h2>Data Retention & Deletion</h2>
            <p>
              You may delete your account and all associated classroom materials at any time from your dashboard settings. Once deleted, your generated presentations and source materials are permanently scrubbed from our active databases within a reasonable commercial timeframe.
            </p>

            <h2>Contact Information</h2>
            <p>
              If you have any questions as a school administrator regarding data protection agreements (DPA) or student privacy compliance, please reach out to us directly at <strong>privacy@classcraft.io</strong>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
