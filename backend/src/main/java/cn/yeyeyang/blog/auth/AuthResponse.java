package cn.yeyeyang.blog.auth;

public record AuthResponse(AuthUserDto user) {
    public static AuthResponse admin() {
        return new AuthResponse(AuthUserDto.admin());
    }
}
