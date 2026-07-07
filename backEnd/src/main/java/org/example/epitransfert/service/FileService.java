package org.example.epitransfert.service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.example.epitransfert.service.dto.FileEntity;
import org.example.epitransfert.service.dto.GroupEntity;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.mongodb.client.gridfs.model.GridFSFile;

@Service
public class FileService {

    private final GridFsTemplate gridFsTemplate;

    public FileService(GridFsTemplate gridFsTemplate) {
        this.gridFsTemplate = gridFsTemplate;
    }

    public String createGroup(List<MultipartFile> files) {
        String groupId = new ObjectId().toHexString();
        try {
            for (MultipartFile file : files) {
                Document metadata = new Document("groupId", groupId);
                gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType(), metadata);
            }
            return groupId;
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public GroupEntity getGroup(String groupId) {
        List<FileEntity> files = new ArrayList<>();
        for (GridFSFile gridFsFile : findByGroupId(groupId)) {
            GridFsResource resource = gridFsTemplate.getResource(gridFsFile);
            try {
                files.add(new FileEntity(gridFsFile.getFilename(), resource.getContentType(), gridFsFile.getLength(), resource.getInputStream()));
            } catch (IOException e) {
                throw new UncheckedIOException(e);
            }
        }
        return new GroupEntity(groupId, files);
    }

    public void deleteGroup(String groupId) {
        findByGroupId(groupId);
        gridFsTemplate.delete(groupIdQuery(groupId));
    }

    private List<GridFSFile> findByGroupId(String groupId) {
        if (!ObjectId.isValid(groupId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found: " + groupId);
        }
        List<GridFSFile> gridFsFiles = new ArrayList<>();
        gridFsTemplate.find(groupIdQuery(groupId)).into(gridFsFiles);
        if (gridFsFiles.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found: " + groupId);
        }
        return gridFsFiles;
    }

    private Query groupIdQuery(String groupId) {
        return Query.query(Criteria.where("metadata.groupId").is(groupId));
    }
}
