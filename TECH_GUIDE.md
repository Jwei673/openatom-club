# 成电开放原子开源社团 官网 - 技术详解文档（答辩版）

> 写给小白看的完整技术说明，帮你顺利通过答辩

---

## 一、先搞懂几个基础概念

### 1. 什么是"静态网站"？

想象你打开一个网页，有两种方式：

| 类型 | 比喻 | 特点 |
|------|------|------|
| **静态网站** | 像看一本已经印好的书 | 页面内容是固定的，直接打开文件就能看到 |
| **动态网站** | 像去餐厅点菜 | 每次访问服务器都要"做一份新的"（查数据库、拼页面） |

**我们的网站是静态的**，因为：
- 社团官网内容相对固定（介绍、成员、项目）
- 不需要用户登录、不需要实时数据
- 免费托管在 GitHub Pages 上

### 2. GitHub Pages 是什么？

GitHub（代码托管平台）提供的一项**免费服务**：
- 你把网站文件上传到 GitHub
- GitHub 自动给你一个网址：`https://你的用户名.github.io/仓库名`
- 全世界都能访问

**好处**：
- 完全免费
- 自带 CDN（全球访问速度快）
- 自动 HTTPS（安全）

### 3. 什么是 Git？

Git 是"版本控制工具"，通俗说就是：
- 保存你代码的每一个历史版本
- 可以随时回退到之前的版本
- 多人协作不冲突

比喻：就像 Word 的"撤销"功能，但可以撤销到任意时间点，还能看每次改了什么。

---

## 二、项目整体架构

### 文件结构图解

```
openatom-club/                    ← 项目根目录
│
├── index.html                    ← 首页（门面）
├── members.html                  ← 成员页
├── projects.html                 ← 项目列表页
├── project.html                  ← 项目详情页（模板，URL参数驱动）
├── events.html                   ← 活动页
├── blog.html                     ← 博客列表页
├── post.html                     ← 博客文章页（模板，URL参数驱动）
├── resources.html                ← 资源中心
├── architecture.html             ← 组织架构页
│
├── style.css                     ← 所有样式（颜色、布局、动画、响应式）
├── shared.js                     ← 公共脚本（主题切换、回到顶部、滚动动画等）
│
├── docs/                         ← 文档文件夹
│   └── index.html                ← 社团章程、Git教程等
│
├── data/                         ← 【核心】数据文件夹
│   ├── members.json              ← 成员数据（架构页读取）
│   ├── projects.json             ← 项目数据（项目列表+详情页读取）
│   ├── posts.json                ← 博客元数据（标题、分类、摘要等）
│   └── posts-content.json        ← 博客正文内容（文章详情页读取）
│
├── assets/                       ← 资源文件夹
│   └── logo.jpg                  ← 社团 Logo
│
├── README.md                     ← 项目说明文档
├── LICENSE                       ← 开源许可证
└── TECH_GUIDE.md                 ← 本技术文档
```

### 四种页面类型

```
┌─────────────────────────────────────────────────────────┐
│  类型1：独立页面（内容直接写在HTML里）                     │
│  ├── index.html（首页）                                  │
│  ├── members.html（成员页 - HTML硬编码展示）              │
│  ├── events.html（活动页）                               │
│  ├── resources.html（资源页）                            │
│  ├── architecture.html（架构页 - 从JSON读取成员数据）     │
│  └── docs/index.html（文档页）                           │
├─────────────────────────────────────────────────────────┤
│  类型2：列表页（从JSON读取数据，动态生成列表）             │
│  ├── projects.html（项目列表 - 从projects.json读取）     │
│  └── blog.html（博客列表 - 从posts.json读取）            │
├─────────────────────────────────────────────────────────┤
│  类型3：详情页模板（一个HTML显示不同内容）                │
│  ├── project.html?id=xxx（根据id显示不同项目详情）        │
│  └── post.html?id=xxx（根据id显示不同文章详情）           │
├─────────────────────────────────────────────────────────┤
│  类型4：公共组件（每个页面都引入）                        │
│  ├── style.css（统一样式）                               │
│  └── shared.js（主题切换、回到顶部、滚动动画、搜索弹窗）  │
└─────────────────────────────────────────────────────────┘
```

---

## 三、核心技术详解

### 1. 数据驱动架构（最重要）

#### 传统做法的问题
```
❌ 传统：改内容要改代码
   想加一个新项目 → 打开 projects.html → 找到项目列表 → 复制粘贴HTML代码块
   → 改文字 → 改链接 → 容易改错 → 格式可能不一致
```

