$(document).ready(function () {
  $(".login-form__btn").click(function (e) {
    e.preventDefault();
    const email = document.querySelector(".form-group #email").value
    const password = document.querySelector(".form-group #password").value
    if (email && password) {
      $.ajax({
        type: "POST",
        url: "http://localhost:3333/api/admins/login",
        data: {
          email,
          password
        },
        dataType: "json",
        success: function (data) {
          successFunction(data)
          localStorage.setItem('accessAdminToken', data.accesstoken);
        },
        error: function (data) {
          const errors = JSON.parse(data.responseText).errors
          for (var i of errors) {
            errorFunction(i.msg)
          }
        }
      });
    }
    else {
      errorFunction("Vui lòng nhập đủ thông tin")
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
      type: 'success'
    })
    setTimeout(function () {
      window.close()
      window.open('/admin/index.html')
    }, 1500)
  }
}
function errorFunction(message) {
  toast({
    title: 'Error',
    message: `${message}`,
    type: 'error'
  })
}
