var begin = false;

var mic; //microphone of computer
var interruption = false; //Boolean for when there is a true interruption
var sound = false; //Boolean for when surrounding sound is consistent enough to be noticed
var showbuttons = false; //Boolean to show buttons for reaction to notification
var duration = 0; //counts how long interruption takes place / stays there untill next interruption
var time; //timer that runs constantly, used for timing in code
var lasttime = 0; //to create timer for noisetimer
var lasttime2 = 0; //to create timer for sensortimer/interruption
var lasttime3 = 0; //to create timer for soundtimer and pausetimer for sound
var lasttime4 = 0; //timer for errorstate time out code
var sensortimer; //counts how long interruption takes place / stops when interruption stops
var noisetimer; //counts how long sound is true for boolean interruption
var soundtimer = 0; // counts how long sound is measured from mic
var pausetimer = 0; // counts the pauses between speaking / surrounding noise
var errortimer = 0; //counts how long the error is and allows the code to continue after a certain threshold
var timestamp; //shows time 
var start = false; // for measuring sound 
var notification = false; //Boolean for when to show buttons and play sound
var errorstate = false;
let sound1; // sound for notification when interruption longer than....
var i = 0; //variable that assures amount only is +1 after each interruption
var p = 0;
var amount = 0; // counting amount of interruptions

var q = 0; // counts ignored interruptions
var w = 0; // counts accepted interruptions
var e = 0; // counts errors of interruptions


var clicked = false; // to assure when mouse click is used to press buttons that button is only clicked once


function setup() { //everything that only runs once 
  createCanvas(500, 500); //background
  noLoop();
  mic = new p5.AudioIn(); //connecting microphone of computer
  mic.start(); //starts measuring sound with microphone
  getAudioContext().suspend();
}

function begincode() {
  begin = true;
  loop();
  somebutton.style.visibility = "hidden";
  userStartAudio();
}

function draw() { //code that runs constantly

  if (begin == true) {
    background(255); //background color

    mouseClicked = function() { //registeres when mouse/trackpad clicks
      clicked = true;
    }

    time = millis(); // starting timer      

    var vol = mic.getLevel(); //setting variable vol for level of microphone


    //FUNCTIONALITY

    if (vol > 0.01) { //when volume microphone higher than ...
      start = true;
    } else {
      start = false;
    }

    if ((time - lasttime3) > 1000) { //timer every 0.1 sec
      lasttime3 = time;
      if (start == true) {
        soundtimer++;
        pausetimer = 0;
      } else {
        pausetimer++;
      }
    }

    if (pausetimer > 2) {
      soundtimer = 0;
      pausetimer = 0;
    }

    if (soundtimer > 0) {
      sound = true;
    } else {
      sound = false;
    }


    if ((time - lasttime) > 1000) {
      lasttime = time;
      if (sound == true) {
        noisetimer++;
      } else {
        noisetimer = 0;
      }
    }


    if (noisetimer > 5) { //when surrounding noise longer than x there is a true interruption
      interruption = true;
    } else {
      interruption = false;
    }

    if ((time - lasttime2) > 1000) {
      lasttime2 = time;
      if (interruption == true) {
        sensortimer++; //counting lenght of interruption
      } else {
        sensortimer = 0;
      }
    }

    if (sensortimer == 0) {
      if (p < 1) {
        p++;

        $.ajax({ //to send data to the database
          url: 'https://data.id.tue.nl/datasets/entity/401/item/',
          headers: {
            'api_token': 'a4SrY2lElYWyqsk1Xe0e58zuzgUTOt/GyAOUnJCciOTK94Z71GcDyv+cVxUD7jXg',
            'resource_id': 'duration',
            'token': 'token_for_identifier'
          },
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            parameter1: duration
          }),
          success: function(data) {
            console.log(data) //to show whether sending to database went well
          },
          error: function(e) {
            console.log(e) //to show whether sending to database went wrong
          }
        });
      }
    } else {
      p = 0;
    }

    if (sensortimer > 2) { //when interruption longer than 2 sec, then notification will be shown
      duration = sensortimer; //set time of interruption to duration variable
      notification = true;
    } else {
      notification = false;
    }
    

    if (notification == true) { //play sound once when notification is true
      if (i < 1) {
        showbuttons = true; //show buttons

        i++;
        amount++;

        $.ajax({ //to send data to the database
          url: 'https://data.id.tue.nl/datasets/entity/401/item/',
          headers: {
            'api_token': 'a4SrY2lElYWyqsk1Xe0e58zuzgUTOt/GyAOUnJCciOTK94Z71GcDyv+cVxUD7jXg',
            'resource_id': 'amount',
            'token': 'token_for_identifier'
          },
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            parameter2: amount
          }),
          success: function(data) {
            console.log(data) //to show whether sending to database went well
          },
          error: function(e) {
            console.log(e) //to show whether sending to database went wrong
          }
        });
      }
    } else {
      i = 0;
    }

  }
}