#### 我们的做法
```
✅ 数据驱动：改JSON就行
   想加一个新项目 → 打开 data/projects.json → 复制一条记录 → 改文字 → 保存
   → 页面自动显示新项目，格式完全一致
```

#### JSON 是什么？

JSON = JavaScript Object Notation（JavaScript 对象表示法）

简单说：一种**格式规范**，用来存储数据。长得像 JavaScript 对象。

```json
// 一个项目的数据（projects.json 里的一条）
{
  "id": "openatom-web",           // 唯一标识符
  "name": "OpenAtom Web",         // 项目名称
  "shortDesc": "社团官网",         // 简短描述
  "category": "frontend",         // 分类
  "status": "active",             // 状态（active/planning/maintenance/archived）
  "lang": "Vue 3",                // 技术栈
  "stars": 128,                   // 星标数
  "forks": 34,                    // Fork数
  "tags": ["Vue 3", "Vite", "TypeScript", "CSS3"],  // 标签数组
  "progress": 85,                 // 进度百分比
  "milestones": [                 // 里程碑列表
    { "done": "首页 + 响应式布局", "date": "2026-04" },
    { "todo": "SSR 优化 + SEO", "date": "2026-06" }
  ],
  "members": ["王浩", "陈婷婷"],   // 项目成员
  "updates": [                    // 更新日志
    { "date": "2026-05-08", "text": "新增资源中心页" }
  ]
}
```

**为什么用 JSON？**
- 纯文本，任何编辑器都能打开
- 格式严格，不容易写错
- JavaScript 原生支持，读取方便（`fetch` + `.json()`）

#### 数据文件分工

| JSON文件 | 谁读取 | 存什么 |
|----------|--------|--------|
| `members.json` | architecture.html | 成员部门、职务、小组归属 |
| `projects.json` | projects.html + project.html | 项目列表与详情 |
| `posts.json` | blog.html + post.html | 文章元数据（标题、分类、摘要） |
| `posts-content.json` | post.html | 文章正文内容（Markdown转HTML） |

**为什么把 posts.json 和 posts-content.json 分开？**
- 列表页只需要标题、摘要等轻量信息，不需要加载全部正文
- 详情页才需要加载正文，减少列表页的加载时间
- 类似于"目录"和"正文"的关系

#### 动态渲染代码解析

```javascript
// projects.html 里的核心逻辑（简化版）

// 1. 从服务器获取 JSON 数据
fetch('data/projects.json')           // 发起网络请求
  .then(function(response) {          // 拿到响应
    return response.json();           // 解析成 JavaScript 对象
  })
  .then(function(data) {              // data 就是 projects.json 的内容
    var projects = data.projects;     // 取出项目数组

    // 2. 遍历每个项目，生成 HTML
    var html = projects.map(function(p) {
      return '<div class="project-card" onclick="location.href='
        + "'project.html?id=" + p.id + "'>"
        + '<h3>' + p.name + '</h3>'   // 用 p.name 填充项目名称
        + '<p>' + p.shortDesc + '</p>' // 用 p.shortDesc 填充描述
        + '</div>';
    }).join('');                      // 把所有 HTML 拼接成字符串

    // 3. 插入到页面
    document.getElementById('projectGrid').innerHTML = html;
  });
```

**关键点**：
- `fetch()`：现代浏览器内置的"获取数据"功能
- `.then()`：因为网络请求是"异步"的（需要等），所以用回调函数
- `.map()`：数组方法，把每个项目转换成 HTML 字符串
- `innerHTML`：把生成的 HTML 塞进页面
- 点击卡片时跳转到 `project.html?id=xxx`，由详情页读取同份数据渲染

### 2. URL 参数驱动详情页

#### 问题：有 4 个项目，需要 4 个详情页吗？

```
❌ 笨办法：project1.html, project2.html, project3.html, project4.html
   问题：代码重复 4 份，改样式要改 4 个文件
```

```
✅ 聪明办法：一个 project.html，用 URL 参数区分
   project.html?id=openatom-web    → 显示官网项目
   project.html?id=openatom-api    → 显示 API 项目
   project.html?id=openatom-docs   → 显示文档项目
   project.html?id=openatom-infra  → 显示基础设施项目
```

#### 怎么读取 URL 参数？

