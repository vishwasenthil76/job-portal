package com.jobportal.backend.service;
 
import com.jobportal.backend.dto.JobRequest;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.exception.UnauthorizedException;
import com.jobportal.backend.model.Job;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
 
import java.time.LocalDateTime;
import java.util.List;
 
@Service
@RequiredArgsConstructor
public class Jobservice {
 
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
 
    public Page<Job> getAllJobs(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        return jobRepository.findByActiveTrue(pageable);
    }
 
    public Page<Job> searchJobs(String keyword, String location, String experience,
                                 String jobType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
 
        if (keyword != null && !keyword.isBlank()) {
            return jobRepository.searchJobs(keyword.trim(), pageable);
        }
        if (location != null || experience != null || jobType != null) {
            return jobRepository.findWithFilters(location, experience, jobType, pageable);
        }
        return jobRepository.findByActiveTrue(pageable);
    }
 
    public Job getJobById(String id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
    }
 
    public Job createJob(JobRequest request, String recruiterId) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));
 
        Job job = new Job();
        mapRequestToJob(request, job);
        job.setCreatedBy(recruiterId);
        job.setCreatedByName(recruiter.getName());
        return jobRepository.save(job);
    }
 
    public Job updateJob(String jobId, JobRequest request, String recruiterId) {
        Job job = getJobById(jobId);
        if (!job.getCreatedBy().equals(recruiterId)) {
            throw new UnauthorizedException("You are not authorized to update this job");
        }
        mapRequestToJob(request, job);
        job.setUpdatedAt(LocalDateTime.now());
        return jobRepository.save(job);
    }
 
    public void deleteJob(String jobId, String recruiterId) {
        Job job = getJobById(jobId);
        if (!job.getCreatedBy().equals(recruiterId)) {
            throw new UnauthorizedException("You are not authorized to delete this job");
        }
        jobRepository.delete(job);
    }
 
    public List<Job> getRecruiterJobs(String recruiterId) {
        return jobRepository.findByCreatedBy(recruiterId);
    }
 
    private void mapRequestToJob(JobRequest request, Job job) {
        job.setTitle(request.getTitle());
        job.setCompanyName(request.getCompanyName());
        job.setLocation(request.getLocation());
        job.setSalaryRange(request.getSalaryRange());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setJobType(request.getJobType());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setSkills(request.getSkills());
        job.setActive(request.isActive());
    }
}