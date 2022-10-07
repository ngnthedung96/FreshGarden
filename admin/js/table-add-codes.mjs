$(document).ready(function () {
    if (localStorage.getItem("accessAdminToken")) {
        $.ajax({
            type: "GET",
            url: "http://localhost:3333/api/admins/home",
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            success: function (data) {
                haveAdminLogin(data)
                logOut()
            }
        });
        $.ajax({
            type: "GET",
            url: "http://localhost:3333/api/sale/show",
            success: function (data) {
                renderSales(data)
            }
        });
        $(".btn-add").click(function (e) {
            const code = document.querySelector('#code').value
            const user_id = document.querySelector('#user-id').value
            e.preventDefault();
            $.ajax({
                type: "POST",
                url: "http://localhost:3333/api/sale/create",
                data: {
                    code,
                    user_id
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


function renderSales(data) {
    const bodyTable = document.querySelector('.table-codes .table tbody')
    var htmls = ''
    var count = 1
    for (var code of data.codes) {
        htmls += `
      <tr>
        <th>${count}</th>
        <td>${code.code}</td>
        <td>${code.id}
        </td>
        <td>${code.user_id}</td>
        <td>${code.createdAt}</td>
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