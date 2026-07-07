package cn.yeyeyang.blog.auth;

public record AuthUserDto(String role) {
    public static AuthUserDto admin() {
        return new AuthUserDto("admin");
    }
}
