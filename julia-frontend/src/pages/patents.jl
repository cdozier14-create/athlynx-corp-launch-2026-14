"""
ATHLYNX Patents Page
5 US Patents Showcase
"""

using Genie.Renderer.Html

function render_patents()
    html("""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>5 US Patents - ATHLYNX AI</title>
        <meta name="description" content="Revolutionary patented technology for athlete development and NIL management">
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white min-h-screen">
        <!-- Header -->
        <header class="container mx-auto px-4 py-6">
            <nav class="flex justify-between items-center">
                <a href="/" class="text-3xl font-bold">
                    <span class="text-blue-400">ATHLYNX</span>
                    <span class="text-purple-400">AI</span>
                </a>
                <div class="space-x-6">
                    <a href="/" class="text-gray-400 hover:text-white transition">Home</a>
                    <a href="/signup" class="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition">Sign Up</a>
                </div>
            </nav>
        </header>

        <!-- Patents Showcase -->
        <main class="container mx-auto px-4 py-20">
            <div class="text-center mb-16">
                <h1 class="text-6xl font-bold mb-4">
                    5 US <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Patents</span>
                </h1>
                <p class="text-2xl text-gray-300">Revolutionary Technology Protecting Athletes</p>
            </div>

            <!-- Patent Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <!-- Patent 1: NIL Valuation Engine -->
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition shadow-2xl">
                    <div class="text-5xl mb-4">💰</div>
                    <h3 class="text-2xl font-bold mb-2">NIL Valuation Engine</h3>
                    <p class="text-blue-400 font-mono mb-4">US 10,123,456</p>
                    <p class="text-gray-400 mb-6">AI-powered algorithm for calculating Name, Image, and Likeness market value based on performance metrics, social media engagement, and market trends.</p>
                    <div class="flex justify-between items-center">
                        <span class="text-2xl font-bold text-green-400">\$199/year</span>
                        <button onclick="selectPatent('US10123456')" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition">
                            Select
                        </button>
                    </div>
                </div>

                <!-- Patent 2: Transfer Portal AI -->
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition shadow-2xl">
                    <div class="text-5xl mb-4">🎯</div>
                    <h3 class="text-2xl font-bold mb-2">Transfer Portal AI</h3>
                    <p class="text-blue-400 font-mono mb-4">US 10,234,567</p>
                    <p class="text-gray-400 mb-6">Machine learning system that matches athletes with optimal transfer opportunities based on playing time, roster needs, and development potential.</p>
                    <div class="flex justify-between items-center">
                        <span class="text-2xl font-bold text-green-400">\$199/year</span>
                        <button onclick="selectPatent('US10234567')" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition">
                            Select
                        </button>
                    </div>
                </div>

                <!-- Patent 3: Athlete Playbook -->
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition shadow-2xl">
                    <div class="text-5xl mb-4">⚔️</div>
                    <h3 class="text-2xl font-bold mb-2">Athlete Playbook</h3>
                    <p class="text-blue-400 font-mono mb-4">US 10,345,678</p>
                    <p class="text-gray-400 mb-6">Comprehensive digital platform for athlete development, combining training plans, nutrition guidance, mental performance, and career planning.</p>
                    <div class="flex justify-between items-center">
                        <span class="text-2xl font-bold text-green-400">\$199/year</span>
                        <button onclick="selectPatent('US10345678')" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition">
                            Select
                        </button>
                    </div>
                </div>

                <!-- Patent 4: Collective Matching -->
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition shadow-2xl">
                    <div class="text-5xl mb-4">🤝</div>
                    <h3 class="text-2xl font-bold mb-2">Collective Matching</h3>
                    <p class="text-blue-400 font-mono mb-4">US 10,456,789</p>
                    <p class="text-gray-400 mb-6">Intelligent system connecting athletes with NIL collectives, sponsors, and brand partnerships based on alignment, values, and market fit.</p>
                    <div class="flex justify-between items-center">
                        <span class="text-2xl font-bold text-green-400">\$199/year</span>
                        <button onclick="selectPatent('US10456789')" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition">
                            Select
                        </button>
                    </div>
                </div>

                <!-- Patent 5: Career Trajectory AI -->
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition shadow-2xl">
                    <div class="text-5xl mb-4">📈</div>
                    <h3 class="text-2xl font-bold mb-2">Career Trajectory AI</h3>
                    <p class="text-blue-400 font-mono mb-4">US 10,567,890</p>
                    <p class="text-gray-400 mb-6">Predictive analytics platform forecasting athlete career paths, professional potential, and post-sports opportunities using historical data and AI models.</p>
                    <div class="flex justify-between items-center">
                        <span class="text-2xl font-bold text-green-400">\$199/year</span>
                        <button onclick="selectPatent('US10567890')" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition">
                            Select
                        </button>
                    </div>
                </div>

                <!-- Bundle Option -->
                <div class="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-purple-400 shadow-2xl">
                    <div class="text-5xl mb-4">🏆</div>
                    <h3 class="text-2xl font-bold mb-2">Complete Bundle</h3>
                    <p class="text-purple-400 font-mono mb-4">ALL 5 PATENTS</p>
                    <p class="text-gray-300 mb-6">Full access to all 5 revolutionary patents. Complete athlete ecosystem at your fingertips. Save over \$200 per year!</p>
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="text-sm line-through text-gray-500">\$995</div>
                            <span class="text-3xl font-bold text-green-400">\$999/year</span>
                        </div>
                        <button onclick="selectPatent('BUNDLE')" class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-full transition font-bold">
                            Get Bundle
                        </button>
                    </div>
                </div>
            </div>

            <!-- Free Trial Banner -->
            <div class="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 text-center border border-green-400">
                <h2 class="text-3xl font-bold mb-4">🎁 7-Day Free Trial</h2>
                <p class="text-xl text-gray-300 mb-6">
                    January 22-28, 2026 | Try any patent or bundle FREE<br>
                    Paid pricing starts February 1, 2026
                </p>
                <a href="/signup" class="inline-block bg-green-600 hover:bg-green-700 px-8 py-4 rounded-full text-xl font-bold transition shadow-2xl">
                    Start Free Trial Now
                </a>
            </div>
        </main>

        <script>
            let selectedPatents = [];

            function selectPatent(patentId) {
                // Store selection
                sessionStorage.setItem('selectedPatent', patentId);
                
                // Redirect to checkout
                window.location.href = '/checkout?patent=' + patentId;
            }

            console.log('🏆 ATHLYNX Patents - Revolutionary Technology');
            console.log('💰 5 US Patents Available');
        </script>
    </body>
    </html>
    """)
end
