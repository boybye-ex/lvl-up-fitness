/**
 * Build last 7 days with intensity (workout XP), protein (from food logs), and optional weight.
 */
export function getWeeklyComparison(history, foodLogs, weightLogs = []) {
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];

    const dailyWorkouts = (history || []).filter((h) => h.timestamp && h.timestamp.startsWith(dateStr));
    const intensity = dailyWorkouts.reduce((sum, w) => sum + (w.xpEarned || 0), 0);

    const dailyFood = (foodLogs || []).filter((f) => f.timestamp && f.timestamp.startsWith(dateStr));
    const protein = dailyFood.reduce((sum, f) => sum + (parseFloat(f.protein) || 0), 0);

    const weightEntry = (weightLogs || []).find((w) => w.date === dateStr);
    const weight = weightEntry ? parseFloat(weightEntry.value) : 0;

    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dateStr,
      intensity,
      protein,
      weight,
    };
  });

  return last7Days;
}

/**
 * Generate coach insight string from weekly data and optional protein goal.
 */
export function generateInsight(data, proteinGoal = 150) {
  if (!data || data.length === 0) return "Log your workouts and meals to see insights here.";

  const totalProtein = data.reduce((s, d) => s + d.protein, 0);
  const totalWork = data.reduce((s, d) => s + d.intensity, 0);
  const latest = data[data.length - 1];
  const previous = data[data.length - 2];

  if (totalWork > 0 && totalProtein === 0) {
    return "Warning: You're training hard but logging zero protein. Recovery will be slow.";
  }
  if (totalWork > 500 && totalProtein < 100) {
    return "Great effort this week. Increase your protein from the Powerfoods list to see faster muscle growth.";
  }
  if (latest && previous && latest.weight > 0 && previous.weight > 0) {
    if (latest.weight > previous.weight && latest.protein >= proteinGoal) {
      return "Weight is up while hitting protein targets. This is high-quality muscle synthesis. Keep the intensity high!";
    }
    if (latest.weight < previous.weight && latest.intensity > 500) {
      return "Weight is dropping while intensity is high. You are in a prime fat-burning state. Watch your protein to protect muscle.";
    }
  }
  return "Good balance. Keep your protein intake consistent to match your training intensity.";
}
