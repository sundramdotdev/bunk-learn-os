# Detailed Features

This document provides an in-depth breakdown of every educational module included in Bunk & Learn Hub.

## 1. Operating Systems
- **CPU Scheduling**: Inputs process arrival and burst times. Computes completion, turnaround, and waiting times. Simulates algorithms including FCFS, SJF, SRTF, RR, HRRN, and LCN via a dynamic Gantt chart.
- **Memory Allocation**: Allows users to define memory partitions and incoming process requests. Simulates First-Fit and Best-Fit allocation strategies, displaying internal fragmentation graphically.
- **Page Replacement**: Visualizes how frames are allocated and swapped using algorithms like FIFO, LRU, and Optimal to calculate page faults.
- **Disk Scheduling**: Tracks the disk head across tracks based on initial position and algorithm (FCFS, SSTF, SCAN, C-SCAN) using an animated line chart.
- **Banker's Algorithm**: Demonstrates deadlock avoidance by showing the safe sequence computation through Allocation, Max, and Need matrices.

## 2. Developer Tools
- **Linux Terminal**: An interactive bash-like simulator running entirely in-memory. Supports core commands (`ls`, `cd`, `mkdir`, `cat`, `echo`, `rm`) with a responsive UI.
- **Regex Playground**: Real-time matching engine. Explains character classes, quantifiers, and flags while highlighting exact string matches.
- **API Playground**: A simulated REST client. Send GET, POST, PUT, PATCH, DELETE requests to a mock JSON database. Visualizes the request cycle (Client -> Internet -> Server -> DB) and renders HTTP status codes and payloads.

## 3. Data Structures & Algorithms
- **Binary Tree**: Insert and delete nodes dynamically. The app computes the x/y coordinates for every node to draw an SVG tree. Includes step-by-step animations for traversals (Preorder, Inorder, Postorder, Level order).
- **Graph Visualizer**: Create custom graphs on an open canvas. Define edge weights. Step through Breadth-First Search, Depth-First Search, and Dijkstra's Shortest Path algorithm with real-time distance table updates.

## 4. Computer Networking
- **Packet Simulator**: Trace a data packet's hop-by-hop journey including latency and TTL.
- **OSI Model**: Interactive 7-layer stack demonstrating the purpose of each layer.
- **TCP / UDP**: Compares the strict state-machine handshake of TCP vs the connectionless, loss-prone stream of UDP.
- **DNS**: Logs the step-by-step resolution process of translating a domain name to an IP.
- **HTTP**: Breaks down the anatomy of raw HTTP requests and responses.
- **IP Routing & Congestion**: Visualizes shortest path finding and router queue overflows based on configurable bandwidth and traffic sliders.

## 5. Fundamentals & Aptitude
- **Number Systems**: Step-by-step division and multiplication tracing to convert between decimal, binary, octal, hex, and ASCII.
- **Logic Gates**: Drag-and-drop circuit simulator.
- **Memory Logic**: Visualizes LIFO (Stacks) and FIFO (Queues) behavior.
