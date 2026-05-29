import { redirect } from "next/navigation";

/** Legacy atrium URL → VRI workspace home (Lattice is a separate product at /lattice). */
export default function AtriumRedirectPage() {
  redirect("/ire");
}