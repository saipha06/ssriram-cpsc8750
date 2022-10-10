// use the express library
const express = require('express');

// create a new server application
const app = express();
const cookieParser = require('cookie-parser');


// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(cookieParser());
app.set('view engine', 'ejs');

// The main page of our website
const {encode} = require('html-entities');

// ... snipped out code ...
let nextVisitorId = 1;
app.get('/', (req, res) => {
  // reads the url parameter
  // http://domain/?name=text
  const name = req.query.name || "World";
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString([],{ hour12: true});
  let visitorId;
  let diff ,text;
  if('visitorId' in req.cookies){
    visitorId = req.cookies.visitorId;
    diff = Math.floor((Date.now().toString()- req.cookies.visited )/1000)
    res.cookie('visited',Date.now().toString())
    text = 'It has been '+diff+' seconds since your last visit'
  }
  else{
    res.cookie('visitorId', nextVisitorId++);
    visitorId = res.cookies.visitorId;
  res.cookie('visited', Date.now().toString());
  text = 'You have never visited!'

  }
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>An Example Title</title>
      <link rel="stylesheet" href="app.css">
    </head>
    <body>
      <h1>Hello, World</h1>
      <p>This site was accessed at ${encode(date)},<span style="text-transform: uppercase;"> ${encode(time)}</span> </p>
      <p> You are vistor # ${encode(visitorId)}</p>
      <p>${encode(text)}</p>

    </body>
  </html>
  `);
});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");