"use client";

import { SparkleIcon } from "@phosphor-icons/react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { EnhanceModal } from "@/app/tools/ai-prompt-studio/enhance-modal";
import { injectVariables, parseVariables } from "@/app/tools/ai-prompt-studio/helpers";
import { PLACEHOLDER } from "@/app/tools/ai-prompt-studio/prompt-templates";
import { QuickStarters } from "@/app/tools/ai-prompt-studio/quick-starters";
import { StarterGuardDialog } from "@/app/tools/ai-prompt-studio/starter-guard-dialog";
import { TokenBadge } from "@/app/tools/ai-prompt-studio/token-badge";
import { VariableCard } from "@/app/tools/ai-prompt-studio/variable-card";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { ClearButton } from "@/components/ui/clear-button";
import { CopyButton } from "@/components/ui/copy-button";
import { TextareaGroup } from "@/components/ui/textarea-group";
import { internalTools } from "@/lib/tools-data";

export default function PromptStudioPage() {
  const [rawPrompt, setRawPrompt] = useState(PLACEHOLDER);
  const [varValues, setVarValues] = useState<Record<string, string>>({});

  const [enhancedOutput, setEnhancedOutput] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showEnhanceModal, setShowEnhanceModal] = useState(false);

  const [pendingStarter, setPendingStarter] = useState<string | null>(null);
  const [hasMadeEdit, setHasMadeEdit] = useState(false);

  const previousDraftRef = useRef<string>("");

  const variables = useMemo(() => parseVariables(rawPrompt), [rawPrompt]);
  const injectedOutput = useMemo(
    () => injectVariables(rawPrompt, varValues),
    [rawPrompt, varValues],
  );

  function isDirty() {
    return (hasMadeEdit && rawPrompt.trim() !== "") || Object.values(varValues).some(Boolean);
  }

  function handleClear() {
    setRawPrompt("");
    setVarValues({});
    setEnhancedOutput("");
    setHasMadeEdit(false);
  }

  function applyStarter(starter: string) {
    setRawPrompt(starter);
    setVarValues({});
    setEnhancedOutput("");
    setHasMadeEdit(false);
  }

  function handleStarterSelect(starter: string) {
    if (isDirty()) {
      setPendingStarter(starter);
    } else {
      applyStarter(starter);
    }
  }

  function handleConfirmStarter() {
    if (pendingStarter) {
      applyStarter(pendingStarter);
      setPendingStarter(null);
    }
  }

  async function handleEnhance() {
    if (!injectedOutput.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: injectedOutput }),
      });

      if (!res.ok) {
        toast.error(`Enhancement failed with status ${res.status}`);
        return;
      }

      const data = await res.json();
      if (data.text) {
        setEnhancedOutput(data.text);
        setShowEnhanceModal(true);
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to connect to the enhancement API.");
    } finally {
      setIsEnhancing(false);
    }
  }

  function handleReplaceDraft() {
    previousDraftRef.current = rawPrompt;
    setRawPrompt(enhancedOutput);
    setShowEnhanceModal(false);
    toast.success("Draft replaced with enhanced version.", {
      duration: 10000,
      action: {
        label: "Undo",
        onClick: () => setRawPrompt(previousDraftRef.current),
      },
    });
  }

  const tool = internalTools.find((t) => t.slug === "ai-prompt-studio");

  return (
    <ToolLayout tool={tool}>
      <QuickStarters onSelect={handleStarterSelect} />

      <div className="flex h-full flex-col gap-8 lg:flex-row">
        {/* Left Column */}
        <div className="flex min-h-0 flex-1 flex-col space-y-4">
          <div className="flex min-h-0 flex-1 flex-col">
            <TextareaGroup
              label="Draft Prompt"
              value={rawPrompt}
              onChange={(e) => {
                setRawPrompt(e.target.value);
                setEnhancedOutput("");
                setHasMadeEdit(true);
              }}
              placeholder={`Write your prompt here.\nUse {{variable}} syntax for dynamic values.`}
              action={
                <ClearButton
                  size="sm"
                  onClick={handleClear}
                  disabled={!rawPrompt && !Object.keys(varValues).length}
                />
              }
              containerClassName="flex-1 min-h-[300px]"
            />
          </div>

          <Button
            size="lg"
            className="w-full shrink-0 font-bold"
            onClick={handleEnhance}
            disabled={isEnhancing || !injectedOutput.trim()}
          >
            <SparkleIcon weight="duotone" className="mr-2 size-5" />
            {isEnhancing ? "Enhancing…" : "Enhance with Gemini"}
          </Button>

          <VariableCard
            variables={variables}
            varValues={varValues}
            onVarChange={(name, value) => setVarValues((prev) => ({ ...prev, [name]: value }))}
          />
        </div>

        {/* Output */}
        <div className="flex min-h-0 flex-1 flex-col">
          <TextareaGroup
            label={<TokenBadge text={injectedOutput} />}
            value={injectedOutput}
            readOnly
            action={
              <CopyButton
                size="icon-sm"
                variant="ghost"
                label={false}
                textToCopy={injectedOutput}
                disabled={!injectedOutput}
              />
            }
            containerClassName="flex-1 min-h-[300px]"
          />
        </div>
      </div>

      <StarterGuardDialog
        open={pendingStarter !== null}
        onOpenChange={(open) => !open && setPendingStarter(null)}
        onConfirm={handleConfirmStarter}
      />

      <EnhanceModal
        open={showEnhanceModal}
        onOpenChange={setShowEnhanceModal}
        rawPrompt={rawPrompt}
        enhancedOutput={enhancedOutput}
        onReplace={handleReplaceDraft}
      />
    </ToolLayout>
  );
}
