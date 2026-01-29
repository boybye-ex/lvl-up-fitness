import { Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';

const tips = [
  "Pack your gym bag the night before. Start at the bottom: shoes first, then socks inside them.",
  "Don't have time? Do a 'Super Set'. Train opposing muscles (like Chest and Back) back-to-back with no rest.",
  "Eat a banana or yogurt 60 minutes before training. It's the '60/60 Rule' for energy.",
  "Stuck in a hotel? Use the floor. Push-ups, lunges, and crunches require zero equipment.",
  "Morning workouts boost metabolism for the rest of the day. Set the alarm 15 minutes earlier.",
  "Traffic jam? Squeeze the steering wheel for 5 seconds to tone forearms and relieve stress.",
  "Drink 16oz of water for every pound of weight lost during a workout."
];

export default function DailyTip() {
  const [tip, setTip] = useState("");

  useEffect(() => {
    // Pick a random tip on mount
    const random = tips[Math.floor(Math.random() * tips.length)];
    setTip(random);
  }, []);

  return (
    <div className="bg-zinc-900/50 border border-yellow-500/30 p-4 rounded-xl mt-8">
      <div className="flex items-center gap-2 text-yellow-500 mb-2">
        <Lightbulb size={18} />
        <span className="text-xs font-bold uppercase tracking-widest">Pro Tip</span>
      </div>
      <p className="text-zinc-400 text-sm italic leading-relaxed">
        "{tip}"
      </p>
    </div>
  );
}
