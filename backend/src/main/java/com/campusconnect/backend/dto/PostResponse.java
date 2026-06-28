package com.campusconnect.backend.dto;

import com.campusconnect.backend.entity.Post;
import java.time.LocalDateTime;

public class PostResponse {
    private Long id;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    private int likesCount;
    private int commentsCount;
    private int sharesCount;
    private AuthorInfo author;

    public static class AuthorInfo {
        private Long id;
        private String fullName;
        private String email;

        public AuthorInfo(Long id, String fullName, String email) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
        }

        public Long getId() { return id; }
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
    }

    public PostResponse(Post post) {
        this.id = post.getId();
        this.content = post.getContent();
        this.imageUrl = post.getImageUrl();
        this.createdAt = post.getCreatedAt();
        this.likesCount = post.getLikesCount();
        this.commentsCount = post.getCommentsCount();
        this.sharesCount = post.getSharesCount();
        this.author = new AuthorInfo(
                post.getAuthor().getId(),
                post.getAuthor().getFullName(),
                post.getAuthor().getEmail()
        );
    }

    public Long getId() { return id; }
    public String getContent() { return content; }
    public String getImageUrl() { return imageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public int getLikesCount() { return likesCount; }
    public int getCommentsCount() { return commentsCount; }
    public int getSharesCount() { return sharesCount; }
    public AuthorInfo getAuthor() { return author; }
}
