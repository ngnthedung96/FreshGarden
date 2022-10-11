$(document).ready(function () {
    $('.form-submit').click(async function (e) {
        e.preventDefault()
        const email = document.querySelector("#email")
        const password = document.querySelector("#password")
        if (email.value && password.value) {
            await $.ajax({
                url: 'http://localhost:3333/api/users/login',
                dataType: 'json',
                type: "POST",
                data: {
                    "email": `${email.value}`,
                    "password": `${password.value}`,
                },
                success: function (data) {
                    successFunction(data)
                    localStorage.setItem('accessToken', data.accesstoken);
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
            // window.close()
            window.open('/client/page/index.html')
        }, 1500)
        // setTimeout(function () {
        //     location.reload()
        // }, 2000)
    }
}
function errorFunction(message) {
    toast({
        title: 'Error',
        message: `${message}`,
        type: 'Error'
    })
}





