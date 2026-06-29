"use client";

import * as React from "react";
import {
  Boxes,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  FlaskConical,
  Laptop,
  Loader2,
  Lock,
  PlayCircle,
} from "lucide-react";
import type { MasterPlan, PhaseStatusResponse, SubPlan } from "../types";
import { cx } from "../utils";

export function MasterPlanViewer({
  plan,
  phases,
  onStartPhase,
  onApprovePhase,
}: {
  plan: MasterPlan;
  phases: PhaseStatusResponse[];
  onStartPhase: (phaseNumber: number) => void;
  onApprovePhase: (phaseNumber: number, approved: boolean) => void;
}) {
  const [expandedDesign, setExpandedDesign] = React.useState(false);
  const [expandedResources, setExpandedResources] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-ink-900/10 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-ink-900">Master Execution Plan</h2>
        <p className="mt-1 text-sm text-ink-500">{plan.objective}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SubPlanColumn
          icon={<Laptop className="h-5 w-5 text-blue-500" />}
          subPlan={plan.computational_plan}
          phases={phases.filter(p => p.sub_plan_type === "computational")}
          onStartPhase={onStartPhase}
          onApprovePhase={onApprovePhase}
        />
        <SubPlanColumn
          icon={<FlaskConical className="h-5 w-5 text-emerald-500" />}
          subPlan={plan.experimental_plan}
          phases={phases.filter(p => p.sub_plan_type === "experimental")}
          onStartPhase={onStartPhase}
          onApprovePhase={onApprovePhase}
        />
      </div>

      {plan.experimental_plan.experimental_design && (
        <div className="rounded-xl border border-ink-900/10 bg-white shadow-sm overflow-hidden">
          <button
            className="flex w-full items-center justify-between bg-parchment-50 px-5 py-4 text-left hover:bg-parchment-100"
            onClick={() => setExpandedDesign(!expandedDesign)}
            type="button"
          >
            <div className="flex items-center gap-3">
              <FlaskConical className="h-5 w-5 text-emerald-600" />
              <h3 className="font-medium text-ink-900">Experimental Design & Protocol</h3>
            </div>
            {expandedDesign ? <ChevronDown className="h-5 w-5 text-ink-500" /> : <ChevronRight className="h-5 w-5 text-ink-500" />}
          </button>
          
          {expandedDesign && (
            <div className="p-5 border-t border-ink-900/10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-ink-500">Hypothesis</span>
                  <p className="mt-1 text-sm text-ink-900">{plan.experimental_plan.experimental_design.hypothesis}</p>
                </div>
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-ink-500">Methodology</span>
                  <p className="mt-1 text-sm text-ink-900">{plan.experimental_plan.experimental_design.methodology}</p>
                </div>
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-ink-500">Controls</span>
                  <ul className="mt-1 text-sm text-ink-900 list-disc pl-4">
                    {plan.experimental_plan.experimental_design.controls.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-ink-500">Power Analysis</span>
                  <p className="mt-1 text-sm text-ink-900">{plan.experimental_plan.experimental_design.power_analysis || "N/A"}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-ink-500">Protocol Steps</span>
                <div className="mt-3 space-y-3">
                  {plan.experimental_plan.experimental_design.protocol_steps.map((step) => (
                    <div key={step.step_number} className="flex gap-4 p-3 rounded-lg bg-parchment-50 border border-ink-900/5">
                      <div className="flex-shrink-0 grid place-items-center h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                        {step.step_number}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-900">{step.action}</p>
                        {step.notes && <p className="mt-1 text-xs text-ink-500">{step.notes}</p>}
                        {step.reagents.length > 0 && (
                          <div className="mt-2 flex gap-2">
                            {step.reagents.map((r, i) => (
                              <span key={i} className="px-2 py-0.5 rounded text-[10px] uppercase font-medium bg-white border border-ink-900/10 text-ink-600">
                                {r}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {plan.resources && plan.resources.length > 0 && (
        <div className="rounded-xl border border-ink-900/10 bg-white shadow-sm overflow-hidden">
          <button
            className="flex w-full items-center justify-between bg-parchment-50 px-5 py-4 text-left hover:bg-parchment-100"
            onClick={() => setExpandedResources(!expandedResources)}
            type="button"
          >
            <div className="flex items-center gap-3">
              <Boxes className="h-5 w-5 text-amber-600" />
              <h3 className="font-medium text-ink-900">Required Resources</h3>
            </div>
            {expandedResources ? <ChevronDown className="h-5 w-5 text-ink-500" /> : <ChevronRight className="h-5 w-5 text-ink-500" />}
          </button>
          
          {expandedResources && (
            <div className="p-0 border-t border-ink-900/10 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase text-ink-500 bg-white border-b border-ink-900/10">
                  <tr>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Quantity</th>
                    <th className="px-5 py-3 font-medium">Specs / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5">
                  {plan.resources.map((res, i) => (
                    <tr key={i} className="hover:bg-parchment-50/50">
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className={cx(
                          "px-2 py-1 rounded-md text-xs font-medium capitalize",
                          res.category === "reagent" ? "bg-rose-100 text-rose-700" :
                          res.category === "equipment" ? "bg-blue-100 text-blue-700" :
                          res.category === "software" ? "bg-purple-100 text-purple-700" :
                          "bg-amber-100 text-amber-700"
                        )}>
                          {res.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-medium text-ink-900">{res.name}</td>
                      <td className="px-5 py-3 text-ink-600">{res.quantity || "-"}</td>
                      <td className="px-5 py-3 text-ink-500 text-xs">
                        {res.specifications}
                        {res.safety_notes && <span className="block mt-1 text-rose-600">⚠️ {res.safety_notes}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SubPlanColumn({
  icon,
  subPlan,
  phases,
  onStartPhase,
  onApprovePhase,
}: {
  icon: React.ReactNode;
  subPlan: SubPlan;
  phases: PhaseStatusResponse[];
  onStartPhase: (phaseNumber: number) => void;
  onApprovePhase: (phaseNumber: number, approved: boolean) => void;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-ink-900/10 bg-white overflow-hidden shadow-sm">
      <div className="bg-parchment-50 px-5 py-4 border-b border-ink-900/10">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-semibold text-ink-900">{subPlan.title}</h3>
        </div>
        <p className="mt-1 text-sm text-ink-500">{subPlan.summary}</p>
      </div>
      <div className="flex-1 p-5 space-y-4">
        {phases.length === 0 ? (
          <p className="text-sm text-ink-400 text-center py-4">No phases proposed.</p>
        ) : (
          phases.map((phase) => (
            <PhaseCard
              key={phase.phase_number}
              phase={phase}
              onStart={() => onStartPhase(phase.phase_number)}
              onApprove={(approved) => onApprovePhase(phase.phase_number, approved)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PhaseCard({
  phase,
  onStart,
  onApprove,
}: {
  phase: PhaseStatusResponse;
  onStart: () => void;
  onApprove: (approved: boolean) => void;
}) {
  const isLocked = phase.status === "locked" || (!phase.status && phase.phase_number > 1); // Simplification, relies on backend status
  
  return (
    <div className={cx(
      "rounded-lg border p-4 transition-all duration-200",
      phase.status === "completed" ? "border-green-200 bg-green-50/30" :
      phase.status === "running" ? "border-beacon-300 bg-beacon-50/50 shadow-beacon-glow" :
      phase.status === "awaiting_approval" ? "border-amber-300 bg-amber-50/50" :
      phase.status === "failed" ? "border-rose-300 bg-rose-50/50" :
      "border-ink-900/10 bg-white"
    )}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-500">
              Phase {phase.phase_number}
            </span>
            <PhaseBadge status={phase.status} />
          </div>
          <h4 className="mt-1 font-medium text-ink-900">{phase.title}</h4>
        </div>
        
        {phase.status === "pending" && (
          <button
            onClick={onStart}
            className="flex items-center gap-1 rounded-md bg-ink-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-ink-800 transition-colors"
          >
            <PlayCircle className="h-3.5 w-3.5" />
            Start
          </button>
        )}
      </div>

      {phase.status === "running" && (
        <div className="mt-4 flex items-center justify-center gap-3 py-2 text-sm text-beacon-700">
          <Loader2 className="h-4 w-4 animate-spin" />
          Executing tasks...
        </div>
      )}

      {phase.status === "awaiting_approval" && phase.verification && (
        <div className="mt-4 space-y-3 border-t border-amber-200 pt-3">
          <div className="rounded-md bg-white p-3 border border-amber-100">
            <p className="text-sm font-medium text-ink-900">Verification Result</p>
            <p className="mt-1 text-sm text-ink-600">{phase.verification.summary}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve & Proceed
            </button>
            <button
              onClick={() => onApprove(false)}
              className="flex items-center justify-center rounded-md border border-ink-900/20 bg-white px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PhaseBadge({ status }: { status: string }) {
  if (status === "completed") {
    return <span className="flex items-center gap-1 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700 uppercase tracking-widest"><CheckCircle2 className="h-3 w-3" /> Complete</span>;
  }
  if (status === "running") {
    return <span className="flex items-center gap-1 rounded bg-beacon-100 px-1.5 py-0.5 text-[10px] font-bold text-beacon-700 uppercase tracking-widest"><Loader2 className="h-3 w-3 animate-spin" /> Running</span>;
  }
  if (status === "awaiting_approval") {
    return <span className="flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 uppercase tracking-widest">Verify</span>;
  }
  if (status === "failed") {
    return <span className="flex items-center gap-1 rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 uppercase tracking-widest">Failed</span>;
  }
  if (status === "locked") {
    return <span className="flex items-center gap-1 rounded bg-ink-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-500 uppercase tracking-widest"><Lock className="h-3 w-3" /> Locked</span>;
  }
  return <span className="rounded bg-ink-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-500 uppercase tracking-widest">Pending</span>;
}
