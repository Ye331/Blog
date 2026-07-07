# Personal Blog

Monorepo for `yeyeyang.cn`.

## Project Layout

- `frontend/`: React + Vite blog UI.
- `backend/`: Java Spring Boot backend skeleton.
- `deploy/`: Nginx and systemd deployment templates.
- `legacy/`: Temporary Express API kept for reference only.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:3000` and proxies `/api` to the Java backend on `http://localhost:8080`.

## Backend

```bash
cd backend
mvn spring-boot:run
```

The Java backend serves the blog API with Spring Boot, Spring Security, JPA, Flyway, and PostgreSQL. Public read APIs are available under `/api/posts` and `/api/profile`; admin writes require the `blog_admin_session` HttpOnly cookie created by `/api/auth/login`.

Configure production credentials through environment variables:

```bash
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="replace-with-a-strong-password"
SESSION_COOKIE_SECURE="true"
```

## Deployment

See `deploy/README.md`. The intended production path is:

1. Build frontend assets.
2. Copy `frontend/dist` into the Spring Boot static resources.
3. Build a Spring Boot jar.
4. Run the jar with systemd.
5. Reverse proxy `yeyeyang.cn` to `localhost:8080` with Nginx.
