import type { Precision } from "./types";

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function parts(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return { y, m, d };
}

export function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function isLeap(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** 0..1 position of a date inside its year. */
export function yearFraction(date: string) {
  const { y, m, d } = parts(date);
  const start = Date.UTC(y, 0, 1);
  const day = (Date.UTC(y, m - 1, d) - start) / 86_400_000;
  return (day + 0.5) / (isLeap(y) ? 366 : 365);
}

/** Human label respecting how precisely the date is known. */
export function formatDate(date: string, precision: Precision) {
  const { y, m, d } = parts(date);
  if (precision === "year") return `Sometime in ${y}`;
  if (precision === "month") return `${MONTHS[m - 1]} ${y}`;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Normalises a stored date so month/year precision events sit on the 1st. */
export function normaliseDate(date: string, precision: Precision) {
  const { y, m } = parts(date);
  const mm = String(m).padStart(2, "0");
  if (precision === "year") return `${y}-01-01`;
  if (precision === "month") return `${y}-${mm}-01`;
  return date;
}

/** Age in whole years on a given date. */
export function ageOn(birth: string, date: string) {
  const b = parts(birth);
  const t = parts(date);
  let age = t.y - b.y;
  if (t.m < b.m || (t.m === b.m && t.d < b.d)) age--;
  return age;
}

export function isValidDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const { y, m, d } = parts(date);
  return m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth(y, m);
}
