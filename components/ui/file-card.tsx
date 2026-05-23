import { cn } from "@/lib/cn";
import { ReactNode } from "react";

export type FormatFileProps =
  | "doc"
  | "pdf"
  | "md"
  | "mdx"
  | "csv"
  | "xls"
  | "xlsx"
  | "txt"
  | "ppt"
  | "pptx"
  | "zip"
  | "rar"
  | "tar"
  | "gz"
  | "code"
  | "html"
  | "js"
  | "jsx"
  | "tsx"
  | "css"
  | "json"
  | "img"
  | "png"
  | "jpg"
  | "jpeg"
  | "video";

type FileCardProps = {
  formatFile: FormatFileProps;
  className?: string;
};

const DefaultPlaceholder = () => {
  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <div className="h-0.5 w-1/2 rounded-full bg-ink-900/20" />
      </div>
      <div className="flex gap-1">
        <div className="h-0.5 w-1/3 rounded-full bg-ink-900/10" />
        <div className="h-0.5 w-1/3 rounded-full bg-ink-900/10" />
      </div>
      <div className="flex gap-1">
        <div className="h-0.5 w-1/2 rounded-full bg-ink-900/10" />
        <div className="h-0.5 w-1/3 rounded-full bg-ink-900/10" />
      </div>
      <div className="flex gap-1">
        <div className="h-0.5 w-1/3 rounded-full bg-ink-900/10" />
        <div className="h-0.5 w-1/3 rounded-full bg-ink-900/10" />
      </div>
      <div className="flex gap-1">
        <div className="h-0.5 w-1/3 rounded-full bg-ink-900/10" />
        <div className="h-0.5 w-1/2 rounded-full bg-ink-900/10" />
      </div>
      <div className="flex gap-1">
        <div className="h-0.5 w-1/3 rounded-full bg-ink-900/10" />
      </div>
    </div>
  );
};

const colorBannerMap: Record<FormatFileProps, string> = {
  doc: "bg-blue-500 text-white",
  pdf: "bg-red-500 text-white",
  md: "bg-neutral-600 text-white",
  mdx: "bg-neutral-600 text-white",
  txt: "bg-gray-500 text-white",
  csv: "bg-teal-700 text-white",
  xls: "bg-emerald-600 text-white",
  xlsx: "bg-emerald-600 text-white",
  ppt: "bg-orange-500 text-white",
  pptx: "bg-orange-500 text-white",
  zip: "bg-purple-500 text-white",
  rar: "bg-purple-600 text-white",
  tar: "bg-yellow-600 text-white",
  gz: "bg-yellow-700 text-white",
  html: "bg-orange-600 text-white",
  js: "bg-yellow-600 text-white",
  jsx: "bg-blue-600 text-white",
  css: "bg-blue-600 text-white",
  json: "bg-yellow-500 text-white",
  tsx: "bg-blue-600 text-white",
  code: "bg-orange-600 text-white",
  img: "bg-pink-500 text-white",
  png: "bg-neutral-600 text-white",
  jpg: "bg-green-700 text-white",
  jpeg: "bg-green-700 text-white",
  video: "bg-green-700 text-white",
};

