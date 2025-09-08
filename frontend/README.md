# Frontend

This is a React (Vite) frontend for the Job Portal app.

## Scripts

- npm run dev — start dev server
- npm run build — build for production
- npm run preview — preview the production build locally

## Configuration

- API base URL is read at build time via `VITE_API_BASE`.
	- Example for local dev: create `frontend/.env.local` with `VITE_API_BASE=http://localhost:8080`.
	- In CI, the GitHub Actions workflow sets it from your ALB DNS or custom domain.

## Deploy

Push changes to `main` to trigger the CI/CD workflow that builds the site and syncs it to your S3 bucket.
