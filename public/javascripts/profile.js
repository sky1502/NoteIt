document.addEventListener("DOMContentLoaded", function() {
    function editprof() {
        document.getElementsyName("fname").readOnly = false;
        document.getElementsByName("lname").readOnly = false;
        document.getElementsByName("email").readOnly = false;
        document.getElementsByName("psw").readOnly = false;

        console.log("Hello")
    }
});