import { SendEmailCommand } from "@aws-sdk/client-ses"
import { ses } from "../config/ses.js"

export const sendMail = async ({to, subject, html}) => {
    const command = new SendEmailCommand({
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Subject: {
                Data: subject
            },
            Body: {
                Html: {
                    Data: html
                }
            }
        }
    })
    const response = await ses.send(command);
    return response;
}