import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolStatus } from "../ToolStatus";

afterEach(() => {
  cleanup();
});

test("shows 'Created' message for completed str_replace_editor create command", () => {
  render(
    <ToolStatus
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "result",
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Created App.jsx")).toBeDefined();
});

test("shows 'Creating' message for in-progress str_replace_editor create command", () => {
  render(
    <ToolStatus
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create", path: "/components/Button.tsx" },
        state: "call",
      }}
    />
  );

  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

test("shows 'Edited' message for completed str_replace_editor str_replace command", () => {
  render(
    <ToolStatus
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "str_replace", path: "/App.jsx", old_str: "foo", new_str: "bar" },
        state: "result",
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Edited App.jsx")).toBeDefined();
});

test("shows 'Editing' message for in-progress str_replace_editor str_replace command", () => {
  render(
    <ToolStatus
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "str_replace", path: "/Card.jsx" },
        state: "call",
      }}
    />
  );

  expect(screen.getByText("Editing Card.jsx")).toBeDefined();
});

test("shows 'Updated' message for completed str_replace_editor insert command", () => {
  render(
    <ToolStatus
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "insert", path: "/App.jsx", insert_line: 5 },
        state: "result",
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Updated App.jsx")).toBeDefined();
});

test("shows 'Viewed' message for completed str_replace_editor view command", () => {
  render(
    <ToolStatus
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "view", path: "/App.jsx" },
        state: "result",
        result: "file contents",
      }}
    />
  );

  expect(screen.getByText("Viewed App.jsx")).toBeDefined();
});

test("shows 'Renamed' message for completed file_manager rename command", () => {
  render(
    <ToolStatus
      toolInvocation={{
        toolCallId: "1",
        toolName: "file_manager",
        args: { command: "rename", path: "/Button.jsx", new_path: "/components/Button.jsx" },
        state: "result",
        result: { success: true },
      }}
    />
  );

  expect(screen.getByText("Renamed Button.jsx to Button.jsx")).toBeDefined();
});

test("shows 'Deleted' message for completed file_manager delete command", () => {
  render(
    <ToolStatus
      toolInvocation={{
        toolCallId: "1",
        toolName: "file_manager",
        args: { command: "delete", path: "/old-file.tsx" },
        state: "result",
        result: { success: true },
      }}
    />
  );

  expect(screen.getByText("Deleted old-file.tsx")).toBeDefined();
});

test("shows 'Deleting' message for in-progress file_manager delete command", () => {
  render(
    <ToolStatus
      toolInvocation={{
        toolCallId: "1",
        toolName: "file_manager",
        args: { command: "delete", path: "/old-file.tsx" },
        state: "call",
      }}
    />
  );

  expect(screen.getByText("Deleting old-file.tsx")).toBeDefined();
});

test("shows green dot for completed tool invocations", () => {
  const { container } = render(
    <ToolStatus
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "result",
        result: "Success",
      }}
    />
  );

  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
});

test("shows spinner for in-progress tool invocations", () => {
  const { container } = render(
    <ToolStatus
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "call",
      }}
    />
  );

  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("falls back to tool name for unknown tools", () => {
  render(
    <ToolStatus
      toolInvocation={{
        toolCallId: "1",
        toolName: "unknown_tool",
        args: {},
        state: "result",
        result: "done",
      }}
    />
  );

  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("handles missing path gracefully", () => {
  render(
    <ToolStatus
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create" },
        state: "result",
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Created file")).toBeDefined();
});

test("extracts file name from nested path", () => {
  render(
    <ToolStatus
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create", path: "/components/ui/Card.tsx" },
        state: "result",
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Created Card.tsx")).toBeDefined();
});
