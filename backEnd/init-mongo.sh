#!/bin/sh
set -e

mongo <<EOF
use admin

db.createUser({
  user: "$MONGO_ADMIN_USER",
  pwd: "$MONGO_ADMIN_PASSWORD",
  roles: [
    { role: "readWrite", db: "$MONGO_INITDB_DATABASE" }
  ]
})
EOF