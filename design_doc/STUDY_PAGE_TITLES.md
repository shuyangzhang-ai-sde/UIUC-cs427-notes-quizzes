# Study 合并页 — 设计文档与标题规范（固定版）

本文档是 **Notes + Quiz 单页合并** 的**唯一规范**：后续新周笔记/测验请按同一套 UI 规则与文件约定实现；**Week 6** 为当前 **prototype**，见 [`config/study_module.example.json`](config/study_module.example.json)。

---

## 1. 当前 Prototype（Week 6 · Design Patterns）

| 项 | 值 |
|----|-----|
| 合并页 | [`zh/week_6_design_patterns.html`](../zh/week_6_design_patterns.html) |
| 导图（独立 HTML，iframe 嵌入） | [`mindmap_design_patterns_html.html`](mindmap_design_patterns_html.html) |
| 原始拆分文件（仅对照，可不参与合并页） | [`notes_6_design_patterns.html`](notes_6_design_patterns.html)、[`quiz_6_design_patterns.html`](quiz_6_design_patterns.html) |
| 导图备用静态图（可选） | [`assets/week6-mindmap.png`](assets/week6-mindmap.png) |

---

## 2. 主标题与副标题

| 区域 | 元素 | Week 6 文案 |
|------|------|-------------|
| 左侧笔记 | `<h1>` | `Week 6 - OO Paterns - Part 2` |
| 右侧测验 | `<h2>` | `Week 6 - quiz` |
| 页面 `<title>` | — | `Week 6 · OO Paterns Part 2 & Quiz`（可与 `<h1>` 同步微调） |

- **不要**在 `<h1>` / `<h2>` 下再增加副标题行（已去掉 `header-meta`、测验副标题 `<p>` 等）。
- 若需将 “Paterns” 改为 “Patterns”，只改标题与 `<title>` 中对应片段即可。

---

## 3. 必须遵守的三条 UI 规则

### 3.1 所有 block 都不要边框

- **卡片** `.card`、**测验** `.q-card`、**选项** `.qz-opt`、**提示框** `.note-box` / `.green-box` / `.blue-box`、**摘要格** `.summary-cell`、**标签** `.kw`、**思维导图 iframe** 等：**不设置 `border`**（含彩色描边）。
- **表格**：`th` / `td` **无线框**；可用 **隔行背景**（如 `tbody tr:nth-child(even) td`）区分行。
- **分隔**：`<hr class="divider">` **仅留白**，不再用 `border-top` 画线。
- **左右分栏**：`.notes-pane` **与** `.quiz-pane` 之间 **不画竖线**（`border-right: none`）；窄屏下栏与栏之间也 **不画横线**。
- **Tab 导航**：`.tab-nav`、`.qz-tabs` **底部不画** 整条分隔线（用 `padding` / `margin` 留白即可）；Tab **激活态**仍可用 **文字色 + 底边** 表示（属导航语义，非「卡片边框」）。
- **测验对错/揭示**：**不依赖描边**，用 **浅色底 + 文字色**（`.qz-opt-correct` 等）区分。

### 3.2 所有卡片都不要 `card-label`

- 笔记区 **禁止**使用 `<div class="card-label">…</div>`。
- 每张卡以 **`.card-title`** 作为主标题即可。
- **例外**：提示框内 **`.note-label`**（如 `note-box` / `green-box` / `blue-box` 内小标题）**保留**，与 `card-label` 不是同一类。

### 3.3 Reset 在 Score 的左边

- 测验工具栏右侧为一组 **`.qz-actions`**，**从左到右**顺序固定为：**`Reset` → `Score: …`**（Reset 在左，分数在右）。
- DOM 顺序示例：

```html
<div class="qz-actions">
  <button type="button" class="qz-reset" onclick="resetQuiz()">Reset</button>
  <div class="score-bar">Score: <span class="score-pill" id="score-display">— / 9</span></div>
</div>
```

---

## 4. 布局与结构（合并页）

- **左右分栏**：左侧 **notes**、右侧 **quiz**；窄屏 **上下堆叠**（先笔记后测验）。
- **笔记 Tab 顺序（Week 6）**：**导图** → **Design Patterns**（概览）→ **Creational** → **Structural** → **Behavioral** → **考点**。
- **导图 Tab**：用 **`<iframe src="…">`** 指向**同目录**独立导图 HTML，**不**把整页导图复制进合并页；修改导图只改该文件。
- **Behavioral**：与「模式详解」合并为同一 Tab（上半总览表 + 下半 Observer / Strategy / Interpreter 详解），**不单独**占「模式详解」Tab。
- **`switchTab`** 必须只在 **`.notes-pane`** 内查找 `.tab-btn` / `.tab-panel`，避免与右侧测验冲突。
- **`file://` 打开**时部分浏览器对 iframe 限制较多；推荐 **本地静态服务**（如 `npx serve`）打开同目录。

---

## 5. 新周如何复用（命名与配置）

1. 复制 **Week 6 合并页** 为 `week_N_<topic>.html`（或你约定的命名）。
2. 复制并编辑 [`config/study_module.example.json`](config/study_module.example.json) → 例如 `config/week_7_*.json`，填入新周 `titles`、`mindmapIframeSrc`、Tab 列表等。
3. 新增导图页：`mindmap_<topic>_html.html`（或统一命名规范），合并页导图 Tab 的 `iframe src` 指向该文件。
4. 笔记/测验内容可来自 `notes_*.html` / `quiz_*.html` 片段，合并时遵守 **§3** 与 **§4**。

---

## 6. 给 AI / 协作者的固定 Prompt（可复制）

下面整段可作为以后「生成新周合并页」时的 **system / user 指令**：

```text
按仓库内 STUDY_PAGE_TITLES.md（Study 合并页设计文档）实现：

1) UI：所有 block 级组件不要 border；卡片不要用 .card-label，只用 .card-title；提示框内可保留 .note-label。
2) 测验工具栏右侧 .qz-actions 内顺序必须是：Reset 按钮在左，Score 在右。
3) 左侧笔记 Tab 第一个为「导图」，用 iframe 引用同目录独立 mindmap HTML，不内联整份导图代码。
4) switchTab 仅作用于 .notes-pane。
5) 分栏、Behavioral 与模式详解合并方式、副标题省略规则，与文档 §4、§2 一致。

当前 prototype 参考：`zh/week_6_design_patterns.html` + mindmap_design_patterns_html.html + config/study_module.example.json。
```

---

## 7. 变更记录（摘要）

- 合并页文件名由早期 `study_6_design_patterns.html` 调整为当前 **`zh/week_6_design_patterns.html`**（以仓库内实际文件为准）。
- 导图由静态图改为 **iframe** 引用 **`mindmap_design_patterns_html.html`**。
- 表格与分栏、Tab 区已按 **§3.1** 收紧为 **无边框**（与历史版本可能略有差异，以本文档与 `zh/week_6_design_patterns.html` 为准）。



----------------

1. Reference the layout of Week 11 and move the two items above—the quiz and the notes—into Week 14.
2. Refer to the UI of 11.1 Overview and edit the UI of 14.5       