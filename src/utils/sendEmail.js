const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <div style="font-family: Arial, sans-serif; max-width: 90%; width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f9; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <div style="background:#F43F5E; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">New Notification 📬</h1>
              </div>
              <div style="background: black; padding: 20px; border-radius: 0 0 10px 10px; color: #e5e7eb; text-align: center;">
                <p style="font-size: 18px; line-height: 1.6; color: white; text-align: start;">
                  ${body}
                </p>
                <a href="http://13.233.137.6/app/login" style="display: inline-block; padding: 12px 25px; margin-top: 20px; color: white; background: #F43F5E; border-radius: 5px; text-decoration: none; font-weight: bold; transition: background 0.3s;">
                  Go to Tinder
                </a>
              </div>
             
              <style>
                blockquote, q {
                  display: block !important;
                  visibility: visible !important;
                  color: #e5e7eb !important;
                }
                a[style*="color: #717171;"] {
                  color: #F43F5E !important;
                }
                blockquote {
                  border-left: none !important;
                  padding-left: 0 !important;
                  margin-left: 0 !important;
                }
              </style>
            </div>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

// Define the run function
const run = async (subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    "nidawaheed506@gmail.com", // To (Recipient)
    "no506reply@gmail.com", // From (Sender)
    subject,
    body
  );

  try {
    const result = await sesClient.send(sendEmailCommand);
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

// Export the run function
module.exports = { run };
