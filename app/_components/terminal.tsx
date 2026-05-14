"use client";

import {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Catty interactive terminal — a fake shell hosted on the download page.
 * Static export only: no server, no real exec; canned responses keyed
 * off typed commands. Goal is to feel like the real Catty terminal
 * (prompt, echo, blinking caret, history) and surface every download
 * path through conversation rather than buttons.
 */

type LineKind = "out" | "echo" | "err" | "ok" | "ascii" | "ghost" | "cmd" | "url";

type Line = {
  id: number;
  kind: LineKind;
  text: string;
  /** When set, an inline copy chip is rendered after the text. */
  copy?: string;
  /** When set, an inline open-in-tab chip is rendered after the text. */
  href?: string;
};

const PROMPT = "catty:~ %";
const HOMEBREW_CMD = "brew tap mochiexists/catty3d && brew install catty";
const SCRIPT_CMD = "curl -fsSL https://catty3d.com/install.sh | sh";
const DMG_URL = "https://github.com/mochiexists/catty-3d/releases/latest/download/Catty.dmg";
const REPO_URL = "https://github.com/mochiexists/catty-3d";

const BANNER = `
   _____      _   _         _____ ____
  / ____|    | | | |       |___ /|  _ \\
 | |     __ _| |_| |_ _   _  |_ \\| | | |
 | |    / _\` | __| __| | | |___) | | | |
 | |___| (_| | |_| |_| |_| |____/| |_| |
  \\_____\\__,_|\\__|\\__|\\__, |_____|____/
                       __/ |
                      |___/   v0.1.0
`;

const HELP = [
  "available commands:",
  "",
  "  download / dl     show every install path",
  "  brew              homebrew install (recommended)",
  "  script            one-line curl install",
  "  dmg               direct .dmg download",
  "  appstore          mac app store status",
  "  about             what catty is and why",
  "  github            open the source repo",
  "  meow              :)",
  "  rat               🐀",
  "  ls                list rooms",
  "  whoami            who's typing",
  "  clear             clear the screen",
  "  help              this list",
  "",
  "shortcuts: ↑/↓ history · tab autocomplete · ⌃L clear",
  "tip — try `download` first.",
];

const ABOUT = [
  "Catty 3D is a macOS terminal rendered as a floating panel",
  "in a real-time 3D scene. Local zsh or SSH. Maxwell the cat",
  "watches a magenta wireframe rat orbit around your shell.",
  "",
  "Built on RealityKit + SwiftTerm + Citadel. Free, MIT.",
];

const ROOMS = [
  "drwxr-xr-x  outdoor/         (direct download · full local shell)",
  "drwxr-xr-x  indoor/          (mac app store · sandboxed)",
  "drwxr-xr-x  ssh/             (works in both rooms)",
  "-rw-r--r--  README.md        (you're standing in it)",
];

type Result = {
  lines: Omit<Line, "id">[];
  /** Map of digit-keys → command name; lets the user press 1/2/3 next. */
  numbered?: Record<string, string>;
  /** Side-effect: open a URL in a new tab. */
  open?: string;
  /** Side-effect: copy a string to clipboard with a toast. */
  copy?: string;
  clear?: boolean;
};

function runCommand(raw: string): Result {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return { lines: [] };

  switch (cmd) {
    case "help":
    case "?":
      return { lines: HELP.map((text) => ({ kind: "out", text })) };

    case "download":
    case "dl":
      return {
        lines: [
          { kind: "out", text: "three install paths — pick your shape:" },
          { kind: "out", text: "" },
          { kind: "ok", text: "  1. brew     →  " + HOMEBREW_CMD, copy: HOMEBREW_CMD },
          { kind: "ok", text: "  2. script   →  " + SCRIPT_CMD,   copy: SCRIPT_CMD },
          { kind: "ok", text: "  3. dmg      →  " + DMG_URL,      href: DMG_URL },
          { kind: "out", text: "" },
          { kind: "ghost", text: "press 1 / 2 / 3 to jump in, or type the name." },
        ],
        numbered: { "1": "brew", "2": "script", "3": "dmg" },
      };

    case "brew":
    case "homebrew":
      return {
        lines: [
          { kind: "out", text: "homebrew (recommended):" },
          { kind: "out", text: "" },
          { kind: "cmd", text: HOMEBREW_CMD, copy: HOMEBREW_CMD },
          { kind: "out", text: "" },
          { kind: "ghost", text: "first command taps mochiexists/catty3d." },
          { kind: "ghost", text: "second installs the cask. sparkle handles updates after." },
        ],
      };

    case "script":
    case "curl":
      return {
        lines: [
          { kind: "out", text: "one-line install script:" },
          { kind: "out", text: "" },
          { kind: "cmd", text: SCRIPT_CMD, copy: SCRIPT_CMD },
          { kind: "out", text: "" },
          { kind: "ghost", text: "fetches the latest dmg from github releases," },
          { kind: "ghost", text: "verifies, opens for drag-to-applications." },
        ],
      };

    case "dmg":
    case "direct":
      return {
        lines: [
          { kind: "out", text: "direct download:" },
          { kind: "out", text: "" },
          { kind: "url", text: DMG_URL, href: DMG_URL, copy: DMG_URL },
          { kind: "out", text: "" },
          { kind: "ghost", text: "notarized, signed with our developer id." },
          { kind: "ghost", text: "first release ships shortly — link 404s until then." },
        ],
        open: DMG_URL,
      };

    case "appstore":
    case "app-store":
      return {
        lines: [
          { kind: "out", text: "mac app store (indoor build):" },
          { kind: "out", text: "" },
          { kind: "ghost", text: "in app review. local-shell is disabled in the" },
          { kind: "ghost", text: "sandboxed build (apple's rules — ssh still works)." },
          { kind: "ghost", text: "for full features, use the outdoor build above." },
        ],
      };

    case "about":
    case "info":
      return { lines: ABOUT.map((text) => ({ kind: "out", text })) };

    case "github":
    case "source":
    case "src":
      return {
        lines: [
          { kind: "url", text: REPO_URL, href: REPO_URL, copy: REPO_URL },
          { kind: "ghost", text: "MIT licensed. PRs welcome." },
        ],
        open: REPO_URL,
      };

    case "ls":
    case "ls -la":
    case "dir":
      return { lines: ROOMS.map((text) => ({ kind: "out", text })) };

    case "meow":
    case "cat":
    case "maxwell":
      return {
        lines: [
          { kind: "ascii", text: "  /\\_/\\  " },
          { kind: "ascii", text: " ( o.o ) " },
          { kind: "ascii", text: "  > ^ <  " },
          { kind: "out",   text: "" },
          { kind: "ghost", text: "maxwell says hi. he doesn't judge your typos." },
        ],
      };

    case "rat":
    case "🐀":
      return {
        lines: [
          { kind: "ok",    text: "    __" },
          { kind: "ok",    text: "  o'')}____//" },
          { kind: "ok",    text: "   `_/      )" },
          { kind: "ok",    text: "   (_(_/-(_/" },
          { kind: "out",   text: "" },
          { kind: "ghost", text: "the rat orbits the terminal. inspired by ratty (orhun parmaksız)." },
        ],
      };

    case "whoami":
      return {
        lines: [
          { kind: "out", text: "stargazer" },
          { kind: "ghost", text: "(no, really — there is no real session here.)" },
        ],
      };

    case "uname":
    case "uname -a":
      return { lines: [{ kind: "out", text: "Catty 3D · web edition · macOS-bound" }] };

    case "clear":
    case "cls":
      return { lines: [], clear: true };

    case "exit":
    case "quit":
    case "logout":
      return {
        lines: [
          { kind: "ghost", text: "there is no exit. you're inside a marketing site." },
          { kind: "ghost", text: "(but the cat is real.)" },
        ],
      };

    case "sudo":
      return { lines: [{ kind: "err", text: "permission denied: cats outrank you." }] };

    case "rm -rf /":
    case "rm -rf":
      return {
        lines: [
          { kind: "err", text: "nice try." },
          { kind: "ghost", text: "this terminal is read-only. yours probably isn't." },
        ],
      };

    default:
      return {
        lines: [
          { kind: "err", text: `command not found: ${raw}` },
          { kind: "ghost", text: "type `help` to see what i know." },
        ],
      };
  }
}

const SUGGESTIONS = ["download", "brew", "script", "dmg", "about", "help"];

export function CattyTerminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState<number | null>(null);
  const [pendingNumbered, setPendingNumbered] = useState<Record<string, string> | null>(null);
  const [copyTip, setCopyTip] = useState<string | null>(null);
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const initOnceRef = useRef(false);
  /** Tracks whether the user is at the bottom of the scroll buffer.
      We only auto-scroll if they were — that way mid-buffer reading
      / selection isn't yanked back to the prompt. */
  const stickToBottomRef = useRef(true);

  const appendLines = useCallback((newLines: Omit<Line, "id">[]) => {
    setLines((prev) => {
      const next = [...prev];
      for (const l of newLines) {
        idRef.current += 1;
        next.push({ ...l, id: idRef.current });
      }
      return next;
    });
  }, []);

  const flashCopy = useCallback((label: string) => {
    setCopyTip(label);
    setTimeout(() => setCopyTip(null), 1800);
  }, []);

  const copyToClipboard = useCallback(
    (text: string, label = "copied to clipboard") => {
      if (typeof navigator === "undefined" || !navigator.clipboard) return;
      navigator.clipboard.writeText(text).then(
        () => flashCopy(label),
        () => {/* noop */}
      );
    },
    [flashCopy]
  );

  // Boot banner — once.
  useEffect(() => {
    if (initOnceRef.current) return;
    initOnceRef.current = true;
    const banner = BANNER.split("\n").map(
      (text) => ({ kind: "ascii" as LineKind, text })
    );
    appendLines([
      ...banner,
      { kind: "ghost", text: "welcome. this terminal is real(ish) — type `help` or `download`." },
      { kind: "out",   text: "" },
    ]);
  }, [appendLines]);

  // Auto-scroll only when the user is already at the bottom.
  // Reading mid-history won't get yanked back to the prompt.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [lines]);

  // Listen for the user scrolling — flip stick-to-bottom accordingly.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      stickToBottomRef.current = distance < 6;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const submit = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      // Numbered shortcut — if the previous response offered numbered
      // options and the user just pressed a digit, route to that.
      let resolved = trimmed;
      if (pendingNumbered && pendingNumbered[trimmed]) {
        resolved = pendingNumbered[trimmed];
      }
      const echo: Omit<Line, "id"> = { kind: "echo", text: `${PROMPT} ${raw}` };
      const result = runCommand(resolved);

      if (result.clear) {
        setLines([]);
        setInput("");
        setPendingNumbered(null);
        return;
      }

      // Always restore stick-to-bottom on a fresh submit so the user
      // sees their command and the response.
      stickToBottomRef.current = true;
      appendLines([echo, ...result.lines, { kind: "out", text: "" }]);

      if (raw.trim()) setHistory((h) => [...h, raw]);
      setHistIndex(null);
      setInput("");
      setPendingNumbered(result.numbered ?? null);

      // Side effects.
      if (result.copy) copyToClipboard(result.copy);
      if (result.open && typeof window !== "undefined") {
        // Tiny delay so the response paints before the new tab opens.
        setTimeout(() => {
          window.open(result.open!, "_blank", "noopener,noreferrer");
        }, 350);
      }
    },
    [appendLines, copyToClipboard, pendingNumbered]
  );

  const onKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(input);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = histIndex === null ? history.length - 1 : Math.max(0, histIndex - 1);
      setHistIndex(next);
      setInput(history[next]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIndex === null) return;
      const next = histIndex + 1;
      if (next >= history.length) {
        setHistIndex(null);
        setInput("");
      } else {
        setHistIndex(next);
        setInput(history[next]);
      }
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const partial = input.trim().toLowerCase();
      if (!partial) return;
      const match = SUGGESTIONS.find((s) => s.startsWith(partial));
      if (match) setInput(match);
      return;
    }
    if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLines([]);
      setPendingNumbered(null);
      return;
    }
    // Number-key fast path: if there are pending numbered options and
    // the input is empty, a digit press jumps straight to that command.
    if (pendingNumbered && input === "" && /^[1-9]$/.test(e.key) && pendingNumbered[e.key]) {
      e.preventDefault();
      submit(e.key);
    }
  };

  /** Mouse-up handler that focuses the input — but only if the user
      isn't currently making a text selection. Lets the user drag-select
      text in scrollback to copy URLs. */
  const onTermMouseUp = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (typeof window === "undefined") return;
    const sel = window.getSelection();
    if (sel && sel.toString().length > 0) return;
    // Don't steal focus from the suggestion buttons or copy chips
    // beneath the scroll area.
    const target = e.target as HTMLElement;
    if (target.closest("button, a")) return;
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="cattyTerm">
      <div className="termChrome">
        <span className="termDot termDot--r" aria-hidden="true" />
        <span className="termDot termDot--y" aria-hidden="true" />
        <span className="termDot termDot--g" aria-hidden="true" />
        <span className="termTitle">catty:~ — interactive (web)</span>
        <span className="termTag">tty/web</span>
      </div>

      <div ref={scrollRef} className="termScroll" onMouseUp={onTermMouseUp}>
        {lines.map((line) => (
          <TerminalLine key={line.id} line={line} onCopy={copyToClipboard} />
        ))}

        <form
          className="termInputRow"
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
        >
          <span className="termPrompt">{PROMPT}</span>
          <input
            ref={inputRef}
            type="text"
            className="termInput"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="terminal input"
            style={{ width: `${Math.max(1, input.length)}ch` }}
          />
          <span className="termCaret" aria-hidden="true" />
        </form>
      </div>

      <div className="termFoot">
        <div className="termHints">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className="termSuggest"
              onClick={() => {
                setInput(s);
                submit(s);
              }}
            >
              {s}
            </button>
          ))}
        </div>
        {copyTip && <span className="termCopyTip">{copyTip}</span>}
      </div>
    </div>
  );
}

