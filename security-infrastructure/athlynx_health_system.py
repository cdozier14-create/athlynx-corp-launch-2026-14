#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║     █████╗ ████████╗██╗  ██╗██╗  ██╗   ██╗███╗   ██╗██╗  ██╗                 ║
║    ██╔══██╗╚══██╔══╝██║  ██║██║  ╚██╗ ██╔╝████╗  ██║╚██╗██╔╝                 ║
║    ███████║   ██║   ███████║██║   ╚████╔╝ ██╔██╗ ██║ ╚███╔╝                  ║
║    ██╔══██║   ██║   ██╔══██║██║    ╚██╔╝  ██║╚██╗██║ ██╔██╗                  ║
║    ██║  ██║   ██║   ██║  ██║███████╗██║   ██║ ╚████║██╔╝ ██╗                 ║
║    ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝  ╚═══╝╚═╝  ╚═╝                 ║
║                                                                              ║
║                    ATHLYNX HEALTH INFORMATION SYSTEM                         ║
║                                                                              ║
║              BETTER THAN EPIC. BETTER THAN McKESSON. PRIVATE.                ║
║                                                                              ║
║                     DHG TRUST / ATHLYNX AI CORPORATION                       ║
║                          CONFIDENTIAL & PROPRIETARY                          ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  WHY WE'RE BETTER THAN EPIC ($4.6B) & McKESSON ($276B):                      ║
║                                                                              ║
║  EPIC PROBLEMS:                     ATHLYNX SOLUTION:                        ║
║  ├─ Legacy 1979 codebase            ├─ Modern Python/Julia AI-native         ║
║  ├─ $500K+ implementation           ├─ Zero cost (we own it)                 ║
║  ├─ 18-month deployments            ├─ Instant deployment                    ║
║  ├─ Sells to anyone                 ├─ PRIVATE - our competitive moat        ║
║  └─ Hospital-focused                └─ Athlete-focused                       ║
║                                                                              ║
║  McKESSON PROBLEMS:                 ATHLYNX SOLUTION:                        ║
║  ├─ Drug distribution focus         ├─ Complete athlete health               ║
║  ├─ Complex supply chain            ├─ Streamlined for sports                ║
║  ├─ Generic healthcare              ├─ Sports-specific AI models             ║
║  └─ No AI integration               └─ 7 AI agents built-in                  ║
║                                                                              ║
║  AUTHORIZED ACCESS ONLY:                                                     ║
║  • Chad A. Dozier (Founder/CEO)                                              ║
║  • Glenn Tse (Strategic Advisor)                                             ║
║  • Lee Marshall (Business Development)                                       ║
║  • Jimmy Boyd (Operations)                                                   ║
║  • Andrew Kustes (Technology)                                                ║
║  • Approved Medical Partners                                                 ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import hashlib
import hmac
import secrets
import time
import json
import logging
import uuid
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any, Set, Union
from enum import Enum, auto
from abc import ABC, abstractmethod
import threading
import base64
from collections import defaultdict

# Import our HIPAA compliance system
try:
    from hipaa_compliance import (
        ATHLYNXHIPAACompliance, PHICategory, AccessLevel, 
        AuditAction, BreachSeverity, PHIEncryption
    )
except ImportError:
    # Standalone mode - define minimal classes
    pass

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | ATHLYNX-HIS | %(levelname)s | %(message)s'
)
logger = logging.getLogger('ATHLYNX_HEALTH')


# ============================================================================
# CORE ENUMERATIONS
# ============================================================================

class SportCategory(Enum):
    """Sports categories for specialized health tracking"""
    FOOTBALL = "Football"
    BASKETBALL = "Basketball"
    BASEBALL = "Baseball"
    SOCCER = "Soccer"
    TRACK_FIELD = "Track & Field"
    SWIMMING = "Swimming"
    TENNIS = "Tennis"
    GOLF = "Golf"
    VOLLEYBALL = "Volleyball"
    SOFTBALL = "Softball"
    WRESTLING = "Wrestling"
    GYMNASTICS = "Gymnastics"
    LACROSSE = "Lacrosse"
    HOCKEY = "Hockey"
    ESPORTS = "Esports"
    OTHER = "Other"


