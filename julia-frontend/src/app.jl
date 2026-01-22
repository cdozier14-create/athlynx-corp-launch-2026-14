"""
ATHLYNX AI Platform - Julia Frontend Server
High-Performance Web Server with Genie Framework

@author ATHLYNX AI Corporation
@date January 22, 2026
"""

using Genie
using Genie.Router
using Genie.Renderer.Html
using Genie.Requests
using HTTP
using JSON
using Dates

# Configuration
const PORT = parse(Int, get(ENV, "JULIA_PORT", "8000"))
const PYTHON_API = get(ENV, "PYTHON_API_URL", "http://localhost:8000")
const STRIPE_PUBLISHABLE_KEY = get(ENV, "STRIPE_PUBLISHABLE_KEY", "")

# Include page templates
include("pages/homepage.jl")
include("pages/signup.jl")
include("pages/patents.jl")
include("pages/checkout.jl")
include("pages/dashboard.jl")

# Setup Genie routes
route("/") do
    render_homepage()
end

route("/signup") do
    render_signup()
end

route("/patents") do
    render_patents()
end

route("/checkout") do
    render_checkout()
end

route("/dashboard") do
    render_dashboard()
end

# API proxy routes to Python backend
# Allowlist of permitted API endpoints for security
const ALLOWED_API_PATHS = [
    "auth", "verification", "waitlist", "feed", "athlete", "social",
    "messages", "notifications", "transfer-portal", "crm", "stripe", "vip"
]

function validate_api_path(path_str::String)
    # Extract first segment of path
    first_segment = split(path_str, '/')[1]
    return first_segment in ALLOWED_API_PATHS
end

route("/api/:path...", method = POST) do
    path = params(:path)
    body = rawpayload()
    
    # Validate API path against allowlist
    if !validate_api_path(path)
        return json(Dict("error" => "Invalid API endpoint", "success" => false), status = 403)
    end
    
    try
        response = HTTP.post(
            "$PYTHON_API/api/$path",
            ["Content-Type" => "application/json"],
            body
        )
        
        json(String(response.body))
    catch e
        @error "API proxy error: $e"
        json(Dict("error" => "API request failed", "success" => false), status = 500)
    end
end

route("/api/:path...", method = GET) do
    path = params(:path)
    
    # Validate API path against allowlist
    if !validate_api_path(path)
        return json(Dict("error" => "Invalid API endpoint", "success" => false), status = 403)
    end
    
    try
        response = HTTP.get("$PYTHON_API/api/$path")
        json(String(response.body))
    catch e
        @error "API proxy error: $e"
        json(Dict("error" => "API request failed", "success" => false), status = 500)
    end
end

# Health check
route("/health") do
    json(Dict(
        "status" => "healthy",
        "service" => "ATHLYNX Julia Frontend",
        "version" => "1.0.0",
        "timestamp" => string(now())
    ))
end

# Static assets
route("/assets/:file") do
    filepath = params(:file)
    servefile("public/assets/$filepath")
end

# Startup configuration
Genie.config.run_as_server = true
Genie.config.server_port = PORT
Genie.config.server_host = "0.0.0.0"
Genie.config.cors_headers["Access-Control-Allow-Origin"] = "*"
Genie.config.cors_headers["Access-Control-Allow-Headers"] = "Content-Type"
Genie.config.cors_headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE"

# Start server
println("🚀 ATHLYNX Julia Frontend Starting...")
println("🦁 Dreams Do Come True 2026")
println("📍 Port: $PORT")
println("🔗 Python API: $PYTHON_API")

up(PORT, "0.0.0.0", async = false)
