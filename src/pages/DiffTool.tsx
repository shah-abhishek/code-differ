import React, { useEffect, useMemo, useRef, useState } from "react";
import { DiffEditor, useMonaco } from "@monaco-editor/react";
import DiffMatchPatch from "diff-match-patch";
import type * as Monaco from "monaco-editor";

const DEFAULT_LEFT = `// Left (Original)
function add(a, b){
  return a + b;
}
`;

const DEFAULT_RIGHT = `// Right (Modified)
function add(a, b){
  // handle edge cases
  if (a == null || b == null) return 0;
  return a + b;
}
`;

// ---------- utils ----------
async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function bytes(str: string) {
  return new TextEncoder().encode(str).length;
}

// map file extensions -> our language keys (the ones in the dropdown)
function detectLanguageFromFilename(name?: string | null): string | null {
  if (!name) return null;
  const dot = name.lastIndexOf(".");
  if (dot < 0) return null;
  const ext = name.slice(dot + 1).toLowerCase();
  switch (ext) {
    case "ts": return "typescript";
    case "js": return "javascript";
    case "jsx": return "jsx";
    case "tsx": return "tsx";
    case "json": return "json";
    case "html":
    case "htm": return "html";
    case "css": return "css";
    case "xml": return "xml";
    case "py": return "python";
    case "java": return "java";
    case "cs": return "csharp";
    case "cshtml":
    case "razor": return "cshtml";
    case "jsp": return "jsp";
    default: return null;
  }
}

// Monaco wants base languages for JSX/TSX
function languageForEditor(lang: string) {
  if (lang === "jsx") return "javascript";
  if (lang === "tsx") return "typescript";
  return lang; // cshtml/jsp are custom (registered below)
}

