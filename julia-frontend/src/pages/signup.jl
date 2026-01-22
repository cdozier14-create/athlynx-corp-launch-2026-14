"""
ATHLYNX Signup Page
Julia Server-Side Rendered Signup Form
"""

using Genie.Renderer.Html

function render_signup()
    html("""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign Up - ATHLYNX AI</title>
        <meta name="description" content="Join ATHLYNX AI - The complete athlete ecosystem powered by AI">
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
                <a href="/" class="text-gray-400 hover:text-white transition">← Back to Home</a>
            </nav>
        </header>

        <!-- Signup Form -->
        <main class="container mx-auto px-4 py-20">
            <div class="max-w-2xl mx-auto">
                <div class="text-center mb-12">
                    <h1 class="text-5xl font-bold mb-4">
                        Join The <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Revolution</span>
                    </h1>
                    <p class="text-xl text-gray-300">Sign up for early access to ATHLYNX AI</p>
                </div>

                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                    <form id="signupForm" class="space-y-6">
                        <!-- Full Name -->
                        <div>
                            <label for="fullName" class="block text-sm font-medium mb-2">Full Name</label>
                            <input 
                                type="text" 
                                id="fullName" 
                                name="fullName" 
                                required
                                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                placeholder="John Smith"
                            />
                        </div>

                        <!-- Email -->
                        <div>
                            <label for="email" class="block text-sm font-medium mb-2">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required
                                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                placeholder="john@example.com"
                            />
                        </div>

                        <!-- Phone -->
                        <div>
                            <label for="phone" class="block text-sm font-medium mb-2">Phone Number</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone" 
                                required
                                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                placeholder="+1-555-123-4567"
                            />
                        </div>

                        <!-- Role -->
                        <div>
                            <label for="role" class="block text-sm font-medium mb-2">I am a...</label>
                            <select 
                                id="role" 
                                name="role" 
                                required
                                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 transition text-white"
                            >
                                <option value="">Select your role</option>
                                <option value="athlete">Athlete</option>
                                <option value="coach">Coach</option>
                                <option value="parent">Parent</option>
                                <option value="brand">Brand</option>
                                <option value="investor">Investor</option>
                            </select>
                        </div>

                        <!-- Sport -->
                        <div>
                            <label for="sport" class="block text-sm font-medium mb-2">Sport</label>
                            <input 
                                type="text" 
                                id="sport" 
                                name="sport" 
                                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                placeholder="Football, Basketball, etc."
                            />
                        </div>

                        <!-- Submit Button -->
                        <button 
                            type="submit" 
                            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-full text-xl font-bold transition shadow-2xl"
                        >
                            Join Waitlist
                        </button>
                    </form>

                    <div id="successMessage" class="hidden mt-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-center">
                        <p class="font-bold">🎉 Welcome to ATHLYNX AI!</p>
                        <p class="text-sm mt-2">Check your email and SMS for verification code.</p>
                    </div>

                    <div id="errorMessage" class="hidden mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-center">
                        <p class="font-bold">❌ Signup Failed</p>
                        <p class="text-sm mt-2" id="errorText"></p>
                    </div>
                </div>
            </div>
        </main>

        <script>
            document.getElementById('signupForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = {
                    fullName: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    role: document.getElementById('role').value,
                    sport: document.getElementById('sport').value,
                    device: /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'iPhone' : 
                            /Android/.test(navigator.userAgent) ? 'Android' : 'Desktop',
                    browser: navigator.userAgent.includes('Chrome') ? 'Chrome' :
                            navigator.userAgent.includes('Safari') ? 'Safari' :
                            navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Other',
                    os: navigator.platform
                };

                try {
                    const response = await fetch('/api/waitlist/signup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });

                    const result = await response.json();

                    if (result.success) {
                        document.getElementById('signupForm').classList.add('hidden');
                        document.getElementById('successMessage').classList.remove('hidden');
                        
                        // Redirect to dashboard after 3 seconds
                        setTimeout(() => {
                            window.location.href = '/dashboard';
                        }, 3000);
                    } else {
                        // Handle different error types
                        let errorText = result.error || 'Unknown error occurred';
                        
                        if (response.status === 400) {
                            errorText = result.error || 'Invalid form data. Please check your inputs.';
                        } else if (response.status === 409) {
                            errorText = 'Email already registered. Please login instead.';
                        } else if (response.status === 500) {
                            errorText = 'Server error. Please try again in a moment.';
                        }
                        
                        document.getElementById('errorMessage').classList.remove('hidden');
                        document.getElementById('errorText').textContent = errorText;
                    }
                } catch (error) {
                    document.getElementById('errorMessage').classList.remove('hidden');
                    document.getElementById('errorText').textContent = 'Network error. Please check your connection and try again.';
                    console.error('Signup error:', error);
                }
            });
        </script>
    </body>
    </html>
    """)
end
