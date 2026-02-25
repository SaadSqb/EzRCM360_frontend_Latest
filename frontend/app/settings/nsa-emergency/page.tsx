import { PageHeader } from "@/components/settings/PageHeader";
import { Card } from "@/components/ui/Card";

export default function NsaEmergencyPage() {
  return (
    <div>
      <PageHeader title="Emergency Override Rules" description="Emergency override rules." />
      <Card><p className="text-sm text-slate-600">Placeholder. Wire to backend when available.</p></Card>
    </div>
  );
}
