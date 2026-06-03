package com.jobportal.backend.repository;

import com.jobportal.backend.model.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface JobRepository extends MongoRepository<Job, String> {
 
    Page<Job> findByActiveTrue(Pageable pageable);
 
    List<Job> findByCreatedBy(String createdBy);
 
    long countByCreatedBy(String createdBy);
 
    long countByCreatedByAndActiveTrue(String createdBy);
 
    @Query("{ 'active': true, $or: [ " +
           "{ 'title': { $regex: ?0, $options: 'i' } }, " +
           "{ 'companyName': { $regex: ?0, $options: 'i' } }, " +
           "{ 'description': { $regex: ?0, $options: 'i' } }, " +
           "{ 'skills': { $in: [{ $regex: ?0, $options: 'i' }] } } ] }")
    Page<Job> searchJobs(String keyword, Pageable pageable);
 
    @Query("{ 'active': true, " +
           "?#{ [0] != null ? { 'location': { $regex: [0], $options: 'i' } } : {} }, " +
           "?#{ [1] != null ? { 'experienceLevel': [1] } : {} }, " +
           "?#{ [2] != null ? { 'jobType': [2] } : {} } }")
    Page<Job> findWithFilters(String location, String experience, String jobType, Pageable pageable);
}