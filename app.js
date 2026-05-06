const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

const express = require("express");
const multer = require('multer');

const app = express();
app.use(express.json());

const userRoutes = require("./routes/user.routes");
app.use("/", userRoutes);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        
        const ext = path.extname(file.originalname);
        
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } //10 Mo
});

const { upload: uploadCtrl, download } = require('./controllers/upload.controller');
const { startCleanupJob } = require('./jobs/cleanup.job');

app.post('/upload', upload.single('file'), uploadCtrl);
app.get('/file/:id', download);

startCleanupJob();

module.exports = app;