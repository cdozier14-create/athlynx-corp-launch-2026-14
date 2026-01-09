#!/usr/bin/env julia
"""
MANUS PERFORMANCE MONITOR (Julia)
High-performance monitoring and analytics
Author: Chad Allen Dozier Sr.
Company: ATHLYNX AI Corporation
"""

using JSON3
using Dates

struct BackupStats
    timestamp::DateTime
    projects_backed_up::Int
    total_projects::Int
    success_rate::Float64
end

function load_state(state_file::String)
    """Load Chad's master state"""
    if isfile(state_file)
        return JSON3.read(read(state_file, String))
    end
    return Dict()
end

function analyze_backups(state_file::String)
    """Analyze backup performance"""
    println("\n" * "="^60)
    println("📊 MANUS BACKUP ANALYTICS")
    println("="^60)
    
    state = load_state(state_file)
    
    if !haskey(state, :backups) || isempty(state.backups)
        println("⚠️  No backup history found")
        return
    end
    
    backups = state.backups
    total_backups = length(backups)
    
    # Calculate success rate
    successful = sum(b.projects_backed_up == b.total_projects for b in backups)
    success_rate = (successful / total_backups) * 100
    
    println("📈 Total Backups: $total_backups")
    println("✅ Successful: $successful")
    println("📊 Success Rate: $(round(success_rate, digits=2))%")
    
    # Last backup info
    if !isempty(backups)
        last_backup = backups[end]
        println("\n🕐 Last Backup:")
        println("   Time: $(last_backup.timestamp)")
        println("   Projects: $(last_backup.projects_backed_up)/$(last_backup.total_projects)")
    end
    
    println("="^60 * "\n")
end

function monitor_system_health()
    """Monitor system health and resources"""
    println("\n" * "="^60)
    println("🏥 MANUS SYSTEM HEALTH CHECK")
    println("="^60)
    
    # Check disk space
    try
        disk_info = read(`df -h /home/ubuntu`, String)
        println("\n💾 Disk Space:")
        println(disk_info)
    catch e
        println("⚠️  Could not check disk space: $e")
    end
    
    # Check memory
    try
        mem_info = read(`free -h`, String)
        println("\n🧠 Memory:")
        println(mem_info)
    catch e
        println("⚠️  Could not check memory: $e")
    end
    
    # Check Git status
    try
        cd("/home/ubuntu/athlynx-perfect-storm")
        git_status = read(`git status --short`, String)
        
        if isempty(strip(git_status))
            println("\n✅ Git: All changes committed")
        else
            println("\n⚠️  Git: Uncommitted changes found")
            println(git_status)
        end
    catch e
        println("\n⚠️  Could not check Git status: $e")
    end
    
    println("="^60 * "\n")
end

function run_health_check_loop(interval_minutes::Int=30)
    """Run continuous health monitoring"""
    println("🚀 MANUS HEALTH MONITOR STARTED")
    println("⏱️  Checking every $interval_minutes minutes\n")
    
    while true
        try
            monitor_system_health()
            analyze_backups("/home/ubuntu/CHAD_MASTER_STATE.json")
            
            println("⏳ Next check in $interval_minutes minutes...")
            sleep(interval_minutes * 60)
            
        catch e
            if isa(e, InterruptException)
                println("\n\n🛑 Monitor stopped by user")
                break
            else
                println("❌ Error: $e")
                println("⏳ Retrying in 5 minutes...")
                sleep(300)
            end
        end
    end
end

# Main execution
if abspath(PROGRAM_FILE) == @__FILE__
    if length(ARGS) > 0 && ARGS[1] == "once"
        # Run single check
        monitor_system_health()
        analyze_backups("/home/ubuntu/CHAD_MASTER_STATE.json")
    else
        # Run continuous monitoring
        run_health_check_loop(30)
    end
end
