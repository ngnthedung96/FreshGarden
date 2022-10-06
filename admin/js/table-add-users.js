$(document).ready(function () {
  if (localStorage.getItem("accessAdminToken")) {
    $.ajax({
      type: "GET",
      url: "http://localhost:3333/api/admins/showusers",
      headers: {
        token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
      },
      success: function (data) {
        haveAdminLogin(data)
        renderUsers(data)
      }
    });
    $(".btn-add").click(function (e) {
      const email = document.querySelector('#email').value
      const password = document.querySelector('#password').value
      e.preventDefault();
      $.ajax({
        type: "POST",
        url: "http://localhost:3333/api/users/register",
        data: {
          email,
          password
        },
        dataType: "json",
        success: function (data) {
          successFunction(data)
        },
        error: function (data) {
          const errors = JSON.parse(data.responseText).errors
          for (var i of errors) {
            errorFunction(i.msg)
          }
        }
      });
    });
  }
  else {
    window.open('/admin/page-error-400.html')
  }
});




function haveAdminLogin(data) {
  const loginDiv = document.querySelector(".header-right .default")
  loginDiv.classList.add('hide')
  const adminEmailDiv = document.querySelector('.icons.dropdown')
  const adminEmailText = document.querySelector('.icons.dropdown .user-email')
  adminEmailDiv.classList.remove('hide')
  $.ajax({
    type: "GET",
    url: `http://localhost:3333/api/admins/infor/${data.id}`,
    success: function (data) {
      adminEmailText.innerText = data.admin.email
    }

  });

}


function renderUsers(data) {
  const bodyTable = document.querySelector('.table-users .table tbody')
  var htmls = ''
  var count = 1
  for (var user of data.user) {
    htmls += `
    <tr>
      <th>${count}</th>
      <td>${user.email}</td>
      <td>${user.id}
      </td>
      <td>${user.password}</td>
      <td class="color-primary">${user.createdAt}</td>
    </tr>
        `
    count++
  }
  bodyTable.innerHTML = htmls

}

function logOut() {
  //-------log out--------------
  $('.log-out__btn').click(function (e) {
    e.preventDefault();
    $.ajax({
      url: "http://localhost:3333/api/users/logout",
      type: "POST",
      dataType: 'json',
      headers: {
        token: 'Bearer ' + localStorage.getItem("accessToken"),
      }
    })
      .done(function (data, textStatus, jqXHR) {
        localStorage.removeItem('accessToken');
        successFunction(data)
        setTimeout(function () {
          location.reload()
        }, 1000)
      })
  });
}

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
      location.reload()
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