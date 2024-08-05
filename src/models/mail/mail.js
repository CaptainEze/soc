const nodermailer = require('nodemailer');
const mailConfig = require('../../../config/mail.config');


/**
     * @param params
     *      {
     *          receiver : @typedef array receivers emails || @typedef string receiver email,
     *          from : @typedef string email from,
     *          subject : @typedef string
     *
     *      }
*/
const mailer = async (params,message,cb = ()=>{}) =>{
    const transport = nodermailer.createTransport({
        host : mailConfig.MAIL_HOST,
        port : mailConfig.MAIL_PORT,
        secure : mailConfig.secure,
        auth : {
            user : mailConfig.MAIL_USER,
            pass : mailConfig.MAIL_PASS
        },
    });

    
    let receiver = "";
    if(params.receiver.constructor === Array){
        receiver = params.receiver.join(', ');
    } else if(typeof params.receiver === 'string') receiver = params.receiver;

    await transport.sendMail({
        from: `"${params.from}" <${mailConfig.MAIL_USER}>`,
        to : receiver,
        subject : params.subject,
        html : message.html,
        text: message.text
    },(err,info)=>{
        
        // remind me to handle logging of all emails both to a flat file and database

        /**
         * 
         * 
         * 
            
            Success Responses:
            250 2.0.0 OK <message-id>: The message was successfully sent.
            250 2.1.0 <recipient@example.com>... Recipient ok: The recipient address was accepted.
            250 2.1.5 <recipient@example.com>... Recipient ok: The recipient address was accepted (alternate format).
            250 2.6.0 <message-id> Queued mail for delivery: The message was queued for delivery.

            Informational Responses:
            211 System status, or system help reply: A response to a request for system status or help.
            214 Help message: A response to a request for help information.

            Redirection Responses:
            220 <domain> Service ready: The server is ready to accept messages.
            221 <domain> Service closing transmission channel: The server is closing the connection.

            Temporary Failures (4xx):
            421 <domain> Service not available, closing transmission channel: The server is temporarily not available.
            450 Requested mail action not taken: mailbox unavailable: The recipient's mailbox is unavailable.
            451 Requested action aborted: local error in processing: A local error occurred on the server.
            452 Requested action not taken: insufficient system storage: The server has insufficient storage.

            Permanent Failures (5xx):
            500 Syntax error, command unrecognized: The command could not be understood by the server.
            501 Syntax error in parameters or arguments: There was a syntax error in the arguments of the command.
            502 Command not implemented: The command is not implemented by the server.
            503 Bad sequence of commands: The commands were sent in an incorrect order.
            504 Command parameter not implemented: The parameter for the command is not implemented.
            550 Requested action not taken: mailbox unavailable: The recipient's mailbox is not available.
            551 User not local; please try <forward-path>: The recipient is not local to the server.
            552 Requested mail action aborted: exceeded storage allocation: The message exceeds the recipient's storage allocation.
            553 Requested action not taken: mailbox name not allowed: The mailbox name is invalid.
            554 Transaction failed: The transaction failed for unspecified reasons.
        
         * 
         * 
         * 
         */
        cb(err,info);
    });
}

module.exports = mailer;