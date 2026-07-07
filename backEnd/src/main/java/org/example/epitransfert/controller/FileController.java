package org.example.epitransfert.controller;

import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.example.epitransfert.controller.dto.GroupResponse;
import org.example.epitransfert.service.FileService;
import org.example.epitransfert.service.dto.FileEntity;
import org.example.epitransfert.service.dto.GroupEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

@RestController
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping("/health")
    public ResponseEntity<Void> getHealth() {
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public GroupResponse uploadFiles(@RequestParam("files") List<MultipartFile> files) {
        return new GroupResponse(fileService.createGroup(files));
    }

    @GetMapping("/files/{groupId}")
    public ResponseEntity<StreamingResponseBody> getGroup(@PathVariable String groupId) {
        GroupEntity group = fileService.getGroup(groupId);
        StreamingResponseBody body = out -> {
            try (ZipOutputStream zipOut = new ZipOutputStream(out)) {
                for (FileEntity file : group.files()) {
                    zipOut.putNextEntry(new ZipEntry(file.filename()));
                    file.content().transferTo(zipOut);
                    zipOut.closeEntry();
                    file.content().close();
                }
            }
        };

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + groupId + ".zip\"")
            .body(body);
    }

    @DeleteMapping("/files/{groupId}")
    public ResponseEntity<Void> deleteGroup(@PathVariable String groupId) {
        fileService.deleteGroup(groupId);
        return ResponseEntity.noContent().build();
    }
}
