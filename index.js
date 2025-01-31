const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

//middleware
app.use(express.json({ limit: "25mb" }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://lyt-global-client.vercel.app",
    // origin: "http://localhost:5173",
    credentials: true,
  })
);

// Set up storage for file upload using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// image
// const uploadImage = require("./src/Utils/uploadImage");

// all routes
const authRoutes = require("./src/Users/user.route");
// const productRoutes = require("./src/Products/products.route");
// const reviewRoutes = require("./src/Reviews/reviews.route");
// const orderRoutes = require("./src/Orders/orders.route");
// const statsRoutes = require("./src/Stats/stats.route");

app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/stats", statsRoutes);

main()
  .then(() => console.log("Mongodb is Connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_URL);

  app.get("/", (req, res) => {
    res.send("This is LYT Global Clothing Server");
  });
}

// POST route for job application form submission
app.post("/submit-application", upload.single("resume"), (req, res) => {
  const { name, email, phone, coverLetter } = req.body;
  const resumePath = req.file ? req.file.path : null;

  // Set up Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // Your email address
    to: process.env.RECIPIENT_EMAIL, // Recipient email address
    subject: "New Job Application",
    text: `You have received a new application from:

    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Cover Letter: ${coverLetter || "No cover letter provided."}
    
    Resume: ${resumePath ? "Attached" : "No resume uploaded."}`,

    attachments: resumePath
      ? [
          {
            filename: path.basename(resumePath),
            path: resumePath,
          },
        ]
      : [],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email.");
    }
    console.log("Email sent:", info.response);
    res.status(200).send("Application submitted successfully.");
  });
});

// app.post("/uploadImage", (req, res) => {
//   uploadImage(req.body.image)
//     .then((url) => res.send(url))
//     .catch((err) => res.status(500).send(err));
// });

app.listen(port, () => {
  console.log(`LYT Global is listening on port ${port}`);
});