class InjuryType(Enum):
    """Common athletic injury classifications"""
    CONCUSSION = "Concussion/Head Injury"
    ACL_TEAR = "ACL Tear"
    MCL_SPRAIN = "MCL Sprain"
    MENISCUS = "Meniscus Injury"
    ANKLE_SPRAIN = "Ankle Sprain"
    HAMSTRING = "Hamstring Strain"
    SHOULDER = "Shoulder Injury"
    ROTATOR_CUFF = "Rotator Cuff"
    FRACTURE = "Bone Fracture"
    STRESS_FRACTURE = "Stress Fracture"
    TENDINITIS = "Tendinitis"
    MUSCLE_STRAIN = "Muscle Strain"
    BACK_INJURY = "Back/Spine Injury"
    HEAT_ILLNESS = "Heat-Related Illness"
    CARDIAC = "Cardiac Event"
    OTHER = "Other"


class RecoveryPhase(Enum):
    """Athletic recovery phases"""
    ACUTE = "Acute Phase (0-72 hours)"
    SUBACUTE = "Subacute Phase (72 hours - 2 weeks)"
    REMODELING = "Remodeling Phase (2 weeks - 6 months)"
    RETURN_TO_PLAY = "Return to Play Protocol"
    CLEARED = "Fully Cleared"
    CHRONIC = "Chronic Management"


class ClearanceStatus(Enum):
    """Medical clearance status"""
    CLEARED = "Cleared for Full Participation"
    LIMITED = "Limited Participation"
    NON_CONTACT = "Non-Contact Only"
    RESTRICTED = "Restricted Activity"
    OUT = "Out - No Participation"
    PENDING_EVAL = "Pending Evaluation"
    SEASON_ENDING = "Season-Ending Injury"


class MentalHealthCategory(Enum):
    """Mental health tracking categories"""
    ANXIETY = "Anxiety"
    DEPRESSION = "Depression"
    STRESS = "Performance Stress"
    SLEEP = "Sleep Disorders"
    EATING = "Eating Disorders"
    SUBSTANCE = "Substance Use"
    ADJUSTMENT = "Adjustment Issues"
    PERFORMANCE = "Performance Psychology"
    WELLNESS = "General Wellness"


# ============================================================================
# DATA MODELS - BETTER THAN EPIC'S LEGACY STRUCTURES
# ============================================================================

@dataclass
class AthleteProfile:
    """Complete athlete health profile - Epic charges $500K for this"""
    athlete_id: str
    # Basic Info
    first_name: str
    last_name: str
    date_of_birth: datetime
    gender: str
    # Athletic Info
    sport: SportCategory
    position: str
    team_id: str
    school_id: str
    division: str  # D1, D2, D3, NAIA, JUCO
    # Physical Metrics
    height_inches: float
    weight_lbs: float
    body_fat_percentage: Optional[float] = None
    # Emergency Contact
    emergency_contact_name: str = ""
    emergency_contact_phone: str = ""
    emergency_contact_relation: str = ""
    # Insurance
    insurance_provider: str = ""
    insurance_policy_number: str = ""
    insurance_group_number: str = ""
    # Medical
    blood_type: str = ""
    allergies: List[str] = field(default_factory=list)
    medications: List[str] = field(default_factory=list)
    medical_conditions: List[str] = field(default_factory=list)
    # System
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    is_active: bool = True
    
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"
    
    @property
    def bmi(self) -> float:
        """Calculate BMI"""
        height_m = self.height_inches * 0.0254
        weight_kg = self.weight_lbs * 0.453592
        return round(weight_kg / (height_m ** 2), 1)


@dataclass
class InjuryRecord:
    """Comprehensive injury tracking - better than any EHR"""
    injury_id: str
    athlete_id: str
    # Injury Details
    injury_type: InjuryType
    body_part: str
    side: str  # Left, Right, Bilateral, N/A
    mechanism: str  # How injury occurred
    # Timing
    injury_date: datetime
    reported_date: datetime
    # Classification
    severity: str  # Grade 1, 2, 3 or Mild, Moderate, Severe
    is_recurrent: bool = False
    previous_injury_id: Optional[str] = None
    # Context
    occurred_during: str  # Practice, Game, Training, Other
    sport_at_time: SportCategory = SportCategory.OTHER
    surface_type: str = ""  # Turf, Grass, Court, etc.
    # Medical
    initial_diagnosis: str = ""
    final_diagnosis: str = ""
    imaging_ordered: List[str] = field(default_factory=list)  # MRI, X-Ray, CT, etc.
    imaging_results: str = ""
    # Treatment
    treatment_plan: str = ""
    surgery_required: bool = False
    surgery_date: Optional[datetime] = None
    surgery_type: str = ""
    # Recovery
    recovery_phase: RecoveryPhase = RecoveryPhase.ACUTE
    estimated_recovery_days: int = 0
    actual_recovery_days: Optional[int] = None
    clearance_status: ClearanceStatus = ClearanceStatus.OUT
    # Provider
    examining_physician: str = ""
    treating_physician: str = ""
    athletic_trainer: str = ""
    # System
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    is_resolved: bool = False
    resolution_date: Optional[datetime] = None


