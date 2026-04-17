总体思路概览
目标: 在不“抄 PPT 文本”和“不自己编新知识点”的前提下，把 11.x 的内容变成一个“考前复习友好”的 notes 子 tab，结构和视觉风格与原 Chapter 11 完全一致。
1. 找到现有的结构模板
在 en/week_11_debugging.html 里先看两块：

tab 导航（notes 左侧）：

week_11_debugging.html
Lines 120-128
<nav class="tab-nav">
<button class="tab-btn active" onclick="switchTab('concepts',this)" type="button">Core concepts</button>
<button class="tab-btn" onclick="switchTab('process',this)" type="button">Process &amp; reports</button>
...
</nav>
对应的面板结构（每个 tab 都是一个 div.tab-panel，里面由若干 card 组成）：

week_11_debugging.html
Lines 183-199
<div class="tab-panel active" id="tab-concepts">
<div class="card">
  <div class="card-title">Failure, Fault and Debugging</div>
  <div class="keywords">...</div>
  <div class="tbl-wrap">... 表格 ...</div>
  <div class="card-body">... 总结句 ...</div>
  <div class="green-box">... exam tip ...</div>
</div>
</div>
这就是“标准样板”：tab 按钮 + 一个或多个概念卡片。

2. 设计新的 11.1 sub-tab 结构（信息架构）
对 11.1，我先从 11.1 Debugging Overview.md + 几张关键截图里抽出信息块，而不是逐行摘抄：

核心块大概是：

Learning Objectives（来自 01-learning-objectives.png + MD 开头）
Testing vs Debugging / Mistake-Fault-Error-Failure 链（来自 recall + from-testing-to-debugging.png）
Program Debugging：两大步骤 + root cause 可能在配置/数据/硬件
Re-test After Fix（fix 后要 re-test 的两个原因）
TRAFFIC 七步流程（06-debugging-process-traffic.png）
然后决定：这些块各自做一张 card，避免单卡过长；卡片标题和关键字用来“秒扫考点”。

3. 在 HTML 里如何“接”一个新 sub-tab
基于现有模式，新 tab 需要两部分：

导航按钮（告诉 JS 要切哪个 id）
在 tab-nav 里插入一个按钮，命名规则和 switchTab 一致：


week_11_debugging.html
Lines 130-167
<nav class="tab-nav">
<button class="tab-btn" onclick="switchTab('11-1-overview',this)" type="button">11.1 Overview</button>
<button class="tab-btn active" onclick="switchTab('concepts',this)" type="button">Core concepts</button>
...
</nav>
switchTab('11-1-overview', this) 对应下面面板的 id tab-11-1-overview
按钮本身只负责切换，不影响 quiz 部分
tab 面板本体（复习内容）

列在 tab-nav 之后、tab-concepts 之前，和其它 panel 并列：


week_11_debugging.html
Lines 130-182
<div class="tab-panel" id="tab-11-1-overview">
  <div class="card">
    <div class="card-title">11.1 Learning Objectives</div>
    <div class="keywords"><span class="kw green">Debugging</span>...</div>
    <ul class="blist">
      <li>List the <strong>two major steps</strong> in debugging.</li>
      ...
    </ul>
  </div>
  <div class="card">From Testing to Debugging ...</div>
  <div class="card">Why Re-test After a Fix ...</div>
  <div class="card">Debugging Process — TRAFFIC ...</div>
</div>
样式全部复用已有 class：

概念列表用 ul.blist
术语对比用 table + tbl-wrap
关键词用 keywords + kw / kw.green / kw.blue 等
4. “不抄 PPT / 不扩写”的处理原则
在写每一行文字时，我遵守两条：

不逐字复制 slide 文本：
用自己的短句归纳，例如 slide 里写两三行 bullet，我合成一句 “Main purpose is to find failures (symptoms...)”，让它更贴近 quiz 题干/选项风格。
不凭空扩展内容：
所有点都必须在 MD 或截图里出现过，只是：
压缩：删掉讲述式语气、例子中的细节
重组：把“讲故事顺序”变成“考点结构”（目的、定义、流程步骤）
5. 如果你要自己加 11.2，可以照抄这个套路
对于 11.2 Problem Tracker，可以按同样步骤：

从 source/week-11/11.2 Problem Tracker/11.2 Problem Tracker.md + 对应截图中，提炼出：
Learning Objectives：problem tracker 能做什么 / 为什么要写 problem report
Bug report 结构（environment, expected vs actual, history, duplicate IDs 等）
Bugzilla/issue tracker 的角色、不要和 debugger/IDE 混淆
在 nav.tab-nav 中再加一个按钮
例如 switchTab('11-2-problem-tracker', this)，文案 11.2 Problem Tracker
新建对应 panel：id="tab-11-2-problem-tracker"
至少 2–3 个 card：
11.2 Learning Objectives
Bug Report & Problem History
Bugzilla / Problem Tracker Role（配一个小表：Topic vs What to remember）
如果你切回 Agent 模式，我可以按这个方案直接帮你把 11.2 那个 sub-tab 写进去；
如果你想自己动手，我也可以给你一段“可直接粘贴再微调”的 HTML 雏形。

