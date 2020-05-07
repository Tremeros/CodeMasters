const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');
const Message = require('../../models/message');
const nodemailer = require('nodemailer');

router.get('/', async (req, res) => {
    res.send('Mesage');
})

router.post('/', [
    check('name', 'Podaj swoje imie').not().isEmpty(),
    check('email', 'Podany email jest niepoprawny').isEmail(),
    check('message', 'Wiadomość powinna zwierać conajmniej 120 znaków').isLength({min: 10})
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {name, email, message} = req.body;
    try {
        


        const newMessage =  new Message({
            name,
            email,
            message
          });     
          
          await newMessage.save();

          const transport = nodemailer.createTransport({
            service: 'gmail',
             auth: {
                user: 'pawel.tylczynski@gmail.com',
                pass: 'w1niasz'
    }
        });

        const mailOptions = {
            from: email,
            to: "pawel.tylczynski@gmail.com",
            subject: "Nowa wiadomość",
            text: message,
            html: `<b>${message} ${email}</b>`,
        };
        

        await transport.sendMail(mailOptions).then((result)=>{
            console.log(result);
            console.log(email);
            console.log(message);
        }).catch((error)=>{
            console.log(error);
        })

          res.json(newMessage);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }

})

module.exports = router;