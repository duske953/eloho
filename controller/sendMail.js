import nodemailer from 'nodemailer';
export async function sendEmail(subject, text, res) {
  let transporter = nodemailer.createTransport({
    service: 'yahoo',
    host: process.env.EMAIL_HOST,
    port: 465,
    connectionTimeout: +process.env.TIMED_OUT,
    socketTimeout: +process.env.TIMED_OUT,
    secure: true,
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER,
    subject,
    text,
  };

  try {
    const data = await transporter.sendMail(mailOptions);
    res.send('success');
  } catch (err) {
    if (err.errno === -3008)
      return res
        .status(504)
        .send('no internet connection. Please check your internet settings');

    if ((err.code = 'ETIMEDOUT'))
      return res
        .status(408)
        .send('Looks like your have an unstable network. Please try again');
    else
      return res
        .status(500)
        .send("we're having trouble with our servers try again later");
  }
}
