package org.example.epitransfert.service.dto;

import java.util.List;

public record GroupEntity(String groupId, List<FileEntity> files) {
}
