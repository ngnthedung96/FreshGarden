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
            }
        });
        $.ajax({
            type: "GET",
            url: "http://localhost:3333/api/pay/showall",
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            success: function (data) {
                renderNumberProduct(data)
                renderNetProfit(data)
                getNumberProductMax(data)
                renderRatePer(data)
            }
        });
        $.ajax({
            type: "GET",
            url: "http://localhost:3333/api/admins/showusers",
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            success: function (data) {
                renderNewCustomers(data)
            }
        });
        $.ajax({
            type: "GET",
            url: "http://localhost:3333/api/admins/showalladmins",
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            success: function (data) {
                renderAllAdmins(data)
            }
        });
    }
    else {
        window.open('/admin/page-error-400.html')
    }
});




function haveAdminLogin(data) {
    const loginDiv = document.querySelector(".header-right .default")
    loginDiv.classList.add('hide')
    const adminEmailDiv = document.querySelector('.icons.dropdown')
    const adminEmailText = document.querySelector('.icons.dropdown .user-email')
    adminEmailDiv.classList.remove('hide')
    adminEmailText.innerText = data.admin.email
}

function renderNumberProduct(data) {
    var countNumber = 0
    const date = new Date()
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    for (order of data.orders) {
        const time = order.createdAt.split('-')
        const [checkYear, checkMonth] = time
        if (month === Number(checkMonth)) {
            for (product of JSON.parse(order.detail)) {
                countNumber += Number(product.number)
            }
        }
    }
    const productSold = document.querySelector("#products-sold")
    productSold.innerHTML =
        `<h3 class="card-title text-white">Products Sold</h3>
    <div class="d-inline-block">
        <h2 class="text-white">${countNumber}</h2>
        <p class="text-white mb-0">${monthNames[month - 1]}- ${year}</p>
    </div>
    <span class="float-right display-5 opacity-5"><i class="fa fa-shopping-cart"></i></span>`
}

function renderNetProfit(data) {
    var countNumber = 0
    const date = new Date()
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    let imPrice = 0
    for (order of data.orders) {
        const time = order.createdAt.split('-')
        const [checkYear, checkMonth] = time
        if (month === Number(checkMonth)) {

            for (detail of JSON.parse(order.detail)) {
                $.ajax({
                    async: false,
                    type: "GET",
                    url: `http://localhost:3333/api/item/showitem/${detail.item_id}`,
                    dataType: "json",
                    success: function (data) {
                        const item = data.item
                        if (item) {
                            imPrice += handlePriceToCal(item.imPrice)
                        }
                    }
                });
            }
            countNumber += (handlePriceToCal(order.price) - handlePriceToCal(order.staffFee))
        }
    }
    countNumber = (Math.floor(countNumber / 23000 - imPrice / 23000))
    const totalEarningMonth = document.querySelector(".product-sales .total-earning-month")
    totalEarningMonth.innerText = `$ ${countNumber}`
    const netProfit = document.querySelector("#net-profit")
    netProfit.innerHTML =
        `<h3 class="card-title text-white">Net Profit</h3>
    <div class="d-inline-block">
        <h2 class="text-white">$ ${countNumber}</h2>
        <p class="text-white mb-0">${monthNames[month - 1]}- ${year}</p>
    </div>
    <span class="float-right display-5 opacity-5"><i class="fa fa-money"></i></span>`
}

function renderNewCustomers(data) {
    var countNumber = 0
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    for (user of data.user) {
        const time = user.createdAt.split('-')
        const [checkYear, checkMonth] = time
        if (month === Number(checkMonth)) {
            countNumber++
        }
        const newCustomer = document.querySelector("#new-customers")
        newCustomer.innerHTML =
            `<h3 class="card-title text-white">New Customers</h3>
        <div class="d-inline-block">
            <h2 class="text-white">${countNumber}</h2>
            <p class="text-white mb-0">${monthNames[month - 1]}- ${year}</p>
        </div>
        <span class="float-right display-5 opacity-5"><i class="fa fa-users"></i></span>`
    }
}

