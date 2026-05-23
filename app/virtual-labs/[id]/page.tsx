import { VIRTUAL_LABS } from "@/lib/virtualLabs";
import { VirtualLabDetailClient } from "./VirtualLabDetailClient";

export function generateStaticParams() {
  return VIRTUAL_LABS.map((l) => ({ id: l.id }));
}

export default function VirtualLabDetailPage({ params }: { params: { id: string } }) {
  return <VirtualLabDetailClient labId={params.id} />;
}
