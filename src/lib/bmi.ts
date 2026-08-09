/** BMI = kg / m². Returns null if inputs invalid. */
export function calcBmi(
  weightKg: number | null | undefined,
  heightCm: number | null | undefined,
): number | null {
  if (weightKg == null || heightCm == null) return null;
  if (weightKg < 20 || weightKg > 400) return null;
  if (heightCm < 80 || heightCm > 250) return null;
  const m = heightCm / 100;
  const bmi = weightKg / (m * m);
  if (!Number.isFinite(bmi)) return null;
  return Math.round(bmi * 10) / 10;
}

export type BmiBand = "under" | "normal" | "over" | "obese";

export function bmiBand(bmi: number): BmiBand {
  if (bmi < 18.5) return "under";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "over";
  return "obese";
}
