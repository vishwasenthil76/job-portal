package com.jobportal.backend.controller;

import com.jobportal.backend.dto.JobRequest;
import com.jobportal.backend.model.Job;
import com.jobportal.backend.security.JwtUtils;
import com.jobportal.backend.service.Jobservice;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final Jobservice jobService;
    private final JwtUtils jwtUtils;

    // Public: list + search
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String experience,
            @RequestParam(required = false) String jobType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Job> jobs = jobService.searchJobs(keyword, location, experience, jobType, page, size);
        return ResponseEntity.ok(Map.of(
                "jobs", jobs.getContent(),
                "totalElements", jobs.getTotalElements(),
                "totalPages", jobs.getTotalPages(),
                "currentPage", jobs.getNumber()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJob(@PathVariable String id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    // Authenticated: list all active jobs
    @GetMapping
    public ResponseEntity<Map<String, Object>> getJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {

        Page<Job> jobs = jobService.getAllJobs(page, size, sortBy);
        return ResponseEntity.ok(Map.of(
                "jobs", jobs.getContent(),
                "totalElements", jobs.getTotalElements(),
                "totalPages", jobs.getTotalPages(),
                "currentPage", jobs.getNumber()
        ));
    }

    // Recruiter: create
    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Job> createJob(
            @Valid @RequestBody JobRequest request,
            @RequestHeader("Authorization") String token) {

        String recruiterId = jwtUtils.extractUserId(token.substring(7));
        return ResponseEntity.ok(jobService.createJob(request, recruiterId));
    }

    // Recruiter: update
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Job> updateJob(
            @PathVariable String id,
            @Valid @RequestBody JobRequest request,
            @RequestHeader("Authorization") String token) {

        String recruiterId = jwtUtils.extractUserId(token.substring(7));
        return ResponseEntity.ok(jobService.updateJob(id, request, recruiterId));
    }

    // Recruiter: delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Map<String, String>> deleteJob(
            @PathVariable String id,
            @RequestHeader("Authorization") String token) {

        String recruiterId = jwtUtils.extractUserId(token.substring(7));
        jobService.deleteJob(id, recruiterId);
        return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
    }

    // Recruiter: my jobs
    @GetMapping("/my-jobs")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<Job>> getMyJobs(
            @RequestHeader("Authorization") String token) {

        String recruiterId = jwtUtils.extractUserId(token.substring(7));
        return ResponseEntity.ok(jobService.getRecruiterJobs(recruiterId));
    }
}