"use client";

import {
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Catty interactive terminal — a fake shell hosted on the home page.
 * Static export only: no server, no real exec; canned responses
 * keyed off the typed command. Goal is to feel like the real Catty
 * terminal (prompt, echo, blinking caret, history) and surface every
 * download path through conversation rather than buttons.
 */

type LineKind = "out" | "echo" | "err" | "ok" | "ascii" | "ghost";

type Line = {
  id: number;
  kind: LineKind;
  text: string;
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
  link?: { label: string; href: string };
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
          { kind: "ok", text: "  1. brew      → " + HOMEBREW_CMD },
          { kind: "ok", text: "  2. script    → " + SCRIPT_CMD },
          { kind: "ok", text: "  3. dmg       → " + DMG_URL },
          { kind: "out", text: "" },
          { kind: "out", text: "type any of: brew, script, dmg, appstore" },
          { kind: "ghost", text: "or visit /download for the full picker" },
        ],
        link: { label: "open /download →", href: "/download/" },
      };

    case "brew":
    case "homebrew":
      return {
        lines: [
          { kind: "out", text: "homebrew (recommended):" },
          { kind: "out", text: "" },
          { kind: "ok", text: "  $ " + HOMEBREW_CMD },
          { kind: "out", text: "" },
          { kind: "ghost", text: "first command taps mochiexists/catty3d." },
          { kind: "ghost", text: "second command installs the cask." },
          { kind: "ghost", text: "sparkle handles updates after install." },
        ],
        copy: HOMEBREW_CMD,
      };

    case "script":
    case "curl":
      return {
        lines: [
          { kind: "out", text: "one-line install script:" },
          { kind: "out", text: "" },
          { kind: "ok", text: "  $ " + SCRIPT_CMD },
          { kind: "out", text: "" },
          { kind: "ghost", text: "fetches the latest dmg from github releases," },
          { kind: "ghost", text: "verifies, opens for drag-to-applications." },
        ],
        copy: SCRIPT_CMD,
      };

    case "dmg":
    case "direct":
      return {
        lines: [
          { kind: "out", text: "direct download:" },
          { kind: "out", text: "" },
          { kind: "ok", text: "  → " + DMG_URL },
          { kind: "out", text: "" },
          { kind: "ghost", text: "notarized, signed with our developer id." },
          { kind: "ghost", text: "first release ships shortly — link 404s until then." },
        ],
        link: { label: "open dmg link →", href: DMG_URL },
      };

    case "appstore":
    case "app-store":
    case "mac app store":
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
          { kind: "out", text: "source: " + REPO_URL },
          { kind: "ghost", text: "MIT licensed. PRs welcome." },
        ],
        link: { label: "open github →", href: REPO_URL },
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
  const [copyTip, setCopyTip] = useState<string | null>(null);
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const initOnceRef = useRef(false);

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

  // Boot banner — once.
  useEffect(() => {
    if (initOnceRef.current) return;
    initOnceRef.current = true;
    const banner = BANNER.split("\n").map(
      (text) => ({ kind: "ascii" as LineKind, text })
    );
    appendLines([
      ...banner,
      { kind: "ghost", text: "welcome. this terminal is real(ish) — type `help`." },
      { kind: "out",   text: "" },
    ]);
  }, [appendLines]);

  // Auto-scroll to bottom on new lines.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines]);

  // Auto-focus when the terminal scrolls into view.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && document.activeElement?.tagName !== "INPUT") {
            el.focus({ preventScroll: true });
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const submit = useCallback(
    (raw: string) => {
      const echo: Omit<Line, "id"> = { kind: "echo", text: `${PROMPT} ${raw}` };
      const result = runCommand(raw);
      if (result.clear) {
        setLines([]);
        setInput("");
        return;
      }
      appendLines([echo, ...result.lines, { kind: "out", text: "" }]);
      if (raw.trim()) {
        setHistory((h) => [...h, raw]);
      }
      setHistIndex(null);
      setInput("");

      // Side-effects: clipboard copy + outbound link
      if (result.copy && typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(result.copy).then(
          () => {
            setCopyTip("copied to clipboard");
            setTimeout(() => setCopyTip(null), 1800);
          },
          () => {/* noop */}
        );
      }
      if (result.link) {
        // Tiny delay so the user sees the response render before the
        // tab opens — softer than a synchronous jump.
        setTimeout(() => {
          if (typeof window !== "undefined") {
            const isExternal = result.link!.href.startsWith("http");
            if (isExternal) {
              window.open(result.link!.href, "_blank", "noopener,noreferrer");
            }
            // Internal links left for the user to click via the
            // affordance that gets rendered below.
          }
        }, 350);
      }
    },
    [appendLines]
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
    }
  };

  const focusInput = () => inputRef.current?.focus();

  return (
    <div className="cattyTerm" onClick={focusInput}>
      <div className="termChrome">
        <span className="termDot termDot--r" aria-hidden="true" />
        <span className="termDot termDot--y" aria-hidden="true" />
        <span className="termDot termDot--g" aria-hidden="true" />
        <span className="termTitle">catty:~ — interactive (web)</span>
        <span className="termTag">tty/web</span>
      </div>

      <div ref={scrollRef} className="termScroll">
        {lines.map((line) => (
          <pre key={line.id} className={`termLine termLine--${line.kind}`}>
            {line.text || " "}
          </pre>
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
            // Size input to content so the block caret sits flush
            // to the end of typed text, like a real terminal.
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