```javascript
// 当前网址：project.html?id=openatom-web

var urlParams = new URLSearchParams(location.search);
// location.search 是 "?id=openatom-web"
// URLSearchParams 是浏览器提供的工具，用来解析参数

var projectId = urlParams.get('id');
// projectId = "openatom-web"

// 然后去 projects.json 里找对应 id 的数据
fetch('data/projects.json')
  .then(function(r) { return r.json(); })
  .then(function(data) {
    // find() 方法：在数组里找第一个匹配条件的项目
    var project = data.projects.find(function(p) {
      return p.id === projectId;
    });

    if (project) {
      // 用 project 的数据填充页面
      document.getElementById('projectName').textContent = project.name;
      document.getElementById('projectDesc').textContent = project.shortDesc;
      // ... 更多字段
    }
  });
```

**好处**：
- 一个 HTML 文件，无限个项目都能显示
- 改样式只改一处
- 新增项目不用新建文件，只需在 JSON 里加一条记录

### 3. CSS 变量系统（主题切换的基础）

#### 什么是 CSS 变量？

CSS 变量（也叫自定义属性）让你定义一组"颜色名"，然后统一引用。

```css
/* 在 :root 里定义变量（全局可用） */
:root {
    --bg-primary: #0d1117;      /* 主背景色 */
    --text-primary: #f0f6fc;    /* 主文字色 */
    --accent-green: #238636;    /* 强调色-绿 */
    --accent-blue: #58a6ff;     /* 强调色-蓝 */
}

/* 使用变量 */
body {
    background-color: var(--bg-primary);   /* 等价于 #0d1117 */
    color: var(--text-primary);            /* 等价于 #f0f6fc */
}
```

#### 我们的变量体系

```
┌──────────────────────────────────────────────────┐
│  背景色（4层，由浅到深）                           │
│  --bg-primary   #0d1117   最底层背景              │
│  --bg-secondary #161b22   卡片/侧边栏背景         │
│  --bg-tertiary  #21262d   第三层/标签背景          │
│  --bg-hover     #30363d   悬停背景                │
├──────────────────────────────────────────────────┤
│  文字色（3级，由亮到暗）                           │
│  --text-primary   #f0f6fc   标题/重要文字          │
│  --text-secondary #c9d1d9   正文                  │
│  --text-muted     #8b949e   辅助说明              │
├──────────────────────────────────────────────────┤
│  强调色（4种用途）                                │
│  --accent-green  #238636   主按钮/成功状态         │
│  --accent-blue   #58a6ff   链接/高亮              │
│  --accent-purple #a371f7   装饰/标签              │
│  --accent-orange #f0883e   警告/代码              │
├──────────────────────────────────────────────────┤
│  边框色                                          │
│  --border-primary   #30363d  主边框               │
│  --border-secondary #21262d  次边框               │
│  --border-hover     #58a6ff  悬停边框（=accent-blue）│
├──────────────────────────────────────────────────┤
│  布局变量                                        │
│  --sidebar-width     280px     侧边栏宽度          │
│  --navbar-height     64px      导航栏高度          │
│  --content-max-width 1280px    内容最大宽度         │
├──────────────────────────────────────────────────┤
│  动画曲线                                        │
│  --ease-out-expo  cubic-bezier(0.16, 1, 0.3, 1)    │
│  --ease-out-back  cubic-bezier(0.34, 1.56, 0.64, 1) │
└──────────────────────────────────────────────────┘
```

**为什么用变量而不是直接写颜色值？**
- 改一个变量，全站所有用到的地方自动更新
- 主题切换只需要覆盖一套变量（见第五节）
- 代码更易读：`var(--accent-green)` 比 `#238636` 更直观

### 4. CSS 动画系统

#### 动画的本质

CSS 动画 = **起始状态** + **结束状态** + **过渡时间** + **缓动函数**

#### 我们用到的 8 种动画

```css
/* ① 页面淡入（防止白屏闪烁，body上直接用） */
@keyframes pageFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
body { animation: pageFadeIn 0.4s ease-out; }

/* ② 从下方滑入（卡片、按钮入场） */
@keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ③ 从左侧滑入（区域标题入场） */
@keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-24px); }
    to { opacity: 1; transform: translateX(0); }
}

/* ④ 缩放弹入（Logo、弹窗） */
@keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: scale(1); }
}

/* ⑤ 脉冲发光（状态指示器"活跃中"） */
@keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(35,134,54,0.4); }
    50% { box-shadow: 0 0 12px 4px rgba(35,134,54,0.15); }
}

/* ⑥ 浮动（装饰元素上下飘） */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
}

/* ⑦ 渐变背景流动（Hero区域背景动画） */
@keyframes gradientFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* ⑧ 骨架屏闪烁（加载占位动画） */
@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}
```

#### 延迟动画（依次入场效果）