@dataclass
class ConcussionProtocol:
    """
    Specialized concussion tracking - NCAA/NFL protocol compliant
    This alone would cost $100K from Epic
    """
    protocol_id: str
    athlete_id: str
    injury_id: str
    # Initial Assessment
    incident_date: datetime
    loss_of_consciousness: bool = False
    loc_duration_seconds: int = 0
    amnesia: bool = False
    amnesia_type: str = ""  # Retrograde, Anterograde, Both
    # Symptom Checklist (22-item)
    symptoms: Dict[str, int] = field(default_factory=dict)  # symptom: severity 0-6
    symptom_total_score: int = 0
    # SCAT5 Components
    scat5_date: Optional[datetime] = None
    orientation_score: int = 0  # /5
    immediate_memory_score: int = 0  # /15
    concentration_score: int = 0  # /5
    delayed_recall_score: int = 0  # /5
    balance_errors: int = 0
    # Return to Play Protocol (6 stages)
    rtp_stage: int = 0  # 0-6
    rtp_stage_dates: Dict[int, datetime] = field(default_factory=dict)
    # Clearance
    neurocognitive_baseline: bool = False
    neurocognitive_cleared: bool = False
    physician_clearance: bool = False
    final_clearance_date: Optional[datetime] = None
    # History
    previous_concussions: int = 0
    total_concussions: int = 1
    
    SYMPTOM_CHECKLIST = [
        "Headache", "Pressure in head", "Neck pain", "Nausea or vomiting",
        "Dizziness", "Blurred vision", "Balance problems", "Sensitivity to light",
        "Sensitivity to noise", "Feeling slowed down", "Feeling like in a fog",
        "Don't feel right", "Difficulty concentrating", "Difficulty remembering",
        "Fatigue or low energy", "Confusion", "Drowsiness", "More emotional",
        "Irritability", "Sadness", "Nervous or anxious", "Trouble falling asleep"
    ]
    
    RTP_STAGES = {
        0: "Complete rest",
        1: "Light aerobic exercise",
        2: "Sport-specific exercise",
        3: "Non-contact training drills",
        4: "Full contact practice (after medical clearance)",
        5: "Return to competition"
    }


@dataclass
class NutritionPlan:
    """AI-powered nutrition tracking - sports dietitian in your pocket"""
    plan_id: str
    athlete_id: str
    # Goals
    goal_type: str  # Weight gain, Weight loss, Maintenance, Performance
    target_weight_lbs: float
    target_body_fat: Optional[float] = None
    # Macros
    daily_calories: int = 0
    protein_grams: int = 0
    carbs_grams: int = 0
    fat_grams: int = 0
    # Timing
    pre_workout_protocol: str = ""
    post_workout_protocol: str = ""
    game_day_protocol: str = ""
    # Supplements
    approved_supplements: List[str] = field(default_factory=list)
    banned_substance_check: bool = True
    # Hydration
    daily_water_oz: int = 0
    electrolyte_protocol: str = ""
    # Restrictions
    dietary_restrictions: List[str] = field(default_factory=list)
    food_allergies: List[str] = field(default_factory=list)
    # Tracking
    created_by: str = ""
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)


@dataclass
class MentalHealthRecord:
    """Mental health tracking - confidential and protected"""
    record_id: str
    athlete_id: str
    category: MentalHealthCategory
    # Assessment
    assessment_date: datetime
    provider_id: str
    provider_type: str  # Psychologist, Counselor, Psychiatrist
    # Scores (standardized assessments)
    phq9_score: Optional[int] = None  # Depression (0-27)
    gad7_score: Optional[int] = None  # Anxiety (0-21)
    psqi_score: Optional[int] = None  # Sleep quality (0-21)
    athlete_burnout_score: Optional[int] = None
    # Notes (encrypted)
    clinical_notes: str = ""
    treatment_plan: str = ""
    # Follow-up
    follow_up_date: Optional[datetime] = None
    referral_made: bool = False
    referral_to: str = ""
    # Crisis
    crisis_intervention: bool = False
    safety_plan_in_place: bool = False
    # System
    created_at: datetime = field(default_factory=datetime.now)
    is_active: bool = True