export default function DiffTool() {
  const monaco = useMonaco();
  const diffRef = useRef<any>(null);

  const [left, setLeft] = useState<string>(DEFAULT_LEFT);
  const [right, setRight] = useState<string>(DEFAULT_RIGHT);

  const [language, setLanguage] = useState<string>("typescript");
  const [theme, setTheme] = useState<"light" | "vs-dark">("vs-dark");
  const [inlineView, setInlineView] = useState<boolean>(false);
  const [wrap, setWrap] = useState<boolean>(true);
  const [ignoreTrimWS, setIgnoreTrimWS] = useState<boolean>(true);

  // Register custom languages once
  useEffect(() => {
    if (!monaco) return;
    registerCshtml(monaco as unknown as typeof Monaco);
    registerJsp(monaco as unknown as typeof Monaco);
  }, [monaco]);

  // Stats with diff-match-patch
  const stats = useMemo(() => {
    const dmp = new DiffMatchPatch();
    dmp.Diff_Timeout = 1.0;
    const diffs = dmp.diff_main(left, right);
    dmp.diff_cleanupSemantic(diffs);

    let insertions = 0, deletions = 0, equal = 0;
    for (const [op, text] of diffs as [number, string][]) {
      if (op === DiffMatchPatch.DIFF_INSERT) insertions += text.length;
      else if (op === DiffMatchPatch.DIFF_DELETE) deletions += text.length;
      else equal += text.length;
    }
    const levenshtein = dmp.diff_levenshtein(diffs);

    return {
      insertions,
      deletions,
      equal,
      distance: levenshtein,
      leftBytes: bytes(left),
      rightBytes: bytes(right),
      leftChars: left.length,
      rightChars: right.length,
    };
  }, [left, right]);

  function handleMount(editor: any) {
    diffRef.current = editor;
    const original = editor.getOriginalEditor();
    const modified = editor.getModifiedEditor();
    try { original.updateOptions({ readOnly: false }); } catch {}
    try { modified.updateOptions({ readOnly: false }); } catch {}
    const sub1 = original.onDidChangeModelContent(() => setLeft(original.getValue()));
    const sub2 = modified.onDidChangeModelContent(() => setRight(modified.getValue()));
    return () => { try { sub1.dispose(); sub2.dispose(); } catch {} };
  }

  function extFor(lang: string) {
    switch (lang) {
      case "typescript": return "ts";
      case "javascript": return "js";
      case "jsx": return "jsx";
      case "tsx": return "tsx";
      case "json": return "json";
      case "html": return "html";
      case "css": return "css";
      case "xml": return "xml";
      case "python": return "py";
      case "java": return "java";
      case "csharp": return "cs";
      case "cshtml": return "cshtml";
      case "jsp": return "jsp";
      default: return "txt";
    }
  }

  function loadFile(which: "left" | "right") {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await readFileAsText(file);
      if (which === "left") setLeft(text); else setRight(text);

      // Auto-detect language by filename and switch dropdown
      const detected = detectLanguageFromFilename(file.name);
      if (detected) setLanguage(detected);
    };
    input.click();
  }

  function download(which: "left" | "right") {
    const text = which === "left" ? left : right;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = which + (language ? `.${extFor(language)}` : ".txt");
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyToClipboard(which: "left" | "right") {
    const text = which === "left" ? left : right;
    navigator.clipboard.writeText(text);
  }

  async function pasteInto(which: "left" | "right") {
    try {
      const text = await navigator.clipboard.readText();
      if (which === "left") setLeft(text); else setRight(text);
    } catch {
      alert("Clipboard permission blocked. Click once on the page and try again, or allow clipboard in your browser.");
    }
  }

  function swapSides() {
    setLeft((prevLeft) => {
      const oldLeft = prevLeft;
      setRight(oldLeft);
      return right;
    });
  }

  function resetDefaults() {
    setLeft(DEFAULT_LEFT);
    setRight(DEFAULT_RIGHT);
  }

  const canSwap = left !== right;
  const canReset = left !== DEFAULT_LEFT || right !== DEFAULT_RIGHT;

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur px-4 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-lg font-semibold">Code Compare</div>

          <div className="h-6 w-px bg-zinc-700/60" />

          <label className="text-sm text-zinc-300">Language</label>
          <select
            className="bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1 text-sm"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {[
              "typescript","javascript","jsx","tsx","json","html","css","xml","python","java","csharp","cshtml","jsp"
            ].map(l => <option key={l} value={l}>{l}</option>)}
          </select>

          <label className="ml-2 text-sm text-zinc-300">Theme</label>
          <select
            className="bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1 text-sm"
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
          >
            <option value="vs-dark">dark</option>
            <option value="light">light</option>
          </select>

          <label className="ml-2 text-sm text-zinc-300">View</label>
          <select
            className="bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1 text-sm"
            value={inlineView ? "inline" : "side"}
            onChange={(e) => setInlineView(e.target.value === "inline")}
          >
            <option value="side">side-by-side</option>
            <option value="inline">inline</option>
          </select>

          <label className="ml-2 inline-flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" checked={wrap} onChange={(e)=>setWrap(e.target.checked)} />
            wrap
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" checked={ignoreTrimWS} onChange={(e)=>setIgnoreTrimWS(e.target.checked)} />
            ignore trim WS
          </label>

          <div className="ml-auto flex items-center gap-2 flex-wrap">
            {/* Swap / Reset */}
            <button
              className="px-2.5 py-1.5 text-sm rounded-md bg-indigo-600/90 hover:bg-indigo-600 border border-indigo-500 disabled:opacity-50"
              onClick={swapSides}
              disabled={!canSwap}
              title="Swap Left/Right"
            >Swap</button>
            <button
              className="px-2.5 py-1.5 text-sm rounded-md bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 disabled:opacity-50"
              onClick={resetDefaults}
              disabled={!canReset}
              title="Reset to defaults"
            >Reset</button>

            {/* Left actions */}
            <button className="px-2.5 py-1.5 text-sm rounded-md bg-zinc-800 border border-zinc-700 hover:bg-zinc-700" onClick={() => loadFile("left")}>Load Left</button>
            <button className="px-2.5 py-1.5 text-sm rounded-md bg-zinc-800 border border-zinc-700 hover:bg-zinc-700" onClick={() => download("left")}>Download Left</button>
            <button className="px-2.5 py-1.5 text-sm rounded-md bg-zinc-800 border border-zinc-700 hover:bg-zinc-700" onClick={() => copyToClipboard("left")}>Copy Left</button>
            <button className="px-2.5 py-1.5 text-sm rounded-md bg-zinc-800 border border-zinc-700 hover:bg-zinc-700" onClick={() => pasteInto("left")}>Paste Left</button>

            {/* Right actions */}
            <div className="w-3" />
            <button className="px-2.5 py-1.5 text-sm rounded-md bg-zinc-800 border border-zinc-700 hover:bg-zinc-700" onClick={() => loadFile("right")}>Load Right</button>
            <button className="px-2.5 py-1.5 text-sm rounded-md bg-zinc-800 border border-zinc-700 hover:bg-zinc-700" onClick={() => download("right")}>Download Right</button>
            <button className="px-2.5 py-1.5 text-sm rounded-md bg-zinc-800 border border-zinc-700 hover:bg-zinc-700" onClick={() => copyToClipboard("right")}>Copy Right</button>
            <button className="px-2.5 py-1.5 text-sm rounded-md bg-zinc-800 border border-zinc-700 hover:bg-zinc-700" onClick={() => pasteInto("right")}>Paste Right</button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-zinc-300">
          <Stat label="Insertions" value={stats.insertions} />
          <Stat label="Deletions" value={stats.deletions} />
          <Stat label="Levenshtein" value={stats.distance} />
          <Stat label="≈ Unchanged" value={stats.equal} />
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <DiffEditor
          height="calc(100vh - 120px)"
          language={languageForEditor(language)}
          theme={theme}
          original={left}
          modified={right}
          onMount={handleMount}
          options={{
            originalEditable: true,       // make left editable + pasteable
            renderSideBySide: !inlineView,
            ignoreTrimWhitespace: ignoreTrimWS,
            wordWrap: wrap ? "on" : "off",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}

// ---------- simple Monarch tokenizers for cshtml / jsp ----------
function registerCshtml(monaco: typeof Monaco) {
  const id = "cshtml";
  // @ts-ignore: getLanguages may be missing in some dts
  const exists = monaco.languages.getLanguages?.().some((l: any) => l.id === id);
  if (!exists) monaco.languages.register({ id, aliases: ["cshtml", "razor"] });

  monaco.languages.setMonarchTokensProvider(id, {
    defaultToken: "",
    tokenPostfix: ".cshtml",
    tokenizer: {
      root: [
        [/<!\-\-[\s\S]*?\-\->/, "comment"],
        [/\<\/?[A-Za-z0-9\-]+/, { token: "tag", next: "tag" }],
        [/@\{/, { token: "metatag", next: "razorBlock" }],
        [/@(if|for|foreach|while|switch|model|using|code|functions)\b/, "keyword"],
        [/@[A-Za-z_][A-Za-z0-9_\.]*/, "identifier"],
        [/[^<@]+/, ""],
      ],
      tag: [
        [/\s+[A-Za-z0-9\-:]+\s*=\s*"[^"]*"/, "attribute"],
        [/\s+[A-Za-z0-9\-:]+\s*=\s*'[^']*'/, "attribute"],
        [/\s+[A-Za-z0-9\-:]+/, "attribute"],
        [/\/?\>/, { token: "tag", next: "root" }],
      ],
      razorBlock: [
        [/\}/, { token: "metatag", next: "root" }],
        [/\/\/.*$/, "comment"],
        [/"(?:[^"\\]|\\.)*"/, "string"],
        [/'(?:[^'\\]|\\.)*'/, "string"],
        [/\b(class|struct|var|dynamic|void|int|string|bool|new|return|this|base)\b/, "keyword"],
        [/\b(if|else|for|foreach|while|switch|case|break|continue|try|catch|finally|using)\b/, "keyword"],
        [/[^\}]+/, ""],
      ],
    },
  } as any);
}

