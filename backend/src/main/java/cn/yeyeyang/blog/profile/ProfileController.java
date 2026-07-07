package cn.yeyeyang.blog.profile;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ProfileDto getProfile() {
        return profileService.getProfile();
    }

    @PutMapping
    public ProfileDto updateProfile(@RequestBody ProfileDto request) {
        return profileService.updateProfile(request);
    }
}
