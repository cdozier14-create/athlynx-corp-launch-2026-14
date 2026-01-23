import { Link } from "wouter";
import { Lock, Shield, Eye, Database, Globe, Mail, Phone } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-blue-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/athlynx-playbook-logo.png" alt="ATHLYNX" className="h-12 rounded-lg" />
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/legal">
              <button className="text-slate-300 hover:text-white px-4 py-2">Legal Hub</button>
            </Link>
            <Link href="/">
              <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Lock className="w-4 h-4" />
            PRIVACY POLICY
          </div>
          <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Last Updated: January 7, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-400" />
              Introduction
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Dozier Holdings Group, LLC and its subsidiaries ("DHG," "ATHLYNX," "we," "us," or "our") 
              respect your privacy and are committed to protecting your personal data. This privacy policy 
              explains how we collect, use, disclose, and safeguard your information when you visit our 
              websites (athlynxapp.vip, athlynx.io, athlynx.net, transferportal.ai) and use our services.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Database className="w-6 h-6 text-purple-400" />
              Information We Collect
            </h2>
            <div className="space-y-4 text-slate-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Name, email address, phone number</li>
                  <li>Mailing address and billing information</li>
                  <li>Date of birth and gender</li>
                  <li>Athletic information (sport, position, school, stats)</li>
                  <li>Social media profiles and handles</li>
                  <li>Profile photos and media content</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>IP address and device information</li>
                  <li>Browser type and operating system</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Referring website and search terms</li>
                  <li>Location data (with consent)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Health Information (HIPAA Protected)</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Medical records (with explicit consent)</li>
                  <li>Injury history and recovery status</li>
                  <li>Physical assessments and fitness data</li>
                  <li>Mental health and wellness information</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-green-400" />
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>Provide and maintain our services</li>
              <li>Process transactions and send related information</li>
              <li>Send promotional communications (with consent)</li>
              <li>Respond to inquiries and provide customer support</li>
              <li>Analyze usage patterns to improve our services</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Comply with legal obligations</li>
              <li>Facilitate NIL deals and brand partnerships</li>
              <li>Connect athletes with schools and recruiters</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Globe className="w-6 h-6 text-cyan-400" />
              Information Sharing
            </h2>
            <p className="text-slate-300 mb-4">We may share your information with:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li><strong>Service Providers:</strong> Third parties who perform services on our behalf</li>
              <li><strong>Business Partners:</strong> Brands, schools, and agencies (with your consent)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
              <li><strong>With Your Consent:</strong> For any other purpose with your explicit consent</li>
            </ul>
            <p className="text-slate-400 mt-4 text-sm">
              We never sell your personal information to third parties.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <div className="grid md:grid-cols-2 gap-4 text-slate-300">
              <div className="bg-slate-700/50 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-2">Access</h3>
                <p className="text-sm">Request a copy of your personal data</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-2">Correction</h3>
                <p className="text-sm">Request correction of inaccurate data</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-2">Deletion</h3>
                <p className="text-sm">Request deletion of your personal data</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-2">Portability</h3>
                <p className="text-sm">Request transfer of your data</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-2">Opt-Out</h3>
                <p className="text-sm">Opt out of marketing communications</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-2">Restrict</h3>
                <p className="text-sm">Restrict processing of your data</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-slate-300 mb-6">
              For privacy-related inquiries or to exercise your rights, contact us:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>privacy@athlynx.ai</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-green-400" />
                <span>+1 (601) 498-5282</span>
              </div>
            </div>
            <div className="mt-6 text-slate-400 text-sm">
              <p><strong>Dozier Holdings Group, LLC</strong></p>
              <p>12036 Lake Portal Drive, Houston, TX 77047</p>
              <p>831 West 28th Street, Laurel, MS 39440</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400 text-sm">© 2026 Dozier Holdings Group, LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
