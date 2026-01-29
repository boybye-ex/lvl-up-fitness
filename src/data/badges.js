import { 
  Flame, 
  Dumbbell, 
  Plane, 
  Crown, 
  Sword, 
  BicepsFlexed, 
  Zap, 
  Trophy, 
  Target, 
  Clock, 
  Moon, 
  Sun, 
  Utensils, 
  Scale, 
  Search, 
  Camera, 
  Shield, 
  TrendingUp, 
  Award,
  Star,
  ZapOff,
  Activity,
  Heart,
  Coffee,
  Timer,
  Wind,
  Zap as Bolt,
  Medal,
  BarChart3,
  Briefcase
} from 'lucide-react';

export const ACHIEVEMENT_GROUPS = {
  COMBAT: { label: "Workout Consistency", color: "text-red-500", icon: Sword },
  FUEL: { label: "Nutrition & Protein", color: "text-green-500", icon: Utensils },
  STRENGTH: { label: "Milestones & PRs", color: "text-blue-500", icon: Dumbbell },
  INTEL: { label: "AI & Tool Usage", color: "text-yellow-500", icon: Zap },
  LEGACY: { label: "Long-term Dedication", color: "text-purple-500", icon: Trophy }
};

export const badges = [
  // COMBAT SQUAD (Red)
  {
    id: 'first_blood',
    group: 'COMBAT',
    title: 'First Blood',
    description: 'Complete your first workout.',
    icon: Sword,
    check: (state) => (state.history || []).length >= 1,
  },
  {
    id: 'century_club',
    group: 'COMBAT',
    title: 'Century Club',
    description: 'Perform 100 total reps in a single session.',
    icon: Target,
    check: (state, session) => session?.totalReps >= 100,
  },
  {
    id: 'night_owl',
    group: 'COMBAT',
    title: 'Night Owl',
    description: 'Complete a workout after 10:00 PM.',
    icon: Moon,
    check: (state, session) => {
      const hour = new Date(session?.timestamp || Date.now()).getHours();
      return hour >= 22 || hour < 4;
    },
  },
  {
    id: 'early_bird',
    group: 'COMBAT',
    title: 'Early Bird',
    description: 'Complete a workout before 7:00 AM.',
    icon: Sun,
    check: (state, session) => {
      const hour = new Date(session?.timestamp || Date.now()).getHours();
      return hour >= 4 && hour < 7;
    },
  },
  {
    id: 'consistency_king',
    group: 'COMBAT',
    title: 'Consistency King',
    description: 'Work out 4 days in a single week.',
    icon: Crown,
    check: (state) => {
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const recent = (state.history || []).filter(h => new Date(h.timestamp).getTime() > oneWeekAgo);
      const uniqueDays = new Set(recent.map(h => h.timestamp.split('T')[0]));
      return uniqueDays.size >= 4;
    },
  },
  {
    id: 'speed_demon',
    group: 'COMBAT',
    title: 'Speed Demon',
    description: 'Finish a workout 2 minutes faster than the target time.',
    icon: Timer,
    check: (state, session) => session?.duration <= (session?.targetDuration - 2),
  },
  {
    id: 'iron_discipline',
    group: 'COMBAT',
    title: 'Iron Discipline',
    description: 'Complete 10 total workouts.',
    icon: BicepsFlexed,
    check: (state) => (state.history || []).length >= 10,
  },

  // FUEL SQUAD (Green)
  {
    id: 'protein_streak_3',
    group: 'FUEL',
    title: 'Protein Pro',
    description: 'Hit your protein goal 3 days in a row.',
    icon: Utensils,
    check: (state) => {
      // Logic for 3 day protein streak
      return false; // Placeholder for complex logic
    },
  },
  {
    id: 'protein_streak_7',
    group: 'FUEL',
    title: 'Fuel Master',
    description: 'Hit your protein goal 7 days in a row.',
    icon: Flame,
    check: (state) => false,
  },
  {
    id: 'pioneer',
    group: 'FUEL',
    title: 'Powerfood Pioneer',
    description: 'Log 5 different Powerfoods.',
    icon: Search,
    check: (state) => {
      const uniqueFoods = new Set((state.foodLogs || []).filter(f => f.type === 'powerfood').map(f => f.item));
      return uniqueFoods.size >= 5;
    },
  },
  {
    id: 'scale_master',
    group: 'FUEL',
    title: 'Scale Master',
    description: 'Log your weight every Monday for 4 weeks.',
    icon: Scale,
    check: (state) => false,
  },
  {
    id: 'clean_eater',
    group: 'FUEL',
    title: 'Clean Eater',
    description: 'Log 20 meals in the food tracker.',
    icon: Coffee,
    check: (state) => (state.foodLogs || []).length >= 20,
  },
  {
    id: 'photo_journalist',
    group: 'FUEL',
    title: 'Photo Journalist',
    description: 'Log 5 progress photos in the vault.',
    icon: Camera,
    check: (state) => (state.photoLogs || []).length >= 5,
  },
  {
    id: 'hydration_hero',
    group: 'FUEL',
    title: 'Hydration Hero',
    description: 'Log water intake for 5 consecutive days.',
    icon: Wind,
    check: (state) => false,
  },

  // STRENGTH SQUAD (Blue)
  {
    id: 'heavy_hitter',
    group: 'STRENGTH',
    title: 'Heavy Hitter',
    description: 'Log a weight entry for any exercise.',
    icon: Dumbbell,
    check: (state) => Object.keys(state.logs || {}).length > 0,
  },
  {
    id: 'pr_machine',
    group: 'STRENGTH',
    title: 'PR Machine',
    description: 'Hit 5 Personal Records in one week.',
    icon: TrendingUp,
    check: (state) => false,
  },
  {
    id: 'volume_king',
    group: 'STRENGTH',
    title: 'Volume King',
    description: 'Move 5,000 lbs total in a single session.',
    icon: BicepsFlexed,
    check: (state, session) => session?.totalVolume >= 5000,
  },
  {
    id: 'titan_frame',
    group: 'STRENGTH',
    title: 'Titan Frame',
    description: 'Reach "Spartan" rank in any exercise.',
    icon: Shield,
    check: (state) => false,
  },
  {
    id: 'explosive_power',
    group: 'STRENGTH',
    title: 'Explosive Power',
    description: 'Log a Box Jump session.',
    icon: Bolt,
    check: (state) => state.logs?.['Box Jump']?.length > 0,
  },
  {
    id: 'iron_grip',
    group: 'STRENGTH',
    title: 'Iron Grip',
    description: 'Log a Deadlift PR.',
    icon: Award,
    check: (state, session) => (session?.prs || []).some(pr => pr.exercise === 'Deadlift'),
  },
  {
    id: 'unbreakable',
    group: 'STRENGTH',
    title: 'Unbreakable',
    description: 'Complete a workout with "Brutal" mood selected.',
    icon: Activity,
    check: (state, session) => session?.mood === 'brutal',
  },

  // INTEL SQUAD (Yellow)
  {
    id: 'ai_apprentice',
    group: 'INTEL',
    title: 'AI Apprentice',
    description: 'Ask the AI Coach 5 questions.',
    icon: Zap,
    check: (state) => false,
  },
  {
    id: 'form_expert',
    group: 'INTEL',
    title: 'Form Expert',
    description: 'Complete 3 AI Form Checks.',
    icon: Bolt,
    check: (state) => false,
  },
  {
    id: 'pantry_scanner',
    group: 'INTEL',
    title: 'Pantry Scanner',
    description: 'Use AI Photo Logger for 5 meals.',
    icon: Search,
    check: (state) => (state.foodLogs || []).filter(f => f.isAI).length >= 5,
  },
  {
    id: 'tactical_analyst',
    group: 'INTEL',
    title: 'Tactical Analyst',
    description: 'View your Stats page 10 times.',
    icon: BarChart3,
    check: (state) => false,
  },
  {
    id: 'recovery_specialist',
    group: 'INTEL',
    title: 'Recovery Specialist',
    description: 'Complete a full Recovery Routine.',
    icon: Heart,
    check: (state) => false,
  },
  {
    id: 'stealth_operative',
    group: 'INTEL',
    title: 'Stealth Operative',
    description: 'Complete 5 Office Mode workouts.',
    icon: Briefcase,
    check: (state) => (state.history || []).filter(h => h.workoutId === 'office').length >= 5,
  },
  {
    id: 'daily_scholar',
    group: 'INTEL',
    title: 'Daily Scholar',
    description: 'Read 7 Daily Tips.',
    icon: Star,
    check: (state) => false,
  },

  // LEGACY SQUAD (Purple)
  {
    id: 'veteran',
    group: 'LEGACY',
    title: 'The Veteran',
    description: 'Reach Level 5.',
    icon: Crown,
    check: (state) => (state.level || 1) >= 5,
  },
  {
    id: 'spartan_status',
    group: 'LEGACY',
    title: 'Spartan Status',
    description: 'Reach Level 25.',
    icon: Trophy,
    check: (state) => (state.level || 1) >= 25,
  },
  {
    id: 'elite_athlete',
    group: 'LEGACY',
    title: 'Elite Athlete',
    description: 'Reach Level 50.',
    icon: Medal,
    check: (state) => (state.level || 1) >= 50,
  },
  {
    id: 'streak_3',
    group: 'LEGACY',
    title: 'Heating Up',
    description: 'Maintain a 3-day workout streak.',
    icon: Flame,
    check: (state) => (state.streak || 0) >= 3,
  },
  {
    id: 'streak_7',
    group: 'LEGACY',
    title: 'Unstoppable',
    description: 'Maintain a 7-day workout streak.',
    icon: Flame,
    check: (state) => (state.streak || 0) >= 7,
  },
  {
    id: 'road_warrior',
    group: 'LEGACY',
    title: 'Road Warrior',
    description: 'Complete 3 "Weightless" workouts.',
    icon: Plane,
    check: (state) =>
      (state.history || []).filter(
        (h) => h.workoutId && h.workoutId.includes('weightless')
      ).length >= 3,
  },
  {
    id: 'legendary',
    group: 'LEGACY',
    title: 'Legendary',
    description: 'Complete 100 total workouts.',
    icon: Star,
    check: (state) => (state.history || []).length >= 100,
  },
];
