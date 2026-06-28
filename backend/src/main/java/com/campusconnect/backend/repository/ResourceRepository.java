package com.campusconnect.backend.repository;

import com.campusconnect.backend.entity.Resource;
import com.campusconnect.backend.entity.Resource.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findBySubjectId(Long subjectId);
    List<Resource> findByTypeAndSubjectId(ResourceType type, Long subjectId);
}
