// ----------------select---------------------
function handleSelect(el) {
  var x, i, j, l, ll, selElmnt, a, b, c;
  /* Look for any elements with the class "custom-select": */
  x = document.querySelector(`${el}`)
  selElmnt = x.getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /* For each element, create a new DIV that will act as the selected item: */
  a = x.querySelector(`.select-selected`);
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x.appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.setAttribute("data-set", `${selElmnt[j].getAttribute("data-set")}`)
    c.innerHTML = selElmnt.options[j].innerHTML;
    console.log(c)
    c.addEventListener("click", function (e) {
      /* When an item is clicked, update the original select box,
      and the selected item: */
      var y, i, k, s, h, sl, yl;
      s = this.parentNode.parentNode.getElementsByTagName("select")[0];
      sl = s.length;
      h = this.parentNode.previousSibling;
      for (i = 0; i < sl; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
          s.selectedIndex = i;
          h.innerHTML = this.innerHTML;
          y = this.parentNode.getElementsByClassName("same-as-selected");
          yl = y.length;
          for (k = 0; k < yl; k++) {
            y[k].removeAttribute("class");
          }
          this.setAttribute("class", "same-as-selected");
          break;
        }
      }
      h.click();
    });
    b.appendChild(c);
  }
  x.appendChild(b);
  a.addEventListener("click", function (e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });

}
function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);


//------------------------API--------------------------
$(document).ready(function () {
  start()
});

function start() {
  getDataCart()
  getDataCitySelect()
}

function getDataCart() {
  // cart produt
  $.ajax({
    type: "GET",
    url: "http://localhost:3333/api/cart/show",
    dataType: "json",
    headers: {
      token: 'Bearer ' + localStorage.getItem("accessToken"),
    },
    success: function (data) {
      if (data.status) {
        renderProducts(data)
        deleteOrder()
        handleInputCode(data)
        handleTotalPrice(data)
        pay()
      }
    }
  });

}

function getDataCitySelect() {
  // select
  $.ajax({
    async: false,
    type: "GET",
    url: "http://localhost:3333/api/cities/show",
    dataType: "json",
    success: function (data) {
      renderCitySelection(data)
      renderDistrictSelection(data)
      renderCommuneSelection(data)
    }
  });
}

function renderCitySelection(data) {

  const selectDiv = document.querySelector(".select-setion #cities select")

  var htmls = ''
  htmls += `<option value="0">Thành phố</option>`
  var count = 1
  for (var city of data.cities) {
    htmls += `
      <option data-set = "${city.code}" value="${count}">${city.name}</option>
      `
    count++

  }
  selectDiv.innerHTML = htmls
  handleSelect("#cities")
}
function renderDistrictSelection(data) {
  handleSelect("#districts")
  $("#cities").click(function (e) {
    e.preventDefault();
    const city = this.querySelector('.same-as-selected')
    const cityId = city.getAttribute("data-set")
    $.ajax({
      type: "GET",
      url: `http://localhost:3333/api/districts/show/${cityId}`,
      dataType: "json",
      success: function (data) {
        const selectDiv = document.querySelector(".select-setion #districts select")

        var htmls = ''
        var count = 1
        htmls += ` <option value="0">Quận huyện</option>`

        for (var district of data.districts) {
          htmls += `
        <option data-set = "${district.code}" value="${count}">${district.name}</option>
        `
          count++
        }
        selectDiv.innerHTML = htmls
        handleSelect("#districts")
      }
    });

  });

}
function renderCommuneSelection(data) {
  handleSelect("#communes")
  $("#districts").click(function (e) {
    e.preventDefault();
    const district = this.querySelector('.same-as-selected')
    const districtId = district.getAttribute("data-set")
    $.ajax({
      type: "GET",
      url: `http://localhost:3333/api/communes/show/${districtId}`,
      dataType: "json",
      success: function (data) {
        console.log(data)
        const selectDiv = document.querySelector(".select-setion #communes select")
        var htmls = ''
        var count = 1
        htmls += ` <option value="0">Quận huyện</option>`

        for (var communes of data.communes) {
          htmls += `
        <option data-set = "${communes.code}" value="${count}">${communes.name}</option>
        `
          count++
        }
        selectDiv.innerHTML = htmls
        handleSelect("#communes")
      }
    });

  });
}


