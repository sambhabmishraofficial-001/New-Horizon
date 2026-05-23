"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Primitives";

type ServiceStatus = "operational" | "degraded" | "down";

type Service = {
  name: string;
  status: ServiceStatus;
  lastIncident: { date: string; desc: string } | null;
};

const SERVICES: Service[] = [
  {
    name: "Lattice workspace",
    status: "operational",
    lastIncident: { date: "2026-05-01", desc: "Compile delay resolved on first load." },
  },
  {
    name: "Twin inference",
    status: "degraded",
    lastIncident: { date: "2026-04-28", desc: "Halo-A queue latency elevated; cleared in 1h." },
  },
  { name: "Invariant registry", status: "operational", lastIncident: null },
  {
    name: "Virtual lab runs",
    status: "operational",
    lastIncident: { date: "2026-05-02", desc: "Bench A1 scheduling blip resolved." },
  },
];

const INCIDENTS = [
  {
    service: "Virtual lab runs",
    date: "2026-05-02",
    desc: "Bench A1 scheduling delay. Resolved in 45m.",
  },
  {
    service: "Twin inference",
    date: "2026-04-28",
    desc: "Queue latency on K11 twins. Resolved in 1h.",
  },
  {
    service: "Lattice workspace",
    date: "2026-05-01",
    desc: "Cold compile on /ire. Resolved in 30m.",
  },
];

const UPTIME_HISTORY: Record<string, number[]> = {
  "Lattice workspace": [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1,
  ],
  "Twin inference": [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1,
  ],
  "Invariant registry": [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ],
  "Virtual lab runs": [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1,
  ],
};

function UptimeBar({ history }: { history: number[] }) {
  return (
    <div className="mt-1 flex gap-0.5">
      {history.map((up, index) => (
        <div
          key={index}
          className={cn(
            "h-6 w-1 rounded-sm",
            up ? "bg-signal-emerald/80" : "bg-signal-rose/80"
          )}
          title={up ? "Up" : "Incident"}
        />
      ))}
    </div>
  );
}

function StatusIcon({ status }: { status: ServiceStatus }) {
  if (status === "operational") {
    return <CheckCircle className="h-4 w-4 text-signal-emerald" strokeWidth={1.75} />;
  }
  if (status === "degraded") {
    return <AlertTriangle className="h-4 w-4 text-amber-600" strokeWidth={1.75} />;
  }
  return <Circle className="h-4 w-4 fill-signal-rose text-signal-rose" />;
}

export function SystemStatusBlock({ className }: { className?: string }) {
  const [showIncidents, setShowIncidents] = React.useState(false);

  return (
    <Card className={cn("w-full overflow-hidden p-0", className)}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-editorial text-[18px] text-ink-900">
              Institute status
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowIncidents((value) => !value)}
              aria-label={showIncidents ? "Hide incident history" : "Show incident history"}
            >
              {showIncidents ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="text-[11px]">
                {showIncidents ? "Hide" : "Incident history"}
              </span>
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {SERVICES.map((service) => (
              <div key={service.name} className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusIcon status={service.status} />
                  <span className="text-[13px] font-medium text-ink-900">
                    {service.name}
                  </span>
                  <span className="text-[11px] capitalize text-ink-500">
                    {service.status}
                  </span>
                  {service.lastIncident ? (
                    <span className="ml-auto text-[11px] text-ink-400">
                      Last: {service.lastIncident.date}
                    </span>
                  ) : null}
                </div>
                <UptimeBar history={UPTIME_HISTORY[service.name] ?? []} />
              </div>
            ))}
          </div>
        </div>

        {showIncidents ? (
          <div className="rounded-xl border border-ink-900/8 bg-parchment-50/80 p-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400">
              Incident history
            </span>
            <div className="mt-3 flex flex-col gap-2">
              {INCIDENTS.map((incident, index) => (
                <div
                  key={`${incident.service}-${index}`}
                  className="border-b border-ink-900/8 pb-2 last:border-b-0 last:pb-0"
                >
                  <span className="text-[12px] font-medium text-ink-800">
                    {incident.service} · {incident.date}
                  </span>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-500">
                    {incident.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
