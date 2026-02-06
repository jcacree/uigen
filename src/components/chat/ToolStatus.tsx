"use client";

import { Loader2, FilePlus, FilePen, Eye, Trash2, ArrowRightLeft, FileCog } from "lucide-react";

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  state: string;
  result?: unknown;
}

interface ToolStatusProps {
  toolInvocation: ToolInvocation;
}

function getFileName(path: unknown): string {
  if (typeof path !== "string") return "file";
  return path.split("/").pop() || path;
}

function getToolMessage(toolInvocation: ToolInvocation): { icon: React.ElementType; label: string } {
  const { toolName, args } = toolInvocation;
  const isComplete = toolInvocation.state === "result" && toolInvocation.result;
  const fileName = getFileName(args.path);

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return {
          icon: FilePlus,
          label: isComplete ? `Created ${fileName}` : `Creating ${fileName}`,
        };
      case "str_replace":
        return {
          icon: FilePen,
          label: isComplete ? `Edited ${fileName}` : `Editing ${fileName}`,
        };
      case "insert":
        return {
          icon: FilePen,
          label: isComplete ? `Updated ${fileName}` : `Updating ${fileName}`,
        };
      case "view":
        return {
          icon: Eye,
          label: isComplete ? `Viewed ${fileName}` : `Viewing ${fileName}`,
        };
      default:
        return {
          icon: FileCog,
          label: isComplete ? `Modified ${fileName}` : `Modifying ${fileName}`,
        };
    }
  }

  if (toolName === "file_manager") {
    switch (args.command) {
      case "rename": {
        const newName = getFileName(args.new_path);
        return {
          icon: ArrowRightLeft,
          label: isComplete ? `Renamed ${fileName} to ${newName}` : `Renaming ${fileName} to ${newName}`,
        };
      }
      case "delete":
        return {
          icon: Trash2,
          label: isComplete ? `Deleted ${fileName}` : `Deleting ${fileName}`,
        };
      default:
        return {
          icon: FileCog,
          label: isComplete ? `Modified ${fileName}` : `Modifying ${fileName}`,
        };
    }
  }

  return {
    icon: FileCog,
    label: toolName,
  };
}

export function ToolStatus({ toolInvocation }: ToolStatusProps) {
  const isComplete = toolInvocation.state === "result" && toolInvocation.result;
  const { icon: Icon, label } = getToolMessage(toolInvocation);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <Icon className="w-3 h-3 text-neutral-500" />
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <Icon className="w-3 h-3 text-neutral-500" />
          <span className="text-neutral-700">{label}</span>
        </>
      )}
    </div>
  );
}