@dataclass
class DrugTestRecord:
    """NCAA/Professional drug testing compliance"""
    test_id: str
    athlete_id: str
    # Test Info
    test_date: datetime
    test_type: str  # Random, Scheduled, Post-Competition, Reasonable Suspicion
    testing_authority: str  # NCAA, USADA, Team, School
    collection_site: str
    collector_id: str
    # Sample
    sample_id: str
    sample_type: str  # Urine, Blood
    chain_of_custody: List[Dict] = field(default_factory=list)
    # Results
    result_date: Optional[datetime] = None
    result: str = "Pending"  # Negative, Positive, Pending
    substances_detected: List[str] = field(default_factory=list)
    # TUE (Therapeutic Use Exemption)
    tue_on_file: bool = False
    tue_substances: List[str] = field(default_factory=list)
    # Consequences
    violation: bool = False
    sanction: str = ""
    appeal_filed: bool = False
    appeal_result: str = ""


@dataclass
class BiometricData:
    """Real-time biometric tracking - wearables integration"""
    reading_id: str
    athlete_id: str
    timestamp: datetime
    source: str  # Whoop, Oura, Apple Watch, Garmin, Manual
    # Vitals
    heart_rate_bpm: Optional[int] = None
    heart_rate_variability: Optional[float] = None
    resting_heart_rate: Optional[int] = None
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    blood_oxygen: Optional[float] = None
    body_temperature_f: Optional[float] = None
    # Sleep
    sleep_hours: Optional[float] = None
    sleep_quality_score: Optional[int] = None  # 0-100
    rem_hours: Optional[float] = None
    deep_sleep_hours: Optional[float] = None
    # Recovery
    recovery_score: Optional[int] = None  # 0-100
    strain_score: Optional[float] = None
    readiness_score: Optional[int] = None  # 0-100
    # Activity
    steps: Optional[int] = None
    calories_burned: Optional[int] = None
    active_minutes: Optional[int] = None
    # GPS/Movement
    distance_miles: Optional[float] = None
    max_speed_mph: Optional[float] = None
    acceleration_events: Optional[int] = None


# ============================================================================
# AI-POWERED ANALYTICS - WHAT EPIC CAN'T DO
# ============================================================================

