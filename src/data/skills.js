import { Dumbbell, Zap, Clock, Crown, Shield, BicepsFlexed, Bolt, Award } from 'lucide-react';

export const skillTree = [
  {
    id: 'foundation',
    title: 'The Foundation',
    requiredXp: 0,
    icon: Shield,
    description: 'The journey begins. Unlocks 10 & 20 minute workouts.',
    unlocks: ['10-min-weight', '10-min-weightless', '20-min-weight', '20-min-weightless']
  },
  {
    id: 'endurance-1',
    title: 'Endurance I',
    requiredXp: 250,
    icon: Clock,
    description: 'You can go the distance. Unlocks 30 minute routines.',
    unlocks: ['30-min-weight', '30-min-weightless']
  },
  {
    id: 'hybrid',
    title: 'Hybrid Training',
    requiredXp: 500,
    icon: Zap,
    description: 'Mixing cardio and iron. Unlocks Fat-Burning Intervals.',
    unlocks: ['fat-burn-interval']
  },
  {
    id: 'strength-1',
    title: 'Heavy Lifter',
    requiredXp: 750,
    icon: Dumbbell,
    description: 'Serious volume. Unlocks 45 & 60 minute grinds.',
    unlocks: ['45-min-weight', '45-min-weightless', '60-min-weight', '60-min-weightless']
  },
  {
    id: 'spartan',
    title: 'Spartan Status',
    requiredXp: 1000,
    icon: Crown,
    description: 'The ultimate test. Unlocks 90-minute workouts.',
    unlocks: ['90-min-weight', '90-min-weightless']
  }
];

export const SKILL_BRANCHES = {
  POWER: {
    color: 'text-blue-500',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500',
    skills: [
      { 
        id: 'p1', 
        name: 'Piston Power', 
        icon: '🦵', 
        req: { exercise: 'Squat', value: 1.5, type: 'bw_ratio' },
        perk: '+10% XP on Leg Days'
      },
      { 
        id: 'p2', 
        name: 'Earthquake', 
        icon: '🌋', 
        req: { exercise: 'Deadlift', value: 2.0, type: 'bw_ratio' },
        perk: 'Unlocks "Heavy Metal" Missions'
      }
    ]
  },
  ARMOR: {
    color: 'text-red-500',
    border: 'border-red-500/30',
    bg: 'bg-red-500',
    skills: [
      { 
        id: 'a1', 
        name: 'Iron Curtain', 
        icon: '🛡️', 
        req: { exercise: 'Plank Hold', value: 180, type: 'seconds' },
        perk: 'Unlocks "Advanced Core" Missions'
      },
      { 
        id: 'a2', 
        name: 'Unbreakable', 
        icon: '💎', 
        req: { exercise: 'Leg Raise', value: 50, type: 'reps' },
        perk: 'Immune to Rest Timer penalties'
      }
    ]
  },
  STRIKE: {
    color: 'text-yellow-500',
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500',
    skills: [
      { 
        id: 's1', 
        name: 'Apex Strike', 
        icon: '⚡', 
        req: { exercise: 'Pushups', value: 50, type: 'reps' },
        perk: '-5s Rest Timer penalty'
      },
      { 
        id: 's2', 
        name: 'Sky Walker', 
        icon: '🦅', 
        req: { exercise: 'Pull-ups', value: 15, type: 'reps' },
        perk: 'Unlocks "Aerial Combat" Missions'
      }
    ]
  }
};

export const getTierProgress = (xp) => {
  const cap = 1000;
  const percentage = Math.min((xp / cap) * 100, 100);
  return { current: xp, max: cap, percentage };
};
