const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendStudentCredentials(email, name, studentId, password) {
  await transporter.sendMail({
    from: `"Educore" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your EduCore Account",
    text: `
Hello ${name},

Your student account has been created successfully.

Student ID: ${studentId}
Email: ${email}
Temporary Password: ${password}

Please log in using these credentials and change your password after your first login.

Regards,
Educore
    `,
  });
}

module.exports = sendStudentCredentials;