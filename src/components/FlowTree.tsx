"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  type Node as RFNode,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { GRAPH } from "../data/flowGraph";
import { buildView, type CardData } from "../lib/geometry";
import TreeNodeCard from "./TreeNodeCard";
import CodePanel from "./CodePanel";

const nodeTypes: NodeTypes = { tn: TreeNodeCard };

function FlowCanvas() {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [counts, setCounts] = useState({ n: 1, e: 0 });

  const view = useMemo(() => buildView(GRAPH, expanded), [expanded]);

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const nx = new Set(prev);
      if (nx.has(id)) nx.delete(id);
      else nx.add(id);
      return nx;
    });
  }, []);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: RFNode) => {
      const d = node.data as CardData | undefined;
      if (d && d.count > 0) toggle(node.id);
    },
    [toggle]
  );

  useEffect(() => {
    setCounts({ n: view.nodes.length, e: view.edges.length });
  }, [view]);

  return (
    <>
      <div className="appbar">
        <h1>Claude Code v2.1.88 生命周期 · 完整流程</h1>
        <span className="hint">
          开始 → 判定 → 步骤 → … → 结束　｜　点击含「＋ 展开子流程」的步骤节点下钻细节　｜　滚轮缩放 / 拖拽平移
        </span>
        <span className="cnt">{counts.n} 节点 · {counts.e} 边</span>
      </div>
      <div className="stage">
        <ReactFlow
          nodes={view.nodes}
          edges={view.edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          minZoom={0.03}
          maxZoom={2.4}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={26} color="var(--grid)" />
          <Controls showInteractive={false} />
          <MiniMap pannable zoomable style={{ width: 170, height: 110 }} />
        </ReactFlow>
      </div>
      <CodePanel />
    </>
  );
}

export default function FlowTree() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}