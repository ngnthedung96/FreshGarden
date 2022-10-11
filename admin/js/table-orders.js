$(document).ready(function () {
    if (localStorage.getItem("accessAdminToken")) {
        getOrders()
    }

    // renderPage()
});
function getOrders() {
    $.ajax({
        async: false,
        type: "GET",
        url: `http://localhost:3333/api/admins/showorder`,
        dataType: "json",
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
        },
        success: function (data) {
            // renderOrders(data)
            haveAdminLogin(data)
            showDetail(data)
            // renderPagNav(data)
            renderOrder(data)
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
function renderOrders(data) {
    let myData = [];
    var countTable = 1
    const tableBody = document.querySelector('.table-orders tbody')
    tableBody.innerHTML = ''
    for (var i of data.orders) {
        const tableRow = document.createElement('tr')
        const dateCreate = i.createdAt
        const dateReceive = (i.date.split('-').reverse().join('-'))
        const userId = i.user_id
        const totalPrice = i.price
        const code = i.code
        var userEmail
        $.ajax({
            async: false,
            type: "GET",
            url: `http://localhost:3333/api/admins/getuser/${userId}`,
            dataType: "json",
            success: function (data) {
                userEmail = data.user.email
            }
        });
        const detail = i.detail
        tableRow.innerHTML = `
        <td class="count">${countTable}
        </td>
        <td class="email">${userEmail}</td>
        <td><span class="dateCreate">${dateCreate}</span>
        </td>
        <td class="products-col">
            
        </td>
        <td class = "total-price">${totalPrice}</td>
        <td class = "code hide">${code}</td>
        <td><span class="label gradient-1 rounded">Paid</span>
        </td>
        <td> <p class = "badge badge-success px-2 detail">Chi tiết</p> 
        </td>
        <td class="dateReceive">${dateReceive}</td>
        `
        const product = tableRow.querySelector('.products-col')
        for (var j of JSON.parse(detail)) {
            $.ajax({
                async: false,
                type: "GET",
                url: `http://localhost:3333/api/item/showitem/${j.item_id}`,
                dataType: "json",
                success: function (data) {
                    const item = data.item
                    if (item) {
                        const productDiv = document.createElement('div')
                        productDiv.classList.add('product')
                        productDiv.innerHTML = `
                    <img class = "img" src=${JSON.parse(item.img)[0]}
                        alt="">
                    <p class = "name">${item.name}</p>
                    <p class = "price hide"  >${item.price}</p>
                    <p class = "imPrice hide"  >${item.imPrice}</p>
                    <p class = "number hide"  >${j.number}</p>
                    <p class = "staffFee hide"  >${i.staffFee}</p>
                    <p class = "shipFee hide"  >${i.shipFee}</p>
                `
                        product.appendChild(productDiv)
                    }
                }
            });
        }
        myData.push({
            "user": userEmail,
            "orderingDate": dateCreate,
            "price": totalPrice,
            "receivingDate": dateReceive

        })
        tableBody.appendChild(tableRow)
        countTable++
    }
    exportToExcel("Orders", "Orders", "Orders", myData)
}

function renderOrder(dataOrders) {
    let myData = []
    var countTable = 1
    for (var i of dataOrders.orders) {
        const orderId = i.id
        const dateCreate = i.createdAt
        const dateReceive = (i.date.split('-').reverse().join('-'))
        const userId = i.user_id
        const totalPrice = i.price
        const code = i.code
        var userEmail
        $.ajax({
            async: false,
            type: "GET",
            url: `http://localhost:3333/api/admins/getuser/${userId}`,
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            dataType: "json",
            success: function (data) {
                userEmail = data.user.email
            }
        });
        const detail = i.detail
        var arr = [countTable, orderId, userEmail, dateCreate, '', totalPrice, code, "Chi tiết", dateReceive]
        // const product = tableRow.querySelector('.products-col')

        // tableBody.appendChild(tableRow)
        countTable++
        myData.push(arr)
    }

    $("#table_id").DataTable({
        data: myData,
        createdRow: function (row, data, dataIndex) {
            $.each($('td', row), function (colIndex) {
                // For example, adding data-* attributes to the cell
                if (colIndex == 0) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("count")
                }
                else if (colIndex == 1) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("id")
                    $(this).addClass("hide")
                }
                else if (colIndex == 2) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("email")
                }
                else if (colIndex == 3) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("dateCreate")
                }
                else if (colIndex == 4) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("products-col")
                    const order_id = ($(this).parent().find(".id").text())
                    var productDiv = $(this)
                    for (var i of dataOrders.orders) {
                        if (i.id === Number(order_id)) {
                            const detail = i.detail
                            for (var j of JSON.parse(detail)) {
                                $.ajax({
                                    async: false,
                                    type: "GET",
                                    url: `http://localhost:3333/api/item/showitem/${j.item_id}`,
                                    dataType: "json",
                                    success: function (data) {
                                        const item = data.item
                                        if (item) {
                                            var html = ` 
                                            <div class="product">
                                            <img class = "img" src=${JSON.parse(item.img)[0]}
                                                alt="">
                                            <p class = "name">${item.name}</p>
                                            <p class = "price hide"  >${item.price}</p>
                                            <p class = "imPrice hide"  >${item.imPrice}</p>
                                            <p class = "number hide"  >${j.number}</p>
                                            <p class = "staffFee hide"  >${i.staffFee}</p>
                                            <p class = "shipFee hide"  >${i.shipFee}</p>
                                            </div>
                                    `
                                            productDiv.append(html)
                                        }
                                    }
                                });
                            }
                        }
                    }


                }
                else if (colIndex == 5) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("total-price")
                }
                else if (colIndex == 6) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("code")
                    $(this).addClass("hide")
                }
                else if (colIndex == 7) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("detail")
                    $(this).append(`<p class = "badge badge-success px-2 detail">Chi tiết</p> `)
                }
                else if (colIndex == 8) {
                    // $(this).attr('data-title', "1");
                    $(this).addClass("dateReceive")
                }

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
    $.ajax({
        type: "GET",
        url: `http://localhost:3333/api/admins/infor/${data.id}`,
        success: function (data) {
            adminEmailText.innerText = data.admin.email
        }

    });

}


