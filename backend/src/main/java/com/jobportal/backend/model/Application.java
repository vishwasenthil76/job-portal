package com.jobportal.backend.model;
 
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
 
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "applications")
public class Application {
 
    @Id
    private String id;
 
    private String userId;
 
    private String userName;
 
    private String userEmail;
 
    private String jobId;
 
    private String jobTitle;
 
    private String companyName;
 
    private String resumePath;
 
    private String coverLetter;
 
    private Status status = Status.APPLIED;
 
    private LocalDateTime appliedAt = LocalDateTime.now();
 
    private LocalDateTime updatedAt = LocalDateTime.now();
 
    public enum Status {
        APPLIED, UNDER_REVIEW, SHORTLISTED, REJECTED, SELECTED
    }
}