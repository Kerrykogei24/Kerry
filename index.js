require('dotenv').config();

const express = require('express');
const nodeMail = require('nodemailer');
const path = require('path');
const app = express()

app.set('view engine', 'html');

app.engine('html', require('ejs').renderFile);

//mail noder setting
async function mainMail(name, email, subject, message) {
    const transporter = await nodeMail.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.PASSWORD,
            host: "smtp.gmail.com",
            port: 587,
            secure: true

        },
    });
    const mailOption = {

        from: email,
        to: process.env.GMAIL_USER,
        subject: subject,
        html: `You got a message from:
      <br>
      Email : ${email}
      <br>
      Name: ${name}
      <br>
      Message: ${message}`,
    };
    try {
        await transporter.sendMail(mailOption);
        return Promise.resolve("Message Sent Successfully!, I will get back to You. Thank you");
    } catch (error) {
        return Promise.reject(error);
    }
}



app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


app.post("/", async(req, res, next) => {
    const { yourname, youremail, yoursubject, yourmessage } = req.body;
    try {
        await mainMail(yourname, youremail, yoursubject, yourmessage);

        res.sendFile(__dirname + '/success.html');
    } catch (error) {
        console.log(error);
        res.sendFile(__dirname + '/reject.html');
        //res.send("Message Could not be Sent");
    }
});




app.listen(5000, () => {
    console.log('Server running on port 5000...');
})