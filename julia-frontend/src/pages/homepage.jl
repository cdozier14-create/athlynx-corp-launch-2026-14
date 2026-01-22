"""
ATHLYNX Homepage - "THE PERFECT STORM"
Julia Server-Side Rendered Landing Page
"""

using Genie.Renderer.Html

function render_homepage()
    html("""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ATHLYNX AI - The Perfect Storm | NIL Revolution 2026</title>
        <meta name="description" content="Complete athlete ecosystem powered by AI. 5 US Patents. Transfer Portal AI. NIL Valuation. Career Trajectory. Join the revolution.">
        <link rel="stylesheet" href="/assets/styles.css">
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white min-h-screen">
        <!-- Header -->
        <header class="container mx-auto px-4 py-6">
            <nav class="flex justify-between items-center">
                <div class="text-3xl font-bold">
                    <span class="text-blue-400">ATHLYNX</span>
                    <span class="text-purple-400">AI</span>
                </div>
                <div class="space-x-6">
                    <a href="/patents" class="hover:text-blue-400 transition">Patents</a>
                    <a href="/signup" class="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition">Sign Up</a>
                </div>
            </nav>
        </header>

        <!-- Hero Section -->
        <main class="container mx-auto px-4 py-20">
            <div class="text-center max-w-4xl mx-auto">
                <h1 class="text-6xl md:text-7xl font-bold mb-6">
                    THE PERFECT<br>
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                        STORM
                    </span>
                </h1>
                
                <p class="text-2xl md:text-3xl text-gray-300 mb-8">
                    Complete Athlete Ecosystem Powered by AI
                </p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                        <div class="text-5xl mb-4">🏆</div>
                        <h3 class="text-xl font-bold mb-2">5 US Patents</h3>
                        <p class="text-gray-400">Revolutionary technology protecting athletes</p>
                    </div>
                    
                    <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                        <div class="text-5xl mb-4">🤖</div>
                        <h3 class="text-xl font-bold mb-2">AI-Powered</h3>
                        <p class="text-gray-400">Transfer Portal AI, NIL Valuation, Career Trajectory</p>
                    </div>
                    
                    <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                        <div class="text-5xl mb-4">💰</div>
                        <h3 class="text-xl font-bold mb-2">Monetized</h3>
                        <p class="text-gray-400">From \$199/year to \$999 full bundle</p>
                    </div>
                </div>

                <!-- CTA Buttons -->
                <div class="flex gap-4 justify-center mb-12">
                    <a href="/signup" class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-full text-xl font-bold transition shadow-2xl">
                        Start Free Trial
                    </a>
                    <a href="/patents" class="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-full text-xl font-bold transition backdrop-blur-lg">
                        View Patents
                    </a>
                </div>

                <!-- Features -->
                <div class="bg-white/5 backdrop-blur-lg rounded-2xl p-8 mb-12">
                    <h2 class="text-3xl font-bold mb-8">10 Revolutionary Apps</h2>
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div class="text-center">
                            <div class="text-4xl mb-2">💎</div>
                            <p class="font-semibold">Diamond Grind</p>
                        </div>
                        <div class="text-center">
                            <div class="text-4xl mb-2">⚔️</div>
                            <p class="font-semibold">Warrior's Playbook</p>
                        </div>
                        <div class="text-center">
                            <div class="text-4xl mb-2">🏦</div>
                            <p class="font-semibold">NIL Vault</p>
                        </div>
                        <div class="text-center">
                            <div class="text-4xl mb-2">🤝</div>
                            <p class="font-semibold">AI Sales</p>
                        </div>
                        <div class="text-center">
                            <div class="text-4xl mb-2">🙏</div>
                            <p class="font-semibold">Faith</p>
                        </div>
                        <div class="text-center">
                            <div class="text-4xl mb-2">🎯</div>
                            <p class="font-semibold">AI Recruiter</p>
                        </div>
                        <div class="text-center">
                            <div class="text-4xl mb-2">📱</div>
                            <p class="font-semibold">AI Content</p>
                        </div>
                        <div class="text-center">
                            <div class="text-4xl mb-2">🔧</div>
                            <p class="font-semibold">Infrastructure</p>
                        </div>
                        <div class="text-center">
                            <div class="text-4xl mb-2">🎓</div>
                            <p class="font-semibold">Transfer Portal</p>
                        </div>
                        <div class="text-center">
                            <div class="text-4xl mb-2">⚡</div>
                            <p class="font-semibold">NIL Calculator</p>
                        </div>
                    </div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-3 gap-8 text-center">
                    <div>
                        <div class="text-5xl font-bold text-blue-400 mb-2">5</div>
                        <p class="text-gray-400">US Patents</p>
                    </div>
                    <div>
                        <div class="text-5xl font-bold text-purple-400 mb-2">10</div>
                        <p class="text-gray-400">Core Apps</p>
                    </div>
                    <div>
                        <div class="text-5xl font-bold text-pink-400 mb-2">∞</div>
                        <p class="text-gray-400">Possibilities</p>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="container mx-auto px-4 py-8 text-center text-gray-400">
            <p>&copy; 2026 ATHLYNX AI Corporation. All rights reserved.</p>
            <p class="mt-2">Dreams Do Come True 2026 🦁</p>
        </footer>

        <script>
            console.log('🚀 ATHLYNX AI - The Perfect Storm');
            console.log('🦁 Dreams Do Come True 2026');
        </script>
    </body>
    </html>
    """)
end