```css
/* 用 delay-1 到 delay-6 控制依次入场 */
.delay-1 { animation-delay: 0.05s; }
.delay-2 { animation-delay: 0.10s; }
.delay-3 { animation-delay: 0.15s; }
.delay-4 { animation-delay: 0.20s; }
.delay-5 { animation-delay: 0.25s; }
.delay-6 { animation-delay: 0.30s; }
```

这样多个卡片会依次"冒出来"，而不是一起闪现。

#### 缓动函数是什么？

控制动画的"速度曲线"：

| 缓动函数 | 效果 | 用途 |
|----------|------|------|
| `linear` | 匀速 | 旋转、循环动画 |
| `ease-out` | 快→慢 | 入场动画（自然减速） |
| `ease-in-out` | 慢→快→慢 | 悬浮、呼吸效果 |
| `--ease-out-expo` | 快速减速停下 | 卡片悬停、导航效果 |
| `--ease-out-back` | 超过目标再回弹 | Logo、弹性效果 |

#### 卡片悬停动画详解

```css
.feature-card {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  /* 所有属性变化都有过渡，持续0.35秒，ease-out-expo缓动 */
}

.feature-card:hover {
  transform: translateY(-6px);           /* 向上移动6px */
  box-shadow: 0 12px 32px rgba(0,0,0,0.25);  /* 阴影加深 */
  border-color: var(--border-hover);     /* 边框变蓝 */
}

/* 悬停时顶部出现彩色渐变线 */
.feature-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-green), var(--accent-blue), var(--accent-purple));
  opacity: 0;                          /* 默认隐藏 */
  transition: opacity 0.3s;
}
.feature-card:hover::before {
  opacity: 1;                          /* 悬停显示 */
}
```

**为什么看起来流畅？**
- `transform` 和 `opacity` 是浏览器优化过的属性，不会触发重排（reflow）
- `transition` 让浏览器自动补中间帧
- 缓动函数让运动更自然

#### 按钮涟漪效果

```css
.btn {
  position: relative;
  overflow: hidden;
}
.btn::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  width: 0; height: 0;
  background: rgba(255,255,255,0.15);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.4s, height 0.4s;
}
/* 点击时涟漪扩散 */
.btn:active::after {
  width: 300px; height: 300px;
}
```

### 5. 导航栏毛玻璃效果

```css
.navbar {
    position: fixed;           /* 固定在顶部 */
    background-color: rgba(22, 27, 34, 0.85);   /* 半透明背景 */
    backdrop-filter: blur(12px);                 /* 背景模糊 = 毛玻璃 */
    -webkit-backdrop-filter: blur(12px);         /* Safari 兼容 */
    border-bottom: 1px solid var(--border-primary);
}

/* 滚动后变深、加阴影 */
.navbar.scrolled {
    background-color: rgba(13, 17, 23, 0.95);
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
```

**`backdrop-filter` 是什么？**
- 让元素背后的内容变模糊，就像磨砂玻璃
- 和 `background-color: rgba(...)` 配合使用，透明度决定模糊程度
- `-webkit-` 前缀是为了兼容 Safari 浏览器

### 6. 全站搜索功能（Ctrl+K）

#### 交互流程

```
用户按 Ctrl+K
   ↓
弹出搜索弹窗（.search-overlay）
   ↓
输入关键词
   ↓
实时过滤匹配页面（前端搜索，不需要服务器）
   ↓
↑↓ 键选择 → Enter 跳转 / Esc 关闭
```

#### 核心代码解析

```javascript
// 搜索数据（写在前端，因为页面不多）
var searchData = [
    {title:"首页", desc:"成电开放原子开源社团 官方网站首页", icon:"🏠", url:"index.html"},
    {title:"成员", desc:"社团核心成员与活跃成员列表", icon:"👥", url:"members.html"},
    // ... 每个页面一条记录
];

// 监听输入事件（实时搜索）
si.addEventListener("input", function(){
    var kw = this.value.trim().toLowerCase();  // 获取关键词，转小写
    var filt = searchData.filter(function(item){
        // 在标题和描述中搜索
        return item.title.toLowerCase().includes(kw)
            || item.desc.toLowerCase().includes(kw);
    });
    // 渲染搜索结果...
});

// 快捷键 Ctrl+K 打开搜索
document.addEventListener("keydown", function(e){
    if((e.ctrlKey || e.metaKey) && e.key === "k"){
        e.preventDefault();   // 阻止浏览器默认行为
        openSearch();
    }
});
```

**为什么不用后端搜索？**
- 网站只有 8 个页面，数据量很小
- 前端搜索零延迟、零服务器成本
- `filter + includes` 就是模糊匹配，足够用

### 7. 主题切换（深色/亮色）

