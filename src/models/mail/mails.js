class Mails {
    css = `
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
        `
    RegSuccess = (email,passkey) =>{
        return {
            html : `
                    <!DOCTYPE html><html lang="en">
                        <head>
                            <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title></title>
                            <style>${this.css}</style>
                        </head>
                        <body>
                            <main>
                                <h1>Registration Success</h1>
                                <h3><a href="your_app_link/verify-email?e=${email}&psk=${passkey}">Click here</a> to verify your account</h3>
                            </main>
                        </body>
                    </html>
                    `,

            text : `Registration Success. Link: your_app_link/verify-email?e=${email}&psk=${passkey}`
        }
    }
}




module.exports = new Mails();