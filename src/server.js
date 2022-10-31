// use the express library
const express = require('express');
const fetch = require('node-fetch');


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
app.get("/trivia", async (req, res) => {
  // fetch the data
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

  // fail if bad response
  if (!response.ok) {
    res.status(500);
    res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
    return;
  }

  // interpret the body as json
  const content = await response.json();

  // fail if db failed

  if (content.response_code !== 0) {
    res.status(500);
    res.send(`Open Trivia Database failed with internal response code ${content.response_code}`);
    return;
  }

  // respond to the browser
  // TODO: make proper html
  answers = content.results[0].incorrect_answers 
  random_number = Math.floor(Math.random()*answers.length)
  const correctAnswer = content.results[0].correct_answer
  answers.splice(random_number,0, correctAnswer )
  

const answerLinks = answers.map(answer => {
  return `<a href="javascript:alert('${
    answer === correctAnswer ? 'Correct!' : 'Incorrect, Please Try Again!'
    }')">${answer}</a>
  `
})
  res.render('trivia',{question:content.results[0].question,answers:answerLinks,difficulty:content.results[0].difficulty,category:content.results[0].category})
  //res.send(JSON.stringify(content, 2));
});
// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");