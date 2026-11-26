"use client";

import { memo, type CSSProperties, type MouseEvent as RMouseEvent } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { FlowCardNode } from "../lib/geometry";
import { parseAnchor, codeView } from "../lib/anchor";

function TreeNodeCardBase({ data }: NodeProps<FlowCardNode>) {
  const badge =
    data.leaf || data.count === 0 ? null : (
      <span
        className={"bdg" + (data.open ? " on" : "")}
        style={{ "--h": data.hue } as CSSProperties}
      >
        {data.open ? "−" : `＋ 展开子流程 (${data.count})`}
      </span>
    );

  const shapeCls =
    data.kind === "start" || data.kind === "end"
      ? "shape-endpoint"
      : data.kind === "decision"
        ? "shape-decision"
        : "";

  const onAnchor = (e: RMouseEvent, a: string | undefined) => {
    const parsed = parseAnchor(a);
    if (!parsed) return;
    e.stopPropagation();
    e.preventDefault();
    codeView.show(parsed);
  };

  // 有可点击锚点的 detail（只有 kind=step/leaf 才展示锚点按钮）
  const clickable = (a: string | undefined) => a !== undefined && a !== "" && !!parseAnchor(a);

  return (
    <div
      className={`tn k-${data.kind} ${shapeCls}`}
      style={{ "--h": data.hue } as CSSProperties}
    >
      {data.kind === "decision" ? (
        <div className="tn-inner">
          <div className="tn-title">{data.label}</div>
        </div>
      ) : (
        <>
          {badge}
          <div className="tn-title">{data.label}</div>
          {data.details.length > 0 && (
            <div className="tn-detail">
              {data.details.map((d, i) => (
                <p key={i}>
                  {d.t}
                  {clickable(d.a) ? (
                    <button
                      className="anc"
                      onClick={(e) => onAnchor(e, d.a)}
                      title={`查看源码 ${d.a}`}
                    >
                      {d.a}
                    </button>
                  ) : (
                    d.a && <span className="anc">{d.a}</span>
                  )}
                </p>
              ))}
            </div>
          )}
        </>
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const TreeNodeCard = memo(TreeNodeCardBase);
export default TreeNodeCard;