#### CSS 变量覆盖实现

```css
:root {
  /* 深色主题默认值 */
  --bg-primary: #0d1117;
  --text-primary: #f0f6fc;
  --accent-green: #238636;
  --accent-blue: #58a6ff;
  /* ... 更多变量 */
}

/* 亮色主题：只需覆盖变量值，所有用 var() 的地方自动变色 */
body.light {
  --bg-primary: #ffffff;
  --bg-secondary: #f6f8fa;
  --bg-tertiary: #eaeef2;
  --bg-hover: #d0d7de;
  --text-primary: #1f2328;
  --text-secondary: #656d76;
  --text-muted: #8b949e;
  --border-primary: #d0d7de;
  --border-secondary: #eaeef2;
  --accent-green: #1a7f37;
  --accent-green-hover: #2da44e;
  --accent-blue: #0969da;
  --accent-blue-hover: #0550ae;
  --accent-purple: #8250df;
  --accent-orange: #bc4c00;
  --border-hover: #0969da;
}
```

#### JavaScript 切换逻辑

```javascript
window.toggleTheme = function() {
    document.body.classList.toggle('light');  // 切换 light 类

    var isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    // 保存到本地存储，下次打开还记得

    // 切换按钮图标（🌙↔☀️）
    var btns = document.querySelectorAll('.theme-toggle');
    btns.forEach(function(b) {
        b.textContent = isLight ? '☀️' : '🌙';
        // 加个旋转弹跳动画，让切换有反馈感
        b.style.transform = 'rotate(360deg) scale(0.8)';
        setTimeout(function() { b.style.transform = ''; }, 300);
    });
};

// 页面加载时读取保存的主题
var savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light');
}
```

**为什么用 `classList.toggle`？**
- 一行代码完成"有就删、没有就加"
- 不需要 if/else 判断当前状态
- 简洁高效

### 8. 滚动动画（IntersectionObserver）

#### 问题：页面很长，下面的内容看不到入场效果

**解决方案**：元素滚动到视口时再播放入场动画

```javascript
// 创建观察器
var animObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {        // 元素进入视口
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            animObserver.unobserve(entry.target); // 只触发一次
        }
    });
}, {
    threshold: 0.1,  // 元素露出 10% 就触发
    rootMargin: '0px 0px -40px 0px'  // 底部提前 40px 触发
});

// 观察所有卡片元素
document.querySelectorAll('.sidebar-card, .feature-card, .resource-card, .contact-card, .member-card, .project-card, .blog-card')
  .forEach(function(el) {
    el.style.opacity = '0';           // 初始隐藏
    el.style.transform = 'translateY(16px)';  // 初始下移
    el.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    animObserver.observe(el);
});
```

**好处**：
- 性能好：不需要持续监听滚动事件（`scroll` 事件每秒触发几十次）
- 体验佳：用户看到元素时动画才触发
- 省代码：浏览器自动处理阈值判断
- `unobserve`：只触发一次，不会重复动画

### 9. 性能优化细节

#### ① requestAnimationFrame 节流

```javascript
// 导航栏滚动效果 - 用 requestAnimationFrame 节流
var ticking = false;
window.addEventListener('scroll', function() {
    lastScrollY = window.scrollY;
    if (!ticking) {
        requestAnimationFrame(function() {
            // 实际的 DOM 操作放在这里
            if (lastScrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });
```

**为什么需要节流？**
- `scroll` 事件每秒可能触发 60+ 次
- 如果每次都操作 DOM，会卡顿
- `requestAnimationFrame` 让 DOM 操作和浏览器刷新同步，一帧只执行一次

#### ② passive 事件监听器

```javascript
// { passive: true } 告诉浏览器：这个监听器不会调用 preventDefault()
// 浏览器可以放心地在等待 JS 执行的同时开始滚动，提升响应速度
window.addEventListener('scroll', handler, { passive: true });
```

#### ③ 数字计数器动画

```javascript
// 统计数字从 0 递增到目标值（如"10+"→从0跑到10）
var numObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            var target = parseInt(entry.target.getAttribute('data-count'));
            var current = 0;
            var step = Math.max(1, Math.floor(target / 40));  // 40步跑完
            var el = entry.target;

            var timer = setInterval(function() {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = current.toLocaleString();     // 格式化数字
            }, 25);  // 每25ms一步，总时长约1秒
        }
    });
}, { threshold: 0.5 });
```

---

## 四、响应式设计（手机也能看）

### 1. 核心问题：屏幕大小不一样怎么办？

