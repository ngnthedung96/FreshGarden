//--------------------show user---------------------
$(document).ready(function () {
  getDataUser()
  goToCate()
  handleTransition()
  getDataItem()
});

function showCatNav() {
  const catNavSection = document.querySelector(".category-nav-section")
  const catNavContent = document.querySelector(".js-category-nav")
  catNavSection.classList.add('open')
  catNavContent.style.animation = ' ShowcatNav ease-in 0.2s forwards'
}
function hideCatNav() {
  const catNavSection = document.querySelector(".category-nav-section")
  const catNavContent = document.querySelector(".js-category-nav")
  setTimeout(function () {
    catNavSection.classList.remove('open')
  }, 200)
  catNavContent.style.animation = ' HidecatNav ease 0.2s forwards'
}


// ------------------------show subcatnav-------------( trong thanh bên phải)

function showSubCatNav() {
  $('.js-category-nav__product-btn').click(function (e) {
    e.preventDefault();
    $(".category-sub-nav__products").slideToggle();
    $('body').animate({
      scrollTop: $(this).offset().top
    })
    $('.js-category-nav__product-btn').toggleClass('catSubNavActive');
  });
}
function handleTransition() {
  // ----------------show catnav-------------------- (thanh bên phải)
  const catNavBtn = document.querySelector('.js-category-nav__btn')
  const catNavBtnBack = document.querySelector('.js-category-nav__back-btn')
  const catNavSection = document.querySelector(".category-nav-section")
  const catNavContent = document.querySelector(".js-category-nav")
  catNavBtn.addEventListener('click', showCatNav)
  catNavBtnBack.addEventListener('click', hideCatNav)
  catNavSection.addEventListener('click', hideCatNav)
  catNavContent.addEventListener('click', function (e) {
    e.stopPropagation()
  })
  showSubCatNav()
  showSearchNav()
}


function showSearchNav() {
  //-----------------------search-nav----------------------------
  $(".search-nav-btn").click(function (e) {
    e.preventDefault();
    const searchSection = document.querySelector(".search-nav-section")
    searchSection.classList.add('open')
  });
  $(".search-nav-section").click(function (e) {
    e.preventDefault();
    const searchSection = document.querySelector(".search-nav-section")
    searchSection.classList.remove('open')
  });
  $(".search-nav-section .search-nav-content").click(function (e) {
    e.stopPropagation();

  });
  $(".search-nav-content .btn-close-nav").click(function (e) {
    e.stopPropagation();
    const searchSection = document.querySelector(".search-nav-section")
    searchSection.classList.remove('open')
  });
}
function getDataItem() {
  $.ajax({
    type: "GET",
    url: "http://localhost:3333/api/item/show",
    dataType: "json",
    success: function (data) {
      if (data.status) {
        searchInput(data)
        clickSearch()
      }
    }
  });
}

function searchInput(data) {
  const searchResultsContainer = document.querySelector(".search-results")
  const inputSearch = document.querySelector(".search-nav-section .input-search")
  inputSearch.addEventListener("input", (e) => {
    const search = e.target.value.toLowerCase().trim()
    if (search) {
      searchResultsContainer.innerHTML = ''
      const searchResults = []
      for (var result of data.items) {
        const resultArr = result.name.toLowerCase().trim().split('')
        if (search.split('').every(text => resultArr.includes(text))) {
          searchResults.push(result)
        }
      }
      for (var searchResult of searchResults) {
        const product = document.createElement("div")
        product.classList.add('search-product')
        const imgOfProduct = JSON.parse(searchResult.img)[0]
        product.innerHTML = `
        <img src="${imgOfProduct}" alt="">
        <div class="search-product-description">
            <p class = "id hide">${searchResult.id}</p>
            <p class="name">${searchResult.name}</p>
            <p class="price">${searchResult.price}</p>
        </div>
        `
        searchResultsContainer.appendChild(product)
      }
      clickSearch()
    }
    else {
      searchResultsContainer.innerHTML = ''
    }
  })

}

function clickSearch() {
  $(".search-product").click(function (e) {
    e.preventDefault();
    const idProduct = this.querySelector(".search-product-description .id").innerText
    window.open(`./product.html?id=${idProduct}`)
  });
}

function getDataUser() {
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
          haveUserLogin(data)
          logOut()
        }
      })
  }
}

function haveUserLogin(data) {
  const user = document.querySelector('.header-nav .user-logout-nav')
  const signIn = document.querySelector('.header-nav .login-register-nav')
  signIn.classList.toggle('hide')
  user.classList.toggle('hide')
  const name = user.querySelector('.user-name span')
  name.innerText = `${data.user.email}`
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
function goToCate() {
  $(".allProducts").click(function (e) {
    const title = "home"
    e.preventDefault();
    window.open(`./category.html?title=${title}`)
  });
  $(".category-sub-nav__products").click(function (e) {
    e.preventDefault();
    if (e.target.closest(".nav")) {
      window.open(`./category.html?title=${e.target.innerText}`)
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


