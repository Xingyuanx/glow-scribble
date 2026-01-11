# 🎨 拾光涂鸦 (Glow Scribble)

> **✨ 记录闪光时刻 • 收集生活糖果 🍬**
>
> **✨ Capture Sparkling Moments • Collect Life's Candies 🍬**

**拾光涂鸦 (Glow Scribble)** 是一款基于 **Vue 3 + Express** 全栈开发的多巴胺风格个人生活站。项目采用极具视觉冲击力的 **Neubrutalism Pop Art (新粗野波普艺术)** 设计语言，用高饱和度的色彩和大胆的粗边框治愈你的每一天。

**Glow Scribble** is a dopamine-styled personal lifestyle station built with **Vue 3 + Express**. It features a visually striking **Neubrutalism Pop Art** design language, healing your day with high-saturation colors and bold borders.

---

## 🌟 核心功能 (Features)

### 📒 心情日记 (Mood Diary)

- **CN**: 记录当下的情绪起伏，支持 5 种心情状态（开心、平静、难过、生气、兴奋）。可视化心情色条，回顾每一段回忆。
- **EN**: Record your emotional ups and downs with 5 mood states (Happy, Calm, Sad, Angry, Excited). Visualize mood strips to review every memory.

### ✅ 愿望清单 (Wishlist / Todo)

- **CN**: 规划今日任务，打卡小目标。多巴胺风格的完成动画，让打勾变得上瘾。
- **EN**: Plan daily tasks and check off small goals. Dopamine-styled completion animations make ticking boxes addictive.

### 🍅 番茄专注 (Pomodoro Focus)

- **CN**: 内置 25 分钟专注 + 5 分钟休息模式。全屏沉浸式倒计时，助你进入心流状态。
- **EN**: Built-in 25-minute focus + 5-minute break mode. Full-screen immersive countdown helps you enter the flow state.

### 🎮 解压乐园 (Stress Relief Games)

- **CN**:
  - **极速打地鼠**: 测试手速，释放压力。
  - **无限捏泡泡**: 强迫症福音，根本停不下来。
- **EN**:
  - **Whac-A-Mole**: Test your speed and release stress.
  - **Bubble Wrap**: Pure satisfaction for OCD, simply unstoppable.

### 📊 个人档案 (About Me)

- **CN**: 自动统计日记篇数与任务完成度。记录你的“拾光”旅程。
- **EN**: Automatically statistics diary entries and task completion. Record your "Glow" journey.

---

## 🛠️ 技术栈 (Tech Stack)

- **Frontend**: Vue 3 (Script Setup), Vite, Vue Router, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: JSON File Adapter (Lightweight file storage, no DB installation required / 轻量级文件存储，无需安装数据库)
- **Design**: Neubrutalism / Pop Art

---

## 🚀 快速开始 (Quick Start)

### 1. 安装依赖 (Install Dependencies)

在项目根目录运行 / Run in project root:

```bash
pnpm install
cd src/backend && pnpm install && cd ../..
```

### 2. 启动项目 (Start Project)

你需要同时启动前端和后端服务。
You need to start both frontend and backend services.

**终端 1 (Terminal 1) - Frontend**:

```bash
pnpm run dev
# Running at http://localhost:5173
```

**终端 2 (Terminal 2) - Backend**:

```bash
pnpm run dev:backend
# Running at http://localhost:3000 (or configured port)
```

---

## 📂 目录结构 (Project Structure)

```text
├── src
│   ├── frontend         # Vue 3 Frontend Source / 前端代码
│   │   ├── components   # UI Components / 组件
│   │   ├── views        # Page Views / 页面
│   │   ├── router       # Routing Config / 路由配置
│   │   └── assets       # Static Assets / 静态资源
│   ├── backend          # Express Backend Source / 后端代码
│   │   ├── index.js     # Server Entry / 服务入口
│   │   └── db.js        # JSON DB Adapter / 数据库适配器
├── package.json         # Project Config / 项目配置
└── README.md            # Documentation / 说明文档
```

---

## 🤝 贡献 (Contributing)

欢迎提交 Issue 和 Pull Request！
Issues and Pull Requests are welcome!

## 📄 许可 (License)

[MIT License](LICENSE)

---

_Built with ❤️ by Xingyuanx_
