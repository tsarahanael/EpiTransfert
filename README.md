# EpiTransfert
Clone WeTransfert self Hosted en Peer2Peer

## FrontApp

## Backend

The backend is used to upload, download and delete groups of files.
A Docker packaged version is available at the repository root.

### Installation

```sh
docker compose up --wait
```

### Use the endpoints

```sh
# Upload a group of files
curl --request POST http://localhost:8080/files -F files=@file1 -F files=@file2
{"downloadUrl":"http://localhost:8080/files/<groupId>"}

# Download a group of files
curl --request GET http://localhost:8080/files/<groupId> -o output.zip

# Delete a group of files
curl --request DELETE http://localhost:8080/files/<groupId>
# No Content (204)
```

