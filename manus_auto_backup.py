#!/usr/bin/env python3
"""
MANUS AUTO-BACKUP SYSTEM
Prevents losing work when sandbox closes
Author: Chad Allen Dozier Sr.
Company: ATHLYNX AI Corporation
"""

import os
import json
import subprocess
import time
from datetime import datetime
from pathlib import Path

class ManusBackupSystem:
    def __init__(self):
        self.state_file = "/home/ubuntu/CHAD_MASTER_STATE.json"
        self.projects = [
            "/home/ubuntu/athlynx-perfect-storm",
        ]
        self.backup_interval = 3600  # 1 hour in seconds
        
    def load_state(self):
        """Load Chad's master state"""
        if os.path.exists(self.state_file):
            with open(self.state_file, 'r') as f:
                return json.load(f)
        return {}
    
    def save_state(self, state):
        """Save Chad's master state"""
        state['last_updated'] = datetime.utcnow().isoformat() + 'Z'
        with open(self.state_file, 'w') as f:
            json.dump(state, f, indent=2)
        print(f"✅ State saved: {state['last_updated']}")
    
    def git_commit_and_push(self, project_dir):
        """Commit and push changes to GitHub"""
        try:
            os.chdir(project_dir)
            
            # Check if there are changes
            result = subprocess.run(['git', 'status', '--porcelain'], 
                                  capture_output=True, text=True)
            
            if not result.stdout.strip():
                print(f"✅ {project_dir}: No changes to commit")
                return True
            
            # Add all changes
            subprocess.run(['git', 'add', '-A'], check=True)
            
            # Commit with timestamp
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            commit_msg = f"🔄 Auto-backup: {timestamp} | Manus Sandbox Protection"
            subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
            
            # Push to GitHub
            subprocess.run(['git', 'push', 'github', 'main'], check=True)
            
            print(f"✅ {project_dir}: Backed up to GitHub")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ {project_dir}: Backup failed - {e}")
            return False
    
    def backup_all_projects(self):
        """Backup all projects to GitHub"""
        print("\n" + "="*50)
        print(f"🔄 MANUS AUTO-BACKUP STARTED")
        print(f"⏰ Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*50)
        
        success_count = 0
        for project in self.projects:
            if os.path.exists(project):
                if self.git_commit_and_push(project):
                    success_count += 1
            else:
                print(f"⚠️  {project}: Directory not found")
        
        # Update state
        state = self.load_state()
        if 'backups' not in state:
            state['backups'] = []
        
        state['backups'].append({
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'projects_backed_up': success_count,
            'total_projects': len(self.projects)
        })
        
        # Keep only last 100 backup records
        state['backups'] = state['backups'][-100:]
        self.save_state(state)
        
        print(f"\n✅ Backup complete: {success_count}/{len(self.projects)} projects")
        print("="*50 + "\n")
        
        return success_count == len(self.projects)
    
    def run_continuous(self):
        """Run continuous backup loop"""
        print("🚀 MANUS AUTO-BACKUP SYSTEM STARTED")
        print(f"📦 Backing up every {self.backup_interval/60} minutes")
        print(f"📁 Projects: {len(self.projects)}")
        print("🔒 Your work is now PROTECTED!\n")
        
        while True:
            try:
                self.backup_all_projects()
                print(f"⏳ Next backup in {self.backup_interval/60} minutes...")
                time.sleep(self.backup_interval)
                
            except KeyboardInterrupt:
                print("\n\n🛑 Backup system stopped by user")
                break
            except Exception as e:
                print(f"❌ Error: {e}")
                print("⏳ Retrying in 5 minutes...")
                time.sleep(300)
    
    def backup_now(self):
        """Run immediate backup"""
        return self.backup_all_projects()


if __name__ == "__main__":
    import sys
    
    backup_system = ManusBackupSystem()
    
    if len(sys.argv) > 1 and sys.argv[1] == "now":
        # Run immediate backup
        backup_system.backup_now()
    else:
        # Run continuous backup
        backup_system.run_continuous()
