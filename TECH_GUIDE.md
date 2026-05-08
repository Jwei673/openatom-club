# OpenAtom Club 官网 - 技术详解文档（答辩版）

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
├── project.html                  ← 项目详情页（模板）
├── events.html                   ← 活动页
├── blog.html                     ← 博客列表页
├── post.html                     ← 博客文章页（模板）
├── resources.html                ← 资源中心
├── architecture.html             ← 组织架构页
│
├── style.css                     ← 所有样式（颜色、布局、动画）
├── shared.js                     ← 公共脚本（主题切换、回到顶部等）
│
├── docs/                         ← 文档文件夹
│   └── index.html                ← 社团章程等
│
├── data/                         ← 【核心】数据文件夹
│   ├── members.json              ← 成员数据
│   ├── projects.json             ← 项目数据
│   ├── posts.json                ← 博客元数据
│   └── posts-content.json        ← 博客正文内容
│
└── assets/                       ← 资源文件夹
    └── logo.jpg                  ← 社团 Logo
```

### 三种页面类型

```
┌─────────────────────────────────────────────────────────┐
│  类型1：独立页面（内容写死在HTML里）                      │
│  ├── index.html（首页）                                  │
│  ├── members.html（成员页，但成员数据来自JSON）           │
│  ├── events.html（活动页）                               │
│  ├── resources.html（资源页）                            │
│  └── architecture.html（架构页）                         │
├─────────────────────────────────────────────────────────┤
│  类型2：列表页（从JSON读取数据，动态生成列表）            │
│  ├── projects.html（项目列表）                           │
│  └── blog.html（博客列表）                               │
├─────────────────────────────────────────────────────────┤
│  类型3：详情页模板（一个HTML显示不同内容）                │
│  ├── project.html?id=xxx（项目详情，根据id显示不同项目）   │
│  └── post.html?id=xxx（文章详情，根据id显示不同文章）      │
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
  "name": "社团官网",              // 项目名称
  "shortDesc": "基于 GitHub Pages 的静态官网",  // 简短描述
  "fullDesc": "详细介绍...",       // 完整描述
  "lang": "Vue 3",                 // 技术栈
  "tags": ["前端", "开源"],        // 标签数组
  "stars": 42,                     // 星标数
  "progress": 85                   // 进度百分比
}
```

**为什么用 JSON？**
- 纯文本，任何编辑器都能打开
- 格式严格，不容易写错
- JavaScript 原生支持，读取方便

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
      return '<div class="project-card">' +
        '<h3>' + p.name + '</h3>' +   // 用 p.name 填充项目名称
        '<p>' + p.shortDesc + '</p>' + // 用 p.shortDesc 填充描述
        '</div>';
    }).join('');                      // 把所有 HTML 拼接成字符串
    
    // 3. 插入到页面
    document.getElementById('projectGrid').innerHTML = html;
  });
```

**关键点**：
- `fetch()`：现代浏览器内置的"获取数据"功能
- `.then()`：因为网络请求是"异步"的（需要等），所以用回调函数
- `.map()`：数组方法，把每个项目转换成 HTML
- `innerHTML`：把生成的 HTML 塞进页面

### 2. URL 参数驱动详情页

#### 问题：有 4 个项目，需要 4 个详情页吗？

```
❌ 笨办法：project1.html, project2.html, project3.html, project4.html
   问题：代码重复 4 份，改样式要改 4 个文件
```

```
✅ 聪明办法：一个 project.html，用 URL 参数区分
   project.html?id=openatom-web    → 显示官网项目
   project.html?id=openatom-cli    → 显示 CLI 项目
   project.html?id=openatom-docs   → 显示文档项目
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
var project = data.projects.find(function(p) {
  return p.id === projectId;
});

// 用 project 的数据填充页面
```

**好处**：
- 一个 HTML 文件，无限个项目都能显示
- 改样式只改一处
- 新增项目不用新建文件

### 3. CSS 动画系统

#### 动画的本质

CSS 动画 = **起始状态** + **结束状态** + **过渡时间** + **缓动函数**

```css
/* 定义动画 */
@keyframes slideUp {
  from {                    /* 起始状态 */
    opacity: 0;             /* 透明 */
    transform: translateY(24px);  /* 向下偏移 24px */
  }
  to {                      /* 结束状态 */
    opacity: 1;             /* 不透明 */
    transform: translateY(0);     /* 回到原位 */
  }
}

/* 使用动画 */
.animate-slide-up {
  animation: slideUp 0.5s ease-out both;
  /* 动画名  持续时间  缓动函数  保持结束状态 */
}
```

#### 缓动函数是什么？

控制动画的"速度曲线"：

| 缓动函数 | 效果 | 用途 |
|----------|------|------|
| `linear` | 匀速 | 旋转、循环动画 |
| `ease-out` | 快→慢 | 入场动画（自然减速） |
| `ease-in-out` | 慢→快→慢 | 悬浮、呼吸效果 |
| `cubic-bezier(0.34, 1.56, 0.64, 1)` | 回弹 | 弹性效果 |

#### 卡片悬停动画详解

```css
.feature-card {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  /* 所有属性变化都有过渡，持续0.35秒，ease-out-expo缓动 */
}

.feature-card:hover {
  transform: translateY(-6px);           /* 向上移动6px */
  box-shadow: 0 12px 32px rgba(0,0,0,0.25);  /* 阴影加深 */
  border-color: #58a6ff;                 /* 边框变蓝 */
}
```

**为什么看起来流畅？**
- `transform` 和 `opacity` 是浏览器优化过的属性，不会触发重排
- `transition` 让浏览器自动补中间帧
- 缓动函数让运动更自然

### 4. 主题切换（深色/亮色）

#### CSS 变量（自定义属性）

```css
:root {
  /* 深色主题默认值 */
  --bg-primary: #0d1117;      /* 主背景 */
  --text-primary: #f0f6fc;    /* 主文字 */
  --accent-green: #238636;    /* 强调色 */
}

body.light {
  /* 亮色主题覆盖 */
  --bg-primary: #ffffff;
  --text-primary: #1f2328;
  --accent-green: #1a7f37;
}
```

**使用变量**：
```css
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
/* 切换 body.light 类，所有用变量的地方自动变色 */
```

#### JavaScript 切换逻辑

```javascript
function toggleTheme() {
  document.body.classList.toggle('light');  // 切换 light 类
  
  var isLight = document.body.classList.contains('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  // 保存到本地存储，下次打开还记得
}

// 页面加载时读取保存的主题
var savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.body.classList.add('light');
}
```

### 5. 滚动动画（IntersectionObserver）

#### 问题：页面很长，下面的内容用户看不到

**解决方案**：元素滚动到视口时再播放入场动画

```javascript
// 创建观察器
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {        // 元素进入视口
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target); // 只触发一次
    }
  });
}, {
  threshold: 0.1,  // 元素露出 10% 就触发
  rootMargin: '0px 0px -40px 0px'  // 底部提前 40px 触发
});

// 观察所有卡片
document.querySelectorAll('.feature-card').forEach(function(card) {
  card.style.opacity = '0';           // 初始隐藏
  card.style.transform = 'translateY(16px)';  // 初始下移
  card.style.transition = 'all 0.5s ease-out';
  observer.observe(card);
});
```

**好处**：