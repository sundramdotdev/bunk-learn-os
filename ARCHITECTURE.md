# Project Architecture

Bunk & Learn Hub is designed as a monolithic Single Page Application (SPA) using React. The core philosophy is to keep state local where possible, and lift it to `App.jsx` only when multiple modules need cross-communication (which is rare). 

## Directory Structure

```text
src/
├── components/          
│   ├── algorithms/      # Graph algorithms, Pathfinding logic UI
│   ├── api-playground/  # Simulated API UI
│   ├── aptitude/        # Stacks, Queues, Logic Gates
│   ├── data-structures/ # Binary Tree UI
│   ├── docs/            # Markdown-like informational pages
│   ├── fundamentals/    # Core CS concepts, number systems
│   ├── math/            # Math visualizers
│   ├── networking/      # Sub-components of the Networking Suite
│   ├── regex/           # Regex editor UI
│   └── terminal/        # Terminal emulator UI
├── utils/               
│   ├── FakeApi.js       # Mock database and REST handler
│   ├── FileSystem.js    # In-memory virtual FS (Tree structure)
│   ├── GraphLogic.js    # Dijkstra, BFS, DFS algorithms
│   ├── SchedulerLogic.js# CPU scheduling mathematical logic
│   └── TreeLogic.js     # Binary Tree algorithms and layout generators
├── App.jsx              # Main routing and global state controller
├── index.css            # Tailwind configuration and global styles
└── main.jsx             # React entry point
```

## Architectural Principles

1. **Separation of Concerns**: Mathematical and algorithmic logic (e.g., shortest path calculations, tree node coordinate mapping) are kept entirely separate in the `utils/` directory. React components in `components/` merely pass inputs to these pure functions and render the output.
2. **No Backend Required**: All simulators run entirely in the browser using JavaScript. The File System is a JS object tree, the API is mocked, and algorithms run instantly.
3. **SVG over Canvas**: For interactive visualizers (Trees, Graphs, Networking topologies), we prefer standard SVG elements over HTML5 `<canvas>`. This allows us to use CSS animations (Tailwind transitions) and native DOM event listeners (`onClick`, `onPointerDown`) seamlessly without writing custom hit-detection logic.
4. **Strict Styling**: Styling uses Tailwind CSS exclusively. We adhere to a brutally minimalist design system leveraging grayscale (`slate`, `zinc`) heavily.
