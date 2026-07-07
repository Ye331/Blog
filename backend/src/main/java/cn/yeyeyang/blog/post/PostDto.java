package cn.yeyeyang.blog.post;

public record PostDto(
    String id,
    String title,
    String content,
    String excerpt,
    String category,
    String date,
    String readTime,
    String coverImage
) {
    public static PostDto from(PostEntity post) {
        return new PostDto(
            post.getId(),
            post.getTitle(),
            post.getContent(),
            post.getExcerpt(),
            post.getCategory(),
            post.getDate(),
            post.getReadTime(),
            post.getCoverImage()
        );
    }
}
