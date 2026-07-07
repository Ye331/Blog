package cn.yeyeyang.blog.post;

public record PostRequest(
    String id,
    String title,
    String content,
    String excerpt,
    String category,
    String readTime,
    String coverImage
) {
}
