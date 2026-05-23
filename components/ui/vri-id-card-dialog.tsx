"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { VriIdCredentials } from "@/lib/vriId";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { VriIdCardFace } from "@/components/ui/vri-id-card-face";

export type VriIdCardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActivate: (code: string) => Promise<void>;
  credentials: VriIdCredentials;
  userId: string;
  avatarUrl?: string | null;
  holderInitials?: string;
};

export function VriIdCardDialog({
  open,
  onOpenChange,
  onActivate,
  credentials,
  userId,
  avatarUrl,
  holderInitials,
}: VriIdCardDialogProps) {
  const [code, setCode] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleActivateClick = async () => {
    if (!code.trim()) return;
    setIsProcessing(true);
    try {
      await onActivate(code);
    } catch {
      /* parent shows error; keep dialog open */
    } finally {
      setIsProcessing(false);
    }
  };

  React.useEffect(() => {
    if (!open) {
      setCode("");
      setIsProcessing(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-[450px]">
        <div className="flex items-center justify-center bg-gradient-to-b from-ink-50 to-white px-6 pb-2 pt-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-80 max-w-full"
          >
            <VriIdCardFace
              credentials={credentials}
              className="h-48 w-full"
              brandLabel="New Horizon · VRI"
              userId={userId}
              avatarUrl={avatarUrl}
              holderInitials={holderInitials}
            />
          </motion.div>
        </div>

        <DialogHeader className="px-6 pb-2 pt-2">
          <DialogTitle className="text-xl">Activate your VRI ID</DialogTitle>
          <DialogDescription>
            Enter your personal activation code to enable institute access on
            this device. Your code is unique to your researcher profile.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 px-6">
          <label
            htmlFor="vri-activation-code"
            className="font-marketing text-[12px] font-medium text-ink-700"
          >
            Activation code
          </label>
          <Input
            id="vri-activation-code"
            placeholder="Enter your code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            disabled={isProcessing}
            className="h-10 font-mono text-base uppercase tracking-[0.12em]"
            autoComplete="off"
            spellCheck={false}
          />
          <p className="font-marketing text-[12px] font-light text-ink-500">
            Member ID:{" "}
            <span className="font-mono text-ink-700">{credentials.memberId}</span>
          </p>
        </div>

        <DialogFooter className="rounded-b-2xl border-t border-ink-900/8 bg-ink-50/60 p-6 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button onClick={handleActivateClick} disabled={!code.trim() || isProcessing}>
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            {isProcessing ? "Activating…" : "Activate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
