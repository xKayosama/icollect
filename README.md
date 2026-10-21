# iCollect

React + TypeScript application built with Vite, Tailwind CSS v4, and shadcn/ui
(Base UI, Nova preset). Redux Toolkit, React Redux, and js-cookie are installed.

## Development

```bash
npm ci
npm run dev
npm run lint
npx tsc -b
npm run build
```

## Application structure

```text
src/
├── app/
│   ├── hooks.ts          # Typed Redux hooks
│   ├── providers.tsx     # Application providers
│   └── store.ts          # Store and inferred state/dispatch types
├── assets/               # Images and other bundled static assets
├── components/
│   └── ui/               # Generated shadcn/ui components
├── lib/
│   └── utils.ts          # Shared cn helper for shadcn/ui
├── services/
│   └── cookies.ts        # Non-sensitive browser cookie access
├── App.tsx               # Root composition (currently the Vite starter)
├── App.css               # Existing starter styles
├── index.css             # Tailwind imports, Nova tokens, and global styles
└── main.tsx              # React entry point
```

Use `@/` for source imports, for example `@/components/ui/button`.
Keep generated UI in `components/ui`; add `components/shared` only for application
components reused across features. Add `layouts` for actual shared page layouts.

When a feature is implemented, put its components, slice, selectors, services,
and domain types together under `src/features/<feature>/`. Add only files the
feature needs, and expose its public API through an `index.ts` when useful.
There is no auth feature or backend integration yet.

Register feature slices in `combineSlices(...)` in `app/store.ts`. The empty
combination intentionally starts without invented application state. Use
`useAppDispatch` and `useAppSelector` from `@/app/hooks`; keep transient UI state
(such as the starter counter) local to its component. Providers are composed in
`app/providers.tsx`.

Put API transport code in `services/api` when a backend exists; keep endpoint
logic in the owning feature's service. Add shared `types`, `constants`, `hooks`,
or `styles` directories only when concrete cross-feature code needs them.
Feature-specific types and constants stay in their feature.

Import `cookies` from `@/services/cookies` for non-sensitive preferences. Values
are strings; missing cookies return `undefined`. Defaults are `path: '/'`,
`sameSite: 'lax'`, and secure cookies in production (serve production over HTTPS).
Pass matching path/domain options when removing a cookie. Do not store passwords,
session identifiers, or authentication tokens here. Authentication should use
server-managed HttpOnly, Secure cookies with an appropriate SameSite policy;
frontend JavaScript cannot read HttpOnly cookies.

The Vite alias, Tailwind v4 plugin, and Nova theme are retained. TypeScript
uses the existing relative path mapping without the deprecated `baseUrl` option.
ESLint allows the generated UI `buttonVariants` export for Fast Refresh checks;
other lint rules and TypeScript settings are retained. The original generated button and utility were moved
from the literal root `@/` directory into `src/` to match the configured alias.
No additional dependencies are required.

---

## Original Vite template notes

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
