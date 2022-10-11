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
      deleteProduct(data)
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

function deleteProduct(data) {
  $('.table-products').click(function (e) {
    e.preventDefault();
    if (e.target.closest('.btn-delete')) {
      var parentEl
      var element = e.target.parentElement
      while (element) {
        if (element.matches('tr')) {
          parentEl = element
          break
        }
        element = element.parentElement
      }
      const id = parentEl.querySelector('.id').innerText
      $.ajax({
        type: "DELETE",
        url: `http://localhost:3333/api/admins/deleteitem/${id}`,
        dataType: "json",
        headers: {
          token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
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
      });
    }

  });
}


function renderProducts(data) {
  const bodyTable = document.querySelector('.table-products .table tbody')
  var count = 1
  for (var product of data.items) {
    const rowDiv = document.createElement('tr')
    rowDiv.innerHTML = `
      <th class = "count">
      <p>${count} </p>
      </th>
      <td class = "name">${product.name}</td>
      <td class = "id">${product.id}
      </td>
      <td class = "price">${product.price}</td>
        `
    const imgCol = document.createElement('td')
    for (var img of JSON.parse(product.img)) {
      const imgOfCol = document.createElement('img')
      imgOfCol.src = img
      imgCol.appendChild(imgOfCol)
    }
    const deleteBtn = document.createElement('td')
    deleteBtn.innerHTML = `<button type="button" class="btn btn-outline-danger btn-delete">Xóa sản phẩm</button>`
    rowDiv.appendChild(imgCol)
    rowDiv.appendChild(deleteBtn)
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