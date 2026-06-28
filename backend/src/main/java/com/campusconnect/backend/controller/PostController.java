package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.PostResponse;
import com.campusconnect.backend.entity.Post;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.repository.PostRepository;
import com.campusconnect.backend.repository.UserRepository;
import com.campusconnect.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired private PostRepository postRepository;
    @Autowired private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        List<PostResponse> posts = postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(PostResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(posts);
    }

    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setContent(body.get("content"));
        post.setImageUrl(body.get("imageUrl"));
        post.setAuthor(user);
        postRepository.save(post);

        return ResponseEntity.ok(new PostResponse(post));
    }
}
