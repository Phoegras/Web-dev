const nodeMailer = require('nodemailer');
const mailConfig = require('../config/mail');

exports.sendMail = async (to, subject, htmlContent) => {
    const transport = nodeMailer.createTransport({
        host: mailConfig.HOST,
        port: mailConfig.PORT,
        secure: false,
        auth: {
            user: mailConfig.USERNAME,
            pass: mailConfig.PASSWORD,
        },
    });

    const options = {
        from: mailConfig.FROM_ADDRESS,
        to: to,
        subject: subject,
        html: htmlContent,
    };
    
    const info = await transport.sendMail(options);
    return info;
};
