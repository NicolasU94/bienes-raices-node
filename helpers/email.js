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
    
    <p>If you didnt creat this account please ignore this email</p>
    `,
  });
};

export { emailRegister };
