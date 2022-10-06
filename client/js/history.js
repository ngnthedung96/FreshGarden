$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "http://localhost:3333/api/pay/show",
        dataType: 'json',
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessToken"),
        },
        success: function (data) {
            renderOrder(data)
            renderRate(data)
            rateProduct(data)
        }
    });
});

function renderOrder(data) {
    console.log(data)

    const historyContentDiv = document.querySelector('.history-content')
    for (var order of data.orders) {
        const dateOrder = moment(order.createdAt).format("DD-MM-YYYY")
        const dayDiv = document.createElement('div')
        dayDiv.classList.add('day')
        dayDiv.innerHTML = `
        <h4 class="day-title">Ngày đặt: ${dateOrder}</h4>
        <p class = "id hide">${order.id}</p>
        <p class = "user_id hide">${order.user_id}</p>
        <table class="table table-order">
                <tr>
                    <th class="table__heading"></th>
                    <th class="table__heading">Tên Sản phẩm</th>
                    <th class="table__heading">Số lượng</th>
                    <th class="table__heading">Thành tiền</th>
                    <th class="table__heading">Đánh giá sản phẩm</th>
                </tr>
        </table>
        <a class = "rate-btn">Gửi đánh giá</a>
        `
        historyContentDiv.appendChild(dayDiv)
        const tableDiv = dayDiv.querySelector('.table-order')
        for (var i of JSON.parse(order.detail)) {
            const dayRow = document.createElement('tr')
            dayRow.setAttribute("data-set", `${i.item_id}`)
            dayRow.innerHTML =
                `
                <td class="table__content table-order-img">
                    <img src="${i.img}"
                              alt="">
                </td>
                <td class="table__content table-order-name">${i.name}</td>
                <td class="table__content table-order-number">${i.number} </td>
                <td class="table__content table-order-price">${i.price}</td>
                <td class="table__content table-order-item_id hide">${i.item_id}</td>
                <td class="table__content table-order-rate">
                    <input type="text" class="rating" data-size="lg" >
                </td>
                `
            tableDiv.appendChild(dayRow)
        }
    }
    $(".rating").rating();
}

function rateProduct() {

    $(".history-content").click(function (e) {
        if (e.target.closest(".rate-btn")) {
            const container = []
            const parentEl = getParent(e.target, ".day")
            const id = parentEl.querySelector(".id").innerText
            const order_id = parentEl.querySelectorAll(".table-order .table-order-item_id")
            const rateDiv = parentEl.querySelectorAll(".table-order .filled-stars")
            for (var i = 0; i < order_id.length; i++) {
                if (rateDiv[i]) {
                    var obj = {}
                    obj.id = Number(order_id[i].innerText)
                    const starNumber = handleNumber(rateDiv[i].style.width) * 5 / 100
                    obj.rate = starNumber
                    container.push(obj)
                }
            }
            $.ajax({
                type: "PUT",
                url: "http://localhost:3333/api/pay/updateRate",
                data: {
                    "id": Number(id),
                    "rate": container
                },
                headers: {
                    token: 'Bearer ' + localStorage.getItem("accessToken"),
                },
                dataType: "json",
                success: function (data) {
                    console.log(data.msg)
                }
            });
        }
    });
}

function handleNumber(number) {
    const container = []
    for (var i of number.split("")) {
        if (Number(i) || i == '0') {
            container.push(i)
        }
    }
    return Number(container.join(''))
}

function getParent(el, parentEl) {
    var parentEl
    var element = el.parentElement
    while (element) {
        if (element.matches(`${parentEl}`)) {
            parentEl = element
            break
        }
        element = element.parentElement
    }

    return parentEl
}

function renderRate(data) {
    const historyContentDivs = document.querySelectorAll(".history-content .day")
    for (var order of data.orders) {
        if (order.rate) {
            for (var historyContentDiv of historyContentDivs) {
                const order_id = historyContentDiv.querySelector(".id").innerText
                if (order.id === Number(order_id)) {
                    const orderRates = historyContentDiv.querySelectorAll(".table-order > tr")
                    var rateBlocks = JSON.parse(order.rate)
                    for (var rateBlock of rateBlocks) {
                        for (var orderRate of orderRates) {
                            if (Number(orderRate.getAttribute("data-set")) === Number(rateBlock.id)) {
                                const rateDiv = orderRate.querySelector(".filled-stars")
                                rateDiv.style.width = `${(Number(rateBlock.rate)) / 5 * 100}%`
                            }
                        }

                    }
                }

            }

        }
    }
}
