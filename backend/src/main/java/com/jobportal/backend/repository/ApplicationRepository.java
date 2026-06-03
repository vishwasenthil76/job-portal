package com.jobportal.backend.repository;

import com.jobportal.backend.model.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends MongoRepository<Application, String> {
 
    List<Application> findByUserId(String userId);
 
    List<Application> findByJobId(String jobId);
 
    Optional<Application> findByUserIdAndJobId(String userId, String jobId);
 
    boolean existsByUserIdAndJobId(String userId, String jobId);
 
    long countByUserId(String userId);
 
    long countByUserIdAndStatus(String userId, Application.Status status);
 
    long countByJobId(String jobId);
}
