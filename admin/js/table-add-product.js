$(document).ready(function () {
  if (localStorage.getItem("accessAdminToken")) {
    $.ajax({
      type: "GET",
      url: "http://localhost:3333/api/admins/showitems",
      headers: {
        token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
      },
      success: function (data) {
        renderProducts(data)
        haveAdminLogin(data)
        postItemToDb()

      }
    });
  }
  else {
    window.open('/admin/page-error-400.html')
  }
});


function renderProducts(data) {
  const bodyTable = document.querySelector('.table-products .table tbody')
  var count = 1
  for (var product of data.items) {
    const rowDiv = document.createElement('tr')
    rowDiv.innerHTML = `
      <th class = "count">
      <p>${count} </p>
      </th>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.id}
      </td>
      <td>${product.imPrice}</td>
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

function postItemToDb() {
  $(".btn-add").click(function (e) {
    e.preventDefault();
    const name = document.querySelector('#name').value
    const price = document.querySelector('#price').value
    const imPrice = document.querySelector('#imPrice').value
    const number = document.querySelector('#number').value
    const category = document.querySelector('#category').value
    const imgs = document.querySelectorAll('#img')
    const imgContainer = []
    for (var img of imgs) {
      if (img.value) {
        imgContainer.push(img.value)
      }
    }
    if (name && price && imgContainer) {
      $.ajax({
        type: "POST",
        url: "http://localhost:3333/api/admins/createitem",
        data: {
          name: name,
          category,
          imPrice: imPrice,
          price: price,
          img: imgContainer,
          number: number
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
          for (var i of errors) {
            errorFunction(i.msg)
          }
        }
      });
    }
    else {
      errorFunction('Bạn cần nhập đủ thông tin!')
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