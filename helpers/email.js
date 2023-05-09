import nodemailer from "nodemailer";

const emailRegister = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log(data);

  const { name, email, token } = data;

  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Bienes Raices Confirm your account",
    text: "Confirm your bienes raices account",
    html: `
    <p>Hi ${name}! Please confirm your account on BienesRaices.com</p>
    
    <p>Your account is ready , You just need to confirm it on the following link:
    <a href="${process.env.BACKEND_URL}:${process.env.PORT}/auth/check/${token}">Confirm Account</a> </p>
    
    <p>If you didnt create this account please ignore this email</p>
    `,
  });
};

const emailPass = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log(data);

  const { email, token, name } = data;

  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Bienes Raices account recovery",
    text: "Bienes Raices password change request",
    html: `
    <p>Hi ${name}! A password change request was submitted for your account</p>
    
    <p>To change your password click on the following link:
    <a href="${process.env.BACKEND_URL}:${process.env.PORT}/auth/forgot-pass/${token}">Reset Password</a> </p>
    
    <p>If you didnt submit this request please ignore this email contact support</p>
    `,
  });
};

export { emailRegister, emailPass };
