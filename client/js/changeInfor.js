$(document).ready(function () {
  $.ajax({
    url: "http://localhost:3333/api/users/infor",// route render infor
    type: "GET",
    dataType: 'json',
    headers: {
      token: 'Bearer ' + localStorage.getItem("accessToken"),
    },
    success: function (data) {
      renderInfor(data)
    },
    error: function (data) {
      const errors = JSON.parse(data.responseText).errors
      for (var i of errors) {
        errorFunction(i.msg)
      }
    }

  })
  $(".updateBtn").click(function (e) {
    e.preventDefault();
    updateInfor()
  });
});

function renderInfor(data) {
  const name = document.querySelector('#email')
  name.innerText = `${data.user.email}`
  const password = document.querySelector('#password')
  password.innerText = `${data.user.password}`
}

function updateInfor() {
  const newEmail = document.querySelector('#new-email input').value
  const newPassword = document.querySelector('#new-password input').value
  $.ajax({
    url: "http://localhost:3333/api/users/updateinfor",
    type: "POST",
    dataType: 'json',
    data: {
      "email": `${newEmail}`,
      "password": `${newPassword}`,
    },
    headers: {
      token: 'Bearer ' + localStorage.getItem("accessToken"),
    },
    success: function (data) {
      alert('Thay đổi thành công')
      location.reload()
    },
    error: function (data) {
      const errors = JSON.parse(data.responseText).errors

      for (var i of errors) {
        alert(`${i.msg}`)
      }
    }
  })

}
