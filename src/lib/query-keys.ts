/** Central query keys for TanStack Query. */
export const qk = {
  dashboard: ["dashboard"] as const,
  feed: ["feed"] as const,
  suggested: ["suggested"] as const,
  activeProgram: ["program", "active"] as const,
  program: (id: number) => ["program", id] as const,
  workout: (date: string) => ["workout", date] as const,
  workoutsRange: (from: string, to: string) =>
    ["workouts", "range", from, to] as const,
  measurements: ["measurements"] as const,
  discover: ["discover"] as const,
  discoverHome: ["discover", "home"] as const,
  profile: (userId: string) => ["profile", userId] as const,
  me: ["me"] as const,
  exercises: ["exercises"] as const,
  settings: ["settings"] as const,
};
