/**
 * 流程数据 —— Claude Code v2.1.88 进程生命周期「完整流程」
 * 主干 = 进程级时序：开始(圆形) → 判定(菱形,是/否出口) → 步骤(矩形) → … → 结束(圆形)
 * 步骤节点可点击展开内部子流程(sub)，子流程仍是纵向流程，直到原子步骤
 * 所有叶子带完整机制说明 + file:line 锚点(锚点根: restored-src/src)
 */
export interface Detail { t: string; a?: string }

export type FlowRole = "start" | "end" | "decision" | "step";

export interface FlowStep {
  id: string;
  label: string;        // 判定=问句；步骤=动作名
  kind: FlowRole;
  hue: number;
  details: Detail[];    // 这一步做了什么(机制说明+锚点)
  sub?: FlowStep[];     // 点击展开的内部子流程
}

export interface FlowEdgeDef { from: string; to: string; label?: string }

export interface FlowGraph { title: string; steps: FlowStep[]; edges: FlowEdgeDef[] }

/* ---------- 主循环子流程(n5 展开后可见) ---------- */
const loop: FlowStep[] = [
  f("L0", "① 组装上下文(每轮开头)", "step", 190, [
    ["fetchSystemPromptParts 三段并行：getSystemPrompt + getUserContext + getSystemContext", "queryContext.ts:44-74"],
    ["CLAUDE.md 注入：五档优先级(Managed→User→Project根到cwd→Local→--add-dir)，拼进第一条 user message 的 <system-reminder>", "claudemd.ts:790-936 / api.ts:449-473"],
    ["getAttachments 三类并行拼装(1s 超时)：@文件/MCP资源/agent/skill｜排队命令/记忆/压缩提醒｜IDE选区/诊断/预算；相关记忆异步 prefetch(≤5条)", "utils/attachments.ts:743-1040"],
  ], [
    f("L0a", "系统提示动态段", "step", 190, [
      ["memory/MCP指令(不可缓存)/env/language/scratchpad 等 9 段；SYSTEM_PROMPT_DYNAMIC_BOUNDARY 界定可缓存静态段", "constants/prompts.ts:492-575"],
    ]),
    f("L0b", "消息级缓存 marker", "step", 190, [
      ["addCacheBreakpoints: marker 打在 messages.length-1(skipCacheWrite 时 -2)；全流只允许单个 message 级 cache marker", "claude.ts:3063-3211"],
    ]),
  ]),
  f("L1", "② paramsFromContext → 流式调用模型", "step", 190, [
    ["唯一请求体出口：retryContext/options/model 推导 max_tokens/thinking/tools/betas/metadata", "claude.ts:1538-1729"],
    ["systemPrompt=[attributionHeader, CLI prefix, ...] → buildSystemPromptBlocks 三模式带缓存 scope", "claude.ts:1358-1379"],
    ["anthropic.beta.messages.create(stream).withResponse()；withRetry 包裹(10次/指数退避500·2^n c32s/jitter≤25%)", "claude.ts:1735-1846"],
  ], [
    f("L1a", "max_tokens 三级", "step", 190, [["retry 覆盖→options 覆盖→getMaxOutputTokensForModel 默认 32768", "claude.ts:1591-1594"]]),
    f("L1b", "thinking 两型", "step", 190, [["ADAPTIVE→{type:'adaptive'}；否则 {type:'enabled',budget}；有 thinking 不带 temperature", "claude.ts:1604-1629"]]),
    f("L1c", "latched headers(键稳定)", "step", 190, [["AFK/fast-mode/cache-editing/thinking-clear 首送后整会话锁定；/clear /compact 重置", "claude.ts:1405-1456"]]),
    f("L1d", "MCP 工具互斥", "step", 190, [["有 MCP 工具时全局缓存策略降级 'none'，切模式B/组织作用域", "claude.ts:1212-1214"]]),
  ]),
  f("L2", "③ 流事件分发", "step", 330, [
    ["content_block_* 渲染/定型，message_delta 属性突变，message_stop 判结束", "claude.ts:2192-2293"],
  ], [
    f("L2a", "content_block_stop→AssistantMessage", "step", 330, [["块结束定型为核心消息结构", "claude.ts:2192-2210"]]),
    f("L2b", "message_delta 增量突变", "step", 330, [["stop_reason/usage 直接改在已定型消息上", "claude.ts:2213-2293"]]),
    f("L2c", "结束判定", "step", 330, [["message_stop 后判 needsFollowUp=!有 tool_use；stop_reason 从不被读取", "query.ts:553-558"]]),
  ]),
  f("D1", "④ 本轮含 tool_use ?", "decision", 330, [
    ["当前轮是否产出工具调用块；决定走「工具链」还是「收尾判定」", "query.ts:834"],
  ]),
  f("L3", "工具权限链判定", "step", 40, [
    ["十层递归检查，任一命中即定；hook deny 优先于一切 allow", "utils/permissions/permissions.ts:1158-1319 / toolHooks.ts:332"],
  ], [
    f("L3a", "①deny 硬拒绝", "step", 40, [["最高优先级后门", "utils/permissions/permissions.ts:1158-1319"]]),
    f("L3b", "②ask 问用户", "step", 40, [["直接询问", "utils/permissions/permissions.ts:1158-1319"]]),
    f("L3c", "③工具自查 allow", "step", 40, [["工具自带 allow 配置", "utils/permissions/permissions.ts:1158-1319"]]),
    f("L3d", "④1d 会话内授权", "step", 40, [["已确认授权(1天)自动通过", "utils/permissions/permissions.ts:1158-1319"]]),
    f("L3e", "⑤requiresUserInteraction", "step", 40, [["必须 UI 等待(useCanUseTool 缝隙)", "utils/permissions/permissions.ts:1158-1319"]]),
    f("L3f", "⑥content ask", "step", 40, [["内容敏感再问一次", "utils/permissions/permissions.ts:1158-1319"]]),
    f("L3g", "⑦safetyCheck 规则引擎", "step", 40, [["弹性规则检查", "utils/permissions/permissions.ts:1158-1319"]]),
    f("L3h", "⑧bypass 模式放行", "step", 40, [["bypass-permissions 直放", "utils/permissions/permissions.ts:1158-1319"]]),
    f("L3i", "⑨alwaysAllowed 白名单", "step", 40, [["总放行名单", "utils/permissions/permissions.ts:1158-1319"]]),
    f("L3j", "⑩passthrough 兜底", "step", 40, [["无匹配时直放", "utils/permissions/permissions.ts:1158-1319"]]),
    f("L3k", "5 个 permission queues", "step", 40, [["中央队列+群组优先级，多个等待按 focus 策略弹出", "REPL.tsx"]]),
  ]),
  f("L4", "工具执行 + Hook 链", "step", 40, [
    ["PreToolUse → 执行 → PostToolUse；三类实现分流：内置/MCP/SkillTool/Agent(subagent)", "toolExecution.ts:1207"],
  ], [
    f("L4a", "内置工具契约", "step", 40, [["maxResultSizeChars 必填；Bash 默认 120s/600s 超时", "Tool.ts:362-695"]]),
    f("L4b", "MCP 直呼", "step", 40, [["远端单server 20并发 / 本地stdio 3并发；30s connect timeout", ""]]),
    f("L4c", "subagent 子流程", "step", 40, [["in-process 新query(runAgent.ts:748)；sidechain 落 subagents/agent-<id>.jsonl", "runAgent.ts:748-757"]]),
    f("L4d", "错误回填", "step", 40, [["is_error → <tool_use_error> 包进 tool_result 回填", "query.ts"]]),
  ]),
  f("L5", "结果回填 → 下一模型调用", "step", 330, [
    ["工具结果作 tool_result 消息回填，带着回填内容回到②继续流式调用下轮(回环虚线)", "query.ts"],
  ]),
  f("D2", "⑤ 上下文超窗口 ?", "decision", 330, [
    ["ContextWindow 超出(≈窗口−13k)触发自动压缩，否则直接收尾判定", "query.ts:365-467"],
  ]),
  f("L6", "五层压缩", "step", 330, [
    ["压缩后断点恢复、换出窗口，回到②继续；仍不够→autocompact 兜底(回环虚线)", "query.ts:365-467"],
  ], [
    f("L6a", "①boundary 切割", "step", 330, [["按块边界定可压缩范围", "query.ts:365-467"]]),
    f("L6b", "②tool_result 预算", "step", 330, [["优先裁剪工具结果", "query.ts:365-467"]]),
    f("L6c", "③snip 行剪", "step", 330, [["行级截断", "query.ts:365-467"]]),
    f("L6d", "④micro 压缩", "step", 330, [["保留消息结构地微缩", "query.ts:365-467"]]),
    f("L6e", "⑤collapse/autocompact", "step", 330, [["整段折叠；不够则指令式紧凑代入", "query.ts:365-467"]]),
    f("L6f", "阈值与断点", "step", 330, [["压缩提交后保留 lastSummarizedMessageId 之后原样消息", "sessionMemoryCompact.ts:514-570"]]),
  ]),
  f("D3", "⑥ 结束?(needsFollowUp=false)", "decision", 330, [
    ["模型已出最终答复，无待处理工具 → 退出主循环；否则循环下一轮", "query.ts:1070-1357"],
  ]),
  f("L7", "退出主循环 → 回合尾处理", "step", 90, [
    ["PT 恢复 → stop hooks 过一遍 → 返回 completed/aborted 等退出原因，进入 n6 回合尾", "query.ts:1070-1357"],
  ]),
];

