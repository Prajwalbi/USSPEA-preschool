const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public', 'images'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Serve static files (CSS, images, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to fetch and display images
app.get('/images', (req, res) => {
    const imageDirectory = path.join(__dirname, 'public', 'images'); // Path to your images directory
    fs.readdir(imageDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Error reading directory');
            return;
        }

        const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif'));
        const imageTags = imageFiles.map(file => `<img src="/images/${file}" alt="${file}" />`);
        const htmlResponse = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Image Gallery</title>
                <link rel="stylesheet" href="/css/style.css"> <!-- Link your CSS file -->
            </head>
            <body>
                <h1>Image Gallery</h1>
                <div class="image-container">
                    ${imageTags.join('')}
                </div>
                <a href="/upload-image">Upload New Image</a> <!-- Link to the upload page -->
            </body>
            </html>
        `;
        res.send(htmlResponse);
    });
});

// Route to serve the upload form
app.get('/upload-image', (req, res) => {
    const htmlForm = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Upload New Image</title>
            <link rel="stylesheet" href="/css/style.css"> <!-- Link your CSS file -->
        </head>
        <body>
            <h2>Upload New Image</h2>
            <form action="/upload" method="post" enctype="multipart/form-data">
                <input type="file" name="image" accept="image/*">
                <button type="submit">Upload</button>
            </form>
            <br>
            <a href="/images">Back to Image Gallery</a> <!-- Link back to the image gallery -->
        </body>
        </html>
    `;
    res.send(htmlForm);
});

// Route to handle file upload
app.post('/upload', upload.single('image'), (req, res) => {
    // Redirect back to images page after successful upload
    res.redirect('/images');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
