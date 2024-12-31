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

    try {
        const info = await transport.sendMail(options);
        return {
            success: true,
            message: 'Email sent successfully',
            info
        }
    } catch (err) {
        if (err.response && err.response.includes('550')) {
            // Email not found
            return {
                success: false,
                message: 'Invalid recipient address. Email does not exist.',
                error: err
            };
        }

        // Other errors
        return {
            success: false,
            message: 'Failed to send email. Please try again later.',
            error: err
        };
    }
};
