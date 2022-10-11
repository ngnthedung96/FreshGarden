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
            handleAddCode()
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
function handleAddCode() {
    $(".btn-add").click(function (e) {
        const code = document.querySelector('#code').value
        const discount = document.querySelector('#discount').value
        const number = document.querySelector('#number').value
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "http://localhost:3333/api/code/create",
            data: {
                code,
                discount,
                number
            },
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            dataType: "json",
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




function haveAdminLogin(data) {
    const loginDiv = document.querySelector(".header-right .default")
    loginDiv.classList.add('hide')
    const adminEmailDiv = document.querySelector('.icons.dropdown')
    const adminEmailText = document.querySelector('.icons.dropdown .user-email')
    adminEmailDiv.classList.remove('hide')
    adminEmailText.innerText = data.admin.email
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