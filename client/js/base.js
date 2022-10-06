// ----------------show catnav-------------------- (thanh bên phải)
const catNavBtn = document.querySelector('.js-category-nav__btn')
const catNavBtnBack = document.querySelector('.js-category-nav__back-btn')
const catNavSection = document.querySelector(".category-nav-section")
const catNavContent = document.querySelector(".js-category-nav")
function showCatNav() {
  catNavSection.classList.add('open')
  catNavContent.style.animation = ' ShowcatNav ease-in 0.2s forwards'


}
function hideCatNav() {
  setTimeout(function () {
    catNavSection.classList.remove('open')
  }, 200)
  catNavContent.style.animation = ' HidecatNav ease 0.2s forwards'
}
catNavBtn.addEventListener('click', showCatNav)
catNavBtnBack.addEventListener('click', hideCatNav)
catNavSection.addEventListener('click', hideCatNav)
catNavContent.addEventListener('click', function (e) {
  e.stopPropagation()
})

// ------------------------show subcatnav-------------( trong thanh bên phải)
$(document).ready(function () {
  $('.js-category-nav__product-btn').click(function (e) {
    e.preventDefault();
    $(".category-sub-nav__products").slideToggle();
    $('body').animate({
      scrollTop: $(this).offset().top
    })
    $('.js-category-nav__product-btn').toggleClass('catSubNavActive');
  });
});


//--------------------show user---------------------
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


