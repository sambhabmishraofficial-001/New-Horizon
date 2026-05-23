import { redirect } from "next/navigation";

/** Atrium was renamed to Lattice - keep old links working. */
export default function AtriumRedirectPage() {
  redirect("/lattice");
}
