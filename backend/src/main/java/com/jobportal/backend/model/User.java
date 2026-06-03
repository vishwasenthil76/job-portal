package com.jobportal.backend.model;
 
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
 
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
 
    @Id
    private String id;
 
    private String name;
 
    @Indexed(unique = true)
    private String email;
 
    private String password;
 
    private Role role;
 
    private String resumePath;
 
    private String phone;
 
    private String location;
 
    private String profileSummary;
 
    private LocalDateTime createdAt = LocalDateTime.now();
 
    public enum Role {
        JOB_SEEKER, RECRUITER
    }
}