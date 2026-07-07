package cn.yeyeyang.blog.admin;

import java.util.List;

import cn.yeyeyang.blog.post.PostDto;
import cn.yeyeyang.blog.post.PostService;
import cn.yeyeyang.blog.profile.ProfileDto;
import cn.yeyeyang.blog.profile.ProfileService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reset-demo-data")
public class ResetDemoDataController {
    private final PostService postService;
    private final ProfileService profileService;

    public ResetDemoDataController(PostService postService, ProfileService profileService) {
        this.postService = postService;
        this.profileService = profileService;
    }

    @PostMapping
    public ResetDemoDataResponse resetDemoData() {
        ProfileDto profile = profileService.resetDefault();
        List<PostDto> posts = postService.resetDefaults();
        return new ResetDemoDataResponse(profile, posts);
    }

    public record ResetDemoDataResponse(ProfileDto profile, List<PostDto> posts) {
    }
}
