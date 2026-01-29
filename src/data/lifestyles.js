import { Briefcase, Plane, Moon, Users, Sun } from 'lucide-react';

export const lifestyles = [
  {
    id: 'executive',
    title: 'The Busy Exec',
    icon: Briefcase,
    quote: 'Stuck on the Business Treadmill',
    description: '12-hour days, endless meetings, lots of coffee.',
    recommendation: 'The Lunch Hour Power',
    schedule: '12:00 PM - 1:00 PM',
    strategy:
      "If you can't get to the gym, use the 'Office Stealth' circuit. Schedule workouts as 'Non-negotiable Meetings' in your calendar.",
    sourcePage: '160',
  },
  {
    id: 'traveler',
    title: 'The Road Warrior',
    icon: Plane,
    quote: 'On the Road / Hotel Living',
    description: 'Frequent flier miles, hotel food, and jet lag.',
    recommendation: 'Hotel Room Circuit',
    schedule: '6:00 AM (Before the day starts)',
    strategy:
      "Never rely on hotel gyms. Pack resistance bands. Use 'Travel Mode' to filter for bodyweight exercises you can do in your room.",
    sourcePage: '104',
  },
  {
    id: 'shift',
    title: 'The Shift Worker',
    icon: Moon,
    quote: 'Fighting the Force of Darkness',
    description: 'Odd hours, rotating shifts, fighting fatigue.',
    recommendation: 'The Pre-Shift Jumpstart',
    schedule: '2:00 PM (Before swing shift)',
    strategy:
      'Avoid caffeine 5 hours before sleep. Exercise before your shift to boost alertness, not after when you need to wind down.',
    sourcePage: '108',
  },
  {
    id: 'family',
    title: 'The Family Guy',
    icon: Users,
    quote: 'Family or Fitness?',
    description: "Kids' soccer games, chores, and quality time.",
    recommendation: 'The Dawn Patrol',
    schedule: '5:30 AM',
    strategy:
      "Your evenings belong to the family. Get up 45 minutes earlier. On weekends, turn chores into 'The Weekend Workout'.",
    sourcePage: '161',
  },
  {
    id: 'morning',
    title: 'The Early Riser',
    icon: Sun,
    quote: 'Working Out in the Morning',
    description: 'You want to get it done before the chaos starts.',
    recommendation: 'Metabolic Boost',
    schedule: '6:00 AM',
    strategy:
      "Lay out your clothes the night before. Don't check email until AFTER you sweat. This sets a positive tone for the entire day.",
    sourcePage: '84',
  },
];