```
电脑屏幕：1920px × 1080px   左边放导航，右边放内容 OK
手机屏幕：375px × 667px     同样布局会被挤扁，无法阅读
```

解决：检测屏幕宽度，不同宽度用不同布局

### 2. 媒体查询（Media Query）

```css
/* 默认样式（桌面端） */
.main-layout {
    display: flex;        /* 左右布局 */
    gap: 24px;
}
.sidebar {
    width: 280px;         /* 固定宽度侧边栏 */
    position: sticky;     /* 滚动时固定 */
}

/* 当屏幕宽度 <= 1024px 时（小笔记本/平板横屏） */
@media (max-width: 1024px) {
    .main-layout {
        flex-direction: column;  /* 改为上下布局 */
    }
    .sidebar {
        width: 100%;             /* 侧边栏撑满 */
        position: static;        /* 取消固定 */
        order: 2;                /* 移到内容下方 */
    }
    .content { order: 1; }       /* 内容优先显示 */
}

/* 当屏幕宽度 <= 768px 时（手机/平板竖屏） */
@media (max-width: 768px) {
    .nav-links {
        display: none;            /* 隐藏导航链接（移动端） */
    }
    .hero-title {
        font-size: 1.5rem;       /* 缩小标题 */
    }
    .feature-grid {
        grid-template-columns: 1fr;  /* 卡片单列显示 */
    }
}
```

### 3. 断点设计

| 断点 | 设备 | 布局变化 |
|------|------|----------|
| > 1024px | 桌面 | 侧边栏 + 主内容，左右布局 |
| ≤ 1024px | 小笔记本/平板 | 侧边栏移到下方，上下布局 |
| ≤ 768px | 手机 | 导航隐藏，卡片单列，文字缩小 |

### 4. Flexbox 布局

Flexbox = 弹性盒子，让布局更简单：

```css
/* 父容器：开启 Flexbox */
.main-layout {
    display: flex;
    gap: 24px;                    /* 子元素间距 */
}
.sidebar {
    flex-shrink: 0;               /* 不被压缩 */
    width: var(--sidebar-width);
}
.content {
    flex: 1;                      /* 自动填满剩余空间 */
    min-width: 0;                 /* 防止内容溢出 */
}
```

### 5. Grid 布局

卡片网格用 CSS Grid（比 Flexbox 更适合二维排列）：

```css
.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    /* auto-fit：自动填满行 */
    /* minmax(260px, 1fr)：每列最小260px，最大等分 */
    gap: 20px;
}
```

**效果**：宽屏时一行放3-4个卡片，窄屏时自动换行，无需手写断点。

### 6. 图片响应式

```css
img {
    max-width: 100%;    /* 图片不会超过容器宽度 */
    height: auto;       /* 高度自适应，保持比例 */
}
```

---

## 五、缓存与存储优化

### 1. localStorage（本地存储）

浏览器提供的一块"持久化存储空间"，即使关掉浏览器再打开，数据还在。

```javascript
// 保存数据（键值对）
localStorage.setItem('theme', 'dark');

// 读取数据
var theme = localStorage.getItem('theme');  // 'dark'

// 删除数据
localStorage.removeItem('theme');
```

我们用 localStorage 做什么？
- 记住用户的主题偏好（深色/亮色）
- 下次打开页面，自动恢复上次设置

### 2. GitHub Pages CDN 缓存

GitHub Pages 自带 CDN 和浏览器缓存：
- 用户第一次访问 → 下载所有文件
- 用户第二次访问 → 浏览器直接从本地缓存读取（毫秒级）
- 文件更新了 → 需要等待 CDN 缓存过期（通常几分钟）

**版本号破缓存技巧**：
```html
<!-- 给资源加 ?v=2 参数，CDN认为是新文件，强制刷新 -->
<img src="assets/logo.jpg?v=2" alt="Logo">
```

---

## 六、无障碍与用户体验

### 1. Focus 可见性

```css
/* 键盘导航时，聚焦元素有明显的蓝色轮廓 */
*:focus-visible {
    outline: 2px solid var(--accent-blue);
    outline-offset: 2px;
}
```

**为什么重要？** 不用鼠标的用户（视力障碍、键盘党）需要看到当前焦点在哪。

### 2. 选中文字样式

```css
::selection {
    background: rgba(88,166,255,0.3);   /* 选中文字的背景色 */
    color: var(--text-primary);
}
```

### 3. 自定义滚动条

```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb {
    background: var(--border-primary);
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
```

### 4. 平滑滚动

```css
html {
    scroll-behavior: smooth;  /* 锚点跳转时平滑滚动，不是瞬移 */
}
```

### 5. `prefers-reduced-motion` 适配

