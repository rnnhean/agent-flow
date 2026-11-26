import type { Node, Edge } from "@xyflow/react";
import type { FlowStep, FlowGraph } from "../data/flowGraph";

export type FlowKind = "start" | "end" | "decision" | "step";

export interface CardData {
  label: string;
  details: { t: string; a?: string }[];
  hue: number;
  count: number;
  open: boolean;
  leaf: boolean;
  kind: FlowKind;
  [key: string]: unknown;
}

export type FlowCardNode = Node<CardData, "tn">;

const ROW = 196;  // 纵向流程步长(加大,菱形有内边距)
const BY = 260;   // 判定"是"分支右移量

/**
 * 流程布局：主干/子流程都按声明顺序自上而下
 * - 显式边(GRAPH.edges)：主干时序 + 判定是/否出口；两端不可见时自动跳过
 * - 判定"是"出口的目标节点整体右移一列,流程自然汇合回中
 * - 展开节点的 sub：父→每个子 扇出(无显式边时才补),不构成伪顺序
 * - 回环边(目标行号<起点行号)自动画虚线
 */
export function buildView(
  graph: FlowGraph,
  expanded: Set<string>
): { nodes: FlowCardNode[]; edges: Edge[] } {
  // ---- 1. 收集可见节点(展开的 sub 就地垂直展开) ----
  const visible: FlowStep[] = [];
  const order = new Map<string, number>();
  const byId = new Map<string, FlowStep>();

  const dig = (list: FlowStep[]): void => {
    for (const st of list) {
      visible.push(st);
      byId.set(st.id, st);
      order.set(st.id, visible.length - 1);
      if (st.sub && expanded.has(st.id)) dig(st.sub);
    }
  };
  dig(graph.steps);

  // ---- 2. 显式边集合(去重) ----
  const explicit = new Set<string>();
  for (const e of graph.edges ?? []) explicit.add(`${e.from}>${e.to}`);

  // ---- 3. 坐标：判定"是"出口目标右移一列 ----
  const yesTargets = new Set<string>();
  for (const e of graph.edges ?? [])
    if (e.label && e.label.startsWith("是")) yesTargets.add(e.to);

  const nodes: FlowCardNode[] = visible.map((st) => {
    const row = order.get(st.id)!;
    const hasSub = !!st.sub && st.sub.length > 0;
    const open = hasSub && expanded.has(st.id);
    return {
      id: st.id,
      position: { x: yesTargets.has(st.id) ? BY : 0, y: row * ROW },
      type: "tn",
      data: {
        label: st.label,
        details: st.details,
        hue: st.hue,
        count: st.sub?.length ?? 0,
        open,
        leaf: !hasSub,
        kind: st.kind,
      },
      style: {
        width:
          st.kind === "decision" ? 400
            : st.kind === "start" || st.kind === "end" ? 380 : 460,
      },
    };
  });

  // ---- 4. 边 ----
  const edges: Edge[] = [];
  const idSet = new Set(visible.map((v) => v.id));

  const line = (from: string, to: string, label?: string) => {
    if (!idSet.has(from) || !idSet.has(to) || from === to) return;
    const back = (order.get(to)!) < (order.get(from)!);
    edges.push({
      id: `e-${from}-${to}`,
      source: from,
      target: to,
      type: "smoothstep",
      label,
      style: back ? { strokeDasharray: "8 6", opacity: 0.72 } : undefined,
      labelStyle: { fontSize: 12, fontWeight: 700, fill: "#7d879c" },
      labelBgStyle: { fill: "var(--card)", fillOpacity: 0.92, rx: 4 },
    });
  };

  // 4a) 显式边
  for (const e of graph.edges ?? []) line(e.from, e.to, e.label);

  // 4b) 展开节点的 sub 扇出(仅在无显式边时补)
  for (const st of visible) {
    if (!st.sub || !expanded.has(st.id)) continue;
    for (const kid of st.sub) {
      if (!explicit.has(`${st.id}>${kid.id}`)) line(st.id, kid.id);
    }
  }

  return { nodes, edges };
}