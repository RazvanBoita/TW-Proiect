const sgMail = require('@sendgrid/mail')
const dotenv = require('dotenv')
dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
class EmailSender { 
    static async  sendCustomEmail(to, subject, content) {
       const msg = {
           to: to,
           from: {
               name: "SQLTwo@DoNotReply.com",
               email: process.env.FROM_EMAIL,
           },
           subject: subject,
           text: content,
       };
   
       try {
           await sgMail.send(msg);
       } catch (error) {
           console.error(error);
   
           if (error.response) {
               console.error(error.response.body);
           }
       }
    }
     static async sendVerificationEmail(name, verificationLink) {
         const msg = {
             to: name,
             from: {
                 name: 'SQLTwo@DoNotReply.com',
                 email: process.env.FROM_EMAIL
             },
             templateId: process.env.VERIFICATION_TEMPLATE,
             dynamic_template_data: {
                verificationLink: verificationLink
            }
         };
 
         try {
             await sgMail.send(msg);
             console.log("Sent email!");
         } catch (error) {
             console.error(error);
 
             if (error.response) {
                 console.error(error.response.body);
             }
         }
     } 
 };
 module.exports = EmailSender;
