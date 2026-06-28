package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.UserProfileRequest;
import com.campusconnect.backend.dto.UserProfileResponse;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.entity.UserProfile;
import com.campusconnect.backend.repository.UserProfileRepository;
import com.campusconnect.backend.repository.UserRepository;
import com.campusconnect.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserProfileController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return getProfileByUserId(userDetails.getId());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfileByUserId(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();
        UserProfile profile = user.getProfile();
        
        if (profile == null) {
            // Create an empty profile on the fly if it doesn't exist yet
            profile = new UserProfile();
            profile.setUser(user);
            profile = userProfileRepository.save(profile);
            user.setProfile(profile);
            userRepository.save(user);
        }
        
        return ResponseEntity.ok(new UserProfileResponse(profile));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody UserProfileRequest request) {
            
        Optional<User> userOpt = userRepository.findById(userDetails.getId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();
        UserProfile profile = user.getProfile();
        
        if (profile == null) {
            profile = new UserProfile();
            profile.setUser(user);
        }
        
        profile.setBio(request.getBio());
        profile.setHeadline(request.getHeadline());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setPortfolioUrl(request.getPortfolioUrl());
        profile.setSkills(request.getSkills());
        
        profile = userProfileRepository.save(profile);
        user.setProfile(profile);
        userRepository.save(user);
        
        return ResponseEntity.ok(new UserProfileResponse(profile));
    }
}
