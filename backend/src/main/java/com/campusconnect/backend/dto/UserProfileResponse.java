package com.campusconnect.backend.dto;

import com.campusconnect.backend.entity.UserProfile;

public class UserProfileResponse {
    private Long userId;
    private String fullName;
    private String email;
    private String role;
    
    private String bio;
    private String headline;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private String skills;

    public UserProfileResponse() {}

    public UserProfileResponse(UserProfile profile) {
        this.userId = profile.getUser().getId();
        this.fullName = profile.getUser().getFullName();
        this.email = profile.getUser().getEmail();
        this.role = profile.getUser().getRole();
        
        this.bio = profile.getBio();
        this.headline = profile.getHeadline();
        this.githubUrl = profile.getGithubUrl();
        this.linkedinUrl = profile.getLinkedinUrl();
        this.portfolioUrl = profile.getPortfolioUrl();
        this.skills = profile.getSkills();
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
}