export function FileCard({ formatFile, className }: FileCardProps) {
  const colorBannerClass = colorBannerMap[formatFile];
  let filePlaceholder: ReactNode = null;

  filePlaceholder = <DefaultPlaceholder />;

  if (formatFile === "md" || formatFile === "mdx") {
    filePlaceholder = (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1">
          <div className="text-[10px] font-bold text-ink-900/30">#</div>
          <div className="h-0.5 w-6 rounded-full bg-ink-900/20" />
        </div>
        <div className="space-y-1">
          <div className="h-0.5 w-1/3 rounded-full bg-ink-900/10" />
          <div className="h-0.5 w-7 rounded-full bg-ink-900/10" />
        </div>
        <div className="space-y-1">
          <div className="h-0.5 w-8 rounded-full bg-ink-900/10" />
          <div className="h-0.5 w-4 rounded-full bg-ink-900/10" />
          <div className="h-0.5 w-1/3 rounded-full bg-ink-900/10" />
        </div>
      </div>
    );
  }

  if (formatFile === "xls" || formatFile === "xlsx") {
    filePlaceholder = (
      <div className="space-y-0.5">
        <div className="grid grid-cols-3 gap-0.5">
          <div className="h-2 bg-ink-900/20" />
          <div className="h-2 bg-ink-900/20" />
          <div className="h-2 bg-ink-900/20" />
        </div>
        <div className="grid grid-cols-3 gap-0.5">
          <div className="h-2 bg-ink-900/5" />
          <div className="h-2 bg-ink-900/5" />
          <div className="h-2 bg-ink-900/5" />
          <div className="h-2 bg-ink-900/5" />
          <div className="h-2 bg-ink-900/5" />
          <div className="h-2 bg-ink-900/5" />
        </div>
        <div className="grid grid-cols-3 gap-0.5">
          <div className="h-2 bg-ink-900/5" />
          <div className="h-2 bg-ink-900/5" />
        </div>
        <div className="grid grid-cols-3 gap-0.5">
          <div className="h-2 bg-ink-900/5" />
        </div>
      </div>
    );
  }

  if (formatFile === "csv") {
    filePlaceholder = (
      <>
        <div className="mb-2">
          <div className="grid grid-cols-3 gap-0.5">
            <div className="h-1.5 rounded-full bg-ink-900/20" />
            <div className="h-1.5 rounded-full bg-ink-900/20" />
            <div className="h-1.5 rounded-full bg-ink-900/20" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="grid grid-cols-3 gap-0.5">
            <div className="h-1 rounded-full bg-ink-900/5" />
            <div className="h-1 rounded-full bg-ink-900/5" />
            <div className="h-1 rounded-full bg-ink-900/5" />
          </div>
          <div className="grid grid-cols-3 gap-0.5">
            <div className="h-1 rounded-full bg-ink-900/5" />
            <div className="h-1 rounded-full bg-ink-900/5" />
            <div className="h-1 rounded-full bg-ink-900/5" />
          </div>
          <div className="grid grid-cols-3 gap-0.5">
            <div className="h-1 rounded-full bg-ink-900/5" />
            <div className="h-1 rounded-full bg-ink-900/5" />
          </div>
          <div className="grid grid-cols-3 gap-0.5">
            <div className="h-1 rounded-full bg-ink-900/5" />
          </div>
        </div>
      </>
    );
  }

  if (
    formatFile === "zip" ||
    formatFile === "rar" ||
    formatFile === "tar" ||
    formatFile === "gz"
  ) {
    filePlaceholder = (
      <div className="relative flex h-full flex-col items-center justify-center">
        <div className="space-y-0">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex overflow-hidden rounded-full">
              <div className="size-1.5 bg-ink-900/20" />
              <div className="size-1.5 bg-ink-900/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (formatFile === "ppt" || formatFile === "pptx") {
    filePlaceholder = (
      <>
        <div className="mb-1.5 space-y-1 rounded border border-ink-900/8 bg-ink-900/5 p-1">
          <div className="flex justify-center gap-1">
            <div className="size-3 rounded-sm bg-orange-400/40" />
          </div>
          <div className="mx-auto h-0.5 w-8 rounded-full bg-ink-900/15" />
        </div>
        <div className="mb-1 flex justify-center gap-1">
          <div className="h-0.5 w-8 rounded-full bg-ink-900/15" />
          <div className="h-0.5 w-4 rounded-full bg-ink-900/15" />
        </div>
        <div className="space-y-1">
          <div className="h-0.5 w-4 rounded-full bg-ink-900/15" />
          <div className="h-0.5 w-5 rounded-full bg-ink-900/15" />
        </div>
      </>
    );
  }

  if (
    formatFile === "img" ||
    formatFile === "png" ||
    formatFile === "jpg" ||
    formatFile === "jpeg"
  ) {
    filePlaceholder = (
      <div className="mb-1.5 space-y-1 rounded border border-ink-900/8 bg-ink-900/5 p-1">
        <div className="flex justify-center gap-1">
          <div className="size-3 rounded-sm bg-yellow-400/40" />
        </div>
        <div className="mx-auto mt-1 h-0.5 w-4 rounded-full bg-ink-900/15" />
        <div className="mx-auto h-0.5 w-8 rounded-full bg-ink-900/15" />
      </div>
    );
  }

  if (formatFile === "video") {
    filePlaceholder = (
      <div className="mb-1.5 space-y-1 rounded border border-ink-900/8 bg-ink-900/5 p-1">
        <div className="flex justify-center gap-1">
          <div className="size-0 border-y-[5px] border-l-8 border-y-transparent border-l-green-400/60" />
        </div>
        <div className="mx-auto mt-1 h-0.5 w-4 rounded-full bg-ink-900/15" />
        <div className="mx-auto h-0.5 w-8 rounded-full bg-ink-900/15" />
      </div>
    );
  }

  if (
    formatFile === "html" ||
    formatFile === "js" ||
    formatFile === "jsx" ||
    formatFile === "tsx" ||
    formatFile === "code"
  ) {
    filePlaceholder = (
      <div className="space-y-1">
        <div className="flex items-center gap-0.5">
          <div className="font-mono text-[5px] text-ink-900/30">&lt;</div>
          <div className="h-0.5 w-3 rounded-full bg-emerald-400/60" />
          <div className="font-mono text-[5px] text-ink-900/30">&gt;</div>
        </div>
        <div className="flex items-center gap-0.5 pl-1">
          <div className="font-mono text-[5px] text-ink-900/30">&lt;</div>
          <div className="h-0.5 w-2.5 rounded-full bg-sky-400/60" />
          <div className="font-mono text-[5px] text-ink-900/30">&gt;</div>
        </div>
        <div className="flex items-center gap-0.5 pl-1">
          <div className="font-mono text-[5px] text-ink-900/30">&lt;/</div>
          <div className="h-0.5 w-2.5 rounded-full bg-sky-400/60" />
          <div className="font-mono text-[5px] text-ink-900/30">&gt;</div>
        </div>
        <div className="flex items-center gap-0.5">
          <div className="font-mono text-[5px] text-ink-900/30">&lt;</div>
          <div className="h-0.5 w-1 rounded-full bg-emerald-400/60" />
          <div className="font-mono text-[5px] text-ink-900/30">/&gt;</div>
        </div>
      </div>
    );
  }

  if (formatFile === "css") {
    filePlaceholder = (
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <div className="font-mono text-[6px] text-ink-900/40">{"{"}</div>
        </div>
        <div className="flex items-center gap-1 pl-1.5">
          <div className="h-0.5 w-3 rounded-full bg-sky-400/60" />
          <div className="h-0.5 w-4 rounded-full bg-sky-400/60" />
        </div>
        <div className="flex items-center gap-1 pl-1.5">
          <div className="h-0.5 w-4 rounded-full bg-sky-400/60" />
          <div className="h-0.5 w-2 rounded-full bg-sky-400/60" />
        </div>
        <div className="flex items-center gap-1">
          <div className="font-mono text-[6px] text-ink-900/40">{"}"}</div>
        </div>
      </div>
    );
  }

  if (formatFile === "json") {
    filePlaceholder = (
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <div className="font-mono text-[6px] text-ink-900/40">{"{"}</div>
        </div>
        <div className="flex items-center gap-1 pl-1.5">
          <div className="h-0.5 w-3 rounded-full bg-ink-900/20" />
          <div className="h-0.5 w-4 rounded-full bg-ink-900/20" />
        </div>
        <div className="flex items-center gap-1 pl-1.5">
          <div className="h-0.5 w-4 rounded-full bg-ink-900/10" />
          <div className="h-0.5 w-2 rounded-full bg-ink-900/10" />
        </div>
        <div className="flex items-center gap-1">
          <div className="font-mono text-[6px] text-ink-900/40">{"}"}</div>
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden className={cn("relative size-fit", className)}>
      <div
        className={cn(
          "absolute -right-2 bottom-1.5 z-[2] rounded px-1.5 py-0.5 text-[8px] font-medium uppercase",
          colorBannerClass
        )}
      >
        {formatFile}
      </div>
      <div className="relative z-[1] h-[4.5rem] w-14 space-y-3 rounded-md bg-white p-2 ring-1 ring-ink-900/10">
        {filePlaceholder}
      </div>
    </div>
  );
}

export default FileCard;
