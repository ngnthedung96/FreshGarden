$(document).ready(function () {
    if (localStorage.getItem("accessAdminToken")) {
        $.ajax({
            type: "GET",
            url: "http://localhost:3333/api/code/show",
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            success: function (data) {
                renderCodes(data)
                logOut()
                haveAdminLogin(data)
            }
        });
    }
    else {
        window.open('/admin/page-error-400.html')
    }
});

function renderCodes(data) {
    const bodyTable = document.querySelector('.table-codes .table tbody')
    var count = 1
    for (var code of data.codes) {
        const rowDiv = document.createElement('tr')
        rowDiv.innerHTML = `
        <th class = "count">
        <p>${count} </p>
        </th>
        <td>${code.id}</td>
        <td>${code.code}</td>
        <td>${code.discount}
        </td>
        <td>${code.createdAt}</td>
        <td>${code.number}</td>
          `
        bodyTable.appendChild(rowDiv)
        count++
    }
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