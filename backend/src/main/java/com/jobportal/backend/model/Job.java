package com.jobportal.backend.model;
 
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
 
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "jobs")
public class Job {
 
    @Id
    private String id;
 
    private String title;
 
    private String companyName;
 
    private String location;
 
    private String salaryRange;
 
    private String description;
 
    private String requirements;
 
    private String jobType;           // Full-time, Part-time, Contract, Remote
 
    private String experienceLevel;   // Entry, Mid, Senior
 
    private List<String> skills;
 
    private boolean active = true;
 
    private String createdBy;         // Recruiter user ID
 
    private String createdByName;
 
    private LocalDateTime createdAt = LocalDateTime.now();
 
    private LocalDateTime updatedAt = LocalDateTime.now();
}