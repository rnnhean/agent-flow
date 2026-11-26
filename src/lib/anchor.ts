/**
 * 锚点解析 + 代码查看全局状态
 * 锚点格式：file.ts[:start[-end]]（容忍随意后缀文本，如 "/ api.ts:449-473"）
 */
export interface Anchor {
  file: string;
  from: number | null;
  to: number | null;
  raw: string;
}

const RE = /^([\w./-]+\.(?:tsx?|mjs|cjs|js)(?![\w.-]))(?::(\d+)(?:\s*-\s*(\d+))?)?/;

export function parseAnchor(a?: string): Anchor | null {
  if (!a) return null;
  const m = a.match(RE);
  if (!m) return null;
  return {
    file: m[1],
    from: m[2] ? parseInt(m[2], 10) : null,
    to: m[3] ? parseInt(m[3], 10) : null,
    raw: a.trim(),
  };
}

/* —— 全局代码面板状态 —— */
export interface CodeView {
  anchor: Anchor;
}

type Listener = () => void;
let current: CodeView | null = null;
const listeners = new Set<Listener>();

export const codeView = {
  get: () => current,
  subscribe: (l: Listener) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  show: (anchor: Anchor) => {
    current = { anchor };
    listeners.forEach((l) => l());
  },
  close: () => {
    current = null;
    listeners.forEach((l) => l());
  },
};

/**
 * 生成请求参数：无行号时给整文件，有 from 无 to 时扩几行上下文
 */
export function rangeFor(anchor: Anchor): { from: number; to: number } {
  if (anchor.from === null) return { from: 1, to: 99999 };
  if (anchor.to !== null) return { from: anchor.from, to: anchor.to };
  return { from: Math.max(1, anchor.from - 4), to: anchor.from + 8 };
}