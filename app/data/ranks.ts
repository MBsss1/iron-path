export function getRank(level: number) {
  if (level >= 30) return "Iron Legend";
  if (level >= 20) return "Built Different";
  if (level >= 15) return "Iron Runner";
  if (level >= 10) return "Street Athlete";
  if (level >= 5) return "Disciplined";
  return "Awakening";
}

export function getNextRank(level: number) {
  if (level < 5) return "Disciplined";
  if (level < 10) return "Street Athlete";
  if (level < 15) return "Iron Runner";
  if (level < 20) return "Built Different";
  if (level < 30) return "Iron Legend";
  return "MAX RANK";
}