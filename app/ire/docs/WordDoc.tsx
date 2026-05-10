"use client";

import * as React from "react";
import {
  Save,
  Undo2,
  Redo2,
  Scissors,
  Copy,
  Clipboard,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Search,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/cn";

const SAMPLE_PARAGRAPH = `Molecular de-extinction refers to the application of advanced genomic and biotechnological tools to resurrect, or functionally approximate, species that have become extinct. The approach typically involves retrieving ancient DNA (aDNA) from preserved biological material — such as permafrost-entombed specimens, museum collections, or fossilised bone — followed by whole-genome sequencing, sequence assembly, and comparative genomic analysis against closely related extant species. Once a high-quality reference genome of the target extinct species is reconstructed, gene-editing technologies such as CRISPR-Cas9 are employed to introduce species-specific alleles into the genome of the nearest living relative, thereby engineering a proxy organism that recapitulates key phenotypic and ecological traits of the lost species. Notable efforts include the Colossal Biosciences initiative to de-extinct the woolly mammoth (Mammuthus primigenius) by editing its traits into the Asian elephant (Elephas maximus) genome, and parallel projects targeting the thylacine (Thylacinus cynocephalus) and the passenger pigeon (Ectopistes migratorius). Beyond genomic editing, successful de-extinction requires advances in reproductive technologies — including artificial insemination, embryo transfer, and ectogenesis via artificial wombs — as well as a thorough understanding of the ecological niche the resurrected organism would occupy. Ethical and conservation debates centre on resource allocation, ecological risk from reintroduction, and whether such proxies constitute true de-extinction or merely novel hybrid organisms; nonetheless, molecular de-extinction continues to drive fundamental insights into paleogenomics, functional genomics, and the molecular basis of adaptive traits.`;

const TABS = ["File", "Home", "Insert", "Layout", "References", "Review", "Format", "Form", "View", "Help"];

export function WordDoc({ name }: { name: string }) {
  const [tab, setTab] = React.useState("Home");
  const [body, setBody] = React.useState(SAMPLE_PARAGRAPH);
  const [stylePanel, setStylePanel] = React.useState(true);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-parchment-50">
      <RibbonTabs tab={tab} setTab={setTab} title={`${name}.fodt`} />
      <Ribbon tab={tab} />
      <div className="flex-1 min-h-0 flex">
        <DocumentArea body={body} onChange={setBody} />
        {stylePanel && <StyleSidebar />}
      </div>
      <StatusFoot
        words={body.trim().split(/\s+/).length}
        chars={body.length}
        stylePanel={stylePanel}
        toggleStyle={() => setStylePanel((s) => !s)}
      />
    </div>
  );
}

function RibbonTabs({
  tab,
  setTab,
  title,
}: {
  tab: string;
  setTab: (t: string) => void;
  title: string;
}) {
  return (
    <div className="h-9 shrink-0 flex items-center gap-0 px-1 border-b border-ink-900/8 bg-white text-[12px]">
      <div className="flex items-center gap-1 px-2">
        <button title="Save" className="h-7 w-7 grid place-items-center rounded text-ink-600 hover:bg-parchment-50">
          <Save className="h-3.5 w-3.5" />
        </button>
      </div>
      <span className="h-5 w-px bg-ink-900/10 mx-1" />
      {TABS.map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={cn(
            "h-9 px-3 text-[12px]",
            tab === t
              ? "text-ink-900 border-b-2 border-ink-900 -mb-[1px]"
              : "text-ink-600 hover:text-ink-900"
          )}
        >
          {t}
        </button>
      ))}
      <div className="ml-auto pr-3 text-[11.5px] font-mono text-ink-500">{title}</div>
    </div>
  );
}

function Ribbon({ tab }: { tab: string }) {
  return (
    <div className="h-[88px] shrink-0 flex items-center gap-0 px-2 border-b border-ink-900/8 bg-parchment-100">
      {tab === "Home" ? <HomeRibbon /> : <PlaceholderRibbon tab={tab} />}
    </div>
  );
}

