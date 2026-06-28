package com.campusconnect.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "clubs")
public class Club {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String category;
    
    @Column(length = 1000)
    private String description;
    
    private String imageUrl;
    
    private Integer memberCount = 0;
    
    @ManyToOne
    @JoinColumn(name = "admin_id")
    private User admin;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getMemberCount() { return memberCount; }
    public void setMemberCount(Integer memberCount) { this.memberCount = memberCount; }

    public User getAdmin() { return admin; }
    public void setAdmin(User admin) { this.admin = admin; }
}
