import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

// 源码根目录（sourcemap 还原工程）。
// 允许用环境变量覆盖：仓库里不能写死某台机器的绝对路径，别人 clone 下来会直接 404。
// 默认值保留本机路径，方便本地零配置打开。
const SRC_ROOT = process.env.CLAUDE_CODE_SRC_ROOT ?? "d:/20260916/_src/claude-code-sourcemap/restored-src/src";

// 简单文件缓存 { absPath -> 行数组 }
const lineCache = new Map<string, string[]>();
// 文件名索引 { basename -> [{rel, total}, ...] }（递归扫一次，防锚点没写目录）
// total 在首次 stat 时惰性填充（-1 表示尚未探测）
let nameIndex: Map<string, Map<string, number>> | null = null;

function buildNameIndex(): Map<string, Map<string, number>> {
  if (nameIndex) return nameIndex;
  nameIndex = new Map();
  const walk = (dir: string, rel: string) => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const en of entries) {
      const r = rel ? `${rel}/${en.name}` : en.name;
      if (en.isDirectory()) walk(path.join(dir, en.name), r);
      else {
        let m = nameIndex!.get(en.name);
        if (!m) {
          m = new Map();
          nameIndex!.set(en.name, m);
        }
        if (!m.has(r)) m.set(r, -1);
      }
    }
  };
  walk(SRC_ROOT, "");
  return nameIndex;
}

function lineCount(rel: string): number {
  const abs = path.join(SRC_ROOT, rel);
  const hit = nameIndex!.get(path.basename(rel))!;
  const cached = hit.get(rel) ?? -1;
  if (cached >= 0) return cached;
  let n = -1;
  try {
    n = fs.statSync(abs).size === 0 ? 0 : fs.readFileSync(abs, "utf8").split(/\r?\n/).length;
  } catch {
    n = -1;
  }
  hit.set(rel, n);
  return n;
}

function resolveFile(file: string, to?: number): string | null {
  const norm = file.replace(/\\/g, "/");
  // 防路径逃逸
  if (norm.includes("..") || norm.startsWith("/") || /^[a-zA-Z]:/.test(norm)) return null;
  const direct = path.join(SRC_ROOT, norm);
  try {
    if (fs.statSync(direct).isFile()) return norm;
  } catch {
    /* 精确路径不存在，走模糊定位 */
  }
  // 模糊定位：同一 basename 可能散落多处（重名），优先选行容量足以覆盖
  // 查询区间(to 行)的候选；都不够就取行数最多的。
  const base = norm.split("/").pop()!;
  const hits = buildNameIndex().get(base);
  if (!hits || hits.size === 0) return null;
  let best: string | null = null;
  let bestLines = -1;
  for (const rel of hits.keys()) {
    const n = lineCount(rel);
    if (n < 0) continue;
    if (bestLines < n) {
      best = rel;
      bestLines = n;
    }
    if (to && n >= to) return rel;
  }
  return best;
}

function loadLines(file: string, to?: number): string[] | null {
  const rel = resolveFile(file, to);
  if (!rel) return null;
  // 精确相对路径已由 resolveFile 解析；若 rel 与请求不同，用解析结果替换请求名
  const abs = path.join(SRC_ROOT, rel);
  const cached = lineCache.get(abs);
  if (cached) return cached;
  try {
    const txt = fs.readFileSync(abs, "utf8");
    const lines = txt.split(/\r?\n/);
    lineCache.set(abs, lines);
    return lines;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get("file") || "";
  const fromRaw = req.nextUrl.searchParams.get("from") || "";
  const toRaw = req.nextUrl.searchParams.get("to") || "";

  let ctxTo = toRaw ? parseInt(toRaw, 10) : 0;
  if (Number.isNaN(ctxTo)) ctxTo = 0;

  const lines = loadLines(file, ctxTo);
  if (!lines) {
    return NextResponse.json({ error: `找不到文件: ${file}` }, { status: 404 });
  }
  const resolved = resolveFile(file, ctxTo) ?? file;

  const total = lines.length;
  let ctxFrom = fromRaw ? parseInt(fromRaw, 10) : 1;
  if (!ctxTo) ctxTo = total;
  if (Number.isNaN(ctxFrom)) ctxFrom = 1;
  ctxFrom = Math.max(1, Math.min(ctxFrom, total));
  ctxTo = Math.max(ctxFrom, Math.min(ctxTo, total));

  const slice = lines.slice(ctxFrom - 1, ctxTo);

  return NextResponse.json({
    file: resolved,
    from: ctxFrom,
    to: ctxTo,
    total,
    lines: slice,
  });
}