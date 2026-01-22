"""
ATHLYNX Dashboard
Access to 10 Apps Post-Signup
"""

using Genie.Renderer.Html

function render_dashboard()
    html("""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard - ATHLYNX AI</title>
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
                <div class="flex items-center space-x-6">
                    <span id="userName" class="text-gray-300">Welcome!</span>
                    <button onclick="logout()" class="text-gray-400 hover:text-white transition">Logout</button>
                </div>
            </nav>
        </header>

        <!-- Dashboard -->
        <main class="container mx-auto px-4 py-20">
            <div class="text-center mb-16">
                <h1 class="text-5xl font-bold mb-4">
                    Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Dashboard</span>
                </h1>
                <p class="text-2xl text-gray-300">Access all 10 revolutionary apps</p>
            </div>

            <!-- App Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <!-- App 1: Diamond Grind -->
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition shadow-2xl cursor-pointer" onclick="openApp('diamond-grind')">
                    <div class="text-6xl mb-4">💎</div>
                    <h3 class="text-2xl font-bold mb-2">Diamond Grind</h3>
                    <p class="text-gray-400">Performance tracking and goal setting</p>
                </div>

                <!-- App 2: Warrior's Playbook -->
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition shadow-2xl cursor-pointer" onclick="openApp('warriors-playbook')">
                    <div class="text-6xl mb-4">⚔️</div>
                    <h3 class="text-2xl font-bold mb-2">Warrior's Playbook</h3>
                    <p class="text-gray-400">Training plans and strategy guides</p>
                </div>

                <!-- App 3: NIL Vault -->
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition shadow-2xl cursor-pointer" onclick="openApp('nil-vault')">
                    <div class="text-6xl mb-4">🏦</div>
                    <h3 class="text-2xl font-bold mb-2">NIL Vault</h3>
                    <p class="text-gray-400">Manage your NIL deals and earnings</p>
                </div>

                <!-- App 4: AI Sales -->
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition shadow-2xl cursor-pointer" onclick="openApp('ai-sales')">
                    <div class="text-6xl mb-4">🤝</div>
                    <h3 class="text-2xl font-bold mb-2">AI Sales</h3>
                    <p class="text-gray-400">Connect with brands and sponsors</p>
                </div>

                <!-- App 5: Faith -->
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition shadow-2xl cursor-pointer" onclick="openApp('faith')">
                    <div class="text-6xl mb-4">🙏</div>
                    <h3 class="text-2xl font-bold mb-2">Faith</h3>
                    <p class="text-gray-400">Spiritual development and community</p>
                </div>

                <!-- App 6: AI Recruiter -->
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition shadow-2xl cursor-pointer" onclick="openApp('ai-recruiter')">
                    <div class="text-6xl mb-4">🎯</div>
                    <h3 class="text-2xl font-bold mb-2">AI Recruiter</h3>
                    <p class="text-gray-400">College recruitment assistant</p>
                </div>

                <!-- App 7: AI Content -->
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition shadow-2xl cursor-pointer" onclick="openApp('ai-content')">
                    <div class="text-6xl mb-4">📱</div>
                    <h3 class="text-2xl font-bold mb-2">AI Content</h3>
                    <p class="text-gray-400">Social media content creation</p>
                </div>

                <!-- App 8: Infrastructure -->
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition shadow-2xl cursor-pointer" onclick="openApp('infrastructure')">
                    <div class="text-6xl mb-4">🔧</div>
                    <h3 class="text-2xl font-bold mb-2">Infrastructure</h3>
                    <p class="text-gray-400">System settings and configuration</p>
                </div>

                <!-- App 9: Transfer Portal -->
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition shadow-2xl cursor-pointer" onclick="openApp('transfer-portal')">
                    <div class="text-6xl mb-4">🎓</div>
                    <h3 class="text-2xl font-bold mb-2">Transfer Portal</h3>
                    <p class="text-gray-400">Find your next opportunity</p>
                </div>

                <!-- App 10: NIL Calculator -->
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition shadow-2xl cursor-pointer" onclick="openApp('nil-calculator')">
                    <div class="text-6xl mb-4">⚡</div>
                    <h3 class="text-2xl font-bold mb-2">NIL Calculator</h3>
                    <p class="text-gray-400">Calculate your market value</p>
                </div>
            </div>

            <!-- Patent Access Section -->
            <div class="mt-16 max-w-4xl mx-auto">
                <div class="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-400 text-center">
                    <h2 class="text-3xl font-bold mb-4">🏆 Unlock Full Patent Access</h2>
                    <p class="text-xl text-gray-300 mb-6">Get access to all 5 revolutionary patents and advanced features</p>
                    <a href="/patents" class="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-full text-xl font-bold transition shadow-2xl">
                        View Patents
                    </a>
                </div>
            </div>
        </main>

        <script>
            function openApp(appName) {
                // In production, these would link to actual app routes
                alert('Opening ' + appName + '...');
                // window.location.href = '/apps/' + appName;
            }

            function logout() {
                if (confirm('Are you sure you want to logout?')) {
                    // Clear session
                    sessionStorage.clear();
                    localStorage.clear();
                    window.location.href = '/';
                }
            }

            // Check authentication
            window.addEventListener('load', () => {
                // In production, verify JWT token here
                console.log('🚀 Dashboard loaded');
            });
        </script>
    </body>
    </html>
    """)
end
