package cn.yeyeyang.blog.auth;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class SessionService {
    private static final Duration SESSION_TTL = Duration.ofDays(7);
    private final SecureRandom secureRandom = new SecureRandom();
    private final Set<String> activeTokens = ConcurrentHashMap.newKeySet();

    public String createSessionToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        activeTokens.add(token);
        return token;
    }

    public boolean isValid(String token) {
        return token != null && activeTokens.contains(token);
    }

    public void revoke(String token) {
        if (token != null) {
            activeTokens.remove(token);
        }
    }

    public ResponseCookie sessionCookie(String token, boolean secure) {
        return ResponseCookie.from(BlogSessionProperties.COOKIE_NAME, token)
            .httpOnly(true)
            .secure(secure)
            .sameSite("Lax")
            .path("/")
            .maxAge(SESSION_TTL)
            .build();
    }

    public ResponseCookie clearedCookie(boolean secure) {
        return ResponseCookie.from(BlogSessionProperties.COOKIE_NAME, "")
            .httpOnly(true)
            .secure(secure)
            .sameSite("Lax")
            .path("/")
            .maxAge(Duration.ZERO)
            .build();
    }
}