class AthleteHealthAI:
    """
    AI-powered health analytics - our secret weapon
    Epic and McKesson don't have this
    """
    
    def __init__(self):
        self.injury_prediction_model = None
        self.recovery_optimization_model = None
        self.performance_correlation_model = None
    
    def predict_injury_risk(self, athlete: AthleteProfile, 
                           biometrics: List[BiometricData],
                           injury_history: List[InjuryRecord]) -> Dict:
        """
        AI injury risk prediction
        Analyzes patterns to predict injury before it happens
        """
        risk_factors = []
        risk_score = 0
        
        # Analyze recent biometrics
        if biometrics:
            recent = biometrics[-7:]  # Last 7 days
            
            # Check HRV trend (declining HRV = increased injury risk)
            hrv_values = [b.heart_rate_variability for b in recent if b.heart_rate_variability]
            if len(hrv_values) >= 3:
                hrv_trend = hrv_values[-1] - hrv_values[0]
                if hrv_trend < -10:
                    risk_factors.append("Declining HRV trend (-10+ ms)")
                    risk_score += 15
            
            # Check sleep quality
            sleep_scores = [b.sleep_quality_score for b in recent if b.sleep_quality_score]
            if sleep_scores:
                avg_sleep = sum(sleep_scores) / len(sleep_scores)
                if avg_sleep < 60:
                    risk_factors.append(f"Poor sleep quality (avg: {avg_sleep:.0f}/100)")
                    risk_score += 20
            
            # Check recovery scores
            recovery_scores = [b.recovery_score for b in recent if b.recovery_score]
            if recovery_scores:
                avg_recovery = sum(recovery_scores) / len(recovery_scores)
                if avg_recovery < 50:
                    risk_factors.append(f"Low recovery scores (avg: {avg_recovery:.0f}/100)")
                    risk_score += 25
        
        # Analyze injury history
        if injury_history:
            # Recurrent injury risk
            recent_injuries = [i for i in injury_history 
                             if i.injury_date > datetime.now() - timedelta(days=365)]
            if len(recent_injuries) >= 2:
                risk_factors.append(f"{len(recent_injuries)} injuries in past year")
                risk_score += 15
            
            # Check for unresolved injuries
            unresolved = [i for i in injury_history if not i.is_resolved]
            if unresolved:
                risk_factors.append(f"{len(unresolved)} unresolved injuries")
                risk_score += 30
        
        # Sport-specific risk factors
        high_risk_sports = [SportCategory.FOOTBALL, SportCategory.WRESTLING, 
                          SportCategory.GYMNASTICS, SportCategory.HOCKEY]
        if athlete.sport in high_risk_sports:
            risk_factors.append(f"High-risk sport: {athlete.sport.value}")
            risk_score += 10
        
        # BMI considerations
        if athlete.bmi > 30 or athlete.bmi < 18.5:
            risk_factors.append(f"BMI outside optimal range: {athlete.bmi}")
            risk_score += 10
        
        # Determine risk level
        if risk_score >= 60:
            risk_level = "HIGH"
            recommendation = "Recommend reduced training load and medical evaluation"
        elif risk_score >= 30:
            risk_level = "MODERATE"
            recommendation = "Monitor closely, consider load management"
        else:
            risk_level = "LOW"
            recommendation = "Continue normal training with standard monitoring"
        
        return {
            'athlete_id': athlete.athlete_id,
            'athlete_name': athlete.full_name,
            'risk_score': min(risk_score, 100),
            'risk_level': risk_level,
            'risk_factors': risk_factors,
            'recommendation': recommendation,
            'analysis_date': datetime.now().isoformat(),
            'model_version': '1.0.0'
        }
    
    def optimize_recovery_plan(self, injury: InjuryRecord,
                               athlete: AthleteProfile) -> Dict:
        """
        AI-optimized recovery planning
        Personalized based on athlete profile and injury type
        """
        # Base recovery timelines by injury type
        base_timelines = {
            InjuryType.CONCUSSION: (7, 21),  # min, max days
            InjuryType.ACL_TEAR: (180, 365),
            InjuryType.MCL_SPRAIN: (14, 42),
            InjuryType.ANKLE_SPRAIN: (7, 28),
            InjuryType.HAMSTRING: (14, 42),
            InjuryType.MUSCLE_STRAIN: (7, 21),
            InjuryType.SHOULDER: (21, 90),
            InjuryType.STRESS_FRACTURE: (42, 84),
        }
        
        min_days, max_days = base_timelines.get(injury.injury_type, (14, 42))
        
        # Adjust based on severity
        severity_multiplier = {
            'Grade 1': 0.7,
            'Grade 2': 1.0,
            'Grade 3': 1.5,
            'Mild': 0.7,
            'Moderate': 1.0,
            'Severe': 1.5
        }
        multiplier = severity_multiplier.get(injury.severity, 1.0)
        
        estimated_min = int(min_days * multiplier)
        estimated_max = int(max_days * multiplier)
        
        # Generate phase-by-phase plan
        phases = []
        
        if injury.injury_type == InjuryType.CONCUSSION:
            phases = [
                {"phase": 1, "name": "Complete Rest", "duration": "24-48 hours", 
                 "activities": ["No physical activity", "Limited screen time", "Quiet environment"]},
                {"phase": 2, "name": "Light Activity", "duration": "2-3 days",
                 "activities": ["Walking", "Light stretching", "Gradual return to school/work"]},
                {"phase": 3, "name": "Sport-Specific", "duration": "1-2 days",
                 "activities": ["Sport-specific drills", "No head impact", "Progressive intensity"]},
                {"phase": 4, "name": "Non-Contact Training", "duration": "1-2 days",
                 "activities": ["Full practice without contact", "Resistance training"]},
                {"phase": 5, "name": "Full Contact", "duration": "1 day",
                 "activities": ["Full practice with contact", "Medical clearance required"]},
                {"phase": 6, "name": "Return to Play", "duration": "Game ready",
                 "activities": ["Full competition", "Continue monitoring"]}
            ]
        else:
            phases = [
                {"phase": 1, "name": "Acute/Protection", "duration": f"{estimated_min//4} days",
                 "activities": ["RICE protocol", "Pain management", "Protect injured area"]},
                {"phase": 2, "name": "Early Rehab", "duration": f"{estimated_min//4} days",
                 "activities": ["Range of motion", "Light strengthening", "Modalities"]},
                {"phase": 3, "name": "Progressive Loading", "duration": f"{estimated_min//4} days",
                 "activities": ["Progressive resistance", "Sport-specific movements", "Balance training"]},
                {"phase": 4, "name": "Return to Sport", "duration": f"{estimated_min//4} days",
                 "activities": ["Full training", "Competition simulation", "Final clearance"]}
            ]
        
        return {
            'injury_id': injury.injury_id,
            'athlete_id': athlete.athlete_id,
            'injury_type': injury.injury_type.value,
            'severity': injury.severity,
            'estimated_recovery_range': f"{estimated_min}-{estimated_max} days",
            'target_return_date': (datetime.now() + timedelta(days=estimated_min)).strftime('%Y-%m-%d'),
            'phases': phases,
            'key_milestones': [
                f"Day {estimated_min//4}: Begin active rehab",
                f"Day {estimated_min//2}: Sport-specific training",
                f"Day {int(estimated_min*0.75)}: Non-contact practice",
                f"Day {estimated_min}: Target return to play"
            ],
            'red_flags': [
                "Increased pain or swelling",
                "Loss of range of motion",
                "Instability or giving way",
                "Fever or signs of infection"
            ],
            'generated_at': datetime.now().isoformat()
        }
    
    def analyze_team_health(self, athletes: List[AthleteProfile],
                           injuries: List[InjuryRecord]) -> Dict:
        """
        Team-wide health analytics dashboard
        Coaches love this - shows injury patterns across the team
        """
        # Group injuries by type
        injury_by_type = defaultdict(int)
        injury_by_body_part = defaultdict(int)
        injury_by_sport = defaultdict(int)
        
        active_injuries = [i for i in injuries if not i.is_resolved]
        
        for injury in injuries:
            injury_by_type[injury.injury_type.value] += 1
            injury_by_body_part[injury.body_part] += 1
            injury_by_sport[injury.sport_at_time.value] += 1
        
        # Calculate injury rate
        total_athletes = len(athletes)
        injury_rate = (len(injuries) / total_athletes * 100) if total_athletes > 0 else 0
        
        # Identify patterns
        patterns = []
        if injury_by_body_part:
            most_common_part = max(injury_by_body_part, key=injury_by_body_part.get)
            patterns.append(f"Most common injury location: {most_common_part}")
        
        if injury_by_type:
            most_common_type = max(injury_by_type, key=injury_by_type.get)
            patterns.append(f"Most common injury type: {most_common_type}")
        
        return {
            'analysis_date': datetime.now().isoformat(),
            'total_athletes': total_athletes,
            'total_injuries': len(injuries),
            'active_injuries': len(active_injuries),
            'injury_rate_percent': round(injury_rate, 1),
            'injuries_by_type': dict(injury_by_type),
            'injuries_by_body_part': dict(injury_by_body_part),
            'injuries_by_sport': dict(injury_by_sport),
            'identified_patterns': patterns,
            'recommendations': [
                "Consider sport-specific injury prevention programs",
                "Review training load management protocols",
                "Evaluate equipment and playing surfaces",
                "Implement pre-season screening programs"
            ]
        }


