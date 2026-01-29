export const exerciseLibrary = {
  // --- BODYWEIGHT FUNDAMENTALS ---
  "Judo Pushup": {
    targets: "Chest, arms, back, and core",
    steps: [
      "Assume a pushup position but move your feet forward and raise your hips so your body forms an inverted V.",
      "Bend your arms to lower your body, swooping your head and shoulders upward while lowering your hips.",
      "Reverse the move to return to the start.",
    ],
    tips: "Keep your hips raised until your chin nears the floor. Use a fluid, swooping motion.",
    image: "/images/exercises/judo-pushup.gif",
  },
  "Seesaw Lunge": {
    targets: "Quadriceps, glutes, hamstrings, and calves",
    steps: [
      "Step forward with your right leg into a lunge.",
      "In one motion, push off your right heel and step immediately backward into a reverse lunge.",
      "Repeat forward and back without resting.",
    ],
    tips: "Don't let your front knee extend past your toes. Keep your torso upright.",
  },
  "Wall Slide": {
    targets: "Lats, trapezius, and rear deltoids",
    steps: [
      "Stand with your butt, upper back, and head against a wall. Raise arms like a 'W'.",
      "Slide your arms straight up until they are fully extended, keeping elbows and wrists touching the wall.",
      "Slide them back down, squeezing your shoulder blades.",
    ],
    tips: "If you can't keep contact with the wall, step your feet forward slightly.",
  },
  "Plank Reach": {
    targets: "Core and spinal stabilizers",
    steps: [
      "Assume a pushup position (or forearm plank).",
      "Lift one arm and reach it straight out in front of you.",
      "Hold for a second, then switch arms.",
    ],
    tips: "Imagine balancing a glass of water on your lower back. Don't let your hips rock.",
  },

  // --- WEIGHT TRAINING STANDARDS ---
  "Goblet Squat": {
    targets: "Quadriceps, calves, glutes, and core",
    steps: [
      "Hold a dumbbell vertically against your chest, cupping the top end with both hands.",
      "Lower your body by pushing your hips back and bending your knees.",
      "Pause, then push back up.",
    ],
    tips: "Push your knees out with your elbows at the bottom of the squat to open your hips.",
  },
  "Dumbbell Row": {
    targets: "Upper back, lats, and biceps",
    steps: [
      "Place your left knee and hand on a bench. Hold a weight in your right hand.",
      "Pull the weight to the side of your torso, keeping your elbow tucked.",
      "Lower slowly.",
    ],
    tips: "Pull your shoulder blade back *before* you pull with your arm.",
  },
};

/** Safely get exercise details; returns fallback if name not in library. */
export function getExerciseDetails(name) {
  return exerciseLibrary[name] || {
    targets: "Full Body",
    steps: ["Maintain good form.", "Control the movement.", "Breathe steadily."],
    tips: "Focus on muscle connection.",
  };
}
