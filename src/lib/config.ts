import "server-only";
import { isValidDate } from "./dates";

/** Your date of birth, YYYY-MM-DD. The timeline starts here. */
export function birthDate() {
  const value = process.env.BIRTH_DATE ?? "2002-01-01";
  if (!isValidDate(value)) throw new Error("BIRTH_DATE must look like 2002-05-17");
  return value;
}

export function ownerName() {
  return process.env.OWNER_NAME || "My";
}

/**
 * Today's date (YYYY-MM-DD) in your timezone, so the new year appears at your
 * midnight rather than the server's. Call only after reading request data.
 */
export function today() {
  const timeZone = process.env.TIMEZONE || "Asia/Kolkata";
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
}
