// import nodemailer from "nodemailer";
// import config from "./env.js";
// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: config.nodemailer.brevoLogin,
//     pass: config.nodemailer.brevoPassword,
//   },
//   tls: {
//     rejectUnauthorized: false  //only for local development
//   }
// })


// export default transporter;

import nodemailer from "nodemailer";
import config from "./env.js";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Must remain false for 587, but we enforce TLS below
  auth: {
    user: config.nodemailer.brevoLogin,
    pass: config.nodemailer.brevoPassword,
  },
  requireTLS: true, // Forces Nodemailer to use STARTTLS immediately
  tls: {
    // Allows local development without strict certs, but enforces secure handshake on Render
    rejectUnauthorized: process.env.NODE_ENV === "production" ? true : false
  }
});

export default transporter;