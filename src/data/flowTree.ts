/**
 * 树数据 —— Claude Code v2.1.88 全部研究结论(深度展开版)
 * 每个机制步骤都拆成独立节点,叶子 = 原子机制描述 + file:line 锚点
 * 锚点路径: d:\20260916\_src\claude-code-sourcemap\restored-src\src
 */
export interface Detail {
  t: string;
  a?: string;
}
export interface FlowNode {
  id: string;
  label: string;
  hue: number;
  details: Detail[];
  children: FlowNode[];
}

type Raw = [string, string?];

const n = (id: string, label: string, hue: number, raw: Raw[], children: FlowNode[] = []): FlowNode => ({
  id,
  label,
  hue,
  details: raw.map(([t, a]) => ({ t, a })),
  children,
});

export const TREE: FlowNode = n("root", "Claude Code v2.1.88 Agent 生命周期 — 全部研究展开树", 220, [
  ["入口 cli.tsx:33 → main.tsx:585 → init.ts:57 → setup.ts:56 → 非交互/交互分叉 → 主循环(while true) → 工具/压缩/落盘/记忆 → gracefulShutdown 结束", ""],
  ["13 个主题分支，逐层点击展开直到叶子；每一片叶子 = 一条完整机制 + file:line 锚点", ""],
  ["全部来自 _graph_notes.md 十三篇研究报告(覆盖率矩阵+报告1~13)", ""],
], [
  /* ================= 1 启动链 ================= */
  n("t1", "① 启动链", 210, [
    ["进程入口 → 护栏/argv重写 → init 序列 → commander 路由 → setup 挂载 → REPL/headless 分叉", ""],
  ], [
    n("t1a", "进程入口 cli.tsx main()", 210, [["真正的进程入口是 src/entrypoints/cli.tsx（不是 main.tsx）：底部 void main():302，main() 定义 :33", "cli.tsx:33-302"]], [
      n("t1a1", "--version 零加载", 210, [["MACRO.VERSION 构建期内联，不 import 任何模块", "cli.tsx:36-42"]]),
      n("t1a2", "--bare 极早写环境变量", 210, [["在此就把 CLAUDE_CODE_SIMPLE=1 写入 env，早于任何模块求值；后续代码以此判断极简模式", "cli.tsx:283-285"]]),
      n("t1a3", "模块顶部副作用", 210, [["CCR 下 NODE_OPTIONS --max-old-space-size=8192；feature(ABLATION_BASELINE) env 覆盖", "cli.tsx:10-31"]]),
      n("t1a4", "bridge/daemon fast-path", 210, [["bridge/remote-control(:112-162)、daemon(:165-180)、ps|logs|attach|kill|--bg(:185-209)、new|list|reply(:212-222)、environment-runner(:226-233)、self-hosted-runner(:238-245) 各自动态 import", "cli.tsx:112-245"]]),
      n("t1a5", "无特殊标志的总开关", 210, [["startCapturingEarlyInput(:291) → await import('../main.js') 的 main(:293-298)；--worktree --tmux 组合 execIntoTmuxWorktree(:248-274)；--update/--upgrade 改写 argv(:277-279)", "cli.tsx:248-298"]]),
    ]),
    n("t1b", "main() 护栏与 argv 早重写", 210, [["安全护栏 + 三类 argv 改写 + 非交互判定 + clientType 推导", "main.tsx:585-854"]], [
      n("t1b1", "安全护栏", 210, [["NoDefaultCurrentDirectoryInExePath=1（防 Windows PATH 劫持）:591；initializeWarningHandler() :594；SIGINT handler :598-606（-p 时跳过，交给 print.ts）", "main.tsx:591-606"]]),
      n("t1b2", "cc:// deep-link 重写", 210, [["cc:// → _pendingConnect(DIRECT_CONNECT 门控) :612-642；headless 重写 open 子命令", "main.tsx:612-642"]]),
      n("t1b3", "assistant/ssh 剥离", 210, [["claude assistant(KAIROS) 剥离 :685-700；claude ssh 剥离 host/cwd、改写 permission-mode :706-795（-p 与 ssh 互斥 :786-790）", "main.tsx:685-795"]]),
      n("t1b4", "非交互判定", 210, [["isNonInteractive = hasPrintFlag || hasInitOnlyFlag || hasSdkUrl || !process.stdout.isTTY:803 → initializeEntrypoint(:815)", "main.tsx:803-815"]]),
      n("t1b5", "clientType 推导", 210, [["cli / sdk-ts / sdk-py / remote / claude-vscode / local-agent / claude-desktop :818-834；eagerLoadSettings :852；auth 预取 prefetchApiKeyFromApiKeyHelperIfSafe(setup.ts:380)、populateOAuthAccountInfoIfNeeded(init.ts:110)", "main.tsx:818-834"]]),
    ]),
    n("t1c", "init() 初始化序列", 210, [["memoize 单例，信任建立前只应用安全 env / CA 证书；顺序敏感", "init.ts:57"]], [
      n("t1c1", "信任前安全 env + CA", 210, [["enableConfigs(:65) → applySafeConfigEnvironmentVariables(信任前只应用安全 env :74) → applyExtraCACertsFromConfig(先于任何 TLS :79) → setupGracefulShutdown(:87)", "init.ts:65-87"]]),
      n("t1c2", "遥测懒加载 + OAuth 预取", 210, [["懒导入 1P event logging(:94-105) → populateOAuthAccountInfoIfNeeded(:110)", "init.ts:94-110"]]),
      n("t1c3", "repo / 策略 / 首启时间", 210, [["JetBrains/git repo 检测(:114,118) → remoteManagedSettings/policyLimits(:123-128) → recordFirstStartTime(:132)", "init.ts:114-132"]]),
      n("t1c4", "mTLS / proxy / TCP 预热", 210, [["configureGlobalMTLS(:137) → configureGlobalAgents(proxy :146) → preconnectAnthropicApi = TCP+TLS 预热(:159)", "init.ts:137-159"]]),
      n("t1c5", "CCR upstream / shell / scratchpad", 210, [["CCR upstreamproxy(:167-183) → setShellIfWindows(:186) → 注册 LSP/team 清理(:189-200) → ensureScratchpadDir(:203-209)", "init.ts:167-209"]]),
      n("t1c6", "initializeTelemetryAfterTrust", 210, [["信任后：remote-settings 加载 → doInitializeTelemetry(:288-303) → setMeterState(:305) → 懒加载 OTel(~400KB 延迟化) → setMeter+会话计数(:333-338)；tengu_init 事件 main.tsx:4562 logTenguInit(定义 :4514,调用 :2496)", "init.ts:247-338"]], [
        n("t1c6a", "doInitializeTelemetry", 210, [["设置加载后初始化遥测，采集计量器状态", "init.ts:288-303"]]),
        n("t1c6b", "OTel 延迟化", 210, [["initializeTelemetry(OTel ~400KB) 懒加载；setMeter+会话计数", "init.ts:333-338"]]),
      ]),
    ]),
    n("t1d", "commander 路由 run()", 210, [["program.name('claude') + [prompt] 参数 + 巨型 options；默认 action 并行执行 setup 与命令注册", "main.tsx:884-1006"]], [
      n("t1d1", "option 全集", 210, [["-p/--bare/--init/--init-only/--output-format/--system-prompt[-file]/--append-system-prompt[-file]/--permission-mode(choices=PERMISSION_MODES)/-c/-r/--model/--settings/--add-dir/--session-id/--agents/--setting-sources(:976 起)", "main.tsx:976-1006"]]),
      n("t1d2", "print 快速路径", 210, [["-p 且非 cc:// 时：跳过 52 个子命令注册直接 parseAsync（子命令注册约 65ms，headless 快启关键）", "main.tsx:3883-3891"]]),
      n("t1d3", "默认 action 并行", 210, [["计算 print(:1128)、sdk-url 隐式 print(:1248-1250)；await import('./setup.js')(:1907-1908) → setup(...)(:1926-1928) 与 getCommands/getAgentDefinitionsWithOverrides 并行(:1929-1935，UDS 绑定与磁盘 I/O 重叠)", "main.tsx:1907-1935"]]),
      n("t1d4", "目录决定", 210, [["默认 process.cwd()；setCwd(cwd)(setup.ts:161)；worktree 则 process.chdir+setOriginalCwd+setProjectRoot(setup.ts:271-278)；getProjectDir(sanitize 后, sessionStorage.ts:436)——不是 sessionStart.ts(那是 SessionStart hooks 执行器)", "sessionStorage.ts:198-436"]]),
    ]),
    n("t1e", "setup() 初始化", 210, [["一切依赖 cwd 的代码在 setCwd 之后才安全；末尾 initSinks 打 tengu_started", "setup.ts:56-380"]], [
      n("t1e1", "setCwd(:161)", 210, [["Node≥18 校验(:70)；自定义 sessionId switchSession(:82-84)；UDS messaging(:89)；终端备份恢复与重装(:115-158)", "setup.ts:70-161"]]),
      n("t1e2", "watcher 与 snapshot", 210, [["captureHooksConfigSnapshot(:166)；initializeFileChangedWatcher(:172)；worktree 创建(:176-285)", "setup.ts:166-285"]]),
      n("t1e3", "会话与插件挂载", 210, [["initSessionMemory(:294→sessionMemory.ts:357)；contextCollapse init(:295-301)；lockCurrentVersion(:303)；插件/命令 prefetch(:315-329)；ant attribution/sessionFileAccess/teamMemory watcher(:336-369)", "setup.ts:294-369"]]),
      n("t1e4", "initSinks = telemetry 起点", 210, [["initSinks(:371) → logEvent('tengu_started',{})(:378) → prefetchApiKey(:380)", "setup.ts:371-380"]]),
    ]),
    n("t1f", "模式路由：REPL vs headless", 210, [["headless 与 TUI 分叉 main.tsx:2585", "main.tsx:2585-2829"]], [
      n("t1f1", "headless 链", 210, [["isNonInteractiveSession → 构建 headlessInitialState AppState(:2623-2650) → createStore(:2653) → MCP 连接批量推入(:2687-2719) → await import('cli/print.js')(:2827) runHeadless", "main.tsx:2623-2827"]]),
      n("t1f2", "交互分支", 210, [["continue/resume(:3124→launchRepl :3134) / direct connect(:3158+) / ssh(:3191+) / teleport/remote/assistant/default(:3798 launchRepl)；launchRepl(replLauncher.tsx:12-22) 渲染 <App><REPL/></App>；每个分支传 initialState AppState(:2926-3030 构造,含 initialMessage :3019-3023)", "main.tsx:3124-3798"]]),
    ]),
  ]),

  /* ================= 2 上下文 / 请求体组装 ================= */
  n("t2", "② 上下文 / 请求体组装", 190, [
    ["系统提示三段并行 → 动态段 → 块级缓存切分 → 工具数组 → CLAUDE.md 五档 → 附件三类 → paramsFromContext", ""],
  ], [
    n("t2a", "系统提示三段并行", 190, [["fetchSystemPromptParts：并行 [getSystemPrompt(tools,model,dirs,mcpClients), getUserContext(), getSystemContext()]，构成「API 缓存键前缀」(文件头注释 :1-4)", "queryContext.ts:44-74"]]),
    n("t2b", "动态段注册表", 190, [["段全部经 systemPromptSection()/DANGEROUS_uncachedSystemPromptSection() 包裹(constants/systemPromptSections.ts:20/32)；边界常量 SYSTEM_PROMPT_DYNAMIC_BOUNDARY='__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__'", "prompts.ts:492-575"]], [
      n("t2b1", "memory 段", 190, [["loadMemoryPrompt() → MEMORY.md(按 auto/team/kairos 分流，auto 关闭返回 null)", "prompts.ts:495"]]),
      n("t2b2", "mcp_instructions 段", 190, [["DANGEROUS_uncached 包裹——MCP 指令不能缓存", "prompts.ts:513-519"]]),
      n("t2b3", "session_guidance / ant_model_override", 190, [["会话指引(:492-494) + 模型覆盖(:497-498)", "prompts.ts:492-498"]]),
      n("t2b4", "env / language / output_style", 190, [["env_info_simple(:499-501) + language(:502-504) + output_style(:505-506)", "prompts.ts:499-506"]]),
      n("t2b5", "scratchpad / frc / summarize", 190, [["scratchpad(:521) + frc(:522) + summarize_tool_results(:524-526)", "prompts.ts:521-526"]]),
      n("t2b6", "边界语义", 190, [["仅 shouldUseGlobalCacheScope()(utils/betas.ts:227) 为真时插边界(:573)；格式=[[静态×6],BOUNDARY,...动态段]；工具清单块 getUsingYourToolsSection(enabledTools)(:269)——工具 schema 走请求体 tools 参数，不在 system 块", "prompts.ts:572-575"]]),
    ]),
    n("t2c", "系统提示块级缓存切分", 190, [["queryModel 拼入 attribution header + CLI prefix 后调 buildSystemPromptBlocks(services/api/claude.ts:1376-1379，定义 :3213-3237) → splitSysPromptPrefix(utils/api.ts:321-444) 三模式", "api.ts:321-444"]], [
      n("t2c1", "模式A 全局缓存+有边界", 190, [["至多 4 块：attributionHeader→null；prefix→null；静态段(join)→'global'；动态段→null；识别=block 以 x-anthropic-billing-header 开头 / CLI_SYSPROMPT_PREFIXES.has；边界用 findIndex(:363-403)", "api.ts:363-403"]]),
      n("t2c2", "模式B 全局缓存+MCP工具", 190, [["有 MCP 工具渲染=跳过全局缓存，至多 3 块全 'org'(:329-361)", "api.ts:329-361"]]),
      n("t2c3", "模式C 默认(3P/无边界)", 190, [["同 3 块全 scope:'org'(:416-444)", "api.ts:416-444"]]),
      n("t2c4", "getCacheControl 字段", 190, [["base={type:'ephemeral'} → 条件加 ttl:'1h'(should1hCacheTTL :390-430) → 条件加 scope:'global'(:358-…)；全局缓存自动补 prompt-caching-scope beta header(claude.ts:1217-1222)", "claude.ts:358-430"]], [
        n("t2c4a", "1h TTL 条件", 190, [["should1hCacheTTL(:390-430) 决定是否带 ttl:'1h'", "claude.ts:390-430"]]),
        n("t2c4b", "global scope beta header", 190, [["scope=global 时自动补 prompt-caching-scope beta header", "claude.ts:1217-1222"]]),
      ]),
      n("t2c5", "不缓存什么", 190, [["只有静态段块带 scope:global；prefix/attribution/动态段不缓存；工具数组无 cache marker；SYSTEM_PROMPT_BLOCKS 常量不存在(对应名字 systemPromptSection())", "prompts.ts"]]),
    ]),
    n("t2d", "工具数组(2.1.88 不带 cache marker)", 190, [["getUsingYourToolsSection(enabledTools)(prompts.ts:269) 渲染工具清单；API schema 经 toolToAPISchema 进请求体 tools 参数", "prompts.ts:269"]], [
      n("t2d1", "cacheControl 参数无人传", 190, [["toolToAPISchema(utils/api.ts:119-266) 接受 options.cacheControl(:129-133,228-230) 但全库无调用方传入(grep cacheControl: 无 tool 命中)；claude.ts:1235-1246 只传 permission 上下文/tools/agents/model；claude.ts:1388-1391 注释「toolSchemas carries cache_control」是历史残留", "api.ts:119-266"]]),
      n("t2d2", "defer_loading 动态加载", 190, [["tool search 经 defer_loading 动态加载(:1208-1229)；MCP 工具在全局缓存模式下阻断全局 system 缓存(needsToolBasedCacheMarker :1212-1214，策略 globalCacheStrategy:'none')", "claude.ts:1208-1229"]]),
      n("t2d3", "toolSchemaCache", 190, [["键名+inputJSONSchema 缓存(:147-152,208)，避免重复序列化 schema", "api.ts:147-152"]]),
    ]),
    n("t2e", "CLAUDE.md 五档优先级", 190, [["getMemoryFiles(utils/claudemd.ts:790) 合并顺序：Managed→User→Project→Local→--add-dir", "claudemd.ts:790-939"]], [
      n("t2e1", "Managed 组织层", 190, [["getMemoryPath('Managed')=config.ts:1779 组织目录/CLAUDE.md + .claude/rules/*.md；总是加载，含 includeExternal", "claudemd.ts:791-824"]]),
      n("t2e2", "User 用户层", 190, [["仅 isSettingSourceEnabled('userSettings')；~/.claude/CLAUDE.md + ~/.claude/rules/*.md", "claudemd.ts:826-847"]]),
      n("t2e3", "Project + Local 逐级", 190, [["从文件系统根向下走到 cwd，dirs.reverse() 使离 cwd 最近的排后面优先级更高(:878)；每层 Project 型=CLAUDE.md/.claude/CLAUDE.md/.claude/rules/*.md(仅 projectSettings :887-920)，Local 型=CLAUDE.local.md(仅 localSettings :923-933)；嵌套 worktree 去重(:859-884, #29599)", "claudemd.ts:849-934"]]),
      n("t2e4", "--add-dir 与开关", 190, [["tengu_paper_halyard 可跳过 Project/Local(getClaudeMds :1156-1158)；优先级结论：Managed→User→Project(根到cwd)→Local→--add-dir(:936-939)；无 enterprise 层(Managed=组织策略层)", "claudemd.ts:936-939"]]),
      n("t2e5", "处理上限", 190, [["processMemoryFile(:618)、processMdRules(:697)、frontmatter include(:254)；MAX_INCLUDE_DEPTH=5(:537)；MAX_MEMORY_CHARACTER_COUNT=40000(:92)；MEMORY_INSTRUCTION_PROMPT='Codebase and user instructions are shown below…'(:89-90)", "claudemd.ts:89-700"]], [
        n("t2e5a", "include 深度限制", 190, [["frontmatter include 递归上限 5 层", "claudemd.ts:254-537"]]),
        n("t2e5b", "字符上限", 190, [["每文件内容上限 40000 字符", "claudemd.ts:92"]]),
        n("t2e5c", "输出封装", 190, [["每文件 'Contents of {path}{description}:\\n\\n{content}'(:1181-1188)，以 MEMORY_INSTRUCTION_PROMPT + 拼接结尾(:1198-1200)", "claudemd.ts:1181-1200"]]),
      ]),
      n("t2e6", "注入点(关键)", 190, [["CLAUDE.md 串→userContext.claudeMd(context.ts:184)→prependUserContext(utils/api.ts:449-473)——作为第一条 user message 的 <system-reminder> 进消息流，不进 system 参数；getClaudeMds(:1156-1158) 可被 tengu_paper_halyard 跳过 Project/Local", "api.ts:449-473"]]),
      n("t2e7", "auto-memory 相反", 190, [["MEMORY.md 经 loadMemoryPrompt(memdir.ts:419-470) 进 system 动态段(prompts.ts:495)；按 auto/team/kairos 分流(kairos 每日日志、TEAMMEM 组合、否则 auto-only 记忆+搜索指引 memory-search-guidance :446-470)；auto 关闭返回 null(:427-430)", "memdir.ts:419-470"]]),
    ]),
    n("t2f", "userContext / systemContext", 190, [["userContext=memoize；systemContext 快照", "context.ts:116-189"]], [
      n("t2f1", "userContext", 190, [["CLAUDE.md+currentDate('Today's date is …')(:155-189)；locked 于 shouldDisableClaudeMd=CLAUDECODE_DISABLE_CLAUDEMDS||(isBareMode&&无--add-dir)(:165-167)；setCachedClaudeMdContent 供 yoloClassifier(:176)", "context.ts:155-189"]]),
      n("t2f2", "systemContext", 190, [["gitStatus(git status 快照，截断 2000 字符 :20,85-89) getGitStatus(:36-111) + BREAK_CACHE_COMMAND cacheBreaker(:143-147)；CCR/禁用 git 跳过(:124-128)", "context.ts:116-150"]]),
      n("t2f3", "注入位区分", 190, [["systemContext→appendSystemContext(utils/api.ts:437-447) 拼进 systemPrompt 尾部；userContext→prependUserContext(api.ts:449-473) prepend 到 messages 数组头部，包成 <system-reminder><claudeMd><currentDate></system-reminder> 的 createUserMessage(isMeta)；调用点 query.ts:660", "api.ts:437-473"]]),
    ]),
    n("t2g", "附件组装(三类并行)", 190, [["getAttachments(utils/attachments.ts:743)：硬开关 CLAUDE_CODE_DISABLE_ATTACHMENTS/SIMPLE(:752-761)、1s 超时 AbortController(:766-768)、每类 maybe() 包裹(:1005-1040)", "attachments.ts:743-1040"]], [
      n("t2g1", "①用户输入型", 190, [["at_mentioned_files / mcp_resources / agent_mentions / skill_discovery(:773-815)", "attachments.ts:773-815"]], [
        n("t2g1a", "at_mentioned_files", 190, [["@-mention 文件附件", "attachments.ts:773-815"]]),
        n("t2g1b", "mcp_resources", 190, [["MCP 资源附件", "attachments.ts:773-815"]]),
        n("t2g1c", "agent_mentions", 190, [["@-mention agent", "attachments.ts:773-815"]]),
        n("t2g1d", "skill_discovery", 190, [["技能发现附件", "attachments.ts:773-815"]]),
      ]),
      n("t2g2", "②通用线程型", 190, [["queued_commands/date_change/relevant_memories/nested_memory/critical_system_reminder/compaction_reminder/context_efficiency 等(:824-959)", "attachments.ts:824-959"]], [
        n("t2g2a", "queued_commands / date_change", 190, [["排队命令与日期变更通知", "attachments.ts:824-959"]]),
        n("t2g2b", "relevant_memories(异步 prefetch)", 190, [["相关记忆 attachment，异步预取", "attachments.ts:824-959"]]),
        n("t2g2c", "nested_memory / ultrathink_effort", 190, [["嵌套记忆与思考强度", "attachments.ts:824-959"]]),
        n("t2g2d", "critical_system_reminder / compaction_reminder", 190, [["关键系统提醒(每次请求都带)与压缩提醒", "attachments.ts:824-959"]]),
        n("t2g2e", "deferred_tools_delta / agent_listing_delta", 190, [["延迟工具与 agent 列表增量", "attachments.ts:824-959"]]),
        n("t2g2f", "mcp_instructions_delta / context_efficiency", 190, [["MCP 指令增量与上下文效率提示", "attachments.ts:824-959"]]),
      ]),
      n("t2g3", "③主线程型", 190, [["ide_selection/output_style/token_usage/budget_usd/lsp_diagnostics/verify_plan_reminder 等(:960-996)", "attachments.ts:960-996"]], [
        n("t2g3a", "ide_selection / ide_opened_file", 190, [["IDE 选区与打开文件", "attachments.ts:960-996"]]),
        n("t2g3b", "diagnostics / lsp_diagnostics", 190, [["诊断与 LSP 诊断", "attachments.ts:960-996"]]),
        n("t2g3c", "token_usage / output_token_usage", 190, [["Token 用量回执", "attachments.ts:960-996"]]),
        n("t2g3d", "budget_usd / output_style", 190, [["美元预算与输出风格", "attachments.ts:960-996"]]),
        n("t2g3e", "unified_tasks / async_hook_responses", 190, [["统一任务与异步 hook 响应", "attachments.ts:960-996"]]),
        n("t2g3f", "verify_plan_reminder", 190, [["任务计划核对提醒", "attachments.ts:960-996"]]),
      ]),
      n("t2g4", "相关记忆召回", 190, [["RELEVANT_MEMORIES_CONFIG(:279)；MAX_MEMORY_LINES=200/MAX_MEMORY_BYTES=4096(:269,277)", "attachments.ts:269-279"]], [
        n("t2g4a", "搜索范围", 190, [["getRelevantMemoryAttachments(:2196-2242)：@-mention 只搜 agent memory dir else auto-memory dir(:2206-2213)", "attachments.ts:2196-2213"]]),
        n("t2g4b", "召回条数", 190, [["findRelevantMemories(memdir/findRelevantMemories.ts:39) 召回，最多 5 条(:2231-2235)", "attachments.ts:2231-2235"]]),
        n("t2g4c", "异步 prefetch", 190, [["startRelevantMemoryPrefetch(:2380-2424,调用 :2392)，链 turn-level abort controller，query.ts 首轮迭代消费(query.ts:199-205)", "attachments.ts:2380-2424"]]),
      ]),
      n("t2g5", "附件消息构造", 190, [["getAttachmentMessages(:2937-2970)→createAttachmentMessage(:3201-3210 {attachment,type:'attachment',uuid,timestamp})", "attachments.ts:2937-3210"]]),
    ]),
    n("t2h", "paramsFromContext(请求体核心)", 190, [["从 retryContext + options + model 推导全部请求参数的唯一出口", "claude.ts:1538-1729"]], [
      n("t2h1", "max_tokens 三级", 190, [["retryContext?.maxTokensOverride || options.maxOutputTokensOverride || getMaxOutputTokensForModel(model)(默认 32768)", "claude.ts:1591-1594"]], [
        n("t2h1a", "retry 覆盖", 190, [["重试时的 maxTokensOverride 优先", "claude.ts:1591"]]),
        n("t2h1b", "options 覆盖", 190, [["用户/API 传入覆盖", "claude.ts:1592"]]),
        n("t2h1c", "模型默认", 190, [["getMaxOutputTokensForModel(model) —— 2.1.88 默认 32768", "claude.ts:1593-1594"]]),
      ]),
      n("t2h2", "adaptive thinking", 190, [["hasThinking=thinkingConfig.type!=='disabled'&&!CLAUDE_CODE_DISABLE_THINKING;模型支持 adaptive→{type:'adaptive'}(无预算 :1604-1613)", "claude.ts:1604-1613"]], [
        n("t2h2a", "adaptive 模式", 190, [["模型支持时 {type:'adaptive'}，不传 budget", "claude.ts:1604-1613"]]),
        n("t2h2b", "enabled + budget", 190, [["否则 {type:'enabled',budget_tokens:thinkBudget}(getMaxThinkingTokensForModel,可覆盖,Math.min(maxOutputTokens-1) :1614-1629)", "claude.ts:1614-1629"]]),
      ]),
      n("t2h3", "latched headers", 190, [["缓存键稳定关键：四类 header 首次发送后整会话锁定", "claude.ts:1405-1456"]], [
        n("t2h3a", "AFK", 190, [["AFK betas 首发送后锁定", "claude.ts:1405"]]),
        n("t2h3b", "fast-mode", 190, [["快速模式 betas 锁定", "claude.ts:1405"]]),
        n("t2h3c", "cache-editing", 190, [["缓存编辑 betas 锁定", "claude.ts:1405"]]),
        n("t2h3d", "thinking-clear", 190, [["清除 thinking 锁定", "claude.ts:1405"]]),
        n("t2h3e", "重置点", 190, [["/clear 与 /compact 时 clearBetaHeaderLatches() 重置", "claude.ts:1405-1456"]]),
      ]),
      n("t2h4", "返回 body", 190, [["model/messages(addCacheBreakpoints)/system/tools:allTools/tool_choice/betas/metadata/max_tokens/thinking/temperature(仅无thinking)/context_management/extraBodyParams/output_config/speed(:1699-1728)", "claude.ts:1699-1728"]], [
        n("t2h4a", "context_management 相关", 190, [["context_management(:1559-1580)、effort(:1632-1637)、task_budget(:1645-1657)、speed(:1571-1575)", "claude.ts:1559-1657"]]),
      ]),
    ]),
    n("t2i", "提交链与调用线", 190, [["从用户输入到第一响应进入点的完整函数链", "query.ts:263-708"]], [
      n("t2i1", "查询链", 190, [["REPL.onSubmit(REPL.tsx:3142)→handlePromptSubmit(utils/handlePromptSubmit.ts:396)→executeUserInput→processUserInput(:85)→onQuery(REPL.tsx:2855)→onQueryImpl(:2661)→buildEffectiveSystemPrompt(systemPrompt.ts:41)→query()(query.ts:263)→queryLoop(:266)→appendSystemContext(query.ts:449)→prependUserContext(query.ts:660)→deps.callModel(query.ts:659-708)", "query.ts:263-708"]]),
      n("t2i2", "模型调用包装", 190, [["deps.callModel=queryModelWithStreaming(query/deps.ts:35)→queryModel(claude.ts:1017)→拼 systemPrompt=[attributionHeader,getCLISyspromptPrefix(),...system](claude.ts:1358-1369)→buildSystemPromptBlocks(:1376-1379)→paramsFromContext(:1538-1729)", "query/deps.ts:35"]], [
        n("t2i2a", "第一响应进入点", 190, [["anthropic.beta.messages.create({...params,stream:true},{signal}).withResponse()(claude.ts:1822-1832)；result.data=原生流 Stream<BetaRawMessageStreamEvent>(:1834-1836)", "claude.ts:1822-1836"]]),
        n("t2i2b", "retry 包裹", 190, [["withRetry/withRequestRetry 包裹创建客户端与 create(:1735-1846)；paramsFromContext 多次调用(logging/retries 注释 :1528-1530)；clientRequestId 仅 firstParty+官方 base 生成(:1813-1816)", "claude.ts:1735-1846"]]),
      ]),
    ]),
  ]),

  /* ================= 3 主循环 ================= */
  n("t3", "③ 主循环 while(true)", 330, [
    ["事件分发 → 工具? → 结束? → 超窗口压缩? → 回到 call-model；消息级 cache marker 与重试降级", "query.ts:241"],
  ], [
    n("t3a", "State 与轮次", 330, [["QueryParams(query.ts:204-214)：messages/toolUseContext/systemPrompt/userContext/systemContext/canUseTool/fallbackModel/querySource/maxOutputTokensOverride/maxTurns/skipCacheWrite/taskBudget；State(:265-277) 含 autoCompactTracking/maxOutputTokensRecoveryCount/hasAttemptedReactiveCompact/stopHookActive/turnCount/transition(Continue)；每轮解构，continue 处整体替换", "query.ts:204-277"]]),
    n("t3b", "流式事件分发", 330, [["content_block_* 渲染/定型，message_delta 属性突变，message_stop 判结束", "claude.ts:2192-2293"]], [
      n("t3b1", "content_block_stop → AssistantMessage", 330, [["块结束定型为核心消息结构 claude.ts:2192-2210", "claude.ts:2192-2210"]]),
      n("t3b2", "message_delta 属性突变", 330, [["stop_reason/usage 等增量直接改在已定型消息上(:2213-2293)", "claude.ts:2213-2293"]]),
      n("t3b3", "结束判定", 330, [["message_stop 后判 needsFollowUp=!有 tool_use(content_block)；注意 stop_reason 从不被读取", "query.ts:553-558"]]),
    ]),
    n("t3c", "菱形：含 tool_use?", 330, [["事件流中出现 tool_use → 走工具路径(query.ts:834)；否则模型已出最终回复 → needsFollowUp=false 判定退出", "query.ts:834"]]),
    n("t3d", "菱形：上下文超窗口", 330, [["ContextWindow 超出(≈窗口−13k)→触发压缩，处理后断点恢复、换出窗口继续，回到 ⑦ call-model(压缩 loop 线)", "query.ts:365-467"]], [
      n("t3d1", "①boundary 切割", 330, [["按块边界确定可压缩范围", "query.ts:365-467"]]),
      n("t3d2", "②tool_result budget", 330, [["给工具结果分配预算优先裁剪", "query.ts:365-467"]]),
      n("t3d3", "③snip", 330, [["行级截断瘦身", "query.ts:365-467"]]),
      n("t3d4", "④micro 压缩", 330, [["微压缩：保留已定型消息结构", "query.ts:365-467"]]),
      n("t3d5", "⑤collapse → autocompact", 330, [["整段折叠；仍不够 → autocompact 兜底指令压缩", "query.ts:365-467"]]),
      n("t3d6", "阈值与断点", 330, [["autoCompact 阈值 = 窗口 − 13k；压缩提交后保留 lastSummarizedMessageId 之后的原样消息", "sessionMemoryCompact.ts:514-570"]]),
    ]),
    n("t3e", "消息级 cache marker(唯一)", 330, [["addCacheBreakpoints(claude.ts:3063-3211)：markerIndex=messages.length-1（skipCacheWrite 时 -2）；注释 :3078-3089「mycro KV 单 marker 原则」；message 级 cache_control 只有一个", "claude.ts:3063-3211"]]),
    n("t3f", "重试与降级", 330, [["withRetry + 模型降级 fallback", "withRetry.ts"]], [
      n("t3f1", "withRetry 参数", 330, [["MAX_RETRIES=10、BASE=500ms、backoff=500·2^(n-1)、cap 32s、jitter≤25%", "withRetry.ts"]], [
        n("t3f1a", "重试上限", 330, [["最多 10 次", "withRetry.ts"]]),
        n("t3f1b", "指数退避", 330, [["500ms · 2^(n-1)，封顶 32s", "withRetry.ts"]]),
        n("t3f1c", "抖动", 330, [["jitter ≤ 25% 打散重试风暴", "withRetry.ts"]]),
      ]),
      n("t3f2", "fallback 降级", 330, [["query.ts:650-954：nonstreaming-only-3-degradations(非流式三次降级链)", "query.ts:650-954"]]),
    ]),
    n("t3g", "唯一出口链", 330, [["needsFollowUp=false → PT 恢复 → hooks → 返回 completed", "query.ts:1070-1357"]], [
      n("t3g1", "正常完成", 330, [["needsFollowUp=false → 恢复 PT 继续尝试(:1070-1212) → handleStopHooks(:1267) → stop_hook_prevented(:1278-1280)/stop_hook_blocking 重组续跑(:1282-1306) → 返回 {reason:'completed'}(:1357)", "query.ts:1070-1357"]]),
      n("t3g2", "max_turns", 330, [["达到轮次上限退出", "query.ts:1711"]]),
      n("t3g3", "aborted_tools / blocking_limit", 330, [["工具中止 / 阻塞限制触发退出", "query.ts:1515,646"]]),
      n("t3g4", "model_error / aborted_streaming", 330, [["模型错误或流中止退出", "query.ts:996,1051"]]),
    ]),
  ]),

  /* ================= 4 工具执行 ================= */
  n("t4", "④ 工具执行", 40, [
    ["权限链 → hook 链 → 三类工具实现 → is_error 回填 → 带回事件环继续", ""],
  ], [
    n("t4a", "权限链十层", 40, [["permissions.ts:1158-1319 判定顺序，逐层简易检查直至命中", "permissions.ts:1158-1319"]], [
      n("t4a01", "①deny", 40, [["硬拒绝，最高优先级", "permissions.ts:1158-1319"]]),
      n("t4a02", "②ask", 40, [["直接询问用户", "permissions.ts:1158-1319"]]),
      n("t4a03", "③自查", 40, [["工具自带 allow 自查", "permissions.ts:1158-1319"]]),
      n("t4a04", "④1d", 40, [["会话内记住的授权(1 天)"], ]),
      n("t4a05", "⑤requiresUserInteraction", 40, [["必须 UI 等待输入(useCanUseTool 缝隙)", "permissions.ts:1158-1319"]]),
      n("t4a06", "⑥content ask", 40, [["对内容敏感的 ask", "permissions.ts:1158-1319"]]),
      n("t4a07", "⑦safetyCheck", 40, [["规则引擎弹性检查", "permissions.ts:1158-1319"]]),
      n("t4a08", "⑧bypass", 40, [["bypass-permissions 模式放行", "permissions.ts:1158-1319"]]),
      n("t4a09", "⑨alwaysAllowed", 40, [["总放行白名单", "permissions.ts:1158-1319"]]),
      n("t4a10", "⑩passthrough", 40, [["直放(最后兜底)", "permissions.ts:1158-1319"]]),
      n("t4a11", "5 permission queues", 40, [["中央权限队列 + 群组优先级，多个等待中的权限请求按 focus 策略弹出", "REPL.tsx"]]),
    ]),
    n("t4b", "Hook 链", 40, [["PreToolUse/PostToolUse 执行时机与优先级", "query.ts:1267-1306"]], [
      n("t4b1", "deny 优先语义", 40, [["toolHooks.ts:332 关键：hook 的 allow 不能绕过 deny(deny 优先)", "toolHooks.ts:332"]]),
      n("t4b2", "stop hooks", 40, [["stop_hook_prevented(:1278-1280)/stop_hook_blocking 重组续跑(:1282-1306)", "query.ts:1278-1306"]]),
      n("t4b3", "PostToolUse 回填", 40, [["工具结果回填后带回事件环 C 继续(feed loop 线:tool_result 已回填 → 请下一帧用 model 续)，直到无 tool_use", "query.ts"]]),
    ]),
    n("t4c", "三类工具实现", 40, [["toolExecution.ts 分流：内置 / MCP / SkillTool / subagent", "toolExecution.ts:1207"]], [
      n("t4c1", "内置工具契约", 40, [["Tool.ts:362-695：maxResultSizeChars 必填(is_input_schema 要求)", "Tool.ts:362-695"]], [
        n("t4c1a", "Bash 超时", 40, [["默认 120s / 600s 超时(视参数)", "Tool.ts"]]),
        n("t4c1b", "结果尺寸限制", 40, [["maxResultSizeChars 必填字段，超限截断", "Tool.ts:362-695"]]),
      ]),
      n("t4c2", "SkillTool", 40, [["tools.ts:212 注册，fork/inline 两种执行形态", "tools.ts:212"]]),
      n("t4c3", "subagent", 40, [["Agent 工具 aliases ['Task']；in-process 新 query 运行(runAgent.ts:748-757)；sidechain 转录 <sessionDir>/subagents/agent-<id>.jsonl；SubagentStop 信号(query.ts:1062)", "runAgent.ts:748-757"]]),
    ]),
    n("t4d", "错误回填", 40, [["is_error → <tool_use_error> 包在 tool_result 回填", "query.ts"]]),
  ]),

  /* ================= 5 Skills ================= */
  n("t5", "⑤ Skills", 260, [
    ["加载链、skill_listing 附件、模板展开、invoked_skills 恢复", ""],
  ], [
    n("t5a", "加载顺序", 260, [["getSkillDirCommands(memoize,loadSkillsDir.ts:638)：注入目录=受管~/.claude/skills→用户→项目逐级向上(cwd 最近优先)→--add-dir；dedupe first-wins(:742-763)", "loadSkillsDir.ts:638-804"]], [
      n("t5a1", "目录优先级", 260, [["受管 policySkills → 用户 → 项目逐级 → --add-dir(getProjectDirsUpToHome 向上递归 :717-723)", "loadSkillsDir.ts:717-723"]]),
      n("t5a2", "dedupe first-wins", 260, [["同名技能先到者胜出(:742-763)", "loadSkillsDir.ts:742-763"]]),
      n("t5a3", "conditional/path-scoped", 260, [["条件与作用域技能(:774-796)", "loadSkillsDir.ts:774-796"]]),
      n("t5a4", "legacy commands 目录", 260, [["loadSkillsFromCommandsDir 兼容 ~/.claude/commands/(:566-623)", "loadSkillsDir.ts:566-623"]]),
      n("t5a5", "SKILL.md → 命令转换", 260, [["createSkillCommand 把 SKILL.md 转命令(:270-390)", "loadSkillsDir.ts:270-390"]]),
    ]),
    n("t5b", "skill_listing 附件", 260, [["附件 1% 窗口 / 250 chars 截断，三层(受管 userSkillSettings 逐级收敛)", "attachments.ts"]], [
      n("t5b1", "窗口与截断", 260, [["1% 窗口预算 / 250 字符上限", "attachments.ts"]]),
      n("t5b2", "三层收敛", 260, [["受管→用户→项目 userSkillSettings 合并", "attachments.ts"]]),
    ]),
    n("t5c", "模板展开 substituteArguments", 260, [["$ARGUMENTS / $ARGUMENTS[N] / $N(旧式) / $NAME；无占位符自动追加 \\n\\nARGUMENTS: {args}", "argumentSubstitution.ts:94-145"]], [
      n("t5c1", "{}-花括号语法废弃", 260, [["{INPUT}/{ARGUMENTS} 旧语法本版不再识别", "argumentSubstitution.ts:94-145"]]),
      n("t5c2", "内置变量", 260, [["${CLAUDE_SKILL_DIR}(loadSkillsDir.ts:360)、${CLAUDE_SESSION_ID}(:366)", "loadSkillsDir.ts:360-366"]]),
    ]),
    n("t5d", "invoked_skills 恢复", 260, [["restoreSkillStateFromMessages：遍历 attachment 中 type:'invoked_skills' 块灌回 STATE.invokedSkills(bootstrap/state.ts:1517 addInvokedSkill)；消费 skill_listing 抑制重复 announce", "sessionRestore.ts:556-558"]]),
  ]),

  /* ================= 6 Subagents ================= */
  n("t6", "⑥ Subagents", 280, [
    ["Agent 工具、in-process 执行、sidechain 转录、quit 信号", ""],
  ], [
    n("t6a", "Agent 工具", 280, [["tools.ts 定义 AgentTool，aliases ['Task']；注册进工具数组随请求体下发，模型可用它派生子 agent", "tools.ts"]]),
    n("t6b", "执行模型", 280, [["in-process 新 query 运行(runAgent.ts:748-757)——不是独立进程，子循环借用主引擎；携带独立 toolUseContext.agentId", "runAgent.ts:748"]]),
    n("t6c", "转录", 280, [["sidechain transcript 落 <sessionDir>/subagents/agent-<id>.jsonl(main sidechain 之外的第 2 条转录流)", "runAgent.ts"]]),
    n("t6d", "退出", 280, [["subagent 返回(messages 处有 agent 标记)→SubagentStop 信号(query.ts:1062)→主循环以待处理工具列表继续", "query.ts:1062"]]),
  ]),

  /* ================= 7 Plugins ================= */
  n("t7", "⑦ Plugins", 320, [
    ["三层来源、命名空间、自动更新、注册面", ""],
  ], [
    n("t7a", "三层", 320, [["受管 ~/.claude/plugins + 用户层 + 项目层(.claude/plugins)", ""]]),
    n("t7b", "命名", 320, [["工具/命令 {pluginName}:{namespace}:{name} 三段式隔离，防全局命名冲突", ""]]),
    n("t7c", "更新", 320, [["marketplace 校验版本 → 自动更新；\"Restart to apply changes\"——重启后加载新版本", ""]]),
    n("t7d", "注册面", 320, [["插件可注册 commands/skills/tools/agents/hooks，随 loadAllCommands 命令池参与排序", "commands.ts:449-469"]]),
  ]),

  /* ================= 8 MCP ================= */
  n("t8", "⑧ MCP", 20, [
    ["命名隔离、transport 并发、连接超时、与全局缓存互斥", ""],
  ], [
    n("t8a", "命名", 20, [["工具名 mcp__server__tool 三段式，严格隔离不同 server 的同名工具", ""]]),
    n("t8b", "transport 表", 20, [["远端每条 server 并发上限与本地 stdio 并发上限不同", ""]], [
      n("t8b1", "remote(SSE/HTTP)", 20, [["单 server 20 并发请求限制", ""]]),
      n("t8b2", "local stdio", 20, [["3 并发；stdio 需权限审批", ""]]),
    ]),
    n("t8c", "连接", 20, [["30s connect timeout；构建客户端读 claude_desktop_config.json / mcp.json；headless -p 亦支持(在 print 路径建立)", ""]]),
    n("t8d", "动态段与附件", 20, [["mcp_instructions 动态段(DANGEROUS_uncached)、mcp_resources 附件、skill_discovery 附件", "prompts.ts:513-519"]]),
    n("t8e", "与缓存互斥", 20, [["MCP 工具存在时全局缓存模式降级为 globalCacheStrategy:'none'(模式B)", "claude.ts:1212-1214"]]),
  ]),

  /* ================= 9 UI / REPL ================= */
  n("t9", "⑨ UI / REPL", 150, [
    ["REPL 状态缝、权限队列、提交链、命令面板", ""],
  ], [
    n("t9a", "REPL 组成", 150, [["REPL.tsx:2584 six setters(六个重处理 setter)；3 条 UI→loop 边；useCanUseTool=等待权限的 UI 缝隙", "REPL.tsx:2584"]], [
      n("t9a1", "six setters", 150, [["六个 re-process setter 驱动 UI 状态", "REPL.tsx:2584"]]),
      n("t9a2", "useCanUseTool 缝隙", 150, [["权限等待期间 UI 可以先渲染(可取消/排队)", "REPL.tsx:2584"]]),
    ]),
    n("t9b", "PromptInput 提交链", 150, [["PromptInput onSubmit(PromptInput.tsx:984)→handlePromptSubmit(:120)→executeUserInput(:396)→processUserInput(:85)→processSlashCommand(:309)；排队项 messageQueueManager.ts:541", "PromptInput.tsx:984"]], [
      n("t9b1", "忙时排队", 150, [["queryGuard 忙时进队列，空闲立即执行；local-jsx 且 immediate:true 例外(:227-311)", "handlePromptSubmit.tsx:150-311"]]),
    ]),
    n("t9c", "手柄类型与退出", 150, [["PromiseActivation / ManualActivationHandler 两种工具确认外观", "REPL.tsx"]], [
      n("t9c1", "handleExit", 150, [["REPL.tsx:3622-3651：设 isExiting→bg 会话 detach→有 worktree 弹 ExitFlow(内 onDone→gracefulShutdown(0,'prompt_input_exit'))→否则 exitMod.call；/exit/quit/ctrl+c/ctrl+d 都路由进来(exit.tsx:15-17)", "REPL.tsx:3622-3651"]]),
    ]),
    n("t9d", "命令面板", 150, [["全局键 ctrl+shift+p / cmd+shift+p → app:quickOpen(defaultBindings.ts:32)", "defaultBindings.ts:32"]], [
      n("t9d1", "fuzzy 匹配", 150, [["Fuse.js 核心 generateCommandSuggestions(commandSuggestions.ts:292,378-498)", "commandSuggestions.ts:292-498"]]),
      n("t9d2", "排序", 150, [["recently>builtin>user>project>policy>other(:372-379)；回车应用+执行 applyCommandSuggestion", "commandSuggestions.ts:372-379"]]),
      n("t9d3", "建议写回", 150, [["findMidInputSlashCommand(:114)/getBestCommandMatch(:164)/applyCommandSuggestion(写回输入 :503-539)", "commandSuggestions.ts:114-539"]]),
    ]),
  ]),

  /* ================= 10 telemetry + cost ================= */
  n("t10", "⑩ Telemetry + Cost", 220, [
    ["1P 事件流、OTel 延迟化、560+ tengu_ 锚点、成本结算与恢复", ""],
  ], [
    n("t10a", "logEvent 上报", 220, [["1P events 统一事件流；batch POST 批量上报；失败落盘 1p_failed_events(磁盘队列下次重发)", ""]], [
      n("t10a1", "batch POST", 220, [["批量组包发送", ""]]),
      n("t10a2", "失败重放", 220, [["1p_failed_events 磁盘队列", ""]]),
    ]),
    n("t10b", "OTel", 220, [["initializeTelemetryAfterTrust 延迟加载 ~400KB；setMeterState 维护会话计数", "init.ts:288-338"]]),
    n("t10c", "tengu_ 生命周期锚点", 220, [["560+ tengu_ 事件中的三个关键时间点", "setup.ts:444-477"]], [
      n("t10c1", "tengu_init", 220, [["main.tsx:4562 logTenguInit(定义 :4514,调用 :2496)", "main.tsx:4562"]]),
      n("t10c2", "tengu_started", 220, [["setup.ts:378 initSinks 后首个事件", "setup.ts:378"]]),
      n("t10c3", "tengu_exit(跨进程)", 220, [["setup.ts:444-477 读上一进程存的 last_session_id，故意不清空支持成本恢复(:473-475)；datadog.ts:34 收 tengu_exit", "setup.ts:444-477"]]),
    ]),
    n("t10d", "成本结算", 220, [["addToTotalSessionCost 在 cost-tracker.ts:278-323(更正：bootstrap/state.ts:557 是 addToTotalCostState,STATE.modelUsage/totalCostUSD :557-564)；调用点 claude.ts:2252、:2825、services/vcr.ts:172", "cost-tracker.ts:278-323"]], [
      n("t10d1", "持久化链", 220, [["costHook.ts:17 process.on('exit')→saveCurrentSessionCosts(cost-tracker.ts:143-175)→config.ts:1625-1644 saveCurrentProjectConfig→~/.claude.json projects[absPath]", "costHook.ts:17"]]),
      n("t10d2", "局限", 220, [["useCostSummary 只在 REPL 挂载(REPL.tsx:3823)；-p 不注册 exit handler 写成本(靠 tengu_exit 下次启动上报)", "REPL.tsx:3823"]]),
      n("t10d3", "恢复", 220, [["resume 成本恢复仅 lastSessionId===sessionId(cost-tracker.ts:130-137)", "cost-tracker.ts:130-137"]]),
    ]),
  ]),

  /* ================= 11 记忆 / 转录 / 结束段 ================= */
  n("t11", "⑪ 记忆 / 转录 / 结束段", 90, [
    ["extractMemories → SessionMemory → autoDream → 转录落盘 → gracefulShutdown 全序列 → 会话恢复", ""],
  ], [
    n("t11a", "extractMemories(回合尾 fork)", 90, [["触发 stopHooks.ts:141-153：feature('EXTRACT_MEMORIES') && !toolUseContext.agentId && isExtractModeActive() → fire-and-forget", "stopHooks.ts:141-153"]], [
      n("t11a1", "gate 链 ①编译期", 90, [["feature('EXTRACT_MEMORIES') 编译期常量；require 条件加载保证 tree-shake", "stopHooks.ts:42-44"]]),
      n("t11a2", "gate 链 ②isExtractModeActive", 90, [["GrowthBook tengu_passport_quail && (!非交互 || tengu_slate_thimble)(paths.ts:69-77)", "paths.ts:69-77"]]),
      n("t11a3", "gate 链 ③isAutoMemoryEnabled", 90, [["paths.ts:30-55 自动记忆开关", "paths.ts:30-55"]]),
      n("t11a4", "gate 链 ④remote 跳过", 90, [["远端会话不提取(extractMemories.ts:550-552)", "extractMemories.ts:550-552"]]),
      n("t11a5", "互斥核心", 90, [["hasMemoryWritesSince(extractMemories.ts:348-360)：主 agent 已写 auto-memory 则跳过 fork——主 agent 与后台 agent 每回合二选一(:112-148)", "extractMemories.ts:348-360"]], [
        n("t11a5a", "节流", 90, [["tengu_bramble_lintel 默认每 N 回合跑一次(默认 1 轮)(:377-386)", "extractMemories.ts:377-386"]]),
        n("t11a5b", "并发 stash", 90, [["并发提取 stash 进 pendingContext，完成后 trailing run(:557-564、:506-521)", "extractMemories.ts:557-564"]]),
      ]),
      n("t11a6", "fork 参数", 90, [["skipTranscript:true, maxTurns:5(:415-427, querySource:'extract_memories')", "extractMemories.ts:415-427"]]),
      n("t11a7", "写入面", 90, [["createAutoMemCanUseTool(memoryDir)(:171-222)：Read/Grep/Glob 全放、Edit/Write 仅 isAutoMemPath(:206-215)——产物只会落在 auto-memory 目录；前置 scanMemoryFiles+formatMemoryManifest(:398-400)；MEMORY.md 本身不算 memory file(:465-467)", "extractMemories.ts:171-467"]]),
      n("t11a8", "-p 关闭前 drain", 90, [["drainPendingExtraction(timeoutMs=60s)(:579-586,:611-615)；print.ts:962-969 调用；成功注入 createMemorySavedMessage(:490-496)；事件 tengu_extract_memories_extraction(:473-485)", "print.ts:962-969"]]),
    ]),
    n("t11b", "SessionMemory(同会话摘要)", 90, [["写 {projectDir}/{sessionId}/session-memory/summary.md(mode 0o600, filesystem.ts:261-270)；自动触发 registerPostSamplingHook(extractSessionMemory)(sessionMemory.ts:372-375)；gate:querySource==='repl_main_thread' && feature 'tengu_session_memory'(cached 非阻塞 :277-291)；auto-compact 关闭则不注册(:357-375)", "sessionMemory.ts:277-375"]], [
      n("t11b1", "阈值", 90, [["初始 >minimumMessageTokensToInit(默认 10000)；增量 >minimumTokensBetweenUpdate(默认 5000) 且(工具调用≥3 或最后一条无 tool_use)(:134-181)；默认 sessionMemoryUtils.ts:32-36", "sessionMemory.ts:134-181"]]),
      n("t11b2", "fork 与下游", 90, [["createMemoryFileCanUseTool 只许 Edit 恰好一份 memory 文件(:460-482),querySource='session_memory'", "sessionMemory.ts:460-482"]], [
        n("t11b2a", "压缩联动", 90, [["services/compact/sessionMemoryCompact.ts:514-570(保留 lastSummarizedMessageId 之后+summary 的压缩)", "sessionMemoryCompact.ts:514-570"]]),
        n("t11b2b", "away/技能下游", 90, [["services/awaySummary.ts:38(away 归来卡片)；skills/bundled/skillify.ts:181", "awaySummary.ts:38"]]),
      ]),
      n("t11b3", "/summary 已 stub", 90, [["commands/summary/index.js 内容 export default { isEnabled:()=>false, isHidden:true, name:'stub' }；manuallyExtractSessionMemory(sessionMemory.ts:387-453) 不可达死代码", "commands/summary"]]),
    ]),
    n("t11c", "autoDream(后台浓缩)", 90, [["不是夜间定时——stopHooks.ts:154-156 回合末顺带检查", "autoDream.ts:5-8"]], [
      n("t11c1", "gate 链", 90, [["isGateOpen(:95-100 →KAIROS/remote/autoMem/autoDreamEnabled)→readLastConsolidatedAt(:133-141)→会话扫描节流 10 分钟(:56,:143-151)→listSessionsTouchedSince(:156-171)→tryAcquireConsolidationLock(:182-189)", "autoDream.ts:95-189"]]),
      n("t11c2", "阈值", 90, [["tengu_onyx_plover DEFAULTS minHours:24 / minSessions:5(:63-66、:73-93)；开关 config.ts:13-21", "autoDream.ts:63-93"]]),
      n("t11c3", "锁", 90, [["consolidationLock.ts：.consolidate-lock mtime=lastConsolidatedAt(:29-36)、body=持有者 PID；获取:若 mtime<1h 且 PID 活→拒绝,否则写自己 PID 再读回校验(:46-84),HOLDER_STALE_MS=60min", "consolidationLock.ts:46-84"]], [
        n("t11c3a", "回滚", 90, [["失败 rollbackConsolidationLock 倒回 mtime+清 PID(:91-108)；崩溃死 PID 由下一进程抢占；/dream 打点 recordConsolidation(:130-140)", "consolidationLock.ts:91-140"]]),
      ]),
      n("t11c4", "产物", 90, [["全目录浓缩(daily log→漂移记忆→转录 grep)，MEMORY.md 收敛到 <200 行/~25KB(consolidationPrompt.ts:33-60)；fork 复用 createAutoMemCanUseTool(autoDream.ts:227),querySource:'auto_dream',skipTranscript:true", "consolidationPrompt.ts:33-60"]], [
        n("t11c4a", "进度反馈", 90, [["registerDreamTask(:204-208,tasks/DreamTask/DreamTask.ts)；makeDreamProgressWatcher 喂 bg-tasks 面板(:281-313)；完成时 completeDreamTask+注入 Improved N files(:235-248)", "autoDream.ts:204-313"]]),
        n("t11c4b", "用户 kill", 90, [["用户 kill→回滚过锁不再重复(:258-265)；fork 失败→failDreamTask+rollbackConsolidationLock 让时间 gate 重开(:266-271)", "autoDream.ts:258-271"]]),
      ]),
    ]),
    n("t11d", "转录落盘", 90, [["getTranscriptPath={projectDir}/{sessionId}.jsonl(:202-205)；单例 Project 写队列", "sessionStorage.ts:202-205"]], [
      n("t11d1", "CPU 写队列", 90, [["enqueueWrite(:606-616)→scheduleDrain 100ms 批量(:618-632)→appendToFile 0600(:634-643)→按 100KB chunk 分批 resolve(:645-686)；recordTranscript(:1408) 入队", "sessionStorage.ts:606-686"]]),
      n("t11d2", "进循环前先落盘", 90, [["QueryEngine 进循环前先持久化用户消息(:436-463)，冷启动 kill 后转录仍可 resume；--bare fire-and-forget；EAGER_FLUSH/Cowork 立即 flush(:457-461)；循环内记录 :609/:712/:728-730/:780/:834", "query.ts:436-463"]]),
      n("t11d3", "退出时落盘", 90, [["getProject 把 flush()+reAppendSessionMetadata() 注册 cleanup(:449-464)；flush 清定时器/等 activeDrain/排空队列/等 pending 归零(:841-861)", "sessionStorage.ts:449-464"]], [
        n("t11d3a", "尾部 64KB", 90, [["reAppend 让 customTitle/tag 出现在末尾 64KB 窗口供 --resume 读(:693-711、:1158)", "sessionStorage.ts:693-711"]]),
        n("t11d3b", "无 SetSessionId", 90, [["sessionId 由 switchSession/regenerateSessionId(bootstrap/state.ts:435-478) 管", "bootstrap/state.ts:435-478"]]),
      ]),
    ]),
    n("t11e", "gracefulShutdown 全序列(11 步)", 90, [["启动到强制退出的每一步", "gracefulShutdown.ts:391-523"]], [
      n("t11e01", "①幂等守卫", 90, [["shutdownInProgress 防止重复执行", "gracefulShutdown.ts:401-404"]]),
      n("t11e02", "②hook 预算 + failsafe 挂起", 90, [["算 SessionEnd hook 预算+挂 failsafe(:406-412；getSessionEndHookTimeoutMs hooks.ts:176 默认约 1.5s)", "gracefulShutdown.ts:406-412"]]),
      n("t11e03", "③Failsafe 兜底", 90, [["setTimeout(max(5000, sessionEnd+3500))，超时→cleanupTerminalModes+printResumeHint+forceExit", "gracefulShutdown.ts:417-427"]]),
      n("t11e04", "④清终端 + resume hint", 90, [["先清终端+打印 resume hint，用户可恢复", "gracefulShutdown.ts:436-437"]]),
      n("t11e05", "⑤runCleanupFunctions 2s 竞速", 90, [["getProject cleanup(flush+reAppend) 等全部清理函数 2s 时限内尽量跑完", "gracefulShutdown.ts:444-467"]]),
      n("t11e06", "⑥SessionEnd hooks", 90, [["AbortSignal.timeout 预算；ExitReason 枚举 ['clear','resume','logout','prompt_input_exit','other','bypass_permissions_disabled'](coreSchemas.ts:747-754)", "gracefulShutdown.ts:472-480"]]),
      n("t11e07", "⑦profileReport", 90, [["性能上报", "gracefulShutdown.ts:483-487"]]),
      n("t11e08", "⑧tengu_cache_eviction_hint", 90, [["scope=session_end，仅 getLastMainRequestId 非空(:489-499)", "gracefulShutdown.ts:489-499"]]),
      n("t11e09", "⑨1P+datadog flush 与 500ms 竞速", 90, [["遥测 flush 与 sleep 500ms 抢先完成者胜", "gracefulShutdown.ts:504-511"]]),
      n("t11e10", "⑩finalMessage", 90, [["可选 finalMessage 写 stderr(:513-520)", "gracefulShutdown.ts:513-520"]]),
      n("t11e11", "⑪forceExit", 90, [["最终强制退出(:522)", "gracefulShutdown.ts:522"]]),
      n("t11e12", "forceExit 与 SIGKILL 保护", 90, [["清 failsafe timer+drain stdin(:199-212)；process.exit 抛错(死终端 EIO,Bun flush 失败)时生产回退 process.kill(pid,'SIGKILL')(:221-223)——没有 retryableWrite/MICROAPP_PENDING_WRITES/whenCaptive(grep 全仓零命中)", "gracefulShutdown.ts:193-232"]]),
      n("t11e13", "信号分支", 90, [["不同信号的退出码与分支处理", "gracefulShutdown.ts:256-333"]], [
        n("t11e13a", "SIGINT", 90, [["gracefulShutdown(0)；-p 自己注册 SIGINT 返回避免竞争(:262-264)", "gracefulShutdown.ts:262-264"]]),
        n("t11e13b", "SIGTERM", 90, [["退出码 143(:268-271)", "gracefulShutdown.ts:268-271"]]),
        n("t11e13c", "SIGHUP", 90, [["退出码 129 + 孤儿检测每 30s 查 stdin/out(:272-296)", "gracefulShutdown.ts:272-296"]]),
        n("t11e13d", "uncaught 只上报", 90, [["uncaughtException/unhandledRejection 只上报不退出(:301-333)", "gracefulShutdown.ts:301-333"]]),
      ]),
    ]),
    n("t11f", "会话恢复", 90, [["conversationRecovery.ts:456-586 loadConversationForResume；source 三态：undefined=--continue/字符串=sessionId/LogOption；无 miniTranscript——最近=尾部 64KB 读取(listSessionsImpl.ts:118)", "conversationRecovery.ts:456-540"]], [
      n("t11f1", "三态 source", 90, [["undefined=--continue(取最近会话，跳过 live bg/daemon :487-512)/字符串=sessionId(getLastSessionLog :520-523)/LogOption 或 .jsonl 路径(:513-519,loadMessagesFromJsonlPath :416-440)", "conversationRecovery.ts:487-540"]]),
      n("t11f2", "读取与重建", 90, [["lite log 扩为 full(:535-537)；findRecentLeaf/sidechain→buildConversationChain→removeExtraFields(:406-415)", "conversationRecovery.ts:406-537"]]),
      n("t11f3", "恢复字段", 90, [["messages/fileHistorySnapshots/attributionSnapshots/contentReplacements/contextCollapseCommits/sessionId/agentName/agentColor/agentSetting(restoreAgentFromSession :200-242)/customTitle/tag/mode(coordinator/normal :514-516)/worktreeSession(restoreWorktreeForResume :332-366)/成本仅 lastSessionId===sessionId(cost-tracker.ts:130-137)", "sessionRestore.ts:409-551"]]),
      n("t11f4", "恢复前 skill 状态", 90, [["restoreSkillStateFromMessages(:556-558)：遍历 invoked_skills 附件块灌回 STATE.invokedSkills(bootstrap/state.ts:1517)", "conversationRecovery.ts:556-558"]]),
    ]),
    n("t11g", "记忆澄清", 90, [["不存在独立「用户级记忆目录」：type:user/feedback/project/reference(memoryTypes.ts:14-19) 只是 frontmatter 语义分类；第二目录只有团队 memory/team/", "memoryTypes.ts:14-19"]], [
      n("t11g1", "路径计算", 90, [["getMemoryBaseDir=CCR 覆盖 else ~/.claude(paths.ts:85-90)；getAutoMemBase=findCanonicalGitRoot(worktree 共享 :203-205)；getAutoMemPath=<base>/projects/<sanitized-git-root>/memory/(:223-235)；getTeamMemPath=join(getAutoMemPath(),'team')(teamMemPaths.ts:84-86)", "paths.ts:85-235"]]),
      n("t11g2", "召回侧", 90, [["MEMORY.md 200 行/25KB 截断(确认)；buildMemoryPrompt 拼进系统提示(memdir.ts:272-316)；query-time findRelevantMemories+搜寻过去上下文(memdir.ts:375-407, feature tengu_coral_fern)", "memdir.ts:272-407"]]),
    ]),
  ]),

  /* ================= 12 命令行 / 命令系统 ================= */
  n("t12", "⑫ 命令行 / 命令系统", 200, [
    ["argv 路由、命令四型、命令池加载顺序、slash 解析、headless 退出码", ""],
  ], [
    n("t12a", "argv 全局路由", 200, [["CommanderCommand+configureHelp(createSortedHelpConfig)(main.tsx:902)；program.hook('preAction')(:907-967,profile/MCP 初始化/插件加载/迁移/设置同步 ~60 行)；全局 options(:968-1006)；--bare 首层处理(:1009-1012)；--prefill seedEarlyInput 注入首条输入(:1108-1110)", "main.tsx:902-1110"]], [
      n("t12a1", "三类 argv 重写", 200, [["cc:// deep-link(main.tsx:609-642，headless 重写 open 子命令 :623/交互剥离 URL :631)；--assistant 剥离(KAIROS :685-700)；claude ssh(:702-795，--continue/--resume 转发远端 :736)", "main.tsx:609-795"]]),
      n("t12a2", "print fast-path", 200, [["-p 且非 cc://：跳 52 子命令注册直接 parseAsync(:3883-3890)", "main.tsx:3883-3890"]]),
      n("t12a3", "子命令注册表", 200, [["mcp(:3894-3958)/open(cc:// 落地 :4059-4095)/auth(:4100-4136)/plugin(:4148-4265)/ssh stub(:4045-4052)/doctor(:4346)/update(:4362)/install(:4395)/completion(:4492)/parseAsync(:4504)", "main.tsx:3894-4504"]]),
    ]),
    n("t12b", "命令四型", 200, [["src/types/command.ts：PromptCommand(react)/LocalCommand(本地)/LocalJSXCommand(即时 UI)；CommandBase(:175-203)；isCommandEnabled(:214-216)", "command.ts:175-216"]]),
    n("t12c", "命令池加载顺序", 200, [["loadAllCommands 七段顺序", "commands.ts:449-469"]], [
      n("t12c1", "顺序", 200, [["bundledSkills→builtinPluginSkills→skillDirCommands→workflowCommands→pluginCommands→pluginSkills→COMMANDS()(:449-469)——同名冲突以更靠前胜出；findCommand 线性首匹配(:688)；远端过滤 filterCommandsForRemoteMode(:684-686)、isBridgeSafeCommand(:672-676)", "commands.ts:449-688"]]),
    ]),
    n("t12d", "processSlashCommand", 200, [["分解 {commandName,args,isMcp}(slashCommandParsing.ts:25-60，Mcp 名归一 name (MCP))；找不到→Unknown skill(:347)", "processSlashCommand.tsx:309-453"]], [
      n("t12d1", "三 type 分支", 200, [["local-jsx(本地渲染)/local/prompt(fork 执行 executeForkedSlashCommand :62,:728)；processPromptSlashCommand(:817-826,找不到抛 MalformedCommandError 'Unknown command: …' :820)", "processSlashCommand.tsx:728-826"]]),
      n("t12d2", "REPL 最终拦截", 200, [["activeRemote 时非 local-jsx 走 sendMessage(:3482)；local-jsx 即刻命令例外(:3420-3425)；本地落 handlePromptSubmit(:3490)", "REPL.tsx:3416-3490"]]),
    ]),
    n("t12e", "headless(-p) 退出码", 200, [["runHeadless(print.ts:455-974)：stdin 防堵(非交互必配 -p :729-732)；stdin 耗尽 gracefulShutdownSync(0)(:769)", "print.ts:455-974"]], [
      n("t12e1", "退出码规则", 200, [["主路径 gracefulShutdownSync(lastMessage?.type==='result'&&is_error?1:0)(:971-973)；显式退出 0(:502)/1(:569,575,583,608,623,748,761,783,791)；622-623 为 'other' 变体；5 秒 failsafe 注释(:964)", "print.ts:971-973"]]),
      n("t12e2", "输出编码", 200, [["structuredIO=getStructuredIO 决定输出编码器(:587)；--output-format=stream-json=NDJSON 编码器；SDK vs 单次 -p 共享同一 runHeadless，差异只由 outputFormat/sdkUrl 透传(main.tsx:2829-2852)", "print.ts:587"]]),
    ]),
    n("t12f", "/help 与辅助命令", 200, [["commands/help local-jsx → HelpV2(components/HelpV2/HelpV2.tsx)；命令池=getCommands 同一份；顶层 -h 由 commander configureHelp", "help.tsx:4-10"]], [
      n("t12f1", "辅助命令", 200, [["/init 引导偏好(type:'prompt')；/session local-jsx aliases:['remote'] 仅远端可见；/resume(index.ts:12,launchResumeChooser)；/restart 和 claude setup 在 2.1.88 未发现(重启=bundle 由 -c/--continue+/resume 承担)", "commands"]]),
    ]),
  ]),

  /* ================= 13 版本核实 ================= */
  n("t13", "⑬ 版本核实(BEST vs 2.1.88)", 0, [
    ["结论：BEST 不是更高的官方版本，是同一 2.1.88 的「可编译工程」", ""],
  ], [
    n("t13a", "判定", 0, [["BEST=官方 2.1.88 更完整的第三方可编译工程(还原+stub 补齐)，版本同号；不存在版本差异，存在「还原完整度」差异", "report13"]], [
      n("t13a1", "版本号", 0, [["BEST/package.json claude-js 1.0.3；BEST CLI MACRO.VERSION='2.1.888'(三个 8, cli.tsx:6, README:48 作者标识)；官方 2.1.88；git HEAD 时间是还原动作先后与发版无关(HEAD: BEST 503a40f 04-01/SM a8a678c 03-31)", "bundle"]]),
      n("t13a2", "同源", 0, [["main.tsx 4683==4683 逐字节一致；query.ts 1732 vs 1729 / claude.ts 3420 vs 3419 / QueryEngine 1320 vs 1295 差异全是 TS 类型补强(断言/守卫/类型桩)，非功能增删", "report13"]]),
      n("t13a3", "feature 计数", 0, [["BEST feature() 调用 1066 vs SM 1076(差异来自 BEST 改动行)；BEST scripts/create-type-stubs.mjs、fix-default-stubs.mjs 自动生成 stub(TS2305/TS2614)", "report13"]]),
    ]),
    n("t13b", "独有目录=stub", 0, [["6 功能目录(daemon/environment-runner/jobs/proactive/self-hosted-runner/ssh，10 文件全 `// Auto-generated stub — replace with real implementation`)+src/src 嵌套类型 stub 目录(39 文件)", "report13"]]),
    n("t13c", "feature() 恒 false", 0, [["BEST feature=(_name)=>false(cli.tsx:3) polyfill 运行时不可达；SM 是 bun:bundle 编译期宏值 false 分支整段 DCE——独有入口全是死代码；daemon 不对应 bridge(bridgeMain.ts SM 完整存在，gate 不同:DAEMON vs BRIDGE_MODE)", "report13"]], [
      n("t13c1", "悬空引用佐证", 0, [["SM 15 个文件引用缺失模块(cli.tsx:100,165,226,238→DAEMON 等；query.ts:69-70→jobs/classifier；print.ts:361-363→proactive；main.tsx:3203→ssh/createSSHSession)——官方 DCE 整段删除所以不在 source map，BEST 用 stub 补齐使 tsc/构建跑通", "report13"]]),
    ]),
    n("t13d", "无新功能", 0, [["SM tools/ 184 文件 == claw-code tools_snapshot 184 条一一对应；独有工具目录(MonitorTool/WorkflowTool 等)抽查为 {} 空对象，按 feature gate 注册(tools.ts:25-127)；无新命令/新工具/新版本", "report13"]]),
  ]),
]);