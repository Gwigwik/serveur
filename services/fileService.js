const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const EXPIRATION_MS = 60 * 60 * 1000 * 10; //10h

const files = new Map();

function saveFile(buffer, originalName) {
    const id = randomUUID();
    const filePath = path.join(UPLOAD_DIR, id);

    fs.writeFileSync(filePath, buffer);

    files.set(id, {
        path: filePath,
        expiresAt: Date.now() + EXPIRATION_MS
    });

    return id;
}

function getFile(id) {
    const meta = files.get(id);
    if (!meta) return null;

    if (Date.now() > meta.expiresAt) {
        deleteFile(id);
        return null;
    }

    return meta.path;
}

function deleteFile(id) {
    const meta = files.get(id);
    if (!meta) return;

    try {
        fs.unlinkSync(meta.path);
    } catch (e) {}

    files.delete(id);
}

function cleanup() {
    const now = Date.now();

    for (const [id, meta] of files.entries()) {
        if (now > meta.expiresAt) {
            deleteFile(id);
        }
    }
}

module.exports = {
    saveFile,
    getFile,
    cleanup
};