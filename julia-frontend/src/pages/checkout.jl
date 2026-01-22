"""
ATHLYNX Checkout Page
Stripe Integration for Patent Purchase
"""

using Genie.Renderer.Html

function render_checkout()
    html("""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Checkout - ATHLYNX AI</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://js.stripe.com/v3/"></script>
    </head>
    <body class="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white min-h-screen">
        <!-- Header -->
        <header class="container mx-auto px-4 py-6">
            <nav class="flex justify-between items-center">
                <a href="/" class="text-3xl font-bold">
                    <span class="text-blue-400">ATHLYNX</span>
                    <span class="text-purple-400">AI</span>
                </a>
                <a href="/patents" class="text-gray-400 hover:text-white transition">← Back to Patents</a>
            </nav>
        </header>

        <!-- Checkout -->
        <main class="container mx-auto px-4 py-20">
            <div class="max-w-2xl mx-auto">
                <div class="text-center mb-12">
                    <h1 class="text-5xl font-bold mb-4">Secure Checkout</h1>
                    <p class="text-xl text-gray-300">Complete your purchase securely with Stripe</p>
                </div>

                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                    <div id="orderSummary" class="mb-8">
                        <h2 class="text-2xl font-bold mb-4">Order Summary</h2>
                        <div class="bg-white/5 rounded-lg p-6">
                            <div class="flex justify-between items-center mb-4">
                                <span id="patentName" class="text-lg">Loading...</span>
                                <span id="patentPrice" class="text-2xl font-bold text-green-400">\$0</span>
                            </div>
                            <div class="text-sm text-gray-400">
                                <p>✅ 7-Day Free Trial (Jan 22-28, 2026)</p>
                                <p>✅ Access to all features</p>
                                <p>✅ Cancel anytime</p>
                                <p class="mt-2 text-blue-400">Billing starts February 1, 2026</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        id="checkoutButton"
                        class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-full text-xl font-bold transition shadow-2xl"
                    >
                        Proceed to Stripe Checkout
                    </button>

                    <div class="mt-6 text-center text-sm text-gray-400">
                        <p>🔒 Secure payment powered by Stripe</p>
                        <p class="mt-2">Your payment information is encrypted and secure</p>
                    </div>
                </div>
            </div>
        </main>

        <script>
            // Get patent from URL
            const urlParams = new URLSearchParams(window.location.search);
            const patentId = urlParams.get('patent');

            const patents = {
                'US10123456': { name: 'NIL Valuation Engine', price: 199, priceId: 'price_nil_valuation' },
                'US10234567': { name: 'Transfer Portal AI', price: 199, priceId: 'price_transfer_portal' },
                'US10345678': { name: 'Athlete Playbook', price: 199, priceId: 'price_athlete_playbook' },
                'US10456789': { name: 'Collective Matching', price: 199, priceId: 'price_collective_matching' },
                'US10567890': { name: 'Career Trajectory AI', price: 199, priceId: 'price_career_trajectory' },
                'BUNDLE': { name: 'Complete Patent Bundle', price: 999, priceId: 'price_bundle' }
            };

            if (patentId && patents[patentId]) {
                const patent = patents[patentId];
                document.getElementById('patentName').textContent = patent.name;
                document.getElementById('patentPrice').textContent = '\$' + patent.price + '/year';
            }

            document.getElementById('checkoutButton').addEventListener('click', async () => {
                try {
                    const response = await fetch('/api/stripe/create-checkout-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            price_id: patents[patentId].priceId,
                            success_url: window.location.origin + '/payment-success',
                            cancel_url: window.location.origin + '/patents'
                        })
                    });

                    const result = await response.json();

                    if (result.url) {
                        window.location.href = result.url;
                    } else {
                        alert('Checkout failed. Please try again.');
                    }
                } catch (error) {
                    console.error('Checkout error:', error);
                    alert('Network error. Please try again.');
                }
            });
        </script>
    </body>
    </html>
    """)
end
