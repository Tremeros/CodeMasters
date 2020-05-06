const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');
const Message = require('../../models/message');

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

          res.json(newMessage);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }

})

module.exports = router;