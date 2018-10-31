$(document).ready(function () {


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDlyTMr8urkcgGAThDNbdKI4RbZOMASLSc",
    authDomain: "train-scheduler-de59b.firebaseapp.com",
    databaseURL: "https://train-scheduler-de59b.firebaseio.com",
    projectId: "train-scheduler-de59b",
    storageBucket: "train-scheduler-de59b.appspot.com",
    messagingSenderId: "1068866404534"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  // Variables for the onClick event
  var name = "";
  var destination = "";
  var firstTrain = 0;
  var frequency = 0;
  var currentTime = moment()

  //update clocks

  setInterval(function () {
    $("current-time").html(moment(moment()).format("hh:mm:ss"));
  }, 1000);


  $("#add-train").on("click", function () {

    event.preventDefault();


    // Storing and retreiving new train data
    name = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();

    //clear all of the text-boxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val('');
    $("#frequency").val('');



    // Pushing to database
    database.ref().push({
      name: name,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
    });
  });



  database.ref().on("child_added", function (childSnapshot) {
    
    
    // Change year so first train comes before now
    var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");

    // Difference between the current and firstTrain
    var diffTime = moment().diff(moment(firstTrainNew), "minutes");
    console.log("Difference in time: " + diffTime);

    var remainder = diffTime % childSnapshot.val().frequency;
    console.log("Remainder: " + remainder);

    // Minutes until next train
    var minAway = childSnapshot.val().frequency - remainder;
    console.log("Time till Train:  " + minAway);

    // Next train time
    var nextTrain = moment().add(minAway, "minutes");
    console.log("Next arrival: " +  moment(nextTrain).format("hh:mm"));


   
    $("#add-row > tbody").append("<tr><td>" + childSnapshot.val().name +
      "</td><td>" + childSnapshot.val().destination +
      "</td><td>" + childSnapshot.val().frequency +
      "</td><td>" + nextTrain +
      "</td><td>" + minAway + "</td></tr>");



    // Handle the errors
  }, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });



  database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
    // Change the HTML to reflect
    $("#name-display").html(snapshot.val().name);
    $("#email-display").html(snapshot.val().email);
    $("#age-display").html(snapshot.val().age);
    $("#comment-display").html(snapshot.val().comment);
  });
})