function getNumberProductMax(data) {
    $.ajax({
        type: "GET",
        url: "http://localhost:3333/api/item/show",
        success: function (response) {
            const date = new Date()
            const month = date.getMonth() + 1
            const idItemContainer = []
            const numberContainer = []
            var countNumber = 0
            for (item of response.items) {
                idItemContainer.push(item.id)
                numberContainer.push([])
            }
            for (order of data.orders) {
                const time = order.createdAt.split('-')
                const [checkYear, checkMonth] = time
                if (month === Number(checkMonth)) {
                    for (product of JSON.parse(order.detail)) {
                        countNumber += Number(product.number)
                        for (var i = 0; i < idItemContainer.length; i++) {
                            if (idItemContainer[i] === Number(product.item_id)) {
                                numberContainer[i].push(Number(product.number))
                            }
                        }
                    }
                }
            }
            const max = getMaxAndSum(numberContainer)
            var idMax = 0
            var newNumberContainer = []
            for (var i = 0; i < numberContainer.length; i++) {
                if (numberContainer[i] === max) {
                    idMax = idItemContainer[i]
                    newNumberContainer = numberContainer.slice(i + 1, numberContainer.length)
                }
            }
            var idMax2 = 0
            const max2 = getMaxAndSum(newNumberContainer)

            for (var i = 0; i < numberContainer.length; i++) {
                if (numberContainer[i] === max2) {
                    idMax2 = idItemContainer[i]
                }
            }
            const max1Div = document.querySelector(".best-seller .max-1")
            const max2Div = document.querySelector(".best-seller .max-2")
            for (item of response.items) {
                if (item.id === idMax) {
                    max1Div.innerText = item.name
                }
                else if (item.id === idMax2) {
                    max2Div.innerText = item.name
                }
            }
            const percentMax1 = Math.round(max / countNumber * 100)
            const percentMax2 = Math.round(max2 / countNumber * 100)
            const max1Progress = document.querySelector(".best-seller .product-max-1 .progress-bar ")
            const max2Progress = document.querySelector(".best-seller .product-max-2 .progress-bar ")
            max1Progress.style.width = `${percentMax1}%`
            max2Progress.style.width = `${percentMax2}%`

        }
    });
}

function renderRatePer(data) {
    var countNumber = 0
    var countRate = []
    const date = new Date()
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    for (var order of data.orders) {
        const time = order.createdAt.split('-')
        const [checkYear, checkMonth] = time
        if (month === Number(checkMonth)) {
            if (order.rate) {
                for (var orderRate of JSON.parse(order.rate)) {
                    var numberStar = Number(orderRate.rate)
                    countNumber += numberStar
                    countRate.push(numberStar)

                }
            }
        }
    }
    const ratePer = Math.round((countNumber / (countRate.length * 5)) * 100)
    const productSold = document.querySelector("#custiomer-sastifaction")
    productSold.innerHTML =
        `
        <h3 class="card-title text-white">Customer Satisfaction</h3>
                                <div class="d-inline-block">
                                    <h2 class="text-white">${ratePer}%</h2>
                                    <p class="text-white mb-0">${monthNames[month - 1]}- ${year}</p>
                                </div>
                                <span class="float-right display-5 opacity-5"><i class="fa fa-heart"></i></span>`
}
function getMaxAndSum(list) {
    var max = 0
    for (var i = 0; i < list.length; i++) {
        sum = 0
        if (Array.isArray(list[i])) {
            for (number of list[i]) {
                sum += number
            }
            if (sum > max) {
                max = sum
            }
            list[i] = sum
        }
        else {
            if (max < list[i]) {
                max = list[i]
            }
        }
    }
    return max
}

function renderAllAdmins(data) {
    const adminsContainer = document.querySelector(".admins")
    for (admin of data.admins) {
        const adminDiv = document.createElement('div')
        adminDiv.classList.add('col-lg-4')
        adminDiv.classList.add('col-sm-6')
        adminDiv.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <div class="text-center">
                        <img src="https://icon-library.com/images/facebook-icon-pictures/facebook-icon-pictures-28.jpg" class="rounded-circle" alt="">
                        <h5 class="mt-3 mb-1">${admin.email}</h5>
                        <p class="m-0">Senior Manager</p>
                    </div>
                </div>
            </div>`
        adminsContainer.appendChild(adminDiv)
    }
}

function handlePriceToShow() {

}

function handlePriceToCal(price) {
    var container = []
    for (var i of price.split('')) {
        if (i != "đ" && i != ",") {
            container.push(i)
        }
    }
    return Number(container.join(''))
}