function toast({
    title = '',
    message = '',
    type = '',
    duration = 1000
}) {

    const main = document.querySelector('#toast')
    const icons = {
        Success: "fa-solid fa-circle-check",
        Warning: "fa-solid fa-circle-exclamation",
        Infor: "fa-solid fa-circle-exclamation",
        Error: "fa-solid fa-circle-exclamation"
    }
    const icon = icons[type]
    if (main) {
        const toast = document.createElement('div')
        const setTimeOut = setTimeout(function () {
            main.removeChild(toast)
        }, duration + 1000)

        toast.addEventListener('click', function (e) {
            if (e.target.closest('.toast__close')) {
                main.removeChild(toast)
                clearTimeout(setTimeOut)
            }
        })
        toast.classList.add('toast', `toast--${type}`)
        // toast.style.animation = `slideInLeft ease-in 1s, fadeOut linear 1s ${duration/1000}s forwards;`
        var htmls = `
        <div class="toast__icon">
          <i class="${icon}"></i>
        </div>
        <div class="toast__body">
          <h3 class="toast__title">${title}</h3>
          <p class="toast__msg"> ${message}</p>
        </div>
        <div class="toast__close">
          <i class="fa-solid fa-xmark"></i>
        </div>
        `
        toast.innerHTML = htmls
        main.appendChild(toast)

    }
}

export default toast