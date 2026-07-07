package cn.yeyeyang.blog.profile;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public ProfileDto getProfile() {
        return ProfileDto.from(findProfile());
    }

    @Transactional
    public ProfileDto updateProfile(ProfileDto request) {
        ProfileEntity profile = findProfile();
        applyProfile(profile, request);
        return ProfileDto.from(profileRepository.save(profile));
    }

    private ProfileEntity findProfile() {
        return profileRepository.findById(ProfileEntity.SINGLETON_ID)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
    }

    private void applyProfile(ProfileEntity profile, ProfileDto request) {
        profile.setId(ProfileEntity.SINGLETON_ID);
        profile.setName(required(request.name(), "name"));
        profile.setTitle(defaultValue(request.title(), ""));
        profile.setBio(defaultValue(request.bio(), ""));
        profile.setAvatar(defaultValue(request.avatar(), "/avatar.jpg"));
        profile.setGithub(blankToNull(request.github()));
        profile.setTwitter(blankToNull(request.twitter()));
        profile.setEmail(blankToNull(request.email()));
    }

    private String required(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " is required");
        }
        return value.trim();
    }

    private String defaultValue(String value, String fallback) {
        return value == null ? fallback : value.trim();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
