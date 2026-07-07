package cn.yeyeyang.blog.profile;

public record ProfileDto(
    String name,
    String title,
    String bio,
    String avatar,
    String github,
    String twitter,
    String email
) {
    public static ProfileDto from(ProfileEntity profile) {
        return new ProfileDto(
            profile.getName(),
            profile.getTitle(),
            profile.getBio(),
            profile.getAvatar(),
            profile.getGithub(),
            profile.getTwitter(),
            profile.getEmail()
        );
    }
}
