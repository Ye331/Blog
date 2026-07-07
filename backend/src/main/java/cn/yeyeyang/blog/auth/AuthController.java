package cn.yeyeyang.blog.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import cn.yeyeyang.blog.common.ErrorResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AdminProperties adminProperties;
    private final BlogSessionProperties sessionProperties;
    private final SessionService sessionService;

    public AuthController(
        AdminProperties adminProperties,
        BlogSessionProperties sessionProperties,
        SessionService sessionService
    ) {
        this.adminProperties = adminProperties;
        this.sessionProperties = sessionProperties;
        this.sessionService = sessionService;
    }

    @GetMapping("/me")
    public AuthResponse me() {
        return AuthResponse.admin();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (!matches(request.username(), adminProperties.username())
            || !matches(request.password(), adminProperties.password())) {
            return ResponseEntity.status(401).body(new ErrorResponse("Invalid username or password"));
        }

        String token = sessionService.createSessionToken();
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, sessionService.sessionCookie(token, sessionProperties.cookieSecure()).toString())
            .body(AuthResponse.admin());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        sessionService.revoke(readSessionCookie(request));
        return ResponseEntity.noContent()
            .header(HttpHeaders.SET_COOKIE, sessionService.clearedCookie(sessionProperties.cookieSecure()).toString())
            .build();
    }

    private boolean matches(String actual, String expected) {
        if (actual == null || expected == null) {
            return false;
        }
        byte[] actualBytes = actual.getBytes(StandardCharsets.UTF_8);
        byte[] expectedBytes = expected.getBytes(StandardCharsets.UTF_8);
        return MessageDigest.isEqual(actualBytes, expectedBytes);
    }

    private String readSessionCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        for (Cookie cookie : cookies) {
            if (BlogSessionProperties.COOKIE_NAME.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
