const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

connectDB();


// app.use(express.json({extended: false}));
app.use(express.json());

app.use(bodyParser.json({ type: '*/*'}));




app.use('/api/message', require('./routes/api/message'));

if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
  
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }



const PORT = process.env.PORT || 5000;



app.listen(PORT, () => console.log(`Server started on port ${PORT}`));