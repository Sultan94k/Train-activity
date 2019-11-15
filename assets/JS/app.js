
//! Initializing firebase
$(document).ready(function () {
    var firebaseConfig = {
        apiKey: "AIzaSyBn9OMKOTlSnuIYYmA_zScQKJHcgLqMZ2Y",
        authDomain: "pr-1-aa3ea.firebaseapp.com",
        databaseURL: "https://pr-1-aa3ea.firebaseio.com",
        projectId: "pr-1-aa3ea",
        storageBucket: "",
        messagingSenderId: "1056854595698",
        appId: "1:1056854595698:web:ad057b54e219834c420aeb"
      };
      
      firebase.initializeApp(firebaseConfig);

   
      //! Adding current time to show it on jumbotron
      $("#currentTime").append(moment().format("hh:mm A"));
    var database = firebase.database();
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;


    //! Click event (button) for adding the trans.
    $("#add-train").on("click", function() {
        event.preventDefault();
        //? grabing the input
        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();
//! data of the train uploads to the database
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });
//! Creating Firebase event to add trains to database.
    database.ref().on("child_added", function(childSnapshot) {
        var nextArr;
        var minAway;
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        var minAway = childSnapshot.val().frequency - remainder;
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");
//? Creating a new row
        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });
    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
        $("#name-display").html(snapshot.val().name);
        $("#email-display").html(snapshot.val().email);
        $("#age-display").html(snapshot.val().age);
        $("#comment-display").html(snapshot.val().comment);
    });
});