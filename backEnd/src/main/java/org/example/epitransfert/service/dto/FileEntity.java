package org.example.epitransfert.service.dto;

import java.io.InputStream;

public record FileEntity(String filename, String contentType, long length, InputStream content) {
}
