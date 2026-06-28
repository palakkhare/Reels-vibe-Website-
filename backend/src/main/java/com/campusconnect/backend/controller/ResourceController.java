package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.ResourceResponse;
import com.campusconnect.backend.entity.Resource;
import com.campusconnect.backend.entity.Subject;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.repository.ResourceRepository;
import com.campusconnect.backend.repository.SubjectRepository;
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
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * GET /api/resources - List all resources
     */
    @GetMapping
    public ResponseEntity<List<ResourceResponse>> getAllResources() {
        List<ResourceResponse> resources = resourceRepository.findAll()
                .stream()
                .map(ResourceResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resources);
    }

    /**
     * GET /api/resources/subject/{subjectId} - List resources by subject
     */
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<ResourceResponse>> getResourcesBySubject(
            @PathVariable Long subjectId) {
        List<ResourceResponse> resources = resourceRepository.findBySubjectId(subjectId)
                .stream()
                .map(ResourceResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resources);
    }

    /**
     * GET /api/resources/department/{departmentId} - List resources by department
     * Fetches all subjects for the department, then retrieves their resources.
     */
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<ResourceResponse>> getResourcesByDepartment(
            @PathVariable Long departmentId) {
        List<Subject> subjects = subjectRepository.findByDepartmentId(departmentId);

        List<ResourceResponse> resources = subjects.stream()
                .flatMap(subject -> resourceRepository.findBySubjectId(subject.getId()).stream())
                .map(ResourceResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(resources);
    }

    /**
     * POST /api/resources - Create a new resource (authenticated)
     */
    @PostMapping
    public ResponseEntity<?> createResource(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User uploader = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long subjectId = Long.parseLong(body.get("subjectId"));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Resource resource = new Resource();
        resource.setTitle(body.get("title"));
        resource.setDescription(body.get("description"));
        resource.setFileUrl(body.get("fileUrl"));
        resource.setType(Resource.ResourceType.valueOf(body.get("type")));
        resource.setSubject(subject);
        resource.setUploader(uploader);

        resourceRepository.save(resource);

        return ResponseEntity.ok(new ResourceResponse(resource));
    }
}
