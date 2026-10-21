# iCollect

A React + TypeScript frontend for organizing shared expenses. The current setup
includes a responsive navigation shell, reusable UI components, and Redux
infrastructure. Feature pages, authentication, and backend integration are not
implemented yet; the main content area is currently empty.

## 1. Set up a local checkout

Prerequisites:

- Git to obtain the repository.
- Node.js compatible with the installed Vite version: `^20.19.0 || >=22.12.0`.
- npm, which is included with Node.js. This repository uses `package-lock.json`.

From your local repository folder, run:

```bash
npm ci
npm run dev
```

`npm ci` installs the dependency versions recorded in the lockfile. Open the local
URL printed by Vite in your terminal. The default is `http://localhost:5173`;
Vite may choose another port if that port is occupied.

No `.env` file, API key, database, or backend server is required for the current
application. Stop the development server with `Ctrl+C`.

## 2. How the project is configured

This section describes the configuration checked into the repository, rather
than a record of the original installation commands. For an existing checkout,
`npm ci` is sufficient; you do not need to scaffold or initialize it again.

### React, TypeScript, and Vite

The application uses React 19, TypeScript 6, and Vite 8. `index.html` loads
`src/main.tsx`, which renders the application in this order:

```text
StrictMode → AppProviders → App → AppLayout → page content
```

`vite.config.ts` enables the React and Tailwind plugins. TypeScript configuration
is split between `tsconfig.app.json` for application code and
`tsconfig.node.json` for tooling, with both referenced by `tsconfig.json`.

### Source import alias

The `@/` prefix points to `src/`. It is configured in both places so the bundler
and TypeScript resolve imports consistently:

- `vite.config.ts`: `@` resolves to the `src` directory.
- `tsconfig.app.json`: `@/*` maps to `./src/*`.

Example:

```tsx
import { Button } from '@/components/ui/button'
```

### Tailwind CSS and shadcn/ui

Tailwind CSS v4 is integrated through `@tailwindcss/vite` in `vite.config.ts`.
`src/index.css` imports Tailwind, `tw-animate-css`, shadcn styles, and the Geist
variable font. It also defines theme tokens, dark styles, and the scoped
`.app-shell` palette.

`components.json` configures shadcn/ui with:

- The `base-nova` style and Base UI primitives.
- TypeScript components, neutral base colors, and CSS variables.
- Lucide icons.
- Generated UI components under `src/components/ui`.
- The `cn` helper at `src/lib/utils.ts`, re-exported from the `cn` package.

Tailwind uses its Vite plugin and CSS configuration; there is no separate
`tailwind.config.js` in this setup. The existing generated button is in
`src/components/ui/button.tsx`.

### Redux Toolkit

`src/app/store.ts` creates the store with `configureStore` and an empty
`combineSlices()` reducer. No feature state has been registered yet.
`src/app/providers.tsx` makes the store available through React Redux's
`Provider`, and `src/main.tsx` wraps `App` with that provider.

Use the typed hooks from `src/app/hooks.ts`:

```tsx
import { useAppDispatch, useAppSelector } from '@/app/hooks'
```

When adding shared feature state, register its slice in `combineSlices(...)`.
Keep temporary component state local; the navigation shell currently uses React
state for its collapsed sidebar and mobile drawer.

### Cookie helper

`src/services/cookies.ts` wraps `js-cookie` for non-sensitive preferences:

```ts
import { cookies } from '@/services/cookies'

cookies.set('preferred-view', 'list', { expires: 30 })
const preferredView = cookies.get('preferred-view')
cookies.remove('preferred-view')
```

Values are strings, and a missing cookie returns `undefined`. Defaults are
`path: '/'`, `sameSite: 'lax'`, and `secure: true` in production. Production
cookie behavior therefore requires HTTPS. Use matching path/domain options
when deleting cookies created with custom options.

Keep authentication credentials out of this helper. Server-managed HttpOnly
cookies must be implemented by the backend when authentication is added.

### Navigation and layout

`src/components/layout/AppLayout.tsx` provides the header, content area,
desktop sidebar, and mobile Base UI dialog drawer. `Sidebar.tsx` renders the
navigation and profile area.

Navigation labels, icons, and IDs live in `src/constants/navigation.ts`:
Dashboard, Accounts, Account Monitoring, Distribution, Reports, and Settings.
Hash links update the active navigation item and header. Unknown hashes fall
back to Dashboard. A routing library and feature-specific page rendering have
not been added.

