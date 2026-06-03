package com.jobportal.backend.service;

import com.jobportal.backend.model.Application;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportService {

    public byte[] exportApplicantsToExcel(List<Application> applications, String jobTitle) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Applicants — " + jobTitle);

            // Header style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Header row
            Row header = sheet.createRow(0);
            String[] headers = {"#", "Name", "Email", "Job Title", "Company", "Status", "Applied At"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            for (int i = 0; i < applications.size(); i++) {
                Application app = applications.get(i);
                Row row = sheet.createRow(i + 1);
                row.createCell(0).setCellValue(i + 1);
                row.createCell(1).setCellValue(app.getUserName());
                row.createCell(2).setCellValue(app.getUserEmail());
                row.createCell(3).setCellValue(app.getJobTitle());
                row.createCell(4).setCellValue(app.getCompanyName());
                row.createCell(5).setCellValue(app.getStatus().name());
                row.createCell(6).setCellValue(app.getAppliedAt().toString());
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }

    public String exportApplicantsToCsv(List<Application> applications) {
        StringBuilder sb = new StringBuilder();
        sb.append("Name,Email,Job Title,Company,Status,Applied At\n");
        for (Application app : applications) {
            sb.append(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                    app.getUserName(), app.getUserEmail(), app.getJobTitle(),
                    app.getCompanyName(), app.getStatus().name(), app.getAppliedAt()));
        }
        return sb.toString();
    }
}