const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const filterFile = (req, file, cb) => {
    const allowedTypes = /audio|mpeg|mp3|wav|ogg/;
    const isValid = allowedTypes.test(file.mimetype);
    if (isValid) cb(null, true);
    else cb(new Error('Invalid file type'), false);
};

const upload = multer({ storage: storage, fileFilter: filterFile });

router.post('/', upload.single('audio'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.status(200).json({
        message: 'File uploaded successfully',
        filePath: `/uploads/${req.file.filename}`,
    });
});

module.exports = router;
