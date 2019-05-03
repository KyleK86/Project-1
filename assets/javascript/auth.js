// Callback function to track the Auth state
initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.

            // Get user profile
            var name, email, uid, emailVerified;
            name = user.displayName;
            email = user.email;
            emailVerified = user.emailVerified;
            uid = user.uid;
            // console.log("Display Name: " + name);
            // console.log("Email: " + email);
            // console.log("Email Verified: " + emailVerified);
            // console.log("User ID: " + uid);
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
            var div = $("<div>").append(
                $("<p>").html("Username: " + name),
                $("<p>").html("Email: " + email)
            );
            // Display the account info in modal by appending div
            $("#account-info").append(div);
        } else {
            // User is signed out
            console.log('Signed Out');
        }
    }, function (error) {
        console.log(error);
    });
};

window.addEventListener('load', function () {
    initApp();
});