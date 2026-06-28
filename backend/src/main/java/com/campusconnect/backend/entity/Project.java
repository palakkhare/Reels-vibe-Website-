package com.campusconnect.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "projects")
public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 2000)
    private String description;
    
    private String githubLink;
    
    private String liveDemoLink;
    
    private String technologies;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getGithubLink() { return githubLink; }
    public void setGithubLink(String githubLink) { this.githubLink = githubLink; }

    public String getLiveDemoLink() { return liveDemoLink; }
    public void setLiveDemoLink(String liveDemoLink) { this.liveDemoLink = liveDemoLink; }

    public String getTechnologies() { return technologies; }
    public void setTechnologies(String technologies) { this.technologies = technologies; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
}
