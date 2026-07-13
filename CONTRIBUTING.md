# Contributing to Bunk & Learn Hub

First off, thank you for considering contributing to Bunk & Learn Hub! It's people like you that make this educational tool great.

## 1. Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [Issues](https://github.com/sundramdotdev/bunk-learn-os/issues) first. If it doesn't exist, feel free to open a new one!

## 2. Fork & Create a Branch

1. Fork the repository.
2. Clone locally: `git clone https://github.com/YOUR_USERNAME/bunk-learn-os.git`
3. Create a branch for your edits: `git checkout -b fix/issue-number` or `git checkout -b feature/new-module`

## 3. Coding Standards

- **React Architecture**: Use Functional Components and React Hooks. Do not use Class components.
- **Styling**: We strictly use Tailwind CSS. Follow the existing minimalist, brutalist design (e.g., `rounded-none`, `slate` color palettes).
- **Data Logic Separation**: Keep pure algorithm logic in `src/utils/` and UI in `src/components/`.
- **Mobile First**: Test your components on a 320px width screen. Ensure no horizontal scrolling occurs on the `<body>`. Use `overflow-x-auto` for large data tables or SVGs.

## 4. Commit Message Convention

We follow conventional commits:
- `feat:` for new features (e.g., `feat: add dijkstra algorithm`)
- `fix:` for bug fixes (e.g., `fix: resolve mobile overflow in sidebar`)
- `docs:` for documentation updates
- `refactor:` for code restructuring without changing behavior

## 5. Submit a Pull Request

- Push your branch to your fork.
- Open a PR against the `main` branch.
- Describe your changes in detail in the PR template.
- Wait for a review!

Thank you for contributing!
