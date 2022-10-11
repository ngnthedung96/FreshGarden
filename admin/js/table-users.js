$(document).ready(function () {
  if (localStorage.getItem("accessAdminToken")) {
    getAdmins()
  }
  else {
    window.open('/admin/page-error-400.html')
  }
});

function getAdmins() {
  $.ajax({
    type: "GET",
    url: "http://localhost:3333/api/admins/showusers",
    headers: {
      token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
    },
    success: function (data) {
      logOut()
      renderUsers(data)
      haveAdminLogin(data)
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

function logOut() {
  //-------log out--------------
  $('.log-out__btn').click(function (e) {
    e.preventDefault();
    $.ajax({
      url: "http://localhost:3333/api/admins/logout",
      type: "POST",
      dataType: 'json',
      headers: {
        token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
      }
    })
      .done(function (data, textStatus, jqXHR) {
        localStorage.removeItem('accessAdminToken');
        successFunction(data)
        setTimeout(function () {
          window.open('/admin/page-login.html')
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