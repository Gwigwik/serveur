const fileService = require('../services/fileService');

async function upload(req, res) {
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file');
    }

    const id = fileService.saveFile(file.path, file.originalname);

    res.json({ fileId: id });
}

function download(req, res) {
    const { id } = req.params;

    const filePath = fileService.getFile(id);
    
    if (!filePath) {
        return res.status(404).send('Not found');
    }

    res.sendFile(filePath);
}

module.exports = {
    upload,
    download
};