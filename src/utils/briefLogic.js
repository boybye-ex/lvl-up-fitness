import { generateAIBrief } from "./geminiCoach";

/**
 * Daily Brief Logic Engine
 * Analyzes the relationship between yesterday's output (workout) and fuel (nutrition)
 * to generate personalized coaching messages.
 */

export async function generateBrief(profile, history, foodLogs) {
  // Try AI-generated brief first
  try {
    const aiBrief = await generateAIBrief(profile, history, foodLogs);
    if (aiBrief) {
      // Determine color/icon based on content if possible, or use defaults
      const isNegative = aiBrief.toLowerCase().includes("missed") || aiBrief.toLowerCase().includes("deficit");
      const isRecovery = aiBrief.toLowerCase().includes("recovery") || aiBrief.toLowerCase().includes("deload");
      
      return {
        title: isRecovery ? "STRATEGIC RECOVERY" : isNegative ? "TACTICAL ADJUSTMENT" : "AI COACH INSIGHT",
        message: aiBrief,
        color: isRecovery ? "text-yellow-400" : isNegative ? "text-orange-400" : "text-blue-400",
        bg: isRecovery ? "bg-yellow-500/10" : isNegative ? "bg-orange-500/10" : "bg-blue-500/10",
        borderColor: isRecovery ? "border-yellow-500/20" : isNegative ? "border-orange-500/20" : "border-blue-500/20",
        icon: isRecovery ? "🛡️" : isNegative ? "⚠️" : "✨",
        isAI: true
      };
    }
  } catch (error) {
    console.warn("AI Briefing failed, falling back to static logic:", error);
  }

  // Static Fallback Logic
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];

  // Check yesterday's workout
  const yesterdayWorkout = (history || []).find(h => h.timestamp?.startsWith(dateStr));
  
  // Check yesterday's protein intake
  const yesterdayProtein = (foodLogs || [])
    .filter(f => f.timestamp?.startsWith(dateStr))
    .reduce((sum, f) => sum + (parseFloat(f.protein) || 0), 0);
  
  const proteinGoal = profile?.dailyProteinGoal || 150;
  const proteinMet = yesterdayProtein >= proteinGoal * 0.8;
  const didWorkout = !!yesterdayWorkout;

  // Generate static brief based on conditions
  if (didWorkout && proteinMet) {
    return {
      title: "MISSION ACCOMPLISHED",
      message: `Yesterday you crushed it: workout completed and ${Math.round(yesterdayProtein)}g protein logged. Keep the momentum going.`,
      color: "text-green-400",
      bg: "bg-green-500/10",
      borderColor: "border-green-500/20",
      icon: "🔥",
      isAI: false
    };
  } else if (didWorkout && !proteinMet) {
    return {
      title: "FUEL CHECK",
      message: `Great workout yesterday, but only ${Math.round(yesterdayProtein)}g protein (goal: ${proteinGoal}g). Your muscles need fuel to grow.`,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      icon: "⚠️",
      isAI: false
    };
  } else if (!didWorkout && proteinMet) {
    return {
      title: "REST DAY NOTED",
      message: `No workout logged yesterday, but nutrition was on point with ${Math.round(yesterdayProtein)}g protein. Time to put that fuel to work.`,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      icon: "💪",
      isAI: false
    };
  } else {
    return {
      title: "NEW DAY, NEW START",
      message: "Yesterday's in the past. Today is your opportunity to level up. Let's get after it.",
      color: "text-zinc-400",
      bg: "bg-zinc-500/10",
      borderColor: "border-zinc-500/20",
      icon: "🎯",
      isAI: false
    };
  }
}
