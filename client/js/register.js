$(document).ready(function () {
    $('.form-submit').click(function (e) {
        e.preventDefault();
        const email = document.querySelector("#email")
        const password = document.querySelector("#password")
        const passwordConfirmation = document.querySelector("#password_confirmation")
        if (email.value && password.value && passwordConfirmation) {
            $.ajax({
                url: 'http://localhost:3333/api/users/register',
                dataType: 'json',
                type: "POST",
                data: {
                    "email": `${email.value}`,
                    "password": `${password.value}`,
                },
                success: function (data) {
                    successFunction(data)
                },
                error: function (data) {
                    const errors = JSON.parse(data.responseText).errors
                    for (var i of errors) {
                        errorFunction(i.msg)
                    }
                }
            })
        }
    });
});
// ------toast---------------
import toast from "./toast.js"
function successFunction(data) {
    if (data.status) {
        toast({
            title: 'Success',
            message: `${data.msg}`,
            type: 'Success'
        })
        setTimeout(function () {
            location.reload()
        }, 2000)
    }
}
function errorFunction(message) {
    toast({
        title: 'Error',
        message: `${message}`,
        type: 'Error'
    })
}