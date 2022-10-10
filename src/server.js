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
    visitorId = nextVisitorId;
    res.cookie('visitorId', nextVisitorId++);
  res.cookie('visited', Date.now().toString());
  text = 'You have never visited!'

  }
  res.render('welcome', {
    name: req.query.name || "World",
    date:date,
    time:time,
    text:text,
    visitorId:visitorId
  });
});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");