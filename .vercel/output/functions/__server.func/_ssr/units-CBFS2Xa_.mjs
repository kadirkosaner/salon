//#region node_modules/.nitro/vite/services/ssr/assets/units-CBFS2Xa_.js
var KG_PER_LB = .45359237;
var CM_PER_IN = 2.54;
function weightUnit(system) {
	return system === "imperial" ? "lb" : "kg";
}
function lengthUnit(system) {
	return system === "imperial" ? "in" : "cm";
}
function kgToLb(kg) {
	return kg / KG_PER_LB;
}
function lbToKg(lb) {
	return lb * KG_PER_LB;
}
function cmToIn(cm) {
	return cm / CM_PER_IN;
}
function inToCm(inch) {
	return inch * CM_PER_IN;
}
/** Round weight for display (1 decimal). */
function displayWeight(kg, system) {
	if (kg == null || !Number.isFinite(kg)) return null;
	const v = system === "imperial" ? kgToLb(kg) : kg;
	return Math.round(v * 10) / 10;
}
/** Volume/tonnage is Σ(kg × reps); convert total for imperial. */
function displayVolume(kgVolume, system) {
	if (kgVolume == null || !Number.isFinite(kgVolume)) return 0;
	const v = system === "imperial" ? kgToLb(kgVolume) : kgVolume;
	return Math.round(v);
}
function displayLength(cm, system) {
	if (cm == null || !Number.isFinite(cm)) return null;
	const v = system === "imperial" ? cmToIn(cm) : cm;
	return Math.round(v * 10) / 10;
}
/** Form display → storage kg. */
function toStorageWeight(value, system) {
	const kg = system === "imperial" ? lbToKg(value) : value;
	return Math.round(kg * 10) / 10;
}
/** Form display → storage cm. */
function toStorageLength(value, system) {
	const cm = system === "imperial" ? inToCm(value) : value;
	return Math.round(cm * 10) / 10;
}
function formatHeight(cm, system) {
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
function heightCmFromFtIn(ft, inch) {
	return Math.round(inToCm(ft * 12 + inch) * 10) / 10;
}
function ftInFromCm(cm) {
	const totalIn = cmToIn(cm);
	const ft = Math.floor(totalIn / 12);
	let inch = Math.round(totalIn - ft * 12);
	if (inch === 12) return {
		ft: ft + 1,
		inch: 0
	};
	return {
		ft,
		inch
	};
}
//#endregion
export { ftInFromCm as a, toStorageLength as c, formatHeight as i, toStorageWeight as l, displayVolume as n, heightCmFromFtIn as o, displayWeight as r, lengthUnit as s, displayLength as t, weightUnit as u };
