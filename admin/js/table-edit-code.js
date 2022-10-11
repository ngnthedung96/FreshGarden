$(document).ready(function () {
  if (localStorage.getItem("accessAdminToken")) {
    getAdmin()
  }
  else {
    window.open('/admin/page-error-400.html')
  }
});

function getAdmin() {
  $.ajax({
    type: "GET",
    url: "http://localhost:3333/api/admins/home",
    headers: {
      token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
    },
    success: function (data) {
      haveAdminLogin(data)
      logOut()
      getCodes()
      handleEditCode()
    }
  });
}
function getCodes() {
  $.ajax({
    type: "GET",
    url: "http://localhost:3333/api/code/show/",
    headers: {
      token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
    },
    success: function (data) {
      renderCodes(data)
    }
  });
}
function renderCodes(data) {
  const bodyTable = document.querySelector('.table-codes .table tbody')
  var htmls = ''
  var count = 1
  for (var code of data.codes) {
    htmls += `
  <tr>
  <th class = "count">
  <p>${count} </p>
  </th>
  <td class = "code-id">${code.id}</td>
  <td class = "code">${code.code}</td>
  <td class = "code-discount">${code.discount}
  </td>
  <td>${code.createdAt}</td>
  <td class = "code-quantity">${code.number}</td>
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
function handleEditCode() {
  $(".table-codes tbody").click(function (e) {
    e.preventDefault();
    var parentEl = e.target.closest('tr')
    if (parentEl) {
      const code = parentEl.querySelector(".code").innerText
      const discount = parentEl.querySelector(".code-discount").innerText
      const quantity = parentEl.querySelector(".code-quantity").innerText
      const code_id = parentEl.querySelector(".code-id").innerText


      const newCode = document.querySelector(".table-edit-codes tbody #new-code")
      const newDiscount = document.querySelector(".table-edit-codes tbody #new-code-discount")
      const newQuantity = document.querySelector(".table-edit-codes tbody #new-code-quantity")
      newCode.value = code
      newDiscount.value = discount
      newQuantity.value = quantity
      $(".btn-edit-codes").click(function (e) {
        e.preventDefault();
        $.ajax({
          type: "PUT",
          url: `http://localhost:3333/api/code/edit/`,
          data: {
            id: code_id,
            code: newCode.value,
            discount: newDiscount.value,
            number: newQuantity.value
          },
          dataType: "json",
          headers: {
            token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
          },
          success: function (data) {
            successFunction(data)
          },
          error: function (data) {
            const errors = JSON.parse(data.responseText).errors
            errorFunction(errors[0].msg)
          }
        });

      });
    }
  });
}


function haveAdminLogin(data) {
  const loginDiv = document.querySelector(".header-right .default")
  loginDiv.classList.add('hide')
  const adminEmailDiv = document.querySelector('.icons.dropdown')
  const adminEmailText = document.querySelector('.icons.dropdown .user-email')
  adminEmailDiv.classList.remove('hide')
  adminEmailText.innerText = data.admin.email

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