/* ─── Single line renderer (with optional inline copy/open chips) ─── */

function TerminalLine({
  line,
  onCopy,
}: {
  line: Line;
  onCopy: (text: string, label?: string) => void;
}): ReactNode {
  // The "cmd" kind renders differently — a boxed command line meant
  // for the user to copy, with an inline copy button nailed to its
  // right edge.
  if (line.kind === "cmd") {
    return (
      <div className="termCmdRow">
        <pre className="termLine termLine--cmd">
          <span className="termCmdPrompt">$</span> {line.text}
        </pre>
        <button
          type="button"
          className="termInlineCopy"
          onClick={() => onCopy(line.copy ?? line.text)}
          aria-label="Copy command"
        >
          copy
        </button>
      </div>
    );
  }

  // Other kinds get inline copy / open-tab chips when present.
  const hasChip = line.copy || line.href;
  return (
    <pre className={`termLine termLine--${line.kind}`}>
      {line.text || " "}
      {hasChip && (
        <span className="termChips">
          {line.copy && (
            <button
              type="button"
              className="termInlineChip termInlineChip--copy"
              onClick={() => onCopy(line.copy!)}
              aria-label="Copy"
            >
              copy
            </button>
          )}
          {line.href && (
            <a
              href={line.href}
              target="_blank"
              rel="noopener noreferrer"
              className="termInlineChip termInlineChip--open"
            >
              open ↗
            </a>
          )}
        </span>
      )}
    </pre>
  );
}
