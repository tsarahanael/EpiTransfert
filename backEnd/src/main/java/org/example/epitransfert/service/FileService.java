package org.example.epitransfert.service;

import java.io.IOException;
import java.io.UncheckedIOException;

import org.bson.types.ObjectId;
import org.example.epitransfert.service.dto.FileEntity;
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

    public String createFile(MultipartFile file) {
        try {
            ObjectId id = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType());
            return id.toHexString();
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public FileEntity getFile(String id) {
        GridFSFile gridFsFile = findById(id);
        GridFsResource resource = gridFsTemplate.getResource(gridFsFile);
        try {
            return new FileEntity(gridFsFile.getFilename(), resource.getContentType(), gridFsFile.getLength(), resource.getInputStream());
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public void deleteFile(String id) {
        findById(id);
        gridFsTemplate.delete(Query.query(Criteria.where("_id").is(new ObjectId(id))));
    }

    private GridFSFile findById(String id) {
        if (!ObjectId.isValid(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found: " + id);
        }
        GridFSFile gridFsFile = gridFsTemplate.findOne(Query.query(Criteria.where("_id").is(new ObjectId(id))));
        if (gridFsFile == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found: " + id);
        }
        return gridFsFile;
    }
}
