/** Canonical storage: weight kg, length cm. Convert only at UI boundaries. */

export type UnitSystem = "metric" | "imperial";

export const KG_PER_LB = 0.45359237;
export const CM_PER_IN = 2.54;

export function weightUnit(system: UnitSystem): "kg" | "lb" {
  return system === "imperial" ? "lb" : "kg";
}

export function lengthUnit(system: UnitSystem): "cm" | "in" {
  return system === "imperial" ? "in" : "cm";
}

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

export function cmToIn(cm: number): number {
  return cm / CM_PER_IN;
}

export function inToCm(inch: number): number {
  return inch * CM_PER_IN;
}

/** Round weight for display (1 decimal). */
export function displayWeight(kg: number | null | undefined, system: UnitSystem): number | null {
  if (kg == null || !Number.isFinite(kg)) return null;
  const v = system === "imperial" ? kgToLb(kg) : kg;
  return Math.round(v * 10) / 10;
}

/** Volume/tonnage is Σ(kg × reps); convert total for imperial. */
export function displayVolume(kgVolume: number | null | undefined, system: UnitSystem): number {
  if (kgVolume == null || !Number.isFinite(kgVolume)) return 0;
  const v = system === "imperial" ? kgToLb(kgVolume) : kgVolume;
  return Math.round(v);
}

export function displayLength(cm: number | null | undefined, system: UnitSystem): number | null {
  if (cm == null || !Number.isFinite(cm)) return null;
  const v = system === "imperial" ? cmToIn(cm) : cm;
  return Math.round(v * 10) / 10;
}

/** Form display → storage kg. */
export function toStorageWeight(value: number, system: UnitSystem): number {
  const kg = system === "imperial" ? lbToKg(value) : value;
  return Math.round(kg * 10) / 10;
}

/** Form display → storage cm. */
export function toStorageLength(value: number, system: UnitSystem): number {
  const cm = system === "imperial" ? inToCm(value) : value;
  return Math.round(cm * 10) / 10;
}

export function formatHeight(
  cm: number | null | undefined,
  system: UnitSystem,
): string | null {
  if (cm == null || !Number.isFinite(cm)) return null;
  if (system === "imperial") {
    const totalIn = cmToIn(cm);
    const ft = Math.floor(totalIn / 12);
    let inch = Math.round(totalIn - ft * 12);
    if (inch === 12) return `${ft + 1}'0"`;
    return `${ft}'${inch}"`;
  }
  return `${Math.round(cm)} cm`;
}

export function heightCmFromFtIn(ft: number, inch: number): number {
  return Math.round(inToCm(ft * 12 + inch) * 10) / 10;
}

export function ftInFromCm(cm: number): { ft: number; inch: number } {
  const totalIn = cmToIn(cm);
  const ft = Math.floor(totalIn / 12);
  let inch = Math.round(totalIn - ft * 12);
  if (inch === 12) return { ft: ft + 1, inch: 0 };
  return { ft, inch };
}

export function formatWeightLabel(
  kg: number | null | undefined,
  system: UnitSystem,
  locale = "en",
): string {
  const n = displayWeight(kg, system);
  if (n == null) return "—";
  return `${n.toLocaleString(locale)} ${weightUnit(system)}`;
}

export function formatVolumeLabel(
  kgVolume: number | null | undefined,
  system: UnitSystem,
  locale = "en",
): string {
  const n = displayVolume(kgVolume, system);
  return `${n.toLocaleString(locale)} ${weightUnit(system)}`;
}
