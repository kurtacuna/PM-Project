// Overview:
// Sends an update to the specified email in the request

const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = (requestId, remarks, status, adminId, studentEmail, shareLink) => {
    const registrarEmail = process.env.NODEMAILER_EMAIL;
    const password = process.env.NODEMAILER_PASSWORD;
    const subject = 'Registrar Document Request Update';
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: registrarEmail,
            pass:password
        }
    });

    let text;
    if (status === 'Pending' && remarks === '') {
        return;
    } else {
        if (status === 'Pending') {
            text = `
                Update by: ${adminId}\n
                Request ID: ${requestId}\n
                Status: ${status}\n
                Remarks: ${remarks}
            `;
        } else if (status === 'To Receive') {
            text = `
                Your request has been completed. Please proceed to the registrar to claim the document.\n\n
                Update by: ${adminId}\n
                Request ID: ${requestId}\n
                Status: ${status}\n
                Remarks: ${remarks}
            `;
        } else if (status === 'Released') {
            text = `
                Your requested document has been released. If there are any problems, please proceed to the registrar.\n\n
                Update by: ${adminId}\n
                Request ID: ${requestId}\n
                Status: ${status}\n
                ${shareLink ? `Track Delivery: ${shareLink}` : ''}\n
                Remarks: ${remarks}
            `;
        } else if (status === 'Rejected') {
            text = `
                Your request has been rejected. Please proceed to the registrar for any clarification.\n\n
                Update by: ${adminId}\n
                Request ID: ${requestId}\n
                Status: ${status}\n
                Remarks: ${remarks}
            `;
        }
    }

    mailOptions = {
        from: registrarEmail,
        to: studentEmail,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('email sent: ' + info.response);
        }
    });
}

module.exports = { sendEmail };
