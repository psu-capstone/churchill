/**
 * Created by ryan on 11/10/15.
 */

// Change this to go to next data collecting page when ready
function check(form) {
    if(form.user.value == "admin" && form.pass.value == "admin") {
        window.location.href = '/graph';
    } else {
        alert("Error Password or Username");
    }
}
