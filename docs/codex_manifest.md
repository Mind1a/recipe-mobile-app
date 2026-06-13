# Create `docs/codex_manifest.md` MVP Roadmap

## Summary

Create a single documentation file at `docs/codex_manifest.md` that becomes the master MVP roadmap for the Recipe Sharing Mobile App. Do not modify `mobile/` or `server/`.

Repo facts to reflect:

- `mobile/` exists and is initialized with Expo SDK 56, React Native, TypeScript, and expo-router.
- `server/` currently appears uninitialized and should be treated as a Phase 1 setup task.
- `docs/system_instructions.md` is the governing project instruction file.
- Cloudinary uploads must flow `mobile -> server -> Cloudinary`.
- Clerk is the only authentication provider.

## Key Content Decisions

- Treat MVP as a mobile-first Expo app, not a web app.
- Include these MVP features: Clerk auth, user sync/profile, public recipe feed, search/filter/sort, recipe detail, create/edit recipe, one main recipe image, draft/published/archived statuses, favorites, profile dashboards, loading/error/empty states.
- Defer these as post-MVP: comments, ratings, follows, notifications, reports/moderation dashboard, AI features, meal planner, shopping list, subscriptions, recommendation engine, admin dashboard, social analytics, offline mode.
- Recommend one main recipe image for MVP. Additional images and step images should be explicitly marked post-MVP to reduce upload, cleanup, and form complexity.
- Recommend a separate `Favorite` collection with a unique compound index on `{ userId, recipeId }`, instead of embedding saved recipe IDs in `User`, for deduplication, pagination, indexing, and future metadata.
- Recommend MongoDB user sync via `POST /api/users/sync` after Clerk login. Never trust `userId` from request bodies.

## Manifest Structure To Write

Create the requested 36 sections in this order:

1. App overview
2. Product goal
3. Target audience
4. MVP scope
5. Feature gap analysis
6. Features included in MVP
7. Features deferred to post-MVP
8. Repository architecture
9. Technical stack
10. Mobile app architecture
11. Backend architecture
12. Folder structure recommendations
13. Data model suggestions
14. Mongoose schema ideas
15. API route plan
16. Clerk auth flow
17. Cloudinary upload flow
18. Recipe creation flow
19. Favorites flow
20. User profile flow
21. Global feed/search/filter flow
22. Screen-by-screen requirements
23. Component ideas
24. UX states
25. Empty states
26. Loading states
27. Error states
28. Security and authorization rules
29. Validation strategy
30. Scalability considerations
31. Known risks
32. Open questions
33. Development phases
34. Suggested step files
35. MVP completion criteria
36. Immediate next step

## Public Interfaces To Document

Document these proposed route contracts only; do not implement them yet.

Public:

- `GET /api/recipes`
- `GET /api/recipes/:slug`
- `GET /api/users/:username`
- `GET /api/users/:username/recipes`

Protected:

- `GET /api/users/me`
- `POST /api/users/sync`
- `PATCH /api/users/me`
- `POST /api/recipes`
- `PATCH /api/recipes/:id`
- `DELETE /api/recipes/:id`
- `PATCH /api/recipes/:id/publish`
- `PATCH /api/recipes/:id/archive`
- `GET /api/favorites`
- `POST /api/favorites/:recipeId`
- `DELETE /api/favorites/:recipeId`
- `GET /api/recipes/:id/favorite-status`
- `POST /api/uploads/recipe-image`
- `POST /api/uploads/avatar`
- `DELETE /api/uploads/:publicId`

Document suggested Mongoose models:

- `User`: Clerk ID, username, display name, bio, avatar, timestamps.
- `Recipe`: owner, slug, title, description, image, ingredients, instructions, metadata, tags/category/cuisine, status, timestamps.
- `Favorite`: user, recipe, timestamps, unique user/recipe index.

## Screen Requirements

For each required screen, include purpose, UI sections, components, user actions, possible states, CTAs, empty states, loading states, error states, and access rules:

- Sign in
- Sign up
- Forgot password
- Global Recipe Feed
- Recipe Detail
- Recipe Creation Wizard
- My Profile / Dashboard
- Public Creator Profile
- Favorites Dashboard
- Edit Profile
- Edit Recipe as optional but recommended MVP support for owner-only changes

## Development Phases

Include phases with all statuses initially `Pending` unless the manifest notes repo initialization facts:

1. Project initialization
2. Auth + user profile foundation
3. Recipe model + public feed
4. Recipe detail screen
5. Recipe creation wizard
6. Cloudinary uploads
7. Favorites
8. Profile dashboards
9. Polish, validation, and MVP readiness

Add suggested future step files under `docs/steps/`, but do not create them:

- `docs/steps/part1_init.md`
- `docs/steps/part2_auth_profiles.md`
- `docs/steps/part3_recipe_feed.md`
- `docs/steps/part4_recipe_detail.md`
- `docs/steps/part5_recipe_creation.md`
- `docs/steps/part6_uploads_cloudinary.md`
- `docs/steps/part7_favorites.md`
- `docs/steps/part8_profiles.md`
- `docs/steps/part9_polish_mvp.md`

## Validation Plan

After creating the file, verify:

- `docs/codex_manifest.md` exists.
- It includes all 36 requested sections.
- It does not create or modify application code.
- It does not propose `web/`, `client/`, Next.js, Convex, RevenueCat, OpenAI APIs, monetization, or advanced social MVP scope.
- It clearly marks critical security rules, Cloudinary backend-only upload rules, Clerk ownership rules, and MongoDB/Mongoose index recommendations.

## Assumptions

- The manifest should be practical and startup-ready, but not a full implementation spec for every function.
- `server/` has no initialized package/config yet, so backend setup belongs in Phase 1.
- The recommended next step after the manifest is creating `docs/steps/part1_init.md`.
