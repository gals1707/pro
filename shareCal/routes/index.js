var express = require('express');
var router = express.Router();
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'credentials.json';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/addEvent',function(req, res){
  /**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

 var data=req.body
 console.log(data)
 addEvent(auth,data);

 });

router.get('/eventForm',function(req, res){
  res.sendFile('form.html', { root: './public/'});

});



//**********************************FUNCTIONS*******************************************/


//Add Event to google calndar
 function addEvent(auth,data){
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: {
      'summary': data.summary,
      'description': data.eventDescription,
      'start': {
        'dateTime': data.eventStart,
        'timeZone': 'GMT',
      },
      'end': {
        'dateTime': data.endTime,
        'timeZone': 'GMT',
      },
    },
  }, function(err, res) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }
    console.log(res);
  });
}

// fucntion to retrive the last 20 events in google clandar
function listEvents(auth,calndar) {
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 20,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, {data}) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = data.items;
    if (events.length) {
      console.log('Upcoming 20 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
}
module.exports = router;
