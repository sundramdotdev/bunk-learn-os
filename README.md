# Bunk & Learn Hub

![Open Source](https://img.shields.io/badge/Open%20Source-Heart-red?style=for-the-badge)
![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)

> **From a classroom experiment to a complete CS visualizer.**

**Bunk & Learn Hub** is a minimalist, interactive educational platform designed for Computer Science students to visualize complex concepts that are traditionally taught via dry mathematical formulas and paper-pencil calculations.

---

## 🚀 The Journey

It started at 2 AM before an Operating Systems exam. The frustration of manually tracing disk head movements and page replacement strings sparked an idea: *Why not automate the visualization?*

What began as a simple **OS Lab Visualizer** has now evolved into a comprehensive **multi-subject learning hub**. We've traded abstract formulas for dynamic, real-time animations, helping students transition from rote memorization to intuitive understanding.

---

## 📸 Gallery

<div align="center">

![Home Page Journey & Subject Grid](./docs/home.png)
*Modern Landing Hub with Subject Selection*

![OS Module - Disk Scheduling Graph](./docs/disk.png)
*Interactive Disk Head Movement Visualization*

![Number System Converter](./docs/converter.png)
*Step-by-Step Base Conversion Logic*

</div>

---

## 📚 Modules Included

| Subject | Modules | Key Features |
| :--- | :--- | :--- |
| **Operating Systems** | CPU Scheduling, Memory Allocation, Page Replacement, Disk Scheduling, Banker's Algorithm | Dynamic Gantt charts, Fragmentation highlighting, Head movement tracing, Step-by-step logic logs. |
| **Computer Fundamentals** | Number System Converter | Real-time conversion across Decimal, Binary, Octal, Hex, and ASCII with division-trace explanations. |
| **Digital Aptitude & Logic** | Stack (LIFO), Queue (FIFO), Memory Layout | Interactive stack/queue pointers, visual memory address space mapping (Code, Data, Heap, Stack). |

---

## 🎨 Design System & UI Architecture

The Hub follows a strict **"Modern Academic"** aesthetic:

- **Theme:** Ultra-minimalist **Zinc/Slate** palette for high concentration.
- **Typography:** 
  - Standard sans-serif for interface elements.
  - **Strictly Monospace** for all data points, logs, memory addresses, and base conversions.
- **UI Components:** Sharp, professional borders (`rounded-none` or `rounded-sm`) and sleek glassmorphism for the `TopBar` (`backdrop-blur-md bg-white/80`).
- **Responsiveness:** A mobile-first approach with `overflow-x-auto` wrappers ensures that even complex Gantt charts and memory grids are fully scrollable on small screens.

---

## 📂 Folder Structure

The project is structured for high modularity and ease of contribution:

```text
src/
├── components/
│   ├── aptitude/       # Stack, Queue, and Memory Layout logic
│   ├── os/             # CPU, Disk, Page, and Banker's modules
│   ├── fundamentals/   # Number system and architecture basics
│   ├── TopBar.jsx      # Global fixed header & system controls
│   ├── Sidebar.jsx     # Responsive subject navigation
│   └── Footer.jsx      # Branding and link footer
├── data/
│   └── contributors.js # Hall of Fame data repository
├── utils/
│   └── Logic.js        # Pure JS algorithm implementations
└── App.jsx             # Global layout & view orchestration
```

---

## 🤝 Open Source & Contribution

This is a **community-driven platform** built by students, for students. We believe that the best way to learn a concept is to build a visualizer for it. 

We feature an integrated **"Contributors Hall of Fame"** directly on the platform to recognize everyone who helps scale this hub.

### How to contribute:
1. **Fork** the repository.
2. **Create a Branch** for your feature/bugfix (`git checkout -b feature/awesome-module`).
3. **Commit** your changes (`git commit -m 'Add: Memory Hierarchy Visualizer'`).
4. **Push** to the branch (`git push origin feature/awesome-module`).
5. Open a **Pull Request**.

---

## 👨‍💻 Author & Contact

**Sundram Gupta**
- **GitHub:** [@sundramdotdev](https://github.com/sundramdotdev)
- **LinkedIn:** [linkedin.com/in/sundaramdotdev](https://www.linkedin.com/in/sundaramdotdev)

---

<div align="center">
Built with ❤️ during the bunked classes.
</div>
