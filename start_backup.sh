#!/bin/bash
# START MANUS AUTO-BACKUP SYSTEM

echo "🚀 Starting Manus Auto-Backup System..."
echo "════════════════════════════════════════"

# Run backup in background
nohup python3 /home/ubuntu/manus_auto_backup.py > /home/ubuntu/manus-backup.log 2>&1 &
BACKUP_PID=$!

echo "✅ Backup system started (PID: $BACKUP_PID)"
echo "📁 Log file: /home/ubuntu/manus-backup.log"
echo ""
echo "Your work is now PROTECTED! 🔒"
echo "Auto-backing up to GitHub every hour."
echo ""
echo "To stop: bash /home/ubuntu/stop_backup.sh"
echo "════════════════════════════════════════"

# Save PID
echo $BACKUP_PID > /home/ubuntu/.manus_backup.pid
