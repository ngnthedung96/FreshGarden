//----------------img effect-----------------------
const subImg = document.querySelectorAll('.left .sub-img img')
const mainImg = document.querySelector('.left .main-img img')

const sliderEffect = {
  currentIndex: 0,
  render() {
    var a = document.querySelector('.left .sub-img img.borderSlider')
    if (a) {
      a.classList.remove('borderSlider')
    }
    subImg[this.currentIndex].classList.add('borderSlider')
    setTimeout(() => {
      mainImg.src = subImg[this.currentIndex].src
    }, 200)
  },
  clickImg() {
    var __this = this
    subImg.forEach(function (item, index) {
      item.addEventListener('click', function () {
        __this.currentIndex = (item.getAttribute('data-set'))
        __this.render()
      })
    })
  },
  start: function () {
    this.render()
    this.clickImg()
  }
}


// -------------------slide-down---------------------

$(document).ready(function () {
  $('.inforOfProduct .inforOfProduct-header').click(function (e) {
    e.preventDefault();
    $(".text").slideToggle();
    $('body').animate({
      scrollTop: $(this).offset().top
    })
    $('.inforOfProduct .btn-slide').toggleClass('btnSlideActive');
  });
  $('.guide .guide-header').click(function (e) {
    e.preventDefault();
    $(".guide  img").slideToggle();
    $('body').animate({
      scrollTop: $(this).offset().top
    })
    $('.guide .btn-slide').toggleClass('btnSlideActive');
  });
});

// ------------------------------------api---------------------------------
$(document).ready(function () {
  const path = (window.location.search.split(''))
  var id = null
  for (var i = 0; i < path.length; i++) {
    if (path[i] === '=') {
      id = path.splice(i + 1, path.length).join('')
    }
  }
  $.ajax({
    type: "GET",
    url: `http://localhost:3333/api/item/showitem/${id}`,
    success: function (data) {
      renderItem(data)
      postProductTocart(data, id)
      renderRate(data)
    }
  });
});


function renderItem(data) {
  var name = document.querySelector('.products .right .name')
  var price = document.querySelector('.products .right .price')
  var number = document.querySelector('.products .right .number')
  number.innerText = `Số lượng sản phẩm còn lại: ${data.item.number}`

  name.innerText = data.item.name
  price.innerText = data.item.price
  const imgOfData = JSON.parse(data.item.img)
  var mainImg = document.querySelector('.products .left .main-img img')
  mainImg.src = imgOfData[0]
  var subImg = document.querySelectorAll('.products .left .sub-img img')
  for (var i = 0; i < subImg.length; i++) {
    for (var j = 0; j < imgOfData.length; j++) {
      if (i == j) {
        subImg[i].src = imgOfData[j]
      }
    }
  }
  sliderEffect.start()
}
function postProductTocart(data, id) {
  $(".addToCart").click(function (e) {
    e.preventDefault();
    var parentEl
    var element = this.parentElement
    while (element) {
      if (element.matches('.products')) {
        parentEl = element
        break
      }
      element = element.parentElement
    }
    const nameItem = parentEl.querySelector(".name").innerText
    var priceItem = parentEl.querySelector(".price").innerText
    const imgOfItem = parentEl.querySelector(".main-img img").getAttribute("src")
    if (localStorage.getItem("accessToken")) {
      $.ajax({
        type: "POST",
        url: "http://localhost:3333/api/cart/create",
        headers: {
          token: 'Bearer ' + localStorage.getItem("accessToken"),
        },
        data: {
          "item_id": Number(id),
          "name": `${nameItem}`,
          "price": `${priceItem}`,
          "img": `${imgOfItem}`,
        },
        dataType: "json",
        success: function (data) {
          console.log(data)
          successFunction(data)
          setTimeout(function () {
            window.open('/client/page/cart.html')
          }, 1000)
        },
        error: function (data) {
          errorFunction(data.responseJSON.msg)
        }
      });
    }
    else {
      errorFunction("Bạn cần đăng nhập")
    }
  });
}

function renderRate(data) {
  const rateSection = document.querySelector(".rate-section")
  if (data.item.rate) {
    rateSection.classList.add("open")
    const star = rateSection.querySelector(".rateNumber")
    star.innerText = `${data.item.rate}/5`
  }

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
    setTimeout(function () {
      window.close()
      window.open('/client/index.html')
    }, 1500)
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