function registerJsp(monaco: typeof Monaco) {
  const id = "jsp";
  // @ts-ignore
  const exists = monaco.languages.getLanguages?.().some((l: any) => l.id === id);
  if (!exists) monaco.languages.register({ id, aliases: ["jsp", "java-server-pages"] });

  monaco.languages.setMonarchTokensProvider(id, {
    defaultToken: "",
    tokenPostfix: ".jsp",
    tokenizer: {
      root: [
        [/<!\-\-[\s\S]*?\-\->/, "comment"],
        [/\<\/?[A-Za-z0-9\-]+/, { token: "tag", next: "tag" }],
        [/\<%\-\-[\s\S]*?\-\-%\>/, "comment"],  // JSP comment <%-- --%>
        [/\<%@[\s\S]*?%\>/, "metatag"],         // JSP directives
        [/\<%[=!]?[\s\S]*?%\>/, "source"],      // Scriptlets/expressions
        [/[^<]+/, ""],
      ],
      tag: [
        [/\s+[A-Za-z0-9\-:]+\s*=\s*"[^"]*"/, "attribute"],
        [/\s+[A-Za-z0-9\-:]+\s*=\s*'[^']*'/, "attribute"],
        [/\s+[A-Za-z0-9\-:]+/, "attribute"],
        [/\/?\>/, { token: "tag", next: "root" }],
      ],
    },
  } as any);
}

// ---------- tiny stat card ----------
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-zinc-400">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