function exportToExcel(fileName, sheetName, table, myData) {
    $(".excel").click(function (e) {
        if (myData.length === 0) {
            console.error('Chưa có data');
            return;
        }
        let wb;
        const ws = XLSX.utils.json_to_sheet(myData);
        var max_width = myData.reduce((w, r) => Math.max(w, r.orderingDate.length, r.user.length, r.price.length, r.receivingDate.length), 10);
        ws["!cols"] = [{ wch: max_width }]
        for (var i in ws) {
            if (typeof (ws[i]) != "object") continue;
            let cell = XLSX.utils.encode_cell(i);
            ws[i].s = { // styling for all cells
                font: {
                    name: "arial"
                },
                alignment: {
                    vertical: "center",
                    horizontal: "center",
                    wrapText: '1', // any truthy value here
                },
                border: {
                    right: {
                        style: "thin",
                        color: "000000"
                    },
                    left: {
                        style: "thin",
                        color: "000000"
                    },
                }
            };

            if (cell.c == 0) { // first column
                ws[i].s.numFmt = "DD/MM/YYYY HH:MM"; // for dates
                ws[i].z = "DD/MM/YYYY HH:MM";
            } else {
                ws[i].s.numFmt = "00.00"; // other numbers
            }

            if (cell.r == 0) { // first row
                ws[i].s.border.bottom = { // bottom border
                    style: "thin",
                    color: "000000"
                };
            }

            if (cell.r % 2) { // every other row
                ws[i].s.fill = { // background color
                    patternType: "solid",
                    fgColor: { rgb: "b2b2b2" },
                    bgColor: { rgb: "b2b2b2" }
                };
            }
        }

        wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.utils.sheet_add_aoa(ws, [["Khách Hàng", "Ngày Đặt", "Tổng Tiền", "Ngày Nhận"]], { origin: "A1" });
        console.log(ws)
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' }); //workbook output
        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), `${fileName}.xlsx`) // save workbook
        e.preventDefault();
    });
}