function HomeRibbon() {
  return (
    <div className="flex items-center gap-0 h-full">
      <RibbonGroup label="Clipboard">
        <RibbonStack>
          <RibbonBigBtn icon={Clipboard} label="Paste" />
          <div className="flex flex-col gap-0.5">
            <RibbonSmallBtn icon={Scissors} label="Cut" />
            <RibbonSmallBtn icon={Copy} label="Copy" />
          </div>
        </RibbonStack>
      </RibbonGroup>

      <RibbonGroup label="Font">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <select className="h-6 px-1.5 rounded border border-ink-900/12 bg-white text-[11.5px] w-[110px]">
              <option>Carlito</option>
              <option>Calibri</option>
              <option>Times Roman</option>
              <option>Helvetica</option>
            </select>
            <select className="h-6 px-1.5 rounded border border-ink-900/12 bg-white text-[11.5px] w-[50px]">
              <option>12 pt</option>
              <option>11 pt</option>
              <option>14 pt</option>
            </select>
          </div>
          <div className="flex items-center gap-0.5">
            <RibbonSmallBtn icon={Bold} label="Bold" />
            <RibbonSmallBtn icon={Italic} label="Italic" />
            <RibbonSmallBtn icon={Underline} label="Underline" />
            <RibbonSmallBtn icon={Strikethrough} label="Strike" />
            <span className="h-4 w-px bg-ink-900/10 mx-0.5" />
            <RibbonSmallBtn icon={Subscript} label="Sub" />
            <RibbonSmallBtn icon={Superscript} label="Sup" />
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup label="Paragraph">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-0.5">
            <RibbonSmallBtn icon={AlignLeft} label="Left" />
            <RibbonSmallBtn icon={AlignCenter} label="Center" />
            <RibbonSmallBtn icon={AlignRight} label="Right" />
            <RibbonSmallBtn icon={AlignJustify} label="Justify" />
          </div>
          <div className="flex items-center gap-0.5">
            <RibbonSmallBtn icon={List} label="Bullets" />
            <RibbonSmallBtn icon={ListOrdered} label="Numbered" />
            <RibbonSmallBtn icon={Outdent} label="Outdent" />
            <RibbonSmallBtn icon={Indent} label="Indent" />
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup label="Styles">
        <div className="flex items-center gap-1">
          <StyleChip>Default Paragraph</StyleChip>
          <StyleChip>Body Text</StyleChip>
          <StyleChip>Heading 1</StyleChip>
          <StyleChip>Heading 2</StyleChip>
        </div>
      </RibbonGroup>

      <RibbonGroup label="Editing">
        <button className="h-7 inline-flex items-center gap-1 rounded border border-ink-900/12 bg-white px-2 text-[11.5px] text-ink-700 hover:bg-parchment-50">
          <Search className="h-3 w-3" /> Search
        </button>
      </RibbonGroup>
    </div>
  );
}

function PlaceholderRibbon({ tab }: { tab: string }) {
  return (
    <div className="px-3 text-[11.5px] text-ink-500">
      <span className="font-medium text-ink-700">{tab}</span> · controls render here when this tab is selected.
    </div>
  );
}

function RibbonGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full justify-between border-r border-ink-900/8 px-2 py-1.5">
      <div className="flex-1 min-h-0 flex items-center">{children}</div>
      <div className="text-center text-[9.5px] uppercase tracking-[0.14em] text-ink-400 mt-1">
        {label}
      </div>
    </div>
  );
}

