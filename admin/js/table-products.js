$(document).ready(function () {
  if (localStorage.getItem("accessAdminToken")) {
    getItems()
  }
  else {
    window.open('/admin/page-error-400.html')
  }
});
function getItems() {
  $.ajax({
    type: "GET",
    url: "http://localhost:3333/api/admins/showitems",
    headers: {
      token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
    },
    success: function (data) {
      renderProducts(data)
      haveAdminLogin(data)
      logOut()
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

function renderProducts(data) {
  const bodyTable = document.querySelector('.table-products .table tbody')
  var count = 1
  for (var product of data.items) {
    const rowDiv = document.createElement('tr')
    if (product.number < 10) {
      rowDiv.classList.add("err")
    }
    rowDiv.innerHTML = `
      <th class = "count">
      <p>${count} </p>
      </th>
      <td>${product.name}</td>
      <td>${product.id}
      </td>
      <td>${product.price}</td>
      <td>${product.number}</td>
        `
    const imgCol = document.createElement('td')
    for (var img of JSON.parse(product.img)) {
      const imgOfCol = document.createElement('img')
      imgOfCol.src = img
      imgCol.appendChild(imgOfCol)
    }
    rowDiv.appendChild(imgCol)
    bodyTable.appendChild(rowDiv)
    count++
  }
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