/* ---------- 主干：进程生命周期 ---------- */
const chain: FlowStep[] = [
  f("s0", "进程启动", "start", 210, [
    ["entrypoints/cli.tsx main() 是唯一进程入口；底部 void main() 启动", "cli.tsx:33-302"],
  ]),
  f("D0", "快速路径 ?(--version / --bare / bridge / daemon…)", "decision", 210, [
    ["按 argv 判断：走子命令 fast-path，还是进入完整生命周期", "cli.tsx:112-245"],
  ]),
  f("ea0", "快速退出(版本/裸模式/daemon/bridge/doctor…)", "end", 210, [
    ["动态 import 对应模块；--version 用 MACRO.VERSION 零加载；--bare 极早写 CLAUDE_CODE_SIMPLE=1", "cli.tsx:36-245 / 283-285"],
  ]),
  f("n1", "main() 护栏 + argv 重写", "step", 210, [
    ["安全护栏 + 三类 argv 改写 + 非交互判定 + clientType 推导 → initializeEntrypoint", "main.tsx:585-854"],
  ], [
    f("n1a", "安全护栏", "step", 210, [["SIGINT handler(硬绑定REPL)；Windows NoDefaultCurrentDirectoryInExePath 防劫持", "main.tsx:591-606"]]),
    f("n1b", "cc:// deep-link 重写", "step", 210, [["cc:// → _pendingConnect(DIRECT_CONNECT 门控)", "main.tsx:612-642"]]),
    f("n1c", "assistant/ssh 剥离", "step", 210, [["claude assistant 剥离 KAIROS；claude ssh 剥离 host/cwd、改写 permission-mode", "main.tsx:685-795"]]),
    f("n1d", "isNonInteractive", "step", 210, [["有 -p/-init-only/sdk-url 或无 TTY", "main.tsx:803-815"]]),
  ]),
  f("n2", "init() 信任前/后初始化", "step", 210, [
    ["memoize 单例；信任建立前只应用安全 env 与 CA 证书；之后才加载遥测", "entrypoints/init.ts:57"],
  ], [
    f("n2a", "①信任前安全 env", "step", 210, [["applySafeConfigEnvironmentVariables 只应用安全 env", "entrypoints/init.ts:65-74"]]),
    f("n2b", "②CA 证书", "step", 210, [["applyExtraCACertsFromConfig 在任何 TLS 之前", "entrypoints/init.ts:79"]]),
    f("n2c", "③repo/策略/首启时间", "step", 210, [["repo 检测→remoteManagedSettings→recordFirstStartTime", "entrypoints/init.ts:114-132"]]),
    f("n2d", "④mTLS/proxy/TCP预热", "step", 210, [["configureGlobalMTLS→proxy→preconnectAnthropicApi", "entrypoints/init.ts:137-159"]]),
    f("n2e", "⑤CCR/shell/scratchpad", "step", 210, [["CCR upstream→setShellIfWindows→ensureScratchpadDir", "entrypoints/init.ts:167-209"]]),
    f("n2f", "⑥遥测初始化(信任后)", "step", 210, [["initializeTelemetryAfterTrust→OTel懒加载(~400KB)→setMeter+会话计数；tengu_init 于此域", "entrypoints/init.ts:247-338"]], [
      f("n2f1", "doInitializeTelemetry", "step", 210, [["remote-settings 加载后初始化采集", "entrypoints/init.ts:288-303"]]),
      f("n2f2", "OTel 延迟化", "step", 210, [["~400KB 懒加载；setMeterState 维护会话计数", "entrypoints/init.ts:333-338"]]),
    ]),
  ]),
  f("n3", "setup() 挂载(一切依赖 cwd 的初始化)", "step", 210, [
    ["setCwd 之后才挂 watcher/会话/插件/遥测；末尾 initSinks 打 tengu_started", "setup.ts:56-380"],
  ], [
    f("n3a", "setCwd / 会话定位", "step", 210, [["自定义 sessionId switchSession；分发 UDS messaging；终端备份与重装", "setup.ts:82-161"]]),
    f("n3b", "hooks 快照 + watcher", "step", 210, [["captureHooksConfigSnapshot + initializeFileChangedWatcher", "setup.ts:166-172"]]),
    f("n3c", "会话与插件挂载", "step", 210, [["initSessionMemory→contextCollapse→lockCurrentVersion→插件/命令 prefetch", "setup.ts:294-369"]]),
    f("n3d", "initSinks=tengu_started", "step", 210, [["initSinks(:371)→logEvent('tengu_started')(:378)→prefetchApiKey(:380)——遥测起点", "setup.ts:371-380"]]),
  ]),
  f("DX", "非交互 ?", "decision", 210, [
    ["isNonInteractiveSession 判定：headless(-p/sdk) 还是 REPL 交互", "main.tsx:2585"],
  ]),
  f("n4a", "headless 链(-p / sdk)", "step", 210, [
    ["构建 headlessInitialState → createStore → MCP 批量推入 → import runHeadless(print)", "main.tsx:2623-2827"],
  ], [
    f("n4a1", "initial state + store", "step", 210, [["headlessInitialState AppState 构造", "main.tsx:2623-2650"]]),
    f("n4a2", "MCP 连接建立", "step", 210, [["批量推入 store(:2687-2719)", "main.tsx:2687-2719"]]),
    f("n4a3", "runHeadless", "step", 210, [["await import('cli/print.js')→runHeadless(print.ts:455-974)", "main.tsx:2827"]]),
  ]),
  f("n4b", "REPL 链(交互)", "step", 210, [
    ["continue/resume/direct/ssh/assistant 各分支 → launchRepl 渲染 <App><REPL/></App>", "main.tsx:3124-3798"],
  ], [
    f("n4b1", "分支路由", "step", 210, [["continue/resume(:3124) / direct connect(:3158) / ssh(:3191) / default(:3798)", "main.tsx:3124-3798"]]),
    f("n4b2", "launchRepl", "step", 210, [["渲染 App+REPL，带初始 state", "replLauncher.tsx:12-22"]]),
    f("n4b3", "输入→主循环线", "step", 210, [["onSubmit→handlePromptSubmit→executeUserInput→processUserInput→query()", "REPL.tsx:3142 / query.ts:263"]]),
  ]),
  {
    id: "n5",
    label: "⑤ 主循环 while(true)　〔点开看完整流程 L0~L7〕",
    kind: "step",
    hue: 330,
    details: [
      { t: "query.ts:241 事件分发→工具?→结束?→超窗口压缩?→回到调用；每轮解构 State、continue 处整体替换", a: "query.ts:241-277" },
    ],
    sub: loop,
  },
  f("n6", "回合尾处理(转录落盘 + 记忆)", "step", 90, [
    ["每回合结束写 transcription(单例CPU写队列100ms批量) + extractMemories/SessionMemory/autoDream 后台 fork", "sessionStorage.ts:606-686 / stopHooks.ts:141-156"],
  ], [
    f("n6a", "转录落盘", "step", 90, [["getTranscriptPath={projectDir}/{sessionId}.jsonl；EAGER_FLUSH 立即；退出注册 flush+reAppend(尾部64KB)", "sessionStorage.ts:202-205 / 449-464"]]),
    f("n6b", "extractMemories(fork)", "step", 90, [["gate: 编译期feature&&非agent&&isExtractModeActive&&isAutoMemoryEnabled&&无并发写；skipTranscript,maxTurns=5；-p退出前drain 60s", "stopHooks.ts:141-153 / extractMemories.ts:415-467"]], [
      f("n6b1", "互斥核心", "step", 90, [["主agent已写auto-memory则跳过fork——主/后台每回合二选一", "extractMemories.ts:348-360"]]),
      f("n6b2", "写入面", "step", 90, [["createAutoMemCanUseTool: Read/Grep/Glob 全放，Edit/Write 仅限 auto-memory 目录", "extractMemories.ts:171-222"]]),
    ]),
    f("n6c", "SessionMemory 摘要", "step", 90, [["gate: querySource=repl_main_thread&&feature；>10000tok 触发/每增5000更新；写 session-memory/summary.md 0600", "sessionMemory.ts:277-375"]], [
      f("n6c1", "压缩联动", "step", 90, [["sessionMemoryCompact 保留 lastSummarizedMessageId 之后", "sessionMemoryCompact.ts:514-570"]]),
    ]),
    f("n6d", "autoDream 后台浓缩", "step", 90, [["gate链+锁：minHours=24/minSessions=5 默认；.consolidate-lock mtime+PID；全目录浓缩 MEMORY.md<200行", "autoDream.ts:63-189"]], [
      f("n6d1", "锁与回滚", "step", 90, [["<1h且PID活→拒绝；失败回滚倒回mtime+清PID", "consolidationLock.ts:46-108"]]),
    ]),
  ]),
  f("DYe", "退出请求 ?(/exit /quit / ctrl+c / ctrl+d / headless stdin EOF)", "decision", 150, [
    ["REPL.handleExit 收口 → gracefulShutdown；headless stdin 耗尽同步退出；否则继续主循环", "REPL.tsx:3622-3651 / print.ts:769"],
  ]),
  f("n7", "gracefulShutdown 全序列(11 步)", "step", 90, [
    ["从开始到强制退出的完整退场流程；随后进程结束(transcript/cost 已落盘)", "gracefulShutdown.ts:391-523"],
  ], [
    f("sy1", "①幂等守卫", "step", 90, [["shutdownInProgress 防重入", "gracefulShutdown.ts:401-404"]]),
    f("sy2", "②hook 预算+failsafe", "step", 90, [["算 SessionEnd 预算并挂 failsafe", "gracefulShutdown.ts:406-412"]]),
    f("sy3", "③Failsafe 兜底", "step", 90, [["max(5s,预算+3.5s) 超时→cleanup+forceExit", "gracefulShutdown.ts:417-427"]]),
    f("sy4", "④清终端+resume hint", "step", 90, [["先让用户能恢复", "gracefulShutdown.ts:436-437"]]),
    f("sy5", "⑤runCleanupFunctions 2s竞速", "step", 90, [["flush+reAppend 等全部清理函数", "gracefulShutdown.ts:444-467"]]),
    f("sy6", "⑥SessionEnd hooks", "step", 90, [["AbortSignal.timeout 预算；ExitReason 枚举 6 种", "gracefulShutdown.ts:472-480"]]),
    f("sy7", "⑦profileReport", "step", 90, [["性能上报", "gracefulShutdown.ts:483-487"]]),
    f("sy8", "⑧tengu_cache_eviction_hint", "step", 90, [["scope=session_end", "gracefulShutdown.ts:489-499"]]),
    f("sy9", "⑨1P+datadog flush 500ms竞速", "step", 90, [["遥测刷出与 sleep 竞速", "gracefulShutdown.ts:504-511"]]),
    f("sy10", "⑩finalMessage", "step", 90, [["可选写 stderr", "gracefulShutdown.ts:513-520"]]),
    f("sy11", "⑪forceExit", "step", 90, [["最终强行退出", "gracefulShutdown.ts:522"]]),
    f("sy12", "forceExit/SIGKILL 回退", "step", 90, [["process.exit 抛错(死终端)→process.kill(SIGKILL)", "gracefulShutdown.ts:199-232"]]),
    f("sy13", "信号分支", "step", 90, [["SIGINT→0 / SIGTERM→143 / SIGHUP→129+孤儿检测 / uncaught 只上报不退出", "gracefulShutdown.ts:256-333"]]),
  ]),
  f("end0", "进程结束(含恢复路径存档)", "end", 90, [
    ["transcript/cost 已入 ~/.claude.json + .jsonl；下次 --continue/--resume 从尾部64KB 恢复", "costHook.ts:17 / conversationRecovery.ts:456-540"],
  ]),
];

