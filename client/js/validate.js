function Validator(options) {
  function getParent(element, selector) {
      while (element.parentElement) {
          if (element.parentElement.matches(selector)) {
              return element.parentElement
          }
          element = element.parentElement
      }
  }

  function Validate(inputElement, rule, options) {
      // nhận rule từ validation => lấy ra selector => lấy ra rule trong biến srt
      var inputParentElement = getParent(inputElement, options.formGroup)
      formMessageElement = inputParentElement.querySelector(options.errorSelector)
      var rules = selectorRulesTest[rule.selector]
      var errorMessage
      for (var i = 0; i < rules.length; ++i) {
          switch (inputElement.type) {
              case 'radio':
              case 'checkbox':
                  errorMessage = rules[i](formElement.querySelector((rule.selector) + ':checked'))
                  break
              default:
                  errorMessage = rules[i](inputElement.value)
                  break
          }
          if (errorMessage) {
              break
          }
      }
      if (errorMessage) {
          inputParentElement.classList.add('invalid')
          formMessageElement.innerHTML = errorMessage
      }
      else {
          formMessageElement.innerHTML = ''
          if (inputParentElement.classList.contains('invalid')) {
              inputParentElement.classList.remove('invalid')
          }
      }
      return errorMessage
      // return có lỗi hay không
  }
  var formElementSubmit = document.querySelector(options.formSubmit)
  // đặt biến check lỗi
  var isErrors = []
  formElementSubmit.addEventListener('click', function (e) {
      e.preventDefault()
      options.rules.forEach(rule => {
          var inputElement = formElement.querySelector(rule.selector)
          Validate(inputElement, rule, options)
          // dùng vòng lặp validate từng input
          if (Validate(inputElement, rule, options)) {
              isErrors.push(true)
          } else {
              isErrors.push(false)
          }
      })
      // tìm lỗi trong biến đã đặt
      var checkError = isErrors.find(function (value, index) {
          return value = true
      })
      // nếu không có lỗi
      if (!checkError) {
          valueOfInputElement = document.querySelectorAll("[name]")
          var data = {}
          var contains = []
          for (i of valueOfInputElement) {
              switch (i.type) {
                  case 'radio':
                      if (i.matches(':checked')) {
                          data[i.getAttribute('name')] = i.value
                      }
                      break
                  case 'checkbox':
                      data[i.getAttribute('name')] = []
                      if (i.matches(':checked')) {
                          contains.push(i.value)
                      }
                      data[i.getAttribute('name')] = contains
                      break
                  default:
                      data[i.getAttribute('id')] = i.value
              }
          }
      }
  })

  // tạo biến srt để lưu tất cả các rule.test => k bị ghi đè
  var selectorRulesTest = {}

  // select form 
  var formElement = document.querySelector(options.form)
  if (formElement) {
      options.rules.forEach(rule => {
          // lấy từng rule để lấy selector
          if (Array.isArray(selectorRulesTest[rule.selector])) {
              selectorRulesTest[rule.selector].push(rule.test)
          } else {
              selectorRulesTest[rule.selector] = [rule.test]
          }
          var inputElements = formElement.querySelectorAll(rule.selector)
          // khi blur
          // lấy được rule => lấy được selector gửi lên function validate
          Array.from(inputElements).forEach(function (inputElement) {
              inputElement.addEventListener('blur', function () {
                  Validate(inputElement, rule, options)
              })
              // khi input
              inputElement.addEventListener('input', function () {
                  var errorMessage = rule.test(inputElement.value)
                  var inputParentElement = getParent(inputElement, options.formGroup)
                  formMessageElement = inputParentElement.querySelector(options.errorSelector)
                  formMessageElement.innerHTML = ''
                  if (inputParentElement.classList.contains('invalid')) {
                      inputParentElement.classList.remove('invalid')
                  }
              })
          })
      });
  }
}

// định nghĩa các rules
// nguyên tắc của rule
// có lỗi => trả message lỗi
// khi hợp lệ => k trả ra cgi
Validator.isRequired = function (selector, message) {
  return {
      selector,
      test: function (value) {
          if (value) {
              return ''
          }
          else {
              if (message) {
                  return message
              }
              else {
                  return "Vui lòng nhập trường này"
              }
          }
      }
  }
}

Validator.isEmail = function (selector, message) {
  return {
      selector,
      test: function (value) {
          var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          if (value.match(mailformat)) {
              return ''
          }
          else {
              if (message) {
                  return message
              }
              else {
                  return "Vui lòng nhập email"
              }
          }
      }
  }
}
Validator.minLength = function (selector, message) {
  return {
      selector,
      test: function (value) {
          if (value.trim().length < 6) {
              if (message) {
                  return message
              }
              else {
                  return "Mật khẩu tối thiểu 6 kí tự"
              }
          }
          else {
              return ''
          }
      }
  }
}
Validator.isConfirmed = function (selector, password, message) {
  return {
      selector,
      test: function (value) {
          if (value != password()) {
              if (message) {
                  return message
              }
              else {
                  return "Mật khẩu không khớp"
              }
          }
          else {
              return ''
          }
      }
  }
}