function showDetail(data) {
    const tableDetailSection = document.querySelector(".modal-detail-section ")
    const tableDetailContent = document.querySelector(".modal-detail-section .modal-detail-content ")
    $(".table-orders").click(function (e) {
        let parentEl = null
        e.preventDefault();
        if (e.target.closest(".detail")) {
            tableDetailSection.classList.add('open')
            parentEl = getParent(e.target, "tr")
        }
        renderDetail(parentEl)
    });
    tableDetailSection.addEventListener("click", e => {
        tableDetailSection.classList.remove('open')
    })
    tableDetailContent.addEventListener("click", e => {
        e.stopPropagation()
    })
}

function renderDetail(element) {
    if (element) {
        const tbodyModalDiv = document.querySelector(".modal-detail-content tbody")
        tbodyModalDiv.innerHTML = ''
        const price = element.querySelectorAll(".price")
        const number = element.querySelectorAll(".number")
        const imPrice = element.querySelectorAll(".imPrice")
        const code = element.querySelector(".code")
        const totalPrice = element.querySelector(".total-price")
        const shipFee = element.querySelector(".shipFee")
        const staffFee = element.querySelector(".staffFee")
        const name = element.querySelectorAll(".name")
        var count = 0
        var countImPrice = 0
        for (var i = 0; i < name.length; i++) {
            countImPrice += Number(handlePrice(imPrice[i].innerText))
            var priceOfProduct = handlePrice(price[i].innerText)
            let priceOfOder = priceOfProduct * Number(number[i].innerText)
            priceOfOder = handleTotalPrice(priceOfOder)
            count++
            const trOfModal = document.createElement('tr')
            trOfModal.innerHTML = `
            <td class = "count">${count}</td>
            <td class = "name">${name[i].innerText}</td>
            <td class = "imPrice">${imPrice[i].innerText}</td>
            <td class = "price">${price[i].innerText}</td>
            <td class = "number">${number[i].innerText}</td>
            <td class = "total-price-product">${priceOfOder}</td>
            `
            tbodyModalDiv.appendChild(trOfModal)
        }
        const feeDiv = document.querySelector(".footer-modal .fee .price")
        const shipDiv = document.querySelector(".footer-modal .ship .price")
        const codeDiv = document.querySelector(".footer-modal .code .price")
        const totalPriceDiv = document.querySelector(".footer-modal .total-price .price")
        const totalProfitDiv = document.querySelector(".footer-modal .total-profit .price")
        feeDiv.innerText = staffFee.innerText
        shipDiv.innerText = shipFee.innerText
        codeDiv.innerText = code.innerText
        totalPriceDiv.innerText = totalPrice.innerText
        totalProfitDiv.innerText = handleTotalPrice(handlePrice(totalPrice.innerText) - handlePrice(staffFee.innerText) - countImPrice)
    }
}

function getParent(element, selector) {
    while (element.parentElement) {
        if (element.parentElement.matches(selector)) {
            return element.parentElement
        }
        element = element.parentElement
    }
}

function handlePrice(price) {
    var priceOfProduct = []
    for (var j of price.split('')) {
        if (j != "đ" && j != ",") {
            priceOfProduct.push(j)
        }
    }
    return Number(priceOfProduct.join(''))
}

function handleTotalPrice(price) {
    var container = `${price}`.split('').reverse()
    var b = []
    var count = 0
    for (var i of container) {
        count++
        if (count === 3) {
            count = 0
            b.push(i)
            b.push(',')
        }
        else {
            b.push(i)
        }
    }
    if (b.reverse()[0] === ',') {
        b = (b.slice(1, b.length)).join('') + 'đ'
    }
    else {
        b = b.join('') + 'đ'
    }

    return b
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