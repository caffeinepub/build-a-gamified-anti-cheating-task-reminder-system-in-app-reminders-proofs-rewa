# Specification

## Summary
**Goal:** Redesign the app UI to look and feel like a mobile game HUD/dashboard, using the uploaded reference screenshot as the primary style guide.

**Planned changes:**
- Apply a cohesive dark, high-contrast, game-like visual theme across all pages and dialogs (glossy/elevated cards, neon accents, soft gradients, subtle depth).
- Update global styling tokens (CSS variables/Tailwind theme usage) for a dark-first palette with purple/magenta accents, consistent elevation, borders, glow states, and interactive hover/active/focus states.
- Redesign the main layout (header + navigation + page container) into a compact, stylized game HUD/menu with a clear active route state and responsive mobile behavior.
- Redesign the Home page into a game dashboard structure: profile/player panel, level/XP progress bar, streak panel, coin panel, and a prominent “Today’s Tasks” section with a strong primary CTA.
- Restyle task presentation components (TaskCard, task lists, task actions) to use the new card style, themed chips/badges, and a standout primary action button without changing functionality.
- Enhance celebratory/progression UI (reward overlays, progress bars, badges) to feel like in-game reward/progression surfaces while respecting reduced-motion settings.
- Ensure the provided generated images exist under `frontend/public/assets/generated` and are referenced via static paths (at minimum use the logo mark in the header; keep other assets available for relevant pages).

**User-visible outcome:** The app no longer looks like a standard website dashboard; it presents a consistent game-like UI across all sections, with a redesigned HUD layout and a Home dashboard that matches the reference style and hierarchy on both desktop and mobile.
