# Online Store Client

React 19 + Vite storefront with React Router, React Query, Zustand, Tailwind CSS, and i18n.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

## Structure

```text
src/
  components/
  hooks/
  i18n/
  layouts/
  pages/
  providers/
  router/
  routes/
  seo/
  services/
  store/
  styles/
  theme/
  utils/
```

## Notes

- Routing is handled by `react-router-dom`
- API access is centralized in `src/services/api`
- Global app providers live in `src/providers/AppProviders.tsx`
- Page-level route adapters live in `src/routes/pages.tsx`
