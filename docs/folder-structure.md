# Project Folder Structure

This document outlines the folder structure for the portfolio project, explaining where different types of files and components belong. This architecture is designed to be maintainable, scalable, and easy to navigate.

## Overview

```
src/
├── assets/         # Static assets (images, animations, global styles)
├── components/     # Global, reusable components
│   ├── layout/     # Structural components used across the app (Navbar, Footer, Preloader)
│   ├── shared/     # Components used across multiple pages but not structural (e.g. HoveredImages)
│   └── ui/         # Generic, low-level UI elements (Buttons, Inputs, Magnet, CustomCursor)
├── constants/      # Static data and constants (e.g. works.js, blogs.js, certificatesList.js)
├── pages/          # Page components and their specific sub-components
├── services/       # API and data fetching services (e.g. workService.js, postService.js)
└── utils/          # Helper functions and utilities (e.g. animationUtils.js)
```

## Detailed Breakdown

### `src/components/`

This directory houses components that are intended to be shared globally across the application.

*   **`layout/`**: Contains components that form the main structure/layout of the application, such as the `Navbar`, `Footer`, and `PreLoader`.
*   **`shared/`**: Contains larger composite components that might be used on more than one page, but aren't fundamental structural elements or basic UI widgets.
*   **`ui/`**: Contains the most granular, reusable UI building blocks. Examples include `PrimaryButton`, custom `Input` fields, and the `Magnet` interaction wrapper. These components should generally be stateless (or only manage internal UI state) and highly reusable.

### `src/pages/`

This directory contains the main route components for the application.

Each page (e.g., `Home`, `About`, `Experience`, `Contact`) has its own dedicated folder. 
Crucially, **components that are only used within a specific page live inside that page's `components/` subfolder.**

```
pages/
├── Home/
│   ├── Home.jsx                    # The main route component for the Home page
│   └── components/                 # Components EXCLUSIVE to the Home page
│       ├── HomeAbout/
│       ├── HomeEntrance/
│       └── ...
├── About/
│   ├── About.jsx
│   └── components/                 # Components EXCLUSIVE to the About page
│       ├── AboutCertificate/
│       └── AboutEntrance/
└── ...
```

**Why this structure?**
Co-locating page-specific components with their parent page prevents the global `src/components/` directory from becoming bloated and disorganized. If a component is only used on the Home page, it belongs in `src/pages/Home/components/`. If a component is used on both the Home page and the About page, it should be promoted to `src/components/shared/` or `src/components/ui/`.

### `src/constants/`

Stores static data arrays, configuration objects, or any constant values used throughout the app. 
Files in here should be named in `camelCase` (e.g., `works.js`, `blogs.js`).

### `src/services/`

Contains logic for fetching data, interacting with APIs, or managing external services. 
Examples: `postService.js`, `workService.js`.

### `src/utils/`

Contains helper functions, custom hooks (if not kept in a separate `hooks/` folder), and other utilities. 
Examples: `animationUtils.js`, `navigationImageAnimation.js`.

## Rules for Maintainability

1.  **Avoid Deep Imports if Possible**: While the nested page component structure is clean, try to keep related files close together to avoid overly long relative paths like `../../../../components/ui/Buttons/PrimaryButton`. (Alternatively, consider configuring absolute import paths with `@/components/...` in Vite/Webpack).
2.  **Naming Conventions**:
    *   **Components**: PascalCase (e.g., `PrimaryButton.jsx`, `HomeEntrance.jsx`)
    *   **Utilities/Services/Constants**: camelCase (e.g., `animationUtils.js`, `workService.js`, `blogs.js`)
3.  **Promote When Needed**: If you create a component in a page's `components/` folder and later realize you need it on another page, move it up to the global `src/components/shared/` or `src/components/ui/` directory and update the imports.
