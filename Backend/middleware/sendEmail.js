// Overview:
// Sends an update to the specified email in the request

const nodemailer = require('nodemailer');

const sendEmail = (requestId, remarks, status, adminId, studentEmail) => {
    const registrarEmail = 'pmprojectnodemailer@gmail.com';
    const password = 'aava gkqo doue qmbz';
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
                Update by: ${adminId}\n
                Request ID: ${requestId}\n
                Status: ${status}\n
                Your request has been completed. Please proceed to the registrar to claim the document.\n
                Remarks: ${remarks}
            `;
        } else if (status === 'Released') {
            text = `
                Update by: ${adminId}\n
                Request ID: ${requestId}\n
                Status: ${status}\n
                Your requested document has been released. If there are any problems, please proceed to the registrar.\n
                Remarks: ${remarks}
            `;
        } else if (status === 'Rejected') {
            text = `
                Update by: ${adminId}\n
                Request ID: ${requestId}\n
                Status: ${status}\n
                Your request has been rejected. Please proceed to the registrar for any clarification.\n
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