部分用户（如前庭功能障碍）在系统设置中关闭了动画。浏览器支持检测：

```css
/* 当用户系统设置了"减少动画"时，禁用所有动画 */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 七、答辩 Q&A 预演

### Q1：为什么选择静态网站？不用后端吗？

参考回答：
社团官网内容相对固定，不需要实时数据库。静态网站有几个优势：
- 免费托管：GitHub Pages 完全免费，每年省几百元服务器费用
- 速度快：静态文件直接返回，无需服务器处理，用户体验好
- 安全：没有数据库、没有后台，黑客无法注入 SQL、没有服务器漏洞
- 维护简单：改内容只需要改 JSON 文件，不需要登录服务器
- 适合开源社团：代码开源、部署开源，完全透明

### Q2：JSON 数据文件的格式是怎么设计的？

参考回答：
我们采用了"前台数据结构化"的设计思路：
- 每个实体（成员、项目、文章）对应一个 JSON 文件
- 字段命名统一规范，如 id、name、shortDesc、tags 等
- 数组类型字段（如 tags、milestones）用方括号 [] 表示
- 文章数据拆分为 posts.json（元数据）和 posts-content.json（正文），列表页只加载轻量的元数据
- 这样做的好处是数据与展示分离，新成员添加内容不需要懂代码

### Q3：URL 参数 ?id=xxx 是什么原理？

参考回答：
这叫"查询参数"，是 URL 的一部分。比如：
- project.html → 打开项目详情页
- project.html?id=openatom-web → 打开 id 为 openatom-web 的项目详情

JavaScript 通过 URLSearchParams API 解析参数，找到对应的数据 ID，
再到 JSON 文件里查询匹配的项目，最后动态渲染页面内容。
这样只需要一个 HTML 文件就能展示无限多个项目详情。

### Q4：CSS 动画会不会影响性能？

参考回答：
我们做了性能优化：
- 只用 transform 和 opacity 两个属性做动画，这两个是浏览器专门优化过的，不会触发"重排"
- 用 IntersectionObserver 代替 scroll 事件监听，避免滚动时频繁触发回调
- 导航栏滚动效果用 requestAnimationFrame 节流，确保一帧只操作一次 DOM
- 事件监听器添加 `{ passive: true }`，让浏览器可以并行处理滚动
- 动画支持 prefers-reduced-motion 适配，视力障碍用户可关闭动画

### Q5：深色主题是怎么实现的？

参考回答：
用的是 CSS 自定义属性（变量）配合类名切换：
- :root 定义深色主题的默认值
- body.light 类覆盖为亮色主题的值
- 切换时只需要给 body 标签添加/移除 light 类，所有用 var() 的地方自动变色
- 主题偏好用 localStorage 持久保存，下次访问自动恢复
- 切换按钮带旋转动画，给用户即时的视觉反馈

### Q6：网站部署的流程是什么？

参考回答：
整个部署流程自动化：
1. 开发者本地编写代码（HTML/CSS/JS/JSON）
2. 用 Git 提交：git commit
3. 推送到 GitHub：git push
4. GitHub Pages 自动检测到 main 分支有新提交
5. 网站自动更新到：https://Jwei673.github.io/openatom-club/
全程不需要手动操作服务器，每次 push 代码网站自动更新。

### Q7：浏览器兼容性问题考虑过吗？

参考回答：
考虑了：
- CSS 变量（:root / var()）支持所有现代浏览器
- IntersectionObserver 支持率已达 95%+
- backdrop-filter 用 -webkit- 前缀兼容 Safari
- GitHub Pages 默认启用 HTTPS，所有浏览器都兼容
- 用 Flexbox + Grid，Flexbox 兼容性极好，Grid 在现代浏览器全部支持
- 没有使用任何实验性 CSS 属性

### Q8：为什么用 fetch 而不用 AJAX？

参考回答：
fetch 是现代浏览器内置的 API，相比老旧的 XMLHttpRequest（AJAX）：
- 语法更简洁：fetch(url).then(r => r.json())
- 支持 Promise，代码更好读
- 是 Web 标准，未来不会被淘汰
- 不需要引入任何第三方库

### Q9：网站有哪些安全措施？

参考回答：
静态网站天然更安全：
- 无数据库：没有 SQL 注入风险
- 无后端：没有服务器漏洞
- GitHub 托管：GitHub 负责服务器安全和 DDoS 防护
- HTTPS 强制：GitHub Pages 自动启用 HTTPS
- GitHub Secret Scanning：自动扫描敏感信息泄露（如 Token）

### Q10：搜索功能是怎么实现的？

参考回答：
前端搜索，不需要后端：
- 把所有页面的标题和描述存成 JavaScript 数组
- 用户输入关键词时，用 filter + includes 做模糊匹配
- 支持键盘导航（↑↓选择，Enter跳转，Esc关闭）
- Ctrl+K 快捷键打开搜索弹窗
- 因为页面数量少（8个），前端搜索零延迟、零成本

### Q11：如果要加新功能，你会怎么做？

参考回答：
分步骤来做：
1. 需求分析：确定新功能要解决什么问题
2. 数据设计：如果涉及内容，先设计 JSON 数据结构
3. 页面结构：用 HTML 写出页面骨架
4. 样式实现：用 CSS 写样式，复用已有的 .card / .btn 等类名
5. 交互逻辑：用 JavaScript 实现动态效果
6. 本地测试：浏览器打开测试
7. Git 提交：git add -> git commit -m "feat: 添加xxx功能"
8. 推送部署：git push，等待 GitHub Pages 自动更新

### Q12：为什么用 CSS 变量而不用 Sass/Less？

参考回答：
CSS 变量是原生功能，不需要编译步骤：
- 浏览器直接支持，改完刷新就能看效果
- 可以在运行时动态修改（主题切换就是靠这个）
- 不需要安装 Node.js、不需要构建工具
- 对初学者更友好，学习成本最低
- Sass/Less 的变量是编译时确定的，无法运行时切换

---

## 八、技术栈总结

| 类别 | 技术 | 说明 |
|------|------|------|
| 页面结构 | HTML5 | 语义化标签（header/nav/section/article/footer） |
| 样式美化 | CSS3 | 变量系统 / Flexbox+Grid / 8种动画 / 响应式3断点 |
| 交互逻辑 | Vanilla JS | 原生 JavaScript（零框架依赖） |
| 数据存储 | JSON | 纯文本数据文件，浏览器原生解析 |
| 搜索功能 | 前端搜索 | JavaScript filter + Ctrl+K 快捷键 |
| 版本控制 | Git + GitHub | 代码历史 + 协作 + 备份 |
| 托管服务 | GitHub Pages | 免费 CDN + HTTPS + 自动部署 |
| 主题系统 | CSS 变量 | 深色/亮色双主题，localStorage 持久化 |
| 动画系统 | CSS Keyframes + IntersectionObserver | 入场动画 + 悬停交互 + 滚动触发 |
| 编辑器 | VS Code | 轻量、免费、插件丰富 |

为什么不用框架（如 Vue/React）？
- 社团官网体量小，不需要复杂的状态管理
- 纯 HTML/CSS/JS 更简单透明，答辩时能解释每一行代码
- 零依赖、无构建步骤，改完直接 push 就能看效果
- 对初学者更友好，方便学习和理解原理

---

## 九、页面功能速查表

| 页面 | 文件 | 数据来源 | 特色功能 |
|------|------|----------|----------|
| 首页 | index.html | 无 | Hero渐变动画、特色卡片、时间线、Ctrl+K搜索 |
| 成员 | members.html | 无（HTML硬编码） | 部门分组、成员卡片 |
| 项目列表 | projects.html | projects.json | 动态渲染、进度条、状态徽章 |
| 项目详情 | project.html | projects.json | URL参数驱动、里程碑、更新日志 |
| 文档 | docs/index.html | 无 | 社团章程、Git教程、锚点导航 |
| 活动 | events.html | 无 | 活动日历、往期回顾 |
| 博客列表 | blog.html | posts.json | 分类筛选、搜索、分页 |
| 博客文章 | post.html | posts.json + posts-content.json | URL参数驱动、Markdown渲染 |
| 资源中心 | resources.html | 无 | 工具推荐、学习路线、书籍列表 |
| 组织架构 | architecture.html | members.json | 部门/小组树、动态渲染 |

---

## 十、参考资源

- MDN Web Docs - JavaScript 教程
  https://developer.mozilla.org/zh-CN/docs/Web/JavaScript
- CSS Tricks - Flexbox 完全指南
  https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- CSS Tricks - Grid 完全指南
  https://css-tricks.com/snippets/css/complete-guide-grid/
- GitHub Pages 官方文档
  https://docs.github.com/en/pages
- IntersectionObserver 详解
  https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
- Can I Use（查看浏览器兼容性）
  https://caniuse.com/
- JSON 格式化工具（写 JSON 时验证格式）
  https://jsonformatter.curiousconcept.com/

---

文档版本：v2.0 | 最后更新：2026-05-08 | 适配项目：成电开放原子开源社团 官网