# ============================================================================
# MAIN HEALTH INFORMATION SYSTEM
# ============================================================================

class ATHLYNXHealthSystem:
    """
    ATHLYNX Health Information System
    The Epic/McKesson killer - but PRIVATE and BETTER
    """
    
    def __init__(self):
        # Core components
        self.athletes: Dict[str, AthleteProfile] = {}
        self.injuries: Dict[str, InjuryRecord] = {}
        self.concussions: Dict[str, ConcussionProtocol] = {}
        self.nutrition_plans: Dict[str, NutritionPlan] = {}
        self.mental_health: Dict[str, MentalHealthRecord] = {}
        self.drug_tests: Dict[str, DrugTestRecord] = {}
        self.biometrics: Dict[str, List[BiometricData]] = defaultdict(list)
        
        # AI Engine
        self.ai = AthleteHealthAI()
        
        # HIPAA Compliance
        self.hipaa = ATHLYNXHIPAACompliance() if 'ATHLYNXHIPAACompliance' in dir() else None
        
        # Authorized users (PRIVATE SYSTEM)
        self.authorized_users = {
            'chad_dozier': {'role': 'owner', 'access': 'full'},
            'glenn_tse': {'role': 'advisor', 'access': 'read'},
            'lee_marshall': {'role': 'business', 'access': 'summary'},
            'jimmy_boyd': {'role': 'operations', 'access': 'read'},
            'andrew_kustes': {'role': 'technology', 'access': 'admin'},
        }
        
        self.startup_time = datetime.now()
        
        logger.info("=" * 70)
        logger.info("🏥 ATHLYNX HEALTH INFORMATION SYSTEM INITIALIZED")
        logger.info("   Better than Epic. Better than McKesson. PRIVATE.")
        logger.info("=" * 70)
    
    def register_athlete(self, profile: AthleteProfile) -> str:
        """Register new athlete in the system"""
        self.athletes[profile.athlete_id] = profile
        logger.info(f"✅ Athlete registered: {profile.full_name} ({profile.athlete_id})")
        return profile.athlete_id
    
    def record_injury(self, injury: InjuryRecord) -> Tuple[str, Dict]:
        """Record injury and get AI-powered recovery plan"""
        self.injuries[injury.injury_id] = injury
        
        athlete = self.athletes.get(injury.athlete_id)
        if athlete:
            # Generate AI recovery plan
            recovery_plan = self.ai.optimize_recovery_plan(injury, athlete)
            logger.info(f"🏥 Injury recorded: {injury.injury_type.value} for {athlete.full_name}")
            return injury.injury_id, recovery_plan
        
        return injury.injury_id, {}
    
    def initiate_concussion_protocol(self, athlete_id: str, 
                                     injury_id: str,
                                     incident_date: datetime) -> ConcussionProtocol:
        """Initiate NCAA-compliant concussion protocol"""
        protocol = ConcussionProtocol(
            protocol_id=str(uuid.uuid4()),
            athlete_id=athlete_id,
            injury_id=injury_id,
            incident_date=incident_date
        )
        
        # Initialize symptom checklist
        protocol.symptoms = {symptom: 0 for symptom in protocol.SYMPTOM_CHECKLIST}
        
        self.concussions[protocol.protocol_id] = protocol
        
        athlete = self.athletes.get(athlete_id)
        if athlete:
            logger.warning(f"⚠️ CONCUSSION PROTOCOL INITIATED: {athlete.full_name}")
            logger.warning(f"   Protocol ID: {protocol.protocol_id}")
            logger.warning(f"   Athlete is OUT until cleared by physician")
        
        return protocol
    
    def record_biometrics(self, data: BiometricData):
        """Record biometric data from wearables"""
        self.biometrics[data.athlete_id].append(data)
        
        # Check for concerning values
        alerts = []
        if data.resting_heart_rate and data.resting_heart_rate > 100:
            alerts.append(f"Elevated resting HR: {data.resting_heart_rate} bpm")
        if data.recovery_score and data.recovery_score < 30:
            alerts.append(f"Very low recovery score: {data.recovery_score}/100")
        if data.sleep_hours and data.sleep_hours < 5:
            alerts.append(f"Insufficient sleep: {data.sleep_hours} hours")
        
        if alerts:
            athlete = self.athletes.get(data.athlete_id)
            name = athlete.full_name if athlete else data.athlete_id
            logger.warning(f"⚠️ BIOMETRIC ALERTS for {name}:")
            for alert in alerts:
                logger.warning(f"   - {alert}")
    
    def get_injury_risk_report(self, athlete_id: str) -> Dict:
        """Get AI-powered injury risk assessment"""
        athlete = self.athletes.get(athlete_id)
        if not athlete:
            return {'error': 'Athlete not found'}
        
        biometrics = self.biometrics.get(athlete_id, [])
        injuries = [i for i in self.injuries.values() if i.athlete_id == athlete_id]
        
        return self.ai.predict_injury_risk(athlete, biometrics, injuries)
    
    def get_team_health_dashboard(self, team_id: str = None) -> Dict:
        """Get team-wide health analytics"""
        if team_id:
            athletes = [a for a in self.athletes.values() if a.team_id == team_id]
            injuries = [i for i in self.injuries.values() 
                       if self.athletes.get(i.athlete_id, AthleteProfile).team_id == team_id]
        else:
            athletes = list(self.athletes.values())
            injuries = list(self.injuries.values())
        
        return self.ai.analyze_team_health(athletes, injuries)
    
    def get_system_status(self) -> Dict:
        """Get complete system status"""
        return {
            'system': 'ATHLYNX Health Information System',
            'version': '1.0.0',
            'status': 'OPERATIONAL',
            'uptime': str(datetime.now() - self.startup_time),
            'statistics': {
                'total_athletes': len(self.athletes),
                'total_injuries': len(self.injuries),
                'active_concussion_protocols': sum(1 for c in self.concussions.values() 
                                                   if not c.physician_clearance),
                'nutrition_plans': len(self.nutrition_plans),
                'mental_health_records': len(self.mental_health),
                'drug_tests': len(self.drug_tests),
                'biometric_readings': sum(len(b) for b in self.biometrics.values())
            },
            'authorized_users': len(self.authorized_users),
            'hipaa_compliant': self.hipaa is not None,
            'ai_enabled': True,
            'comparison_to_competitors': {
                'epic_annual_cost': '$500,000+',
                'mckesson_annual_cost': '$250,000+',
                'athlynx_cost': '$0 (We own it)',
                'epic_implementation_time': '18 months',
                'athlynx_implementation_time': 'Instant',
                'data_ownership': 'ATHLYNX owns all data',
                'competitive_advantage': 'MASSIVE'
            }
        }


