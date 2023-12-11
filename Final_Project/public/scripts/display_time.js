// Javascript for displaying the current date and time on the footer of the page

document.addEventListener("DOMContentLoaded", function () {
    var currentDateTimeSpan = document.getElementById("currentDateTimeSpan");

    function updateCurrentDateTime() {
        var now = new Date();

        // Get date components
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();

        // Get time components
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();

        // Formatting the date as YYYY-MM-DD
        var formattedDate = year + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day;

        // Formatting the time as HH:MM:SS
        var formattedTime = hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

        // Combine date and time
        var formattedDateTime = formattedDate + " " + formattedTime;

        // Update the text content of the currentDateTimeSpan element
        if (currentDateTimeSpan) {
            currentDateTimeSpan.textContent = formattedDateTime;
        }
    }

    // Call the function to update the current date and time
    updateCurrentDateTime();

    // Update the current date and time every second
    setInterval(updateCurrentDateTime, 1000);
});



