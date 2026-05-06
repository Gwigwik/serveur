const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const EXPIRATION_MS = 60 * 60 * 1000 * 10; // 10h

const files = new Map();

function saveFile(filePath, originalName) {
    const id = randomUUID();
    const ext = path.extname(originalName);

    const filename = id + ext;
    const newPath = path.join(UPLOAD_DIR, filename);

    fs.renameSync(filePath, newPath);

    files.set(filename, {
        path: newPath,
        expiresAt: Date.now() + EXPIRATION_MS
    });
    console.log(`Saved file: ${filename}`);
    return filename;
}

function getFile(id) {
    const meta = files.get(id);
    
    if (!meta) return null;

    if (Date.now() > meta.expiresAt) {
        deleteFile(id);
        return null;
    }
    console.log(`Get file: ${id}`)
    return meta.path;
}

function deleteFile(id) {
    const meta = files.get(id);
    if (!meta) return;

    try {
        fs.unlinkSync(meta.path);
    } catch {}

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