$(document).ready(function () {
    const path = (window.location.search.split(''))
    var title = null
    for (var i = 0; i < path.length; i++) {
        if (path[i] === '=') {
            title = path.splice(i + 1, path.length).join('')
        }
    }
    start(title)

});



function start(title) {
    getItem(title)
    renderItemsByCategory()
    authentication()
}

function authentication() {
    if (localStorage.getItem("accessToken")) {
        $.ajax({
            url: "http://localhost:3333/api/users/home",
            type: "GET",
            dataType: 'json',
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessToken"),
            }
        })
            .done(function (data, textStatus, jqXHR) {
                if (data.status) {
                    postProductTocart(data)
                }
            })
    }
    else {
        $(".category-content-products").click(function (e) {
            e.preventDefault();
            if (e.target.closest(".addToCart")) {
                errorFunction("Bạn cần đăng nhập")
            }
        });
    }
}
function getItem(title) {
    $.ajax({
        type: "GET",
        url: `http://localhost:3333/api/item/show/${title}`,
        dataType: "json",
        success: function (data) {
            if (data.status) {
                renderItems(data.items, data.category)
                viewItem(data)
            }
        }
    });
}


function renderItemsByCategory() {
    $(".category-nav-content").click(function (e) {
        e.preventDefault();
        if (e.target.closest('.title')) {
            const title = e.target.innerText.trim()
            $.ajax({
                type: "GET",
                url: `http://localhost:3333/api/item/show/${title}`,
                dataType: "json",
                success: function (data) {
                    if (data.status) {
                        renderItems(data.items, data.category)
                        viewItem(data)
                        authentication()
                    }
                }
            });
        }
    });
}

function renderItems(items, title) {
    const header = document.querySelector(".category-content-header h2")
    header.innerText = title
    const numberCol = 4
    const productDiv = document.querySelector(".category-content-products")
    productDiv.innerHTML = ''
    var numberRow = items.length / 4
    if (numberRow % 1 !== 0) {
        numberRow + 1
    }
    for (var i = 0; i < numberRow; i++) {
        var productRow = document.createElement("div")
        productRow.classList.add("category-content__product-row")
        productDiv.appendChild(productRow)
    }
    var productRow = document.querySelectorAll(".category-content__product-row")
    if (productRow) {
        for (var row of productRow) {
            for (var i = 0; i < numberCol; i++) {
                if (items[i]) {
                    var product = document.createElement('div')
                    product.classList.add('category-content__product')
                    product.classList.add('col')
                    product.classList.add('span-1-of-4')
                    const item = items[i]
                    const imgOfItem = (JSON.parse(item.img)[0])
                    product.innerHTML = `
                    <a href = "#"> 
                    <p class="id hide">${items[i].id}</p>
                    <img class= "img" src="${imgOfItem}"
                        alt="">
                    <h4 class = "name">${items[i].name}</h4>
                    <p class="price">${items[i].price}</p>
                  </a>
                  <div class="hoverProduct">
                    <a href="##" class="addToCart">
                        <i class="fa-solid fa-cart-plus"></i>
                    </a>
                    <a href="##" class="viewProduct"  data-set = "${items[i].id}">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                  </div>`
                    row.appendChild(product)
                }
            }
            items.slice(0, numberCol)
        }
    }

}

function viewItem(items) {
    $(".hoverProduct").click(function (e) {
        if (e.target.closest('.viewProduct')) {
            const idItem = (this.querySelector(".viewProduct").getAttribute("data-set"))
            window.open(`./product.html?id=${idItem}`)
        }
    });
}

function postProductTocart(data) {
    $(".addToCart").unbind()
    $(".addToCart").click(function (e) {
        e.preventDefault();
        var parentDiv = this.parentElement.parentElement
        const nameItem = parentDiv.querySelector(".name").innerText
        var priceItem = parentDiv.querySelector(".price").innerText
        const idOfItem = parentDiv.querySelector(".id").innerText
        const imgOfItem = parentDiv.querySelector(".img").getAttribute("src")
        $.ajax({
            type: "POST",
            url: "http://localhost:3333/api/cart/create",
            data: {
                "user_id": data.user.id,
                "item_id": Number(idOfItem),
                "name": `${nameItem}`,
                "price": `${priceItem}`,
                "img": `${imgOfItem}`,
            },
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessToken"),
            },
            dataType: "json",
            success: function (data) {
                console.log(data)
                successFunction(data)
            }
        });
    });
}


// ------toast---------------
import toast from "./toast.js"
function successFunction(data) {
    if (data.status) {
        toast({
            title: 'Success',
            message: `${data.msg}`,
            type: 'Success'
        })
    }
}
function errorFunction(message) {
    toast({
        title: 'Error',
        message: `${message}`,
        type: 'Error'
    })
}

