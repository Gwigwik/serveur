const fileService = require('../services/fileService');

function startCleanupJob() {
    setInterval(() => {
        console.log("Cleanup des fichiers vieux de plus de 10h");
        fileService.cleanup();
    }, 60 * 60 * 1000); // 1h
}

module.exports = { startCleanupJob };