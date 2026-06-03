package com.jobportal.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class JobRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Location is required")
    private String location;

    private String salaryRange;

    @NotBlank(message = "Description is required")
    private String description;

    private String requirements;

    private String jobType;         // Full-time, Part-time, Contract, Remote

    private String experienceLevel; // Entry, Mid, Senior

    private List<String> skills;

    private boolean active = true;
}