At widths of 1024px and above, the sidebar can collapse to an icon rail. At
smaller widths, the header menu button opens the drawer. Selecting a link or
resizing to desktop closes the drawer. Pass a `user` object to `Sidebar` when
real profile details are available; it currently uses a generic profile.

## 3. Project structure

```text
icollect/
├── public/                     # Static files served directly
├── src/
│   ├── app/
│   │   ├── hooks.ts            # Typed Redux hooks
│   │   ├── providers.tsx       # Application providers
│   │   └── store.ts            # Redux store and inferred types
│   ├── assets/                 # Bundled images and assets
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx   # Responsive application shell
│   │   │   └── Sidebar.tsx     # Navigation and profile area
│   │   └── ui/
│   │       └── button.tsx      # Generated shadcn/ui button
│   ├── constants/
│   │   └── navigation.ts       # Navigation definitions
│   ├── lib/
│   │   └── utils.ts            # Shared cn helper
│   ├── services/
│   │   └── cookies.ts          # Preference cookie access
│   ├── App.tsx                # Root layout and page content
│   ├── App.css                # Retained starter styles
│   ├── index.css              # Global styles and theme tokens
│   └── main.tsx               # React entry point
├── components.json            # shadcn/ui configuration
├── eslint.config.js           # Lint configuration
├── package.json               # Dependencies and npm scripts
├── package-lock.json          # Locked dependency versions
├── tsconfig*.json             # TypeScript configuration
└── vite.config.ts             # Build plugins and source alias
```

For new features, group their components, slices, selectors, services, and domain
types under `src/features/<feature>/` when needed. Keep generated UI in
`components/ui` and shared layout code in `components/layout`. Add shared
utilities only when they are used across features.

## 4. Commands and verification

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the locked dependencies for a fresh checkout |
| `npm run dev` | Start Vite with hot module replacement |
| `npm run lint` | Run ESLint on the project |
| `npx tsc -b` | Check the referenced TypeScript projects |
| `npm run build` | Check TypeScript and generate production files in `dist/` |
| `npm run preview` | Serve the production build locally for inspection |

To verify a change:

```bash
npm run lint
npm run build
npm run preview
```

Open the preview URL printed in the terminal. Check the desktop sidebar,
collapse control, and mobile drawer. Verify keyboard navigation, Escape and
backdrop dismissal, and focus returning to the menu button after closing the
drawer. The empty main area is expected until page content is implemented.

ESLint includes JavaScript, TypeScript, React Hooks, and Fast Refresh rules.
Generated UI files allow the `buttonVariants` export alongside components.
There is currently no automated test script in `package.json`.

`dist/` and `node_modules/` are ignored by Git. The production output can be
served by a static host; `npm run preview` is for local build inspection.

## 5. Troubleshooting

- **Node version error:** Check `node --version` against the Vite requirement
  above, switch to a compatible version, and rerun `npm ci`.
- **Dependency lock mismatch:** Use `npm install` when intentionally changing
  dependencies and commit both `package.json` and `package-lock.json`. Use
  `npm ci` to reproduce the committed setup.
- **Alias import fails:** Confirm the file is inside `src/` and that both Vite
  and TypeScript retain their `@` alias configuration.
- **Styles are missing:** Confirm `main.tsx` imports `index.css` and
  `vite.config.ts` includes `tailwindcss()`.
- **Preview does not show recent changes:** Run `npm run build` again before
  starting the preview server.

## Dark mode

Use the sun/moon button in the header to switch themes. The application follows
the operating system preference until you choose a theme, then saves that
choice in `localStorage` under `icollect-theme`. To return to the system default,
remove that key in browser developer tools and reload.

`src/lib/theme.ts` resolves and applies the theme before React renders.
`src/hooks/use-theme.ts` manages the toggle, system preference changes, and
synchronization between browser tabs. The `dark` class is applied to `<html>`,
so portalled dialogs inherit the theme too.

Use semantic Tailwind classes such as `bg-background`, `bg-sidebar`,
`text-foreground`, and `text-muted-foreground` for new content. Theme values are
in `src/index.css`; `.dark` defines the base dark palette and
`.dark .app-shell` defines the application shell overrides. Use `dark:` utilities
only when a component needs a theme-specific adjustment.
