function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">DHG</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Dozier Holdings Group</h1>
                <p className="text-sm text-slate-400">Building the Future</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#portfolio" className="text-slate-300 hover:text-white transition">Portfolio</a>
              <a href="#about" className="text-slate-300 hover:text-white transition">About</a>
              <a href="#contact" className="text-slate-300 hover:text-white transition">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Dreams Do Come True
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Empowering athletes and building the future of sports technology
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://athlynx.ai"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Explore Athlynx
            </a>
            <a
              href="#portfolio"
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
            >
              View Portfolio
            </a>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="container mx-auto px-6 py-20">
        <h3 className="text-4xl font-bold text-white text-center mb-12">Our Portfolio</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Athlynx */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">🦁</span>
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">Athlynx.ai</h4>
            <p className="text-slate-300 mb-4">
              Complete athlete ecosystem for NIL deals, social networking, and career development
            </p>
            <a
              href="https://athlynx.ai"
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Visit Platform →
            </a>
          </div>

          {/* Athlynx VIP */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-purple-500 transition">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">👑</span>
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">Athlynx VIP</h4>
            <p className="text-slate-300 mb-4">
              Premium portal with exclusive features, advanced analytics, and priority support
            </p>
            <a
              href="https://athlynxapp.vip"
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Access VIP Portal →
            </a>
          </div>

          {/* Transfer Portal */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-green-500 transition">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">🏈</span>
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">Transfer Portal AI</h4>
            <p className="text-slate-300 mb-4">
              AI-powered athlete transfer management with school matching and analytics
            </p>
            <a
              href="https://transferportal.ai"
              className="text-green-400 hover:text-green-300 font-semibold"
            >
              Explore Transfers →
            </a>
          </div>

          {/* Diamond Grind */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-orange-500 transition">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-400 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">💎</span>
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">Diamond Grind</h4>
            <p className="text-slate-300 mb-4">
              Elite training platform with performance tracking and mental conditioning
            </p>
            <a
              href="https://diamond-grind.ai"
              className="text-orange-400 hover:text-orange-300 font-semibold"
            >
              Start Training →
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-6 py-20 bg-slate-800/30 rounded-3xl my-20">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-6">About DHG</h3>
          <p className="text-lg text-slate-300 mb-6">
            Dozier Holdings Group is building the future of athlete development and opportunity. 
            Our portfolio of innovative applications empowers athletes at every stage of their journey, 
            from recruitment to NIL deals to career transitions.
          </p>
          <p className="text-lg text-slate-300">
            Founded in 2026, we're committed to leveraging technology to create unprecedented 
            opportunities for athletes worldwide.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Get In Touch</h3>
          <p className="text-lg text-slate-300 mb-8">
            Interested in partnering with us or learning more about our portfolio?
          </p>
          <a
            href="mailto:contact@dozierholdingsgroup.com"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-700 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-slate-400">
                © 2026 Dozier Holdings Group. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-slate-400 hover:text-white transition">
                Privacy
              </a>
              <a href="/terms" className="text-slate-400 hover:text-white transition">
                Terms
              </a>
              <a href="https://github.com/cdozier14-create" className="text-slate-400 hover:text-white transition">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
