export function moodLabel(mood: number) {
  if (mood >= 4) return "Amazing";
  if (mood >= 2) return "Good";
  if (mood >= 1) return "Okay";
  if (mood === 0) return "Neutral";
  if (mood >= -1) return "Meh";
  if (mood >= -3) return "Bad";
  return "Awful";
}

export function moodColor(mood: number) {
  if (mood > 0) return "text-emerald-300";
  if (mood < 0) return "text-rose-300";
  return "text-zinc-400";
}
