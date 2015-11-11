/**
 * Created by ryan on 11/10/15.
 */

function check(form) {
    if(form.user.value == "admin" && form.pass.value == "admin") {
        window.open('google.com')
    } else {
        alert("Error Password or Username")
    }
}
