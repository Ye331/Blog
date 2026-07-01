# Deploy Notes

Target deployment shape:

1. Build the React frontend from `frontend/`.
2. Copy `frontend/dist/*` into `backend/src/main/resources/static/`.
3. Build the Spring Boot jar from `backend/`.
4. Run the jar with `systemd`.
5. Let Nginx reverse proxy `yeyeyang.cn` to `localhost:8080`.

The files in `deploy/nginx/` and `deploy/systemd/` are starter templates. Update paths, Linux user, database credentials, and HTTPS settings before production use.
