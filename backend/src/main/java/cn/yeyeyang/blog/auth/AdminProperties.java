package cn.yeyeyang.blog.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "blog.admin")
public record AdminProperties(String username, String password) {
}