/* ---------- 组装(兼容 tuple 与对象两种明细写法) ---------- */
function f(id: string, label: string, kind: FlowRole, hue: number, raw: ([string, string?] | Detail)[], sub?: FlowStep[]): FlowStep {
  const details: Detail[] = (raw || []).map((x) =>
    Array.isArray(x) ? { t: x[0] as string, a: x[1] } : (x as Detail)
  );
  return { id, label, kind, hue, details, sub };
}

export const GRAPH: FlowGraph = {
  title: "Claude Code v2.1.88 生命周期流程",
  steps: chain,
  edges: [
    // 主干时序
    { from: "s0", to: "D0" },
    { from: "D0", to: "ea0", label: "是·快速路径" },
    { from: "D0", to: "n1", label: "否·完整生命周期" },
    { from: "n1", to: "n2" },
    { from: "n2", to: "n3" },
    { from: "n3", to: "DX" },
    { from: "DX", to: "n4a", label: "是·headless" },
    { from: "DX", to: "n4b", label: "否·REPL" },
    { from: "n4a", to: "n5" },
    { from: "n4b", to: "n5" },
    { from: "n5", to: "n6" },
    { from: "n6", to: "DYe" },
    { from: "DYe", to: "n7", label: "是·退出" },
    { from: "DYe", to: "n5", label: "否·继续主循环" },
    { from: "n7", to: "end0" },
    // 主循环子流程(仅 n5 展开时可见)
    { from: "n5", to: "L0", label: "进入主循环" },
    { from: "L0", to: "L1" },
    { from: "L1", to: "L2" },
    { from: "L2", to: "D1" },
    { from: "D1", to: "L3", label: "是·有工具调用" },
    { from: "L3", to: "L4" },
    { from: "L4", to: "L5" },
    { from: "L5", to: "L1", label: "回填后下一轮调用" },
    { from: "D1", to: "D2", label: "否" },
    { from: "D2", to: "L6", label: "是·超窗口" },
    { from: "L6", to: "L1", label: "压缩后续跑" },
    { from: "D2", to: "D3", label: "否" },
    { from: "D3", to: "L7", label: "是·已完成" },
    { from: "D3", to: "L0", label: "否·继续下一轮" },
  ],
};