function RibbonStack({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-1">{children}</div>;
}

function RibbonBigBtn({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button className="h-[58px] w-[52px] grid place-items-center rounded hover:bg-parchment-50 text-ink-700">
      <div className="flex flex-col items-center gap-1">
        <Icon className="h-5 w-5" />
        <span className="text-[10px]">{label}</span>
        <ChevronDown className="h-2.5 w-2.5 text-ink-400 -mt-0.5" />
      </div>
    </button>
  );
}

function RibbonSmallBtn({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button title={label} className="h-6 w-6 grid place-items-center rounded text-ink-700 hover:bg-parchment-50">
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function StyleChip({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-7 px-2 rounded border border-ink-900/8 bg-white text-[11px] text-ink-700 hover:border-ink-900/20 whitespace-nowrap">
      {children}
    </button>
  );
}

function DocumentArea({
  body,
  onChange,
}: {
  body: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-parchment-50">
      <div className="px-8 py-8">
        <div className="mx-auto max-w-[760px] bg-white shadow-page border border-ink-900/8 px-16 py-20 min-h-[1000px]">
          <textarea
            value={body}
            onChange={(e) => onChange(e.target.value)}
            spellCheck
            className="w-full min-h-[800px] resize-none outline-none text-ink-900 text-[13.5px] leading-[1.65]"
            style={{ fontFamily: "Carlito, Calibri, system-ui, sans-serif" }}
          />
        </div>
      </div>
    </div>
  );
}

function StyleSidebar() {
  return (
    <div className="w-[240px] shrink-0 border-l border-ink-900/8 bg-white overflow-y-auto">
      <Section label="Style">
        <select className="w-full h-7 px-2 rounded border border-ink-900/12 bg-white text-[11.5px]">
          <option>Default Paragraph Style</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
          <option>Body Text</option>
        </select>
      </Section>
      <Section label="Character">
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <select className="h-7 px-2 rounded border border-ink-900/12 bg-white text-[11.5px]">
            <option>Carlito</option>
          </select>
          <select className="h-7 px-2 rounded border border-ink-900/12 bg-white text-[11.5px]">
            <option>12 pt</option>
          </select>
        </div>
        <div className="flex items-center gap-0.5">
          <SidebarBtn icon={Bold} />
          <SidebarBtn icon={Italic} />
          <SidebarBtn icon={Underline} />
          <SidebarBtn icon={Strikethrough} />
          <SidebarBtn icon={Subscript} />
          <SidebarBtn icon={Superscript} />
        </div>
      </Section>
      <Section label="Paragraph">
        <div className="flex items-center gap-0.5 mb-1.5">
          <SidebarBtn icon={AlignLeft} />
          <SidebarBtn icon={AlignCenter} />
          <SidebarBtn icon={AlignRight} />
          <SidebarBtn icon={AlignJustify} />
        </div>
        <div className="flex items-center gap-0.5">
          <SidebarBtn icon={List} />
          <SidebarBtn icon={ListOrdered} />
          <SidebarBtn icon={Outdent} />
          <SidebarBtn icon={Indent} />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3 text-[10.5px] text-ink-500">
          <div>
            <div className="mb-1">Spacing</div>
            <input
              type="number"
              defaultValue={0}
              className="h-7 w-full rounded border border-ink-900/12 px-2 text-[11.5px]"
            />
          </div>
          <div>
            <div className="mb-1">Indent</div>
            <input
              type="number"
              defaultValue={0}
              className="h-7 w-full rounded border border-ink-900/12 px-2 text-[11.5px]"
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-ink-900/6 px-3 py-3">
      <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-medium mb-2">
        {label}
      </div>
      {children}
    </div>
  );
}

function SidebarBtn({ icon: Icon }: { icon: React.ComponentType<{ className?: string }> }) {
  return (
    <button className="h-7 w-7 grid place-items-center rounded text-ink-700 hover:bg-parchment-50">
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function StatusFoot({
  words,
  chars,
  stylePanel,
  toggleStyle,
}: {
  words: number;
  chars: number;
  stylePanel: boolean;
  toggleStyle: () => void;
}) {
  return (
    <div className="h-7 shrink-0 flex items-center justify-between px-3 border-t border-ink-900/8 bg-white text-[11px] text-ink-500 font-mono">
      <div className="flex items-center gap-3">
        <span>Page 1 of 1</span>
        <span>
          {words} words, {chars} characters
        </span>
        <span>English (USA)</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleStyle}
          className="hover:text-ink-700"
        >
          {stylePanel ? "Hide style sidebar" : "Show style sidebar"}
        </button>
        <span>100%</span>
      </div>
    </div>
  );
}
