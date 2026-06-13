<div align="center">
  <img src="public/logo.svg" alt="ASTra Logo" width="80" height="80">
  
  <h1>ASTra</h1>
  <p><strong>A local full-stack static analysis engine that visually maps out React codebase architectures, prop-drilling, and blast radiuses.</strong></p>
  <p>
    <a href="https://github.com/Arunava07M/ASTra"><strong>https://github.com/Arunava07M/ASTra</strong></a>
  </p>
</div>

## Overview

ASTra is a tool I built to solve the headache of jumping into a massive, undocumented React codebase. The idea is simple: instead of opening 15 different files to figure out how a specific piece of state is getting passed down, or guessing what might break if you delete a component, you just point ASTra at the folder.

It runs a local Node.js engine to read your raw code, parses it into an Abstract Syntax Tree (AST), and then automatically draws a beautiful, interactive dependency map on a React Flow canvas. It shows you how files connect, highlights massive files as "tech debt", catches dead code, and visualizes exactly which props are moving between components.

## How it Works

### 1. The Parser Engine (AST & DFS)
When you target a folder, the backend doesn't just read the text; it uses `@babel/parser` to compile your JavaScript/JSX into an Abstract Syntax Tree. It uses a recursive Depth-First Search (DFS) to walk through the tree, extracting file imports, calculating file sizes, and ripping out the exact JSX props being passed between React components.

### 2. Auto-Arranging the Map (DAG Layouts)
If you just threw 50 files onto a canvas, they would all pile up at `x:0, y:0`. ASTra uses `dagre` (a mathematical graph layout algorithm) to assign hierarchical ranks and Cartesian coordinates to every file. It structures your codebase into a perfect Directed Acyclic Graph (DAG) so data flows cleanly from top to bottom.

### 3. Tracing the Blast Radius (Reverse BFS)
When you click a file on the canvas, the app runs a custom Reverse Breadth-First Search (BFS) graph traversal algorithm `O(V + E)`. It instantly dims the rest of the codebase and traces a bright red line *upwards* to show you exactly which parent files rely on the component you clicked, warning you of the "blast radius" before you refactor.

### 4. Catching Dead Code (O(1) Hash Sets)
To figure out if a file is an orphan (never imported anywhere), the backend dumps every single import target into a JavaScript `Set`. Instead of running a slow nested loop `O(N^2)`, it checks the set in constant `O(1)` time, instantly throwing unused files into the "Dead Code Graveyard" in the sidebar.

## Features

- **Automated Architecture Map** — point it at any React `src` folder and get a complete visual tree
- **Data Flow / Prop-Drilling Visualizer** — toggle a switch to see exactly which props (like `isLoading`, `onScan`) are passing between files
- **Blast Radius Tracing** — click any node to highlight its downstream dependencies
- **Tech Debt Heatmap** — file nodes are color-coded (Emerald/Amber/Red) based on raw file size to expose bloated components
- **Dead Code Graveyard** — automatically detects and lists files that are safe to delete
- **Glass-morphism FTUE** — a sleek, local-storage powered welcome tutorial for first-time users

## Tech Stack Used

* **Frontend:** React.js (Vite), Tailwind CSS v4
* **Canvas Engine:** React Flow (`@xyflow/react`), Dagre
* **Backend:** Node.js, Express.js
* **Code Parser:** Babel AST Parser (`@babel/parser`)
* **Icons & UI:** Lucide React

---

## How to Run This on Your Computer

### Prerequisites
- Node.js installed
- A local React codebase on your computer that you want to scan

*(Note: Because this is a local developer tool that reads your file system, there is no `.env` file or external database required!)*

### 1. Start the Backend Engine

Open a terminal, go to the `backend` folder, and install the packages:

```bash
cd backend
npm install
```
Start the backend server (runs on Port 8000 by default):

```bash
npm run dev
```

### 2. Start the Frontend Visualizer

Open a new terminal, go to the frontend folder, and install the packages:

```bash
cd frontend
npm install
```

Start the frontend application:

```bash
npm run dev
```

Open http://localhost:5173 in your browser. The welcome modal will pop up, and you can paste the absolute path to any local React src folder to start mapping!