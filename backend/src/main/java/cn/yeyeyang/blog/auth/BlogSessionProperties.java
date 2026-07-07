package cn.yeyeyang.blog.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "blog.session")
public record BlogSessionProperties(boolean cookieSecure) {
    public static final String COOKIE_NAME = "blog_admin_session";
}
