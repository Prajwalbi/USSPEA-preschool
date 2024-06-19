const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const basicAuth = require('express-basic-auth');

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

// Basic Authentication Middleware
const auth = basicAuth({
    users: { 'admin': 'admin@1234' },
    challenge: true,
    unauthorizedResponse: 'Unauthorized',
});

app.get('/images', (req, res) => {
    const imageDirectory = path.join(__dirname, 'public', 'images');
    fs.readdir(imageDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Error reading directory');
            return;
        }

        const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif'));
        const imageTags = imageFiles.map(file => `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="/images/${file}" class="card-img-top" alt="${file}" style="max-height: 240px; object-fit: cover;">
                </div>
            </div>
        `);

        const htmlResponse = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>VSSPEA - Gallery</title>
                <link rel="icon" href="/img/logo c2.jpg">

                <!-- Google Web Fonts -->
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600&family=Inter:wght@600&family=Lobster+Two:wght@700&display=swap" rel="stylesheet">
    
                <!-- Icon Font Stylesheet -->
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">

                <!-- Libraries Stylesheet -->
                <link href="lib/animate/animate.min.css" rel="stylesheet">
                <link href="lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">

                <!-- Customized Bootstrap Stylesheet -->
                <link href="/css/bootstrap.min.css" rel="stylesheet">

                <!-- Template Stylesheet -->
                <link href="/css/style.css" rel="stylesheet">
                
                <style>
                            .logoimg{
                        height: 80px;
                        width: 90px;
                    }
                    .card {
                        border: 20px solid #FFF5F3;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                        border-radius: 10px;
                        transition: 0.5s ease;
                    }
                    .card:hover {
                        border: 20px solid #FE5D37;
                    }
                </style>
            </head>
            <body>
            <div class="container-xxl bg-white p-0">
                <!-- Spinner Start -->
                <div id="spinner" class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                    <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
                <!-- Spinner End -->

                <!-- Navbar Start -->
                <nav class="navbar navbar-expand-lg bg-white navbar-light sticky-top px-4 px-lg-5 py-lg-0">
                    <a href="index.html" class="navbar-brand">
                        <h1 class="m-0 text-primary"><img class="logoimg me-3" src="/img/logo c2.jpg">VSSPEA</h1>
                    </a>
                    <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarCollapse">
                        <div class="navbar-nav mx-auto">
                            <a href="/index.html" class="nav-item nav-link">Home</a>
                            <a href="/about.html" class="nav-item nav-link">About Us</a>
                            <a href="/programs.html" class="nav-item nav-link">Programs</a>
                            <a href="/contact.html" class="nav-item nav-link">Contact Us</a>
                        </div>
                         <a href="/images" class="btn btn-primary rounded-pill px-3 d-none d-lg-block">Gallery<i class="fa fa-arrow-right ms-3"></i></a>
                    </div>
                </nav>
                <!-- Navbar End -->
                
                <!-- Page Header -->
                <div class="container-xxl py-5 page-header position-relative mb-5" id="page-header">
                    <div class="container py-5">
                        <h1 class="display-2 text-white animated slideInDown mb-4">Our Gallery</h1>
                        <!-- Breadcrumbs -->
                        <nav aria-label="breadcrumb animated slideInDown">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#">Home</a></li>
                                <li class="breadcrumb-item"><a href="#">Pages</a></li>
                                <li class="breadcrumb-item text-white active" aria-current="page">Image Gallery</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                
                <!-- Image Gallery -->
                <div class="container">
                    <div class="row row-cols-1 row-cols-md-3 g-4">
                        ${imageTags.join('')}
                    </div>
                </div>
                
                <!-- Footer Start -->
 <div class="container-fluid bg-dark text-white-50 footer pt-5 mt-5 wow fadeIn" data-wow-delay="0.1s">
    <div class="container py-5">
        <div class="row g-5">
            <div class="col-lg-3 col-md-6">
                <h3 class="text-white mb-4">Get In Touch</h3>
                <p class="mb-2"><i class="fa fa-map-marker-alt me-3"></i><a href="https://g.co/kgs/eQbfjYy" target="_blank" style="color: rgba(255, 255, 255, 0.5) !important;">WG57+QV8, near Old manipal Hospital, 5th Stage, Rajarajeshwari Nagar, Bengaluru, Karnataka 560098</a></p>
                <p class="mb-2"><i class="fa fa-phone-alt me-3"></i><a href="tel:+91 99809 69382" style="color: rgba(255, 255, 255, 0.5) !important;">+91 99809 69382</a></p>
                <p class="mb-2"><i class="fa fa-envelope me-3"></i><a href="mailto:reach.vsspea@gmail.com" style="color: rgba(255, 255, 255, 0.5) !important;">reach.vsspea@gmail.com</a></p>
            </div>
            <div class="col-lg-3 col-md-6">
                <h3 class="text-white mb-4">Quick Links</h3>
                <a class="btn btn-link text-white-50" href="about.html">About Us</a>
                <a class="btn btn-link text-white-50" href="contact.html">Contact Us</a>
                <a class="btn btn-link text-white-50" href="programs.html">Our Programs</a>
                <a class="btn btn-link text-white-50" href="/images">Our Gallery</a>
            </div>
            <div class="col-lg-3 col-md-6">
                <h3 class="text-white mb-4">Photo Gallery</h3>
                <div class="row g-2 pt-2">
                    <div class="col-4">
                        <img class="img-fluid rounded bg-light p-1" src="/img/classes-1.jpg" alt="">
                    </div>
                    <div class="col-4">
                        <img class="img-fluid rounded bg-light p-1" src="/img/classes-2.jpg" alt="">
                    </div>
                    <div class="col-4">
                        <img class="img-fluid rounded bg-light p-1" src="/img/classes-3.jpg" alt="">
                    </div>
                    <div class="col-4">
                        <img class="img-fluid rounded bg-light p-1" src="/img/classes-4.jpg" alt="">
                    </div>
                    <div class="col-4">
                        <img class="img-fluid rounded bg-light p-1" src="/img/classes-5.jpg" alt="">
                    </div>
                    <div class="col-4">
                        <img class="img-fluid rounded bg-light p-1" src="/img/classes-6.jpg" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="copyright">
            <div class="row">
                <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                    &copy; <a class="border-bottom" href="#">VSSPEA</a>, All Right Reserved. 
                    Managed By <a class="border-bottom" href="https://flioneit.com/" target="_blank">Flione Innovation & Technologies Pvt.Ltd</a>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Footer End -->

                <!-- Back to Top -->
                <a href="#" class="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top"><i class="bi bi-arrow-up"></i></a>
            </div>
                <!-- JavaScript Libraries -->
                <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
                <script src="/lib/wow/wow.min.js"></script>
                <script src="/lib/easing/easing.min.js"></script>
                <script src="/lib/waypoints/waypoints.min.js"></script>
                <script src="/lib/owlcarousel/owl.carousel.min.js"></script>

                <!-- Template Javascript -->
                <script src="/js/main.js"></script>
            </body>
            </html>
        `;
        res.send(htmlResponse);
    });
});

app.get('/upload-image', auth, (req, res) => {
    const htmlForm = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>VSSPEA - Upload Image</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css">
            <link rel="stylesheet" href="/css/style.css">
            <style>
                .upload-form {
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    color: #FE5D37;;
                }
                .upload-form h2 {
                    margin-bottom: 20px;
                    color: #FE5D37;

                }
                .upload-form input[type=file] {
                    margin-bottom: 20px;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    width: 100%;
                }
                .upload-form button[type=submit] {
                    background-color: #007bff;
                    color: #fff;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    background: #FE5D37;
                }
                .upload-form button[type=submit]:hover {
                    background-color: #f87355;
                }
                .upload-form a {
                    display: block;
                    margin-top: 10px;
                    color: #FE5D37;
                    text-decoration: none;
                }
                .upload-form a:hover {
                    text-decoration: underline;
                    color:  #f87355;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-6 mt-3">
                        <div class="upload-form">
                            <h2>Upload New Image</h2>
                            <form action="/upload" method="post" enctype="multipart/form-data">
                                <div class="mb-3">
                                    <label for="image" class="form-label">Choose an image</label>
                                    <input type="file" class="form-control" id="image" name="image" accept="image/*">
                                </div>
                                <button type="submit" class="btn btn-primary">Upload</button>
                            </form>
                            <br>
                            <a href="/images" class="btn btn-link">Back to Image Gallery</a>
                        </div>
                    </div>
                </div>
            </div>
            <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `;
    res.send(htmlForm);
});

// Route to handle file upload
app.post('/upload', auth, upload.single('image'), (req, res) => {
    res.redirect('/images');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
