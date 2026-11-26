"use client";

import { useCallback, useEffect, useSyncExternalStore, useState } from "react";
import { codeView, rangeFor } from "../lib/anchor";

interface CodeResp {
  file: string;
  from: number;
  to: number;
  total: number;
  lines: string[];
}

export default function CodePanel() {
  const view = useSyncExternalStore(codeView.subscribe, codeView.get, () => null);
  const [resp, setResp] = useState<CodeResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!view) {
      setResp(null);
      setErr(null);
      return;
    }
    const ctrl = new AbortController();
    const r = rangeFor(view.anchor);
    setLoading(true);
    setErr(null);
    fetch(`/api/code?file=${encodeURIComponent(view.anchor.file)}&from=${r.from}&to=${r.to}`, {
      signal: ctrl.signal,
    })
      .then(async (res) => {
        const j = (await res.json()) as CodeResp & { error?: string };
        if (!res.ok) throw new Error(j.error || "加载失败");
        setResp(j);
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setErr(String(e?.message || e));
        setResp(null);
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [view]);

  const close = useCallback(() => codeView.close(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") codeView.close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={"code-panel" + (view ? " open" : "")} aria-hidden={!view}>
      {view && (
        <>
          <div className="cp-head">
            <span className="cp-file">{view.anchor.raw}</span>
            <button className="cp-close" onClick={close} title="Esc 关闭">
              ✕
            </button>
          </div>
          <div className="cp-body">
            {loading && <div className="cp-tip">正在读取源码…</div>}
            {err && <div className="cp-tip cp-err">{err}</div>}
            {resp && (
              <pre className="cp-pre">
                {resp.lines.map((ln, i) => (
                  <span key={resp.from + i}>
                    <span className="cpl">{resp.from + i}</span>
                    <span className="cpln">{ln.replace(/\t/g, "  ")}</span>
                  </span>
                ))}
              </pre>
            )}
          </div>
          <div className="cp-foot">
            {resp ? `${resp.file}　第 ${resp.from}–${resp.to} 行 / 共 ${resp.total} 行` : " "}
          </div>
        </>
      )}
    </div>
  );
}