"use client";

import {
  SettingsHeader,
  SettingsSection,
  Row,
  Toggle,
} from "@/components/settings/SettingsKit";
import { useUserPrefs } from "@/lib/store/preferences";

type Integration = { id: string; label: string; description: string };

const GROUPS: { title: string; items: Integration[] }[] = [
  {
    title: "Communication",
    items: [
      { id: "slack", label: "Slack", description: "Mentions, run completions, and digests in your channels." },
      { id: "discord", label: "Discord", description: "Same, for community-style labs." },
      { id: "email", label: "Email", description: "Transactional and digest delivery." },
    ],
  },
  {
    title: "Identity & scholarship",
    items: [
      { id: "orcid", label: "ORCID", description: "Verify identity and pull authored work." },
      { id: "zotero", label: "Zotero", description: "Two-way sync of your reference library." },
      { id: "mendeley", label: "Mendeley", description: "Read-only import of your library." },
    ],
  },
  {
    title: "Code & writing",
    items: [
      { id: "github", label: "GitHub", description: "Open issues from a finding; push notebooks to a repo." },
      { id: "overleaf", label: "Overleaf", description: "Compile and edit manuscripts in Overleaf." },
      { id: "google-drive", label: "Google Drive", description: "Import data, export figures, mount as a volume." },
    ],
  },
  {
    title: "Data & artifacts",
    items: [
      { id: "huggingface", label: "Hugging Face", description: "Pull models and datasets into the workspace." },
      { id: "protocols-io", label: "protocols.io", description: "Import and publish wet-lab protocols." },
      { id: "figshare", label: "Figshare", description: "Publish data and figures with DOIs." },
      { id: "zenodo", label: "Zenodo", description: "Long-term archival and DOI minting." },
    ],
  },
  {
    title: "Compute",
    items: [
      { id: "aws", label: "AWS", description: "Run jobs on your AWS account." },
      { id: "gcp", label: "Google Cloud", description: "Run jobs on your GCP account." },
      { id: "azure", label: "Azure", description: "Run jobs on your Azure account." },
      { id: "slurm", label: "SLURM cluster", description: "Connect a university or institutional cluster." },
    ],
  },
];

export default function IntegrationSettings() {
  const { prefs, setPrefs } = useUserPrefs();
  const set = (id: string, on: boolean) =>
    setPrefs({ integrations: { ...prefs.integrations, [id]: on } });

  return (
    <div>
      <SettingsHeader
        title="Integrations"
        description="The institute talks to the rest of your stack. Toggle what's connected; auth is mocked in this build."
      />

      {GROUPS.map((g) => (
        <SettingsSection key={g.title} title={g.title}>
          {g.items.map((it) => (
            <Row key={it.id} label={it.label} description={it.description}>
              <Toggle
                checked={!!prefs.integrations[it.id]}
                onChange={(v) => set(it.id, v)}
              />
            </Row>
          ))}
        </SettingsSection>
      ))}
    </div>
  );
}
