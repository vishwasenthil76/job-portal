package com.jobportal.backend.service;

import com.jobportal.backend.exception.ResourceAlreadyExistsException;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.model.Application;
import com.jobportal.backend.model.Job;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public Application applyForJob(String jobId, String userId,
                                   MultipartFile resume, String coverLetter) throws IOException {

        if (applicationRepository.existsByUserIdAndJobId(userId, jobId)) {
            throw new ResourceAlreadyExistsException("You have already applied for this job");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String resumePath = null;
        if (resume != null && !resume.isEmpty()) {
            resumePath = saveResume(resume, userId);
        } else {
            resumePath = user.getResumePath();
        }

        Application application = new Application();
        application.setUserId(userId);
        application.setUserName(user.getName());
        application.setUserEmail(user.getEmail());
        application.setJobId(jobId);
        application.setJobTitle(job.getTitle());
        application.setCompanyName(job.getCompanyName());
        application.setResumePath(resumePath);
        application.setCoverLetter(coverLetter);
        Application saved = applicationRepository.save(application);

        // Send confirmation email
        emailService.sendApplicationConfirmation(user.getEmail(), user.getName(), job.getTitle());

        return saved;
    }

    public List<Application> getUserApplications(String userId) {
        return applicationRepository.findByUserId(userId);
    }

    public List<Application> getJobApplicants(String jobId, String recruiterId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (!job.getCreatedBy().equals(recruiterId)) {
            throw new RuntimeException("Not authorized to view applicants");
        }
        return applicationRepository.findByJobId(jobId);
    }

    public Application updateStatus(String applicationId, String status, String recruiterId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        app.setStatus(Application.Status.valueOf(status.toUpperCase()));
        app.setUpdatedAt(LocalDateTime.now());
        Application saved = applicationRepository.save(app);

        // Notify applicant of status change
        emailService.sendStatusUpdate(app.getUserEmail(), app.getUserName(),
                app.getJobTitle(), status);
        return saved;
    }

    // Dashboard stats for job seekers
    public record SeekerStats(long total, long pending, long selected, long shortlisted) {}

    public SeekerStats getSeekerStats(String userId) {
        long total = applicationRepository.countByUserId(userId);
        long pending = applicationRepository.countByUserIdAndStatus(userId, Application.Status.APPLIED);
        long selected = applicationRepository.countByUserIdAndStatus(userId, Application.Status.SELECTED);
        long shortlisted = applicationRepository.countByUserIdAndStatus(userId, Application.Status.SHORTLISTED);
        return new SeekerStats(total, pending, selected, shortlisted);
    }

    private String saveResume(MultipartFile file, String userId) throws IOException {
        Path uploadPath = Paths.get(uploadDir + "resumes/");
        Files.createDirectories(uploadPath);
        String filename = userId + "_" + UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return "resumes/" + filename;
    }
}