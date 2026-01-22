import { Link } from "wouter";
import { FileText, Scale, AlertTriangle, CheckCircle, Shield, Users, DollarSign } from "lucide-react";

export default function TermsOfService() {
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
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            TERMS OF SERVICE
          </div>
          <h1 className="text-4xl font-black mb-4">Terms of Service</h1>
          <p className="text-slate-400">Effective Date: January 7, 2026</p>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Scale className="w-6 h-6 text-purple-400" />
              Agreement to Terms
            </h2>
            <p className="text-slate-300 leading-relaxed">
              By accessing or using ATHLYNX services (including athlynx.ai, athlynx.io, athlynx.net, 
              and transferportal.ai), you agree to be bound by these Terms of Service. If you do not 
              agree to these terms, do not use our services. These terms constitute a legally binding 
              agreement between you and Dozier Holdings Group, LLC.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-400" />
              Eligibility
            </h2>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>You must be at least 13 years old to use our services</li>
              <li>Users under 18 must have parental or guardian consent</li>
              <li>Athletes must comply with NCAA, NAIA, or applicable governing body rules</li>
              <li>You must provide accurate and complete registration information</li>
              <li>You are responsible for maintaining the security of your account</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              Acceptable Use
            </h2>
            <p className="text-slate-300 mb-4">You agree to use ATHLYNX services only for lawful purposes. You will NOT:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated systems to scrape or collect data without permission</li>
              <li>Impersonate another person or entity</li>
              <li>Engage in fraudulent NIL deals or misrepresent your identity</li>
              <li>Harass, abuse, or harm other users</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-amber-400" />
              NIL Deals & Transactions
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>
                ATHLYNX facilitates connections between athletes, brands, and other parties for NIL 
                (Name, Image, Likeness) opportunities. By using our platform:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>You acknowledge that ATHLYNX is a platform, not a party to NIL agreements</li>
                <li>You are responsible for ensuring your NIL activities comply with applicable rules</li>
                <li>ATHLYNX may charge fees for premium features and successful transactions</li>
                <li>All financial transactions are processed through secure third-party providers</li>
                <li>Disputes between parties should be resolved directly or through mediation</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-cyan-400" />
              Intellectual Property
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>
                All content, features, and functionality of ATHLYNX services are owned by Dozier Holdings 
                Group, LLC and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                <strong>Your Content:</strong> You retain ownership of content you submit but grant ATHLYNX 
                a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content 
                in connection with our services.
              </p>
              <p>
                <strong>Trademarks:</strong> ATHLYNX, DHG, and related logos are trademarks of Dozier Holdings 
                Group, LLC. You may not use these marks without prior written permission.
              </p>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              Disclaimers & Limitations
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>
                <strong>AS-IS BASIS:</strong> ATHLYNX services are provided "as is" and "as available" 
                without warranties of any kind, either express or implied.
              </p>
              <p>
                <strong>LIMITATION OF LIABILITY:</strong> To the maximum extent permitted by law, Dozier 
                Holdings Group, LLC shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages arising from your use of our services.
              </p>
              <p>
                <strong>NO GUARANTEE:</strong> We do not guarantee any specific results from using our 
                platform, including NIL deal values, scholarship offers, or transfer opportunities.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">Termination</h2>
            <p className="text-slate-300">
              We reserve the right to suspend or terminate your account at any time for violations of 
              these terms or for any other reason at our sole discretion. Upon termination, your right 
              to use our services will immediately cease. Provisions that by their nature should survive 
              termination will survive.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
            <p className="text-slate-300">
              These Terms shall be governed by and construed in accordance with the laws of the State of 
              Texas, without regard to its conflict of law provisions. Any disputes arising from these 
              terms shall be resolved in the courts of Harris County, Texas.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <p className="text-slate-300 mb-4">
              For questions about these Terms of Service, contact us:
            </p>
            <div className="text-slate-400">
              <p><strong>Dozier Holdings Group, LLC</strong></p>
              <p>Email: legal@athlynx.ai</p>
              <p>Phone: +1 (601) 498-5282</p>
              <p>Address: 12036 Lake Portal Drive, Houston, TX 77047</p>
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
