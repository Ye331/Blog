package cn.yeyeyang.blog.post;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class PostService {
    private static final DateTimeFormatter DISPLAY_DATE = DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.US);
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Transactional(readOnly = true)
    public List<PostDto> listPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream().map(PostDto::from).toList();
    }

    @Transactional(readOnly = true)
    public PostDto getPost(String id) {
        return PostDto.from(findPost(id));
    }

    @Transactional
    public PostDto createPost(PostRequest request) {
        PostEntity post = new PostEntity();
        post.setId(UUID.randomUUID().toString());
        post.setDate(LocalDate.now().format(DISPLAY_DATE));
        applyRequest(post, request);
        return PostDto.from(postRepository.save(post));
    }

    @Transactional
    public PostDto updatePost(String id, PostRequest request) {
        PostEntity post = findPost(id);
        applyRequest(post, request);
        return PostDto.from(postRepository.save(post));
    }

    @Transactional
    public void deletePost(String id) {
        if (!postRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }
        postRepository.deleteById(id);
    }

    @Transactional
    public List<PostDto> resetDefaults() {
        postRepository.deleteAll();
        postRepository.saveAll(DefaultPosts.create());
        return listPosts();
    }

    private PostEntity findPost(String id) {
        return postRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
    }

    private void applyRequest(PostEntity post, PostRequest request) {
        post.setTitle(required(request.title(), "title"));
        post.setContent(required(request.content(), "content"));
        post.setExcerpt(defaultExcerpt(request.excerpt(), request.content()));
        post.setCategory(required(request.category(), "category"));
        post.setReadTime(defaultValue(request.readTime(), "5 min read"));
        post.setCoverImage(blankToNull(request.coverImage()));
    }

    private String required(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " is required");
        }
        return value.trim();
    }

    private String defaultExcerpt(String excerpt, String content) {
        if (excerpt != null && !excerpt.isBlank()) {
            return excerpt.trim();
        }
        String cleanContent = required(content, "content").trim();
        return cleanContent.length() <= 140 ? cleanContent : cleanContent.substring(0, 140) + "...";
    }

    private String defaultValue(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
