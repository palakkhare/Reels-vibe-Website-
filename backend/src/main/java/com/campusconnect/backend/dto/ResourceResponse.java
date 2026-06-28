package com.campusconnect.backend.dto;

import com.campusconnect.backend.entity.Resource;
import java.time.LocalDateTime;

public class ResourceResponse {

    private Long id;
    private String title;
    private String description;
    private String fileUrl;
    private String type;
    private String uploaderName;
    private String subjectName;
    private String departmentName;
    private LocalDateTime uploadedAt;
    private int downloads;

    public ResourceResponse() {}

    public ResourceResponse(Resource resource) {
        this.id = resource.getId();
        this.title = resource.getTitle();
        this.description = resource.getDescription();
        this.fileUrl = resource.getFileUrl();
        this.type = resource.getType().name();
        this.uploaderName = resource.getUploader().getFullName();
        this.subjectName = resource.getSubject().getName();
        this.departmentName = resource.getSubject().getDepartment().getName();
        this.uploadedAt = resource.getUploadedAt();
        this.downloads = resource.getDownloads();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getUploaderName() { return uploaderName; }
    public void setUploaderName(String uploaderName) { this.uploaderName = uploaderName; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }

    public int getDownloads() { return downloads; }
    public void setDownloads(int downloads) { this.downloads = downloads; }
}