function handleTotalPrice(data) {
  $(".table-order").click(function (e) {
    e.preventDefault();
    if (e.target.closest(".prev")) {
      e.preventDefault();
      const parentOfRow = e.target.parentElement.parentElement.parentElement
      const priceDiv = parentOfRow.querySelector('.table-order-price').innerText
      var price = []
      for (var i of priceDiv.split('')) {
        if (i != "đ" && i != ",") {
          price.push(i)
        }
      }
      const parentElement = e.target.parentElement
      const inputNumber = parentElement.querySelector('.number')
      var valueOfInput = inputNumber.value
      if (valueOfInput != 1) {
        inputNumber.value = valueOfInput - 1
      }
      const totalPrice = parentOfRow.querySelector(".table-order-total")
      var a = Number(price.join('')) * Number(inputNumber.value)
      var container = `${a}`.split('').reverse()
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
        totalPrice.innerText = (b.slice(1, b.length)).join('') + 'đ'
      }
      else {
        totalPrice.innerText = b.join('') + 'đ'
      }
    }
    else if (e.target.closest(".next")) {
      e.preventDefault();
      const parentOfRow = e.target.parentElement.parentElement.parentElement
      const priceDiv = parentOfRow.querySelector('.table-order-price').innerText
      var price = []
      for (var i of priceDiv.split('')) {
        if (i != "đ" && i != ",") {
          price.push(i)
        }
      }
      const parentElement = e.target.parentElement
      const inputNumber = parentElement.querySelector('.number')
      var valueOfInput = inputNumber.value
      inputNumber.value = Number(valueOfInput) + 1
      const totalPrice = parentOfRow.querySelector(".table-order-total")
      var a = Number(price.join('')) * Number(inputNumber.value)
      var container = `${a}`.split('').reverse()
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
        totalPrice.innerText = (b.slice(1, b.length)).join('') + 'đ'
      }
      else {
        totalPrice.innerText = b.join('') + 'đ'
      }
    }
    //default
    const number = document.querySelector('.numberOrder .number')
    number.addEventListener('input', function () {
      const parentOfRow = (this.parentElement.parentElement.parentElement)
      const inputNumber = parentOfRow.querySelector('.number')
      const priceDiv = parentOfRow.querySelector('.table-order-price').innerText
      var price = []
      for (var i of priceDiv.split('')) {
        if (i != "đ" && i != ",") {
          price.push(i)
        }
      }
      if (number.value) {
        const totalPrice = parentOfRow.querySelector(".table-order-total")
        var a = Number(price.join('')) * Number(inputNumber.value)
        var container = `${a}`.split('').reverse()
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
          totalPrice.innerText = (b.slice(1, b.length)).join('') + 'đ'
        }
        else {
          totalPrice.innerText = b.join('') + 'đ'
        }
      }
      totalPrice()
    })
    totalPrice()
  });
  totalPrice()
}

function totalPrice(code) {
  var prices = document.querySelectorAll(".table-order-total")
  var price = []
  for (var i of prices) {
    var container = []
    for (var j of i.innerText.split('')) {
      if (j != "đ" && j != ",") {
        container.push(j)
      }
    }
    price.push(container.join(''))
  }
  var total = 0
  for (var i of price) {
    total += Number(i)
  }

  //tính tổng tiền hàng trước khi giảm giá và + phí ship
  const oldTotalProPriceDiv = document.querySelector('.cart-footer .right .total-products-price')
  oldTotalProPriceDiv.innerText = handlePriceToCal(total)



  // tính tiền phí ship
  total += handleshipFee(total)
  var discountDiv = document.querySelector(".discount")
  var discountContentDiv = document.querySelector(".discount-content")

  //tính tiền trước khi giảm giá
  var oldTotalPrice = document.querySelector('.old-total-price')
  var oldTotal = total
  oldTotalPrice.innerText = handlePriceToCal(oldTotal)
  //giảm giá
  if (code) {
    discountDiv.innerText = `-${code}`
    discountDiv.classList.remove("hide")
    discountContentDiv.classList.remove("hide")
    const discount = total * parseInt(code) / 100
    total -= Math.round(discount)
  }

  var totalPriceDiv = document.querySelector(".total-price")

  var container = `${total}`.split('').reverse()
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
    totalPriceDiv.innerText = (b.slice(1, b.length)).join('') + 'đ'
  }
  else {
    totalPriceDiv.innerText = b.join('') + 'đ'
  }
}


function handleshipFee(totalPrice) {
  const shipFee = document.querySelector(".cart-footer .right .ship-fee")
  var shipfee = 30000
  shipFee.innerText = handlePriceToCal(shipfee)
  totalPrice += shipfee
  return shipfee
}

