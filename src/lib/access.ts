import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth, isOwnerEmail } from "@/auth";

export async function getViewer() {
  // Auth.js touches crypto before reading cookies; mark this as request-time
  // work so Cache Components doesn't try to prerender it.
  await connection();
  const session = await auth();
  const isOwner = isOwnerEmail(session?.user?.email);
  const isPublic = process.env.PUBLIC_VIEW === "true";
  return { isOwner, canView: isOwner || isPublic };
}

/** For pages: send visitors to /login unless the timeline is public. */
export async function requireViewer() {
  const viewer = await getViewer();
  if (!viewer.canView) redirect("/login");
  return viewer;
}

/** For edits: only the owner may change anything. */
export async function requireOwner() {
  const viewer = await getViewer();
  if (!viewer.isOwner) redirect("/login");
  return viewer;
}
