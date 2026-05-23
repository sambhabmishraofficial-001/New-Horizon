"use client";

import {
  SettingsHeader,
  SettingsSection,
  Row,
  Toggle,
} from "@/components/settings/SettingsKit";
import { useUserPrefs } from "@/lib/store/preferences";

const FLAGS: { id: string; label: string; description: string }[] = [
  {
    id: "knowledge-graph-3d",
    label: "3D knowledge graph",
    description: "Render the project graph in WebGL with force-directed layout.",
  },
  {
    id: "voice-composer",
    label: "Voice composer",
    description: "Talk to the agent with push-to-talk dictation in the IRE rail.",
  },
  {
    id: "agent-debate",
    label: "Multi-agent debate",
    description: "Two agents argue opposite sides before answering. Slower, more rigorous.",
  },
  {
    id: "live-blame",
    label: "Live provenance blame",
    description: "Hover any sentence in a manuscript to see which run it traces back to.",
  },
  {
    id: "preregister-on-save",
    label: "Auto-preregister",
    description: "Hash and timestamp hypotheses on save so reviewers can verify priority.",
  },
  {
    id: "twin-arena",
    label: "Twin arena",
    description: "Spin up multiple research twins and compare their answers side-by-side.",
  },
  {
    id: "anomaly-blocking",
    label: "Anomaly-blocking commits",
    description: "Refuse to advance a study if Radar flags an unresolved invariant break.",
  },
];

export default function LabsSettings() {
  const { prefs, setPrefs } = useUserPrefs();
  const set = (id: string, on: boolean) =>
    setPrefs({ labs: { ...prefs.labs, [id]: on } });

  return (
    <div>
      <SettingsHeader
        title="Labs"
        description="Early-access features. Each one ships when it's ready; expect rough edges in the meantime."
      />

      <SettingsSection title="Experimental">
        {FLAGS.map((f) => (
          <Row key={f.id} label={f.label} description={f.description}>
            <Toggle
              checked={!!prefs.labs[f.id]}
              onChange={(v) => set(f.id, v)}
            />
          </Row>
        ))}
      </SettingsSection>

      <div className="mt-6 rounded-xl border border-amber-200/60 bg-amber-50/60 p-4 text-[12.5px] text-amber-900">
        These features may change, break, or disappear without notice. Send feedback to{" "}
        <span className="font-mono text-[12px]">contact@newhorizon.dev</span>.
      </div>
    </div>
  );
}
