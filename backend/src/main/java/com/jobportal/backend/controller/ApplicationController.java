package com.jobportal.backend.controller;

import com.jobportal.backend.model.Application;
import com.jobportal.backend.security.JwtUtils;
import com.jobportal.backend.service.ApplicationService;
import com.jobportal.backend.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final ExportService exportService;
    private final JwtUtils jwtUtils;

    // Job Seeker: apply
    @PostMapping("/apply/{jobId}")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<Application> applyForJob(
            @PathVariable String jobId,
            @RequestParam(required = false) MultipartFile resume,
            @RequestParam(required = false, defaultValue = "") String coverLetter,
            @RequestHeader("Authorization") String token) throws IOException {

        String userId = jwtUtils.extractUserId(token.substring(7));
        return ResponseEntity.ok(applicationService.applyForJob(jobId, userId, resume, coverLetter));
    }

    // Job Seeker: my applications
    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<List<Application>> getMyApplications(
            @RequestHeader("Authorization") String token) {

        String userId = jwtUtils.extractUserId(token.substring(7));
        return ResponseEntity.ok(applicationService.getUserApplications(userId));
    }

    // Job Seeker: dashboard stats
    @GetMapping("/stats")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ApplicationService.SeekerStats> getSeekerStats(
            @RequestHeader("Authorization") String token) {

        String userId = jwtUtils.extractUserId(token.substring(7));
        return ResponseEntity.ok(applicationService.getSeekerStats(userId));
    }

    // Recruiter: view applicants for a job
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<Application>> getJobApplicants(
            @PathVariable String jobId,
            @RequestHeader("Authorization") String token) {

        String recruiterId = jwtUtils.extractUserId(token.substring(7));
        return ResponseEntity.ok(applicationService.getJobApplicants(jobId, recruiterId));
    }

    // Recruiter: update application status
    @PutMapping("/{applicationId}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Application> updateStatus(
            @PathVariable String applicationId,
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String token) {

        String recruiterId = jwtUtils.extractUserId(token.substring(7));
        return ResponseEntity.ok(applicationService.updateStatus(
                applicationId, body.get("status"), recruiterId));
    }

    // Recruiter: export to Excel
    @GetMapping("/export/excel/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<byte[]> exportExcel(
            @PathVariable String jobId,
            @RequestHeader("Authorization") String token) throws IOException {

        String recruiterId = jwtUtils.extractUserId(token.substring(7));
        List<Application> apps = applicationService.getJobApplicants(jobId, recruiterId);
        byte[] excel = exportService.exportApplicantsToExcel(apps, jobId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=applicants.xlsx")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }

    // Recruiter: export to CSV
    @GetMapping("/export/csv/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<String> exportCsv(
            @PathVariable String jobId,
            @RequestHeader("Authorization") String token) {

        String recruiterId = jwtUtils.extractUserId(token.substring(7));
        List<Application> apps = applicationService.getJobApplicants(jobId, recruiterId);
        String csv = exportService.exportApplicantsToCsv(apps);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=applicants.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}