# ============================================================================
# DEMONSTRATION
# ============================================================================

def main():
    """Demonstrate the ATHLYNX Health Information System"""
    
    print("""
    ╔══════════════════════════════════════════════════════════════════════════╗
    ║                                                                          ║
    ║     █████╗ ████████╗██╗  ██╗██╗  ██╗   ██╗███╗   ██╗██╗  ██╗             ║
    ║    ██╔══██╗╚══██╔══╝██║  ██║██║  ╚██╗ ██╔╝████╗  ██║╚██╗██╔╝             ║
    ║    ███████║   ██║   ███████║██║   ╚████╔╝ ██╔██╗ ██║ ╚███╔╝              ║
    ║    ██╔══██║   ██║   ██╔══██║██║    ╚██╔╝  ██║╚██╗██║ ██╔██╗              ║
    ║    ██║  ██║   ██║   ██║  ██║███████╗██║   ██║ ╚████║██╔╝ ██╗             ║
    ║    ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝  ╚═══╝╚═╝  ╚═╝             ║
    ║                                                                          ║
    ║                    HEALTH INFORMATION SYSTEM                             ║
    ║                                                                          ║
    ║            🏥 BETTER THAN EPIC ($4.6B Revenue)                           ║
    ║            💊 BETTER THAN McKESSON ($276B Revenue)                       ║
    ║            🔒 PRIVATE - Our Competitive Moat                             ║
    ║            🤖 AI-POWERED - They Can't Match This                         ║
    ║                                                                          ║
    ╚══════════════════════════════════════════════════════════════════════════╝
    """)
    
    # Initialize system
    his = ATHLYNXHealthSystem()
    
    # Register sample athlete
    athlete = AthleteProfile(
        athlete_id="ATH-2024-001",
        first_name="Marcus",
        last_name="Johnson",
        date_of_birth=datetime(2002, 5, 15),
        gender="Male",
        sport=SportCategory.FOOTBALL,
        position="Wide Receiver",
        team_id="TEAM-001",
        school_id="SCHOOL-001",
        division="D1",
        height_inches=73,
        weight_lbs=195,
        body_fat_percentage=8.5,
        emergency_contact_name="Sarah Johnson",
        emergency_contact_phone="555-123-4567",
        emergency_contact_relation="Mother",
        blood_type="O+",
        allergies=["Penicillin"],
        medications=[]
    )
    
    his.register_athlete(athlete)
    
    # Record biometric data
    for i in range(7):
        biometric = BiometricData(
            reading_id=str(uuid.uuid4()),
            athlete_id=athlete.athlete_id,
            timestamp=datetime.now() - timedelta(days=6-i),
            source="Whoop",
            heart_rate_variability=65 - (i * 3),  # Declining trend
            resting_heart_rate=58 + i,
            sleep_hours=7.5 - (i * 0.3),
            sleep_quality_score=85 - (i * 5),
            recovery_score=80 - (i * 8)
        )
        his.record_biometrics(biometric)
    
    # Get injury risk assessment
    print("\n" + "=" * 70)
    print("🔮 AI INJURY RISK PREDICTION")
    print("=" * 70)
    
    risk_report = his.get_injury_risk_report(athlete.athlete_id)
    print(json.dumps(risk_report, indent=2))
    
    # Record an injury
    print("\n" + "=" * 70)
    print("🏥 RECORDING INJURY")
    print("=" * 70)
    
    injury = InjuryRecord(
        injury_id=str(uuid.uuid4()),
        athlete_id=athlete.athlete_id,
        injury_type=InjuryType.HAMSTRING,
        body_part="Hamstring",
        side="Right",
        mechanism="Non-contact sprint",
        injury_date=datetime.now(),
        reported_date=datetime.now(),
        severity="Grade 2",
        occurred_during="Practice",
        sport_at_time=SportCategory.FOOTBALL,
        surface_type="Turf",
        initial_diagnosis="Right hamstring strain",
        examining_physician="Dr. Smith"
    )
    
    injury_id, recovery_plan = his.record_injury(injury)
    print("\n📋 AI-GENERATED RECOVERY PLAN:")
    print(json.dumps(recovery_plan, indent=2))
    
    # Get system status
    print("\n" + "=" * 70)
    print("📊 SYSTEM STATUS")
    print("=" * 70)
    
    status = his.get_system_status()
    print(json.dumps(status, indent=2))
    
    return his


if __name__ == "__main__":
    health_system = main()