function handleInputCode(data) {
  const inputCode = document.querySelector('#code')
  inputCode.addEventListener('input', function () {
    if (inputCode.value) {
      $.ajax({
        type: "GET",
        url: `http://localhost:3333/api/sale/show/${data.products[0].user_id}/${inputCode.value}`,
        success: function (data) {
          if (data.code) {
            const code = data.code.discount
            const number = data.code.number
            totalPrice(code)
          }
          else {
            totalPrice()
          }
        }
      });
    }
  })
}


function deleteOrder() {
  $("table").unbind()
  $("table").click(function (e) {
    e.preventDefault();
    var btnDelete = e.target.closest(".table-order-delete")
    if (btnDelete) {
      var parentEl
      var element = e.target.parentElement
      while (element) {
        if (element.matches('.table-order-row')) {
          parentEl = element
          break
        }
        element = element.parentElement
      }
      const id = Number(parentEl.querySelector('.table-order-cart-id').innerText)
      $.ajax({
        type: "POST",
        url: "http://localhost:3333/api/cart/delete",
        data: {
          "id": id
        },
        dataType: "json",
        success: function (data) {
          successFunction(data)
          getDataCart()
        }
      });
    }
  });
}



function pay() {
  $(".btn-buy").click(function (e) {
    var checkOrder = document.querySelector(".cart-content h2.hide")
    if (checkOrder) {
      e.preventDefault();
      const orders = document.querySelectorAll(".table-order-row")
      const container = []
      for (var i of orders) {
        const item_img = i.querySelector(".table-order-img img").getAttribute("src")
        const item_id = i.querySelector(".table-order-item-id").innerText
        const name = i.querySelector(".table-order-name").innerText
        const price = i.querySelector(".table-order-total").innerText
        const number = i.querySelector(".numberOrder .number").value
        const block = {
          img: item_img,
          item_id,
          name,
          price,
          number
        }
        container.push(block)
      }
      const price = document.querySelector(".total-price").innerText
      const oldPrice = document.querySelector('.old-total-price').innerText
      const user_id = document.querySelector(".table-order-user-id").innerText
      const note = document.querySelector(".cart-footer #note").value
      const date = document.querySelector(".cart-footer #date").value
      const time = document.querySelector(".cart-footer #time").value
      const code = document.querySelector(".cart-footer #code").value
      const shipFee = document.querySelector(".cart-footer .right .ship-fee").innerText
      if (date && time) {
        $.ajax({
          type: "POST",
          url: "http://localhost:3333/api/pay/create",
          data: {
            user_id,
            note,
            price,
            code,
            date,
            time,
            shipFee,
            oldPrice,
            detail: container
          }
          ,
          dataType: "json",
          success: function (data) {
            successFunction(data)
            setTimeout(function () {
              location.reload()
            }, 1500)
          }
        });
      }
      else {
        errorFunction("Bạn cần nhập thời gian giao hàng")
      }
    }
    else {
      errorFunction("Bạn cần chọn sản phẩm")
    }

  });


}


function handlePriceToCal(price) {
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




function renderProducts(data) {
  const table = document.querySelector(".table-order")
  table.innerHTML = ''
  const noItem = document.querySelector(".cart-content h2")
  if (data.products.length > 0) {
    noItem.classList.add('hide')
    for (var i of data.products) {
      const row = document.createElement("tr")
      row.classList.add("table-order-row")
      var htmls = `
        <td class="table__content table-order-img">
            <img src="${i.img}"
                              alt="">
        </td>
        <td class="table__content table-order-item-id hide">${i.item_id}</td>
        <td class="table__content table-order-cart-id hide">${i.id}</td>
        <td class="table__content table-order-user-id hide">${i.user_id}</td>
        <td class="table__content table-order-name">${i.name}</td>
        <td class="table__content table-order-price">${i.price}</td>
        <td class="table__content table-order-number">
          <div class="numberOrder">
            <input type="button" class="prev" value="-"></input>
            <input type="number" class="number" value="1" min="1"></input>
            <input type="button" class="next" value="+"></input>
          </div>
        </td>
        <td class="table__content table-order-total">${i.price}</td>
        <td class="table__content table-order-delete">
          <i class="fa-solid fa-x"></i>
        </td>
        `
      row.innerHTML = htmls
      table.appendChild(row)
    }
  }
}

// ------toast---------------
import toast from "./toast.js"
function successFunction(data) {
  if (data.status) {
    toast({
      title: `Success`,
      message: `${data.msg}`,
      type: `Success`,
      duration: 5000
    })
    // setTimeout(function () {
    //     location.reload()
    // }, 2000)
  }
}
function errorFunction(message) {
  toast({
    title: 'Error',
    message: `${message}`,
    type: 'Error'
  })
}

