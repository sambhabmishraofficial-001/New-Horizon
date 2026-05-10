"use client";

import {
  SettingsHeader,
  SettingsSection,
  Row,
  Segment,
  Select,
  Toggle,
} from "@/components/settings/SettingsKit";
import { useUserPrefs } from "@/lib/store/preferences";

const AUTO_SPAWNABLE: { id: string; label: string; description: string }[] = [
  { id: "orchestrator", label: "Compass — orchestrator", description: "Routes work to the right specialist agent." },
  { id: "literature", label: "Halo-A — literature", description: "Synthesises related work and contradictions." },
  { id: "analyst", label: "Sigma — analyst", description: "Runs statistics and produces figures." },
  { id: "writer", label: "Scroll — writer", description: "Drafts manuscripts, abstracts, and grant prose." },
  { id: "auditor", label: "Witness — auditor", description: "Reproducibility checks and provenance audits." },
  { id: "anomaly", label: "Radar — anomaly hunter", description: "Surfaces breaks and silent failures." },
];

const APPROVAL_GATES: { id: string; label: string; description: string }[] = [
  { id: "compute>$1", label: "Compute spend over $1", description: "Pause before kicking off paid jobs." },
  { id: "publish", label: "Publishing", description: "Anything visible outside the workspace." },
  { id: "instrument-dispatch", label: "Instrument dispatch", description: "Real-world hardware actions." },
  { id: "external-API", label: "External API calls", description: "Anything that leaves the institute." },
  { id: "irreversible", label: "Irreversible operations", description: "Deletes, overwrites, finalisations." },
];

export default function AgentSettings() {
  const { prefs, setPrefs } = useUserPrefs();
  const a = prefs.agents;
  const setAgents = (patch: Partial<typeof a>) =>
    setPrefs({ agents: { ...a, ...patch } });

  const toggleSpawn = (id: string) => {
    const next = a.autoSpawn.includes(id)
      ? a.autoSpawn.filter((x) => x !== id)
      : [...a.autoSpawn, id];
    setAgents({ autoSpawn: next });
  };
  const toggleApproval = (id: string) => {
    const next = a.requireApproval.includes(id)
      ? a.requireApproval.filter((x) => x !== id)
      : [...a.requireApproval, id];
    setAgents({ requireApproval: next });
  };

  return (
    <div>
      <SettingsHeader
        title="Agents"
        description="How autonomously your agents act, what they can do alone, and what asks for a glance first."
      />

      <SettingsSection title="Defaults">
        <Row
          label="Default autonomy"
          description="Suggest waits for you. Semi-auto runs reversible work. Full-auto runs the loop."
        >
          <Segment
            value={a.defaultAutonomy}
            onChange={(v) => setAgents({ defaultAutonomy: v })}
            options={[
              { value: "suggest", label: "Suggest" },
              { value: "semi-auto", label: "Semi-auto" },
              { value: "full-auto", label: "Full-auto" },
            ]}
          />
        </Row>
        <Row
          label="Reasoning visibility"
          description="How much of the agent's chain of thought you see by default."
        >
          <Select
            value={a.defaultReasoning}
            onChange={(v) => setAgents({ defaultReasoning: v })}
            options={[
              { value: "always", label: "Always show" },
              { value: "summary", label: "Summary only" },
              { value: "hidden", label: "Hidden" },
            ]}
          />
        </Row>
      </SettingsSection>

      <SettingsSection title="Auto-spawn on new project">
        {AUTO_SPAWNABLE.map((agent) => (
          <Row key={agent.id} label={agent.label} description={agent.description}>
            <Toggle
              checked={a.autoSpawn.includes(agent.id)}
              onChange={() => toggleSpawn(agent.id)}
            />
          </Row>
        ))}
      </SettingsSection>

      <SettingsSection title="Always ask before">
        {APPROVAL_GATES.map((gate) => (
          <Row key={gate.id} label={gate.label} description={gate.description}>
            <Toggle
              checked={a.requireApproval.includes(gate.id)}
              onChange={() => toggleApproval(gate.id)}
            />
          </Row>
        ))}
      </SettingsSection>
    </div>
  );
}
