export const workouts = [
  // --- 10 MINUTE WORKOUTS ---
  {
    id: "10-min-weight",
    title: "The Ultimate 10-Minute Workout (Weight)",
    duration: 10,
    type: "weight",
    difficulty: "Beginner",
    exercises: [
      { name: "Jumping Jacks / Jog in Place", sets: 1, reps: "1 min", notes: "Warm-up" },
      { name: "Squats", sets: 2, reps: "8-12", notes: "30 sec rest between sets" },
      { name: "Inclined Bench Press", sets: 2, reps: "8-12", notes: "15-20 sec rest" },
      { name: "Barbell Rows", sets: 2, reps: "8-12", notes: "15-20 sec rest" },
      { name: "Crunches", sets: 1, reps: "To failure", notes: "Finish strong" },
      { name: "Post-Workout Stretch", sets: 1, reps: "1 min", notes: "Do in shower or office" }
    ]
  },
  {
    id: "10-min-weightless",
    title: "The Ultimate 10-Minute Workout (Weightless)",
    duration: 10,
    type: "weightless",
    difficulty: "Beginner",
    exercises: [
      { name: "Jumping Jacks / Jog in Place", sets: 1, reps: "1 min", notes: "Warm-up" },
      { name: "Lunges", sets: 2, reps: "10-15", notes: "30 sec rest between sets" },
      { name: "Decline Push-ups", sets: 2, reps: "10-15", notes: "15-20 sec rest" },
      { name: "Seated Rows (Tubing)", sets: 2, reps: "8-12", notes: "15-20 sec rest" },
      { name: "Crunches", sets: 1, reps: "To failure", notes: "Finish strong" },
      { name: "Post-Workout Stretch", sets: 1, reps: "1 min", notes: "Do in shower or office" }
    ]
  },

  // --- 20 MINUTE WORKOUTS ---
  {
    id: "20-min-weight",
    title: "The Ultimate 20-Minute Workout (Weight)",
    duration: 20,
    type: "weight",
    difficulty: "Intermediate",
    exercises: [
      { name: "Cardio Warm-up", sets: 1, reps: "2 min", notes: "Break a light sweat" },
      { name: "Stretching", sets: 1, reps: "2 min", notes: "Prep muscles" },
      { name: "Bench Press", sets: 1, reps: "8-12", notes: "Heavy set" },
      { name: "Barbell Rows", sets: 1, reps: "8-12", notes: "Heavy set" },
      { name: "Seated Military Press", sets: 1, reps: "8-12", notes: "Shoulders" },
      { name: "Barbell Curls", sets: 1, reps: "10-15", notes: "Biceps" },
      { name: "Overhead Triceps Ext", sets: 1, reps: "10-15", notes: "Triceps" },
      { name: "Squats", sets: 1, reps: "8-12", notes: "Legs" },
      { name: "Crunches", sets: 1, reps: "To failure", notes: "Abs" },
      { name: "Active Cooldown", sets: 1, reps: "2 min", notes: "Easy cycle or walk" },
      { name: "Final Stretch", sets: 1, reps: "2 min", notes: "Focus on tight areas" }
    ]
  },
  {
    id: "20-min-weightless",
    title: "The Ultimate 20-Minute Workout (Weightless)",
    duration: 20,
    type: "weightless",
    difficulty: "Intermediate",
    exercises: [
      { name: "Cardio Warm-up", sets: 1, reps: "2 min", notes: "Break a light sweat" },
      { name: "Stretching", sets: 1, reps: "2 min", notes: "Prep muscles" },
      { name: "Push-ups between chairs", sets: 1, reps: "10-15", notes: "Chest/Tri" },
      { name: "Seated Rows (Tubing)", sets: 1, reps: "8-12", notes: "Back" },
      { name: "Desk Dips", sets: 1, reps: "10-15", notes: "Triceps" },
      { name: "Biceps Curls (Tubing)", sets: 1, reps: "8-12", notes: "Biceps" },
      { name: "Upright Rows (Tubing)", sets: 1, reps: "8-12", notes: "Shoulders" },
      { name: "Lunges", sets: 1, reps: "10-15", notes: "Legs" },
      { name: "Crunches", sets: 1, reps: "To failure", notes: "Abs" },
      { name: "Active Cooldown", sets: 1, reps: "2 min", notes: "Easy cycle or walk" },
      { name: "Final Stretch", sets: 1, reps: "2 min", notes: "Focus on tight areas" }
    ]
  },

  // --- 30 MINUTE WORKOUTS ---
  {
    id: "30-min-weight",
    title: "The Ultimate 30-Minute Workout (Weight)",
    duration: 30,
    type: "weight",
    difficulty: "Intermediate",
    exercises: [
      { name: "Cardio Warm-up", sets: 1, reps: "3 min", notes: "Warm-up" },
      { name: "Stretching", sets: 1, reps: "2 min", notes: "Prep muscles" },
      { name: "Bench Press", sets: 2, reps: "8-12", notes: "1 min rest" },
      { name: "Barbell Rows", sets: 2, reps: "8-12", notes: "1 min rest" },
      { name: "Overhead Triceps Ext", sets: 2, reps: "10-15", notes: "45 sec rest" },
      { name: "Barbell Curls", sets: 2, reps: "10-15", notes: "45 sec rest" },
      { name: "Seated Military Press", sets: 2, reps: "8-12", notes: "1 min rest" },
      { name: "Squats", sets: 2, reps: "8-12", notes: "1 min rest" },
      { name: "Crunches", sets: 2, reps: "15-30", notes: "1 min rest" },
      { name: "Active Cooldown", sets: 1, reps: "2 min", notes: "Easy cycle or walk" },
      { name: "Final Stretch", sets: 1, reps: "2 min", notes: "Focus on tight areas" }
    ]
  },
  {
    id: "30-min-weightless",
    title: "The Ultimate 30-Minute Workout (Weightless)",
    duration: 30,
    type: "weightless",
    difficulty: "Intermediate",
    exercises: [
      { name: "Cardio Warm-up", sets: 1, reps: "3 min", notes: "Warm-up" },
      { name: "Stretching", sets: 1, reps: "2 min", notes: "Prep muscles" },
      { name: "Push-ups between chairs", sets: 3, reps: "10-15", notes: "45 sec rest" },
      { name: "Seated Rows (Tubing)", sets: 3, reps: "8-12", notes: "1 min rest" },
      { name: "Desk Dips", sets: 2, reps: "10-15", notes: "45 sec rest" },
      { name: "Biceps Curls (Tubing)", sets: 2, reps: "8-12", notes: "45 sec rest" },
      { name: "Upright Rows (Tubing)", sets: 2, reps: "8-12", notes: "1 min rest" },
      { name: "Lunges", sets: 3, reps: "10-15", notes: "45 sec rest" },
      { name: "Crunches", sets: 2, reps: "15-30", notes: "1 min rest" },
      { name: "Active Cooldown", sets: 1, reps: "2 min", notes: "Easy cycle or walk" },
      { name: "Final Stretch", sets: 1, reps: "2 min", notes: "Focus on tight areas" }
    ]
  },

  // --- 45 MINUTE WORKOUTS ---
  {
    id: "45-min-weight",
    title: "The Ultimate 45-Minute Workout (Weight)",
    duration: 45,
    type: "weight",
    difficulty: "Advanced",
    exercises: [
      { name: "Cardio Warm-up", sets: 1, reps: "4 min", notes: "Warm-up" },
      { name: "Stretching", sets: 1, reps: "3 min", notes: "Prep muscles" },
      { name: "Bench Press", sets: 3, reps: "8-12", notes: "1 min rest" },
      { name: "Barbell Rows", sets: 3, reps: "8-12", notes: "1 min rest" },
      { name: "Overhead Triceps Ext", sets: 3, reps: "10-15", notes: "45 sec rest" },
      { name: "Barbell Curls", sets: 2, reps: "10-15", notes: "45 sec rest" },
      { name: "Seated Military Press", sets: 3, reps: "8-12", notes: "1 min rest" },
      { name: "Squats", sets: 3, reps: "8-12", notes: "1 min rest" },
      { name: "Stiff-legged Deadlifts", sets: 2, reps: "10-15", notes: "1 min rest" },
      { name: "Crunches", sets: 3, reps: "15-30", notes: "1 min rest" },
      { name: "Active Cooldown", sets: 1, reps: "3 min", notes: "Easy cycle or walk" },
      { name: "Final Stretch", sets: 1, reps: "3 min", notes: "Hold stretches 15s+" }
    ]
  },
  {
    id: "45-min-weightless",
    title: "The Ultimate 45-Minute Workout (Weightless)",
    duration: 45,
    type: "weightless",
    difficulty: "Advanced",
    exercises: [
      { name: "Cardio Warm-up", sets: 1, reps: "4 min", notes: "Warm-up" },
      { name: "Stretching", sets: 1, reps: "3 min", notes: "Prep muscles" },
      { name: "Push-ups between chairs", sets: 3, reps: "10-15", notes: "45 sec rest" },
      { name: "Decline Push-ups", sets: 2, reps: "10-15", notes: "45 sec rest" },
      { name: "Seated Rows (Tubing)", sets: 3, reps: "8-12", notes: "1 min rest" },
      { name: "Desk Dips", sets: 3, reps: "10-15", notes: "45 sec rest" },
      { name: "Biceps Curls (Tubing)", sets: 2, reps: "8-12", notes: "45 sec rest" },
      { name: "Upright Rows (Tubing)", sets: 3, reps: "8-12", notes: "1 min rest" },
      { name: "Squats", sets: 3, reps: "10-15", notes: "1 min rest" },
      { name: "Lunges", sets: 2, reps: "10-15", notes: "45 sec rest" },
      { name: "Crunches", sets: 3, reps: "15-30", notes: "1 min rest" },
      { name: "Active Cooldown", sets: 1, reps: "3 min", notes: "Easy cycle or walk" },
      { name: "Final Stretch", sets: 1, reps: "3 min", notes: "Hold stretches 15s+" }
    ]
  },

  // --- 60 MINUTE WORKOUTS ---
  {
    id: "60-min-weight",
    title: "The Ultimate 60-Minute Workout (Weight)",
    duration: 60,
    type: "weight",
    difficulty: "Advanced",
    exercises: [
      { name: "Cardio Warm-up", sets: 1, reps: "5 min", notes: "Get heart rate up" },
      { name: "Stretching", sets: 1, reps: "3 min", notes: "Prep muscles" },
      { name: "Bench Press", sets: 3, reps: "8-12", notes: "1 min rest" },
      { name: "Inclined Bench Press", sets: 2, reps: "8-12", notes: "1 min rest" },
      { name: "Barbell Rows", sets: 3, reps: "8-12", notes: "1 min rest" },
      { name: "Front Lat Pull-downs", sets: 2, reps: "8-12", notes: "1 min rest" },
      { name: "Overhead Triceps Ext", sets: 4, reps: "10-15", notes: "45 sec rest" },
      { name: "Barbell Curls", sets: 3, reps: "10-15", notes: "45 sec rest" },
      { name: "Seated Military Press", sets: 2, reps: "8-12", notes: "1 min rest" },
      { name: "Upright Rows", sets: 2, reps: "8-12", notes: "45 sec rest" },
      { name: "Squats", sets: 4, reps: "8-12", notes: "1 min rest" },
      { name: "Stiff-legged Deadlifts", sets: 3, reps: "10-15", notes: "1 min rest" },
      { name: "Crunches", sets: 3, reps: "15-30", notes: "1 min rest" },
      { name: "Active Cooldown", sets: 1, reps: "4 min", notes: "Easy cycle or walk" },
      { name: "Final Stretch", sets: 1, reps: "3 min", notes: "Hold stretches 15s+" }
    ]
  },
  {
    id: "60-min-weightless",
    title: "The Ultimate 60-Minute Workout (Weightless)",
    duration: 60,
    type: "weightless",
    difficulty: "Advanced",
    exercises: [
      { name: "Cardio Warm-up", sets: 1, reps: "5 min", notes: "Get heart rate up" },
      { name: "Stretching", sets: 1, reps: "3 min", notes: "Prep muscles" },
      { name: "Push-ups between chairs", sets: 3, reps: "10-15", notes: "45 sec rest" },
      { name: "Decline Push-ups", sets: 2, reps: "10-15", notes: "45 sec rest" },
      { name: "Desk Push-ups", sets: 2, reps: "10-15", notes: "45 sec rest" },
      { name: "Seated Rows (Tubing)", sets: 3, reps: "8-12", notes: "1 min rest" },
      { name: "Desk Dips", sets: 4, reps: "10-15", notes: "45 sec rest" },
      { name: "Biceps Curls (Tubing)", sets: 3, reps: "8-12", notes: "45 sec rest" },
      { name: "Upright Rows (Tubing)", sets: 3, reps: "8-12", notes: "1 min rest" },
      { name: "Squats", sets: 3, reps: "10-15", notes: "1 min rest" },
      { name: "Lunges", sets: 2, reps: "15-30", notes: "1 min rest" },
      { name: "Heel Raises", sets: 3, reps: "10-15", notes: "45 sec rest" },
      { name: "Crunches", sets: 3, reps: "15-30", notes: "1 min rest" },
      { name: "Active Cooldown", sets: 1, reps: "4 min", notes: "Easy cycle or walk" },
      { name: "Final Stretch", sets: 1, reps: "3 min", notes: "Hold stretches 15s+" }
    ]
  },

  // --- 90 MINUTE WORKOUTS ---
  {
    id: "90-min-weight",
    title: "The Ultimate 90-Minute Workout (Weight)",
    duration: 90,
    type: "weight",
    difficulty: "Expert",
    exercises: [
      { name: "Cardio Warm-up", sets: 1, reps: "6 min", notes: "Warm-up" },
      { name: "Stretching", sets: 1, reps: "4 min", notes: "Prep muscles" },
      { name: "Bench Press", sets: 5, reps: "8-12", notes: "1st set warm-up" },
      { name: "Inclined Bench Press", sets: 4, reps: "8-12", notes: "75 sec rest" },
      { name: "Barbell Rows", sets: 5, reps: "8-12", notes: "1st set warm-up" },
      { name: "Front Lat Pull-downs", sets: 4, reps: "8-12", notes: "75 sec rest" },
      { name: "Overhead Triceps Ext", sets: 5, reps: "10-15", notes: "1st set warm-up" },
      { name: "Barbell Curls", sets: 4, reps: "10-15", notes: "45 sec rest" },
      { name: "Seated Military Press", sets: 4, reps: "8-12", notes: "1 min rest" },
      { name: "Upright Rows", sets: 3, reps: "8-12", notes: "1 min rest" },
      { name: "Squats", sets: 5, reps: "8-12", notes: "1st set warm-up" },
      { name: "Stiff-legged Deadlifts", sets: 4, reps: "10-15", notes: "1 min rest" },
      { name: "Crunches", sets: 5, reps: "15-30", notes: "1 min rest" },
      { name: "Active Cooldown", sets: 1, reps: "6 min", notes: "Easy cycle or walk" },
      { name: "Final Stretch", sets: 1, reps: "4 min", notes: "Hold stretches 15s+" }
    ]
  },
  {
    id: "90-min-weightless",
    title: "The Ultimate 90-Minute Workout (Weightless)",
    duration: 90,
    type: "weightless",
    difficulty: "Expert",
    exercises: [
      { name: "Cardio Warm-up", sets: 1, reps: "6 min", notes: "Warm-up" },
      { name: "Stretching", sets: 1, reps: "4 min", notes: "Prep muscles" },
      { name: "Push-ups between chairs", sets: 5, reps: "10-15", notes: "1 min rest" },
      { name: "Decline Push-ups", sets: 4, reps: "10-15", notes: "45 sec rest" },
      { name: "Desk Push-ups", sets: 2, reps: "10-15", notes: "45 sec rest" },
      { name: "Seated Rows (Tubing)", sets: 5, reps: "8-12", notes: "1 min rest" },
      { name: "Desk Dips", sets: 5, reps: "10-15", notes: "1 min rest" },
      { name: "Biceps Curls (Tubing)", sets: 5, reps: "8-12", notes: "45 sec rest" },
      { name: "Upright Rows (Tubing)", sets: 5, reps: "8-12", notes: "1 min rest" },
      { name: "Squats", sets: 5, reps: "10-15", notes: "1 min rest" },
      { name: "Lunges", sets: 4, reps: "10-15", notes: "45 sec rest" },
      { name: "Heel Raises", sets: 3, reps: "10-15", notes: "45 sec rest" },
      { name: "Crunches", sets: 5, reps: "15-30", notes: "1 min rest" },
      { name: "Active Cooldown", sets: 1, reps: "6 min", notes: "Easy cycle or walk" },
      { name: "Final Stretch", sets: 1, reps: "4 min", notes: "Hold stretches 15s+" }
    ]
  },

  // --- SPECIALTY WORKOUTS ---
  {
    id: "fat-burn-interval",
    title: "The Ultimate Fat-Burning Workout",
    duration: 20,
    type: "interval",
    difficulty: "High Intensity",
    description: "Alternate between high-intensity cardio and resistance training. Go hard for 90 seconds, then lift.",
    exercises: [
      { name: "Cardio Blast (Run/Bike/Step)", sets: 1, reps: "90 sec", notes: "High Intensity" },
      { name: "Dumbbell Squats or Lunges", sets: 1, reps: "1 set", notes: "Transition quickly" },
      { name: "Cardio Blast", sets: 1, reps: "90 sec", notes: "High Intensity" },
      { name: "Push-ups or Bench Press", sets: 1, reps: "1 set", notes: "Transition quickly" },
      { name: "Cardio Blast", sets: 1, reps: "90 sec", notes: "High Intensity" },
      { name: "Dumbbell Rows", sets: 1, reps: "1 set", notes: "Transition quickly" },
      { name: "Cardio Blast", sets: 1, reps: "90 sec", notes: "High Intensity" },
      { name: "Overhead Press", sets: 1, reps: "1 set", notes: "Transition quickly" },
      { name: "Cardio Blast", sets: 1, reps: "90 sec", notes: "High Intensity" },
      { name: "Bicep Curls", sets: 1, reps: "1 set", notes: "Transition quickly" }
    ]
  },
  {
    id: "10-min-abs",
    title: "The Ultimate 10-Minute Ab Workout",
    duration: 10,
    type: "abs",
    difficulty: "Intermediate",
    description: "No rest. 30 seconds per exercise. Continuous movement.",
    exercises: [
      { name: "Crunches", sets: 1, reps: "30 sec", notes: "Don't pull neck" },
      { name: "V-Sits", sets: 1, reps: "30 sec", notes: "Knees to chest" },
      { name: "Side Oblique Crunches (Left)", sets: 1, reps: "30 sec", notes: "Focus on side" },
      { name: "Side Oblique Crunches (Right)", sets: 1, reps: "30 sec", notes: "Focus on side" },
      { name: "Reverse Crunches", sets: 1, reps: "30 sec", notes: "Lift hips" },
      { name: "Vertical Leg Lifts", sets: 1, reps: "30 sec", notes: "Legs straight up" },
      { name: "Arm and Leg Reaches (Left)", sets: 1, reps: "30 sec", notes: "On hands/knees" },
      { name: "Arm and Leg Reaches (Right)", sets: 1, reps: "30 sec", notes: "On hands/knees" },
      { name: "Twisting Reaches", sets: 1, reps: "30 sec", notes: "Seated rotation" },
      { name: "Jackknife Sit-ups", sets: 1, reps: "30 sec", notes: "Advanced move" }
    ]
  },
  {
    id: "office-stealth",
    title: "Office Stealth Circuit",
    duration: 15,
    type: "office",
    difficulty: "Low Sweat",
    description: "Discreet exercises you can do in a suit without sweating.",
    exercises: [
      { name: "Seated Leg Extensions", sets: 3, reps: "12", notes: "Under the desk" },
      { name: "Shoulder Shrugs", sets: 3, reps: "15", notes: "Release tension" },
      { name: "Desk Isometric Press", sets: 3, reps: "10 sec", notes: "Press hands down on desk" },
      { name: "Seated Torso Twist", sets: 2, reps: "10", notes: "Look behind you" },
      { name: "Calf Raises", sets: 3, reps: "20", notes: "While standing at phone" }
    ]
  },

  // --- FROM MH BIG BOOK OF EXERCISES ---
  {
    id: "spartacus",
    title: "The Spartacus Workout",
    duration: 40,
    type: "interval",
    difficulty: "Spartan",
    description: "The legendary fat-loss circuit. 60 seconds of work, 15 seconds of rest. Do 3 circuits.",
    exercises: [
      { name: "Goblet Squat", sets: 3, reps: "60 sec", notes: "Go for 60s. Then rest 15s." },
      { name: "Mountain Climber", sets: 3, reps: "60 sec", notes: "Go for 60s. Then rest 15s." },
      { name: "Single-Arm Dumbbell Swing", sets: 3, reps: "60 sec", notes: "Go for 60s. Then rest 15s." },
      { name: "T-Pushup", sets: 3, reps: "60 sec", notes: "Go for 60s. Then rest 15s." },
      { name: "Split Jump", sets: 3, reps: "60 sec", notes: "Go for 60s. Then rest 15s." },
      { name: "Dumbbell Row", sets: 3, reps: "60 sec", notes: "Go for 60s. Then rest 15s." },
      { name: "Dumbbell Side Lunge", sets: 3, reps: "60 sec", notes: "Go for 60s. Then rest 15s." },
      { name: "Pushup-Position Row", sets: 3, reps: "60 sec", notes: "Go for 60s. Then rest 15s." },
      { name: "Dumbbell Lunge & Rotation", sets: 3, reps: "60 sec", notes: "Go for 60s. Then rest 15s." },
      { name: "Dumbbell Push Press", sets: 3, reps: "60 sec", notes: "Go for 60s. Then rest 15s." }
    ]
  },

  // --- FROM CHAPTER 4: TOTAL BODY (Men's Health Big Book) ---
  {
    id: "classic-powerlifter",
    title: "The Classic Powerlifter",
    duration: 15,
    type: "weight",
    difficulty: "Advanced",
    description: "Focus on the 'Big Three' lifts to build raw power. Heavy weights, fewer reps.",
    exercises: [
      {
        name: "Barbell Squat",
        sets: 3,
        reps: "12, 12, 5",
        notes: "2 light sets (10-12 reps), then 1 heavy set (5 reps). Rest 90s."
      },
      {
        name: "Barbell Bench Press",
        sets: 3,
        reps: "12, 12, 5",
        notes: "Squeeze the bar to activate core. 2 light sets, 1 heavy."
      },
      {
        name: "Barbell Deadlift",
        sets: 3,
        reps: "12, 12, 5",
        notes: "Keep back straight. Drive heels into floor. 2 light sets, 1 heavy."
      }
    ]
  },

  // --- FROM CHAPTER 14: HEALING (Men's Health Big Book) ---
  {
    id: "age-eraser",
    title: "The Age Eraser",
    duration: 15,
    type: "interval",
    difficulty: "Intermediate",
    description: "Plyometric moves to tap fast-twitch fibers and trigger bone growth.",
    exercises: [
      { name: "Power Skaters", sets: 3, reps: "10", notes: "Hop side to side explosively." },
      { name: "Seal Jacks", sets: 3, reps: "20", notes: "Clap hands in front of chest." },
      { name: "Clock Walk", sets: 3, reps: "1 rotation", notes: "Pushup position, walk hands in circle." },
      { name: "Low-Step Lateral Shuffle", sets: 3, reps: "10", notes: "Quick feet over a low box." }
    ]
  },

  // --- BEST OF THE REST (Men's Health Big Book expansion) ---

  // --- FAT BURNING (Metabolic) ---
  {
    id: "melting-a",
    title: "You're Melting (Workout A)",
    duration: 15,
    type: "weight",
    difficulty: "Intermediate",
    description: "High-energy metabolic resistance training to burn fat fast.",
    exercises: [
      { name: "Barbell Rollout", sets: 2, reps: "10", notes: "Keep core tight" },
      { name: "Crossover Dumbbell Stepup", sets: 2, reps: "12/leg", notes: "Cross leg over to step" },
      { name: "Elevated-Feet Inverted Row", sets: 2, reps: "12", notes: "Pull chest to bar" },
      { name: "Barbell Front Squat", sets: 2, reps: "12", notes: "Rest bar on front shoulders" },
      { name: "Pushup", sets: 2, reps: "12", notes: "Classic form" }
    ]
  },

  // --- ABS & CORE ---
  {
    id: "no-crunch-core",
    title: "The No-Crunch Core Workout",
    duration: 15,
    type: "abs",
    difficulty: "Intermediate",
    description: "Engages the entire core without a single traditional crunch.",
    exercises: [
      { name: "Reverse Wood Chop", sets: 2, reps: "10/side", notes: "Use cable or dumbbell" },
      { name: "Single-Arm Lunge", sets: 2, reps: "8/side", notes: "Weight in one hand only" },
      { name: "Reverse Plank with Leg Raise", sets: 2, reps: "10/leg", notes: "Face ceiling, lift leg" },
      { name: "Single-Arm Bent-Over Row", sets: 2, reps: "10/side", notes: "Engage core to stabilize" },
      { name: "Hammer Toss", sets: 2, reps: "10/side", notes: "Use med ball or cable" }
    ]
  },

  // --- ARMS (Vanity) ---
  {
    id: "dumbbell-arms",
    title: "Dumbbell Total Arms",
    duration: 15,
    type: "weight",
    difficulty: "Beginner",
    description: "Old-school isolation moves for biceps and triceps.",
    exercises: [
      { name: "Concentration Curl", sets: 2, reps: "8-12", notes: "Elbow against inner thigh" },
      { name: "Seated Triceps Extension", sets: 2, reps: "8-12", notes: "One weight behind head" },
      { name: "Wrist Curl", sets: 2, reps: "12-15", notes: "Forearms on bench" },
      { name: "Hammer Curl", sets: 2, reps: "8-12", notes: "Palms facing each other" },
      { name: "Standing Scaption", sets: 2, reps: "8-12", notes: "Raise arms at 45 degree angle" }
    ]
  },

  // --- LEGS ---
  {
    id: "iron-glute",
    title: "The Iron Glute Workout",
    duration: 15,
    type: "weight",
    difficulty: "Intermediate",
    description: "Strengthens the posterior chain to protect your back.",
    exercises: [
      { name: "Rotation Lunge", sets: 2, reps: "10", notes: "Twist torso over front leg" },
      { name: "Reverse Lunge Press", sets: 2, reps: "10", notes: "Press weight as you lunge" },
      { name: "Hydrant Extension", sets: 2, reps: "12", notes: "All fours, lift leg side & back" },
      { name: "Lateral Shuffle", sets: 4, reps: "10 steps", notes: "Stay low in squat" },
      { name: "Wide Squat", sets: 2, reps: "15", notes: "Toes pointed out" }
    ]
  },

  // --- BODYWEIGHT (No Gear) ---
  {
    id: "strength-agility",
    title: "Strength & Agility (Bodyweight)",
    duration: 15,
    type: "weightless",
    difficulty: "Beginner",
    description: "Get back in shape with no equipment needed.",
    exercises: [
      { name: "Judo Pushup", sets: 3, reps: "30 sec", notes: "Swoop chest low to high" },
      { name: "Seesaw Lunge", sets: 3, reps: "30 sec", notes: "Lunge forward then back" },
      { name: "Wall Slide", sets: 3, reps: "30 sec", notes: "Back against wall, arms up/down" },
      { name: "Plank Reach", sets: 3, reps: "30 sec", notes: "Plank position, reach arm out" }
    ]
  },

  // --- MISSING LEGENDS (Chest & Back, Cardio Machine, Special Gear) ---

  // --- CHEST & BACK (The V-Shape Builders) ---
  {
    id: "chest-pound-1",
    title: "Chest Pound Workout 1",
    duration: 15,
    type: "weight",
    difficulty: "Intermediate",
    description: "A high-volume circuit to build a broad chest and strong triceps.",
    exercises: [
      { name: "Parallel Bar Dip", sets: 2, reps: "Max reps", notes: "Lower until upper arms are parallel." },
      { name: "Barbell Bench Press", sets: 2, reps: "10-12", notes: "Squeeze the bar hard." },
      { name: "Incline Dumbbell Fly", sets: 2, reps: "10-12", notes: "Sweep arms wide." },
      { name: "Single-Arm Dumbbell Row", sets: 2, reps: "15/arm", notes: "Keep back flat." },
      { name: "Weighted Pushup", sets: 2, reps: "10-12", notes: "Wear a vest or plate on back." }
    ]
  },
  {
    id: "back-attack",
    title: "The Back Attack",
    duration: 15,
    type: "weight",
    difficulty: "Advanced",
    description: "Complex movements to build a thick, powerful back and correct posture.",
    exercises: [
      { name: "Thoracic Rotation", sets: 2, reps: "20/side", notes: "Kneel and rotate torso." },
      { name: "Rack Pull", sets: 2, reps: "10-12", notes: "Deadlift from knee height." },
      { name: "Two-Part Dumbbell Row", sets: 2, reps: "10-12", notes: "Pause at top, then lower." },
      { name: "Pullup Hold", sets: 2, reps: "5 reps", notes: "Hold at top for 10-20 sec." },
      { name: "Cable Diagonal Raise", sets: 2, reps: "10-12", notes: "Pull from low to high across body." }
    ]
  },

  // --- SPECIAL GEAR (Kettlebell) ---
  {
    id: "kettlebell-1",
    title: "Kettlebell Inferno",
    duration: 15,
    type: "weight",
    difficulty: "Intermediate",
    description: "Burns 20 calories per minute. An absolute metabolic torch.",
    exercises: [
      { name: "Around the Body Pass", sets: 3, reps: "10/direction", notes: "Pass bell around waist." },
      { name: "Kettlebell Swing", sets: 3, reps: "15-20", notes: "Drive from hips, not arms." },
      { name: "Kettlebell Deadlift", sets: 3, reps: "10-12", notes: "Keep back flat." },
      { name: "Halo", sets: 3, reps: "6/direction", notes: "Circle bell around head." }
    ]
  },

  // --- CARDIO MACHINE (Treadmill) ---
  {
    id: "speed-demon",
    title: "The Speed Demon",
    duration: 15,
    type: "interval",
    difficulty: "Spartan",
    description: "Treadmill interval sprints to max out heart rate.",
    exercises: [
      { name: "Warmup Walk", sets: 1, reps: "3 min", notes: "3.5 - 3.8 mph" },
      { name: "Sprint Interval 1", sets: 1, reps: "45 sec", notes: "8.0+ mph (All out)" },
      { name: "Recovery Jog", sets: 1, reps: "45 sec", notes: "5.5 mph" },
      { name: "Sprint Interval 2", sets: 1, reps: "60 sec", notes: "8.0+ mph" },
      { name: "Recovery Jog", sets: 1, reps: "90 sec", notes: "5.5 mph" },
      { name: "Sprint Interval 3", sets: 1, reps: "75 sec", notes: "8.0+ mph" },
      { name: "Recovery Jog", sets: 1, reps: "60 sec", notes: "5.5 mph" },
      { name: "Sprint Interval 4", sets: 1, reps: "45 sec", notes: "Max Effort!" },
      { name: "Cooldown Walk", sets: 1, reps: "3 min", notes: "3.0 mph" }
    ]
  },

  // --- SPORTS PERFORMANCE (Chapters 10, 13, 15) ---

  {
    id: "golf-power",
    title: "The Golf Workout",
    duration: 15,
    type: "sports",
    difficulty: "Intermediate",
    description: "Builds rotational power for a longer drive.",
    exercises: [
      { name: "Lawn Mower", sets: 3, reps: "12/side", notes: "Rotational row from lunge." },
      { name: "Windmill", sets: 3, reps: "20", notes: "Wide stance, rotate arm to ceiling." },
      { name: "Leaning Hamstring Curl", sets: 3, reps: "12/leg", notes: "Isolates the posterior chain." },
      { name: "Medicine Ball Transfer", sets: 3, reps: "15", notes: "Pass ball from hands to feet." }
    ]
  },
  {
    id: "tennis-ace",
    title: "The Tennis Workout",
    duration: 15,
    type: "sports",
    difficulty: "Intermediate",
    description: "Quickens reflexes and lateral agility.",
    exercises: [
      { name: "Power Lunge and Pull", sets: 3, reps: "12/leg", notes: "Lunge while pulling weights to torso." },
      { name: "Calf Raise", sets: 3, reps: "12", notes: "Explosive concentric, slow eccentric." },
      { name: "Rotation Swing", sets: 3, reps: "10/side", notes: "Mimic a forehand stroke with weight." },
      { name: "Lateral Leap with Reach", sets: 3, reps: "5/side", notes: "Jump sideways, touch toes." }
    ]
  },
  {
    id: "cycling-lance",
    title: "The Lance Armstrong (Cycling)",
    duration: 15,
    type: "sports",
    difficulty: "Advanced",
    description: "Progressive resistance intervals for stationary bikes.",
    exercises: [
      { name: "Warmup Spin", sets: 1, reps: "3 min", notes: "Moderate pace (Level 6)." },
      { name: "Fast Pedal", sets: 1, reps: "2 min", notes: "High RPM (Level 8)." },
      { name: "Chase Pace", sets: 1, reps: "1 min", notes: "Hard effort (Level 9)." },
      { name: "Sprint!", sets: 1, reps: "30 sec", notes: "Max effort (Level 10)." },
      { name: "Easy Pedal", sets: 1, reps: "3 min", notes: "Recover (Level 6)." },
      { name: "Fast Pedal", sets: 1, reps: "2 min", notes: "Level 8." },
      { name: "Chase Pace", sets: 1, reps: "1 min", notes: "Level 9." },
      { name: "Final Sprint", sets: 1, reps: "30 sec", notes: "Empty the tank." }
    ]
  },
  {
    id: "stamina-workout",
    title: "The Stamina Workout",
    duration: 15,
    type: "sports",
    difficulty: "Intermediate",
    description: "Builds endurance and hip flexibility.",
    exercises: [
      { name: "Boxer's Punch", sets: 3, reps: "32 reps", notes: "Use light dumbbells." },
      { name: "Dumbbell Squat", sets: 3, reps: "16 reps", notes: "Deep squats for hip mobility." },
      { name: "Pushup & Prone Row", sets: 3, reps: "Pyramid", notes: "Pushup then row weight to ribs." },
      { name: "Jump Squat & Curl", sets: 3, reps: "Pyramid", notes: "Explosive jump, then bicep curl." }
    ]
  },

  // --- FROM MH BIG BOOK OF EXERCISES: TRANSFORMATION PROGRAMS ---

  {
    id: "scrawny-brawny",
    title: "Scrawny to Brawny (Phase 1)",
    duration: 45,
    type: "weight",
    difficulty: "Advanced",
    description: "The classic hypertrophy plan. Slow eccentrics (3 seconds down) to tear muscle fibers.",
    exercises: [
      { name: "Barbell Deadlift", sets: 3, reps: "8", notes: "Rest 90s. Heavy." },
      { name: "Incline Dumbbell Press", sets: 3, reps: "8", notes: "3-second lowering phase." },
      { name: "Chin-up", sets: 3, reps: "Max", notes: "Dead hang at bottom." },
      { name: "Dumbbell Step-up", sets: 3, reps: "10/leg", notes: "Use a knee-height box." },
      { name: "Seated Calf Raise", sets: 3, reps: "15", notes: "Pause at top." }
    ]
  },
  {
    id: "bodyweight-500",
    title: "The Bodyweight 500",
    duration: 30,
    type: "weightless",
    difficulty: "Spartan",
    description: "500 total reps. Do not stop until you finish. Record your total time.",
    exercises: [
      { name: "Pushups", sets: 1, reps: "50", notes: "Chest to floor." },
      { name: "Jump Squats", sets: 1, reps: "50", notes: "Explosive power." },
      { name: "Inverted Rows", sets: 1, reps: "50", notes: "Use a table or bar." },
      { name: "Jumping Jacks", sets: 1, reps: "50", notes: "Full range of motion." },
      { name: "Step-ups", sets: 1, reps: "50", notes: "25 per leg." },
      { name: "Pike Pushups", sets: 1, reps: "50", notes: "Shoulder focus." },
      { name: "Lunges", sets: 1, reps: "50", notes: "25 per leg." },
      { name: "Crunches", sets: 1, reps: "50", notes: "Squeeze at top." },
      { name: "Mountain Climbers", sets: 1, reps: "50", notes: "25 per leg." },
      { name: "Burpees", sets: 1, reps: "50", notes: "The finisher." }
    ]
  },
  {
    id: "beach-body",
    title: "The Beach Body Circuit",
    duration: 20,
    type: "interval",
    difficulty: "Intermediate",
    description: "A density circuit designed to carve the V-taper (Shoulders & Abs).",
    exercises: [
      { name: "Dumbbell Swing", sets: 4, reps: "20", notes: "Hinge at hips." },
      { name: "Dumbbell Shoulder Press", sets: 4, reps: "12", notes: "Standing, core tight." },
      { name: "Goblet Squat", sets: 4, reps: "15", notes: "Deep depth." },
      { name: "Plank to Pushup", sets: 4, reps: "10", notes: "Elbow down, hand up." },
      { name: "Farmer's Walk", sets: 4, reps: "45 sec", notes: "Heavy dumbbells, walk straight." }
    ]
  }
];
