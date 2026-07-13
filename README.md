<div align="center">
  
  # Bunk & Learn Hub
  
  **An interactive, visual-first platform for mastering Computer Science fundamentals. Built by students, for students.**

  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)
  [![Open Source](https://img.shields.io/badge/Open_Source-Yes-blue?style=for-the-badge)](https://github.com/sundramdotdev/bunk-learn-os)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
  [![Version](https://img.shields.io/badge/Version-3.0-purple?style=for-the-badge)](https://github.com/sundramdotdev/bunk-learn-os/releases)
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)

  <!-- Banner Placeholder -->
  <!-- ![Bunk & Learn Hub Banner](public/banner.png) -->
</div>

---

## 📖 Table of Contents
- [Project Vision](#-project-vision)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Installation Guide](#-installation-guide)
- [Folder Structure](#-folder-structure)
- [Design System](#-design-system)
- [Performance](#-performance)
- [Contributing Guide](#-contributing-guide)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 🎯 Project Vision

**Why does this exist?**
Computer Science concepts (like CPU Scheduling, OS Deadlocks, or Network Packet Routing) are often taught using static whiteboards or dense textbooks. 

**The Problem:** Students struggle to visualize dynamic algorithms over time.
**The Solution:** An interactive playground that forces students to learn by *seeing* and *doing*. 
**The Philosophy:** "Don't just read about algorithms. Step through them."

Bunk & Learn Hub targets undergraduate CS students, coding bootcamp attendees, and competitive programmers who need a mental model of how systems actually work under the hood.

---

## 🚀 Features

Bunk & Learn Hub is categorized into several core educational domains.

### 💻 Operating Systems
- **CPU Scheduling**: FCFS, SJF, RR, SRTF, HRRN, LCN simulations with animated Gantt charts.
- **Memory Allocation**: First-Fit, Best-Fit visualizers showing fragmentation.
- **Page Replacement**: Simulated frames showing page faults.
- **Disk Scheduling**: Animated disk head movement tracking.
- **Deadlock Avoidance**: Banker's Algorithm step-by-step matrix calculator.

### 🌳 Data Structures
- **Binary Tree**: Interactive BST layout generator with traversal animations (Pre/In/Post/Level order).

### 🕸 Algorithms
- **Graph Visualizer**: Interactive canvas for drawing nodes and edges, featuring BFS, DFS, and Dijkstra's shortest path.

### 🧮 Mathematics
- **Linear Algebra**: Matrix transformations and vector plotting.
- **Calculus**: Visual derivatives and area under the curve.

### 🌐 Networking
- **Packet Simulator**: Animated packet flow (Laptop → Router → Firewall → ISP → Server).
- **OSI Model**: Interactive 7-layer stack explainer.
- **TCP & UDP**: State machine and stream simulators highlighting packet loss vs reliability.
- **DNS & HTTP**: Resolution logs and request anatomy visualizers.
- **IP Routing & Congestion**: Shortest-path routing and queue overflow simulations.

### 🛠 Developer Tools
- **Linux Terminal**: Browser-based in-memory filesystem simulator supporting core bash commands.
- **Regex Playground**: Live matcher, flag toggling, and cheatsheet.
- **API Playground**: REST simulator supporting GET/POST/PUT/PATCH/DELETE with fake JSON responses.

### 🧠 Digital Aptitude & Fundamentals
- **Memory Logic**: Stack (LIFO) and Queue (FIFO) pointer visualizers.
- **Logic Gates**: Interactive circuit builder.
- **Number Systems**: Decimal, Binary, Octal, Hex conversions with step-by-step division traces.

---

## 📸 Screenshots

*(Placeholders for actual repository images)*

### Desktop
<!-- <img src="docs/screenshots/desktop-home.png" width="800" alt="Desktop Home"> -->
<!-- <img src="docs/screenshots/desktop-cpu.png" width="800" alt="CPU Simulator"> -->

### Tablet
<!-- <img src="docs/screenshots/tablet-terminal.png" width="600" alt="Tablet Terminal"> -->

### Mobile
<!-- <img src="docs/screenshots/mobile-regex.png" width="300" alt="Mobile Regex"> -->

---

## 🛠 Technology Stack

- **Frontend**: React 19
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4 (Strict utility classes, minimalist 'slate' theme)
- **Icons**: Lucide React
- **Math Engine**: Math.js
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Deployment**: Vercel / GitHub Pages
- **Version Control**: Git / GitHub
- **Future Backend**: (Planned) Next.js or Node.js for cloud saves

---

## 🏗 Project Architecture

Bunk & Learn Hub uses a monolithic React SPA architecture.

```text
src/
├── components/          # Reusable UI & Layouts (Sidebar, TopBar, Home)
│   ├── algorithms/      # Graph & Pathfinding
│   ├── api-playground/  # Fake REST API
│   ├── aptitude/        # Logic gates, Stacks, Queues
│   ├── data-structures/ # Trees
│   ├── docs/            # Informational Markdown-like React Pages
│   ├── fundamentals/    # Base CS math, Number systems
│   ├── math/            # Calculus, Algebra
│   ├── networking/      # Packet, TCP/UDP, Routing simulators
│   ├── regex/           # Regex IDE
│   └── terminal/        # Browser shell
├── utils/               # Pure JS algorithm engines
│   ├── FakeApi.js       # JSON mock DB
│   ├── FileSystem.js    # In-memory virtual FS
│   ├── GraphLogic.js    # Dijkstra, BFS, DFS
│   ├── SchedulerLogic.js# CPU burst math
│   └── TreeLogic.js     # BST layout math
├── App.jsx              # Main Router & State controller
├── index.css            # Tailwind directives
└── main.jsx             # React DOM entry
```

---

## ⚡ Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Clone & Install
```bash
git clone https://github.com/sundramdotdev/bunk-learn-os.git
cd bunk-learn-os
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🎨 Design System

Our platform adheres to strict UI/UX guidelines:
- **Colors**: Grayscale dominance (Tailwind `slate` and `zinc`). Accent colors (emerald, blue, red) are reserved strictly for system states (Success, Info, Error).
- **Typography**: Inter (sans) for prose. JetBrains Mono or similar (`font-mono`) for all technical data, logs, and terminal outputs.
- **Spacing**: Generous padding (`p-6`, `p-8`) to prevent cognitive overload.
- **Corners**: Brutalist/Minimalist (`rounded-none`).
- **Responsive**: Strict Mobile-First approach. All charts use `overflow-x-auto` to prevent horizontal scrolling on 320px screens.

---

## 🚀 Performance

- **Lightweight Dependencies**: We rely on pure JS logic instead of heavy visual libraries (no D3 or Three.js). SVGs are rendered natively by React for 60FPS animations.
- **No Backend Latency**: Operations run client-side, making the platform feel instantaneous.

---

## 🤝 Contributing Guide

We love open source! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

1. **Fork** the repository
2. **Clone** your fork (`git clone <url>`)
3. **Branch** off `main` (`git checkout -b feature/AmazingFeature`)
4. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
5. **Push** to the branch (`git push origin feature/AmazingFeature`)
6. **Open a Pull Request**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- **Contributors**: Thank you to all the students who have submitted PRs.
- **Icons**: [Lucide React](https://lucide.dev/)
- **Community**: Built for the global CS community.
