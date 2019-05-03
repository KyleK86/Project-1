// Callback function to track the Auth state
initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.

            // Get user profile
            var name, email, uid, emailVerified;
            name = user.displayName;
            uid = user.uid;
            email = user.email;
            emailVerified = emailVerified;
            // console.log("Display Name: " + name);
            // console.log("Email: " + email);
            // console.log("Email Verified: " + emailVerified);
            console.log("User ID: " + uid);

            // Hide login button and display account & logout buttons
            $("#login-btn").hide();
            $("#logout-btn").show();
            $("#account-btn").show();
            $("#fav-btn").show();
            $("#categories-btn").show();
            $("#pop-btn").show();

            // Diplay username to navbar
            $("#display-name").html("Username: " + name);

            // Build a div filled with account information
            var newRow = $("<tr>").append(
                $("<td>").text(name),
                $("<td>").text(email),
                $("<td>").text(emailVerified),

            );
            // Display the account info in modal by appending div
            $("#table-data > tbody").append(newRow);
        } else {
            // User is signed out
            console.log('Signed Out');
            $("#webcam-div").empty();
        }
    }, function (error) {
        console.log(error);
    });
};

window.addEventListener('load', function () {
    initApp();
});