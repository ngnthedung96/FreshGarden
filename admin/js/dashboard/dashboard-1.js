$.ajax({
    type: "GET",
    url: "http://localhost:3333/api/pay/showall",
    headers: {
        token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
    },
    success: function (data) {
        renderChartMax(data)
        renderMorrisChart(data)
    }
});
function renderMorrisChart(data) {
    var monthContainer = []
    for (order of data.orders) {
        const time = order.createdAt.split('-')
        const [checkYear, checkMonth] = time
        if (!monthContainer.includes(checkMonth)) {
            monthContainer.push(checkMonth)
        }
    }
    monthContainer = monthContainer.map(value => {
        return Number(value)
    });
    for (var i = 0; i < monthContainer.length - 1; i++) {
        for (var j = i + 1; j < monthContainer.length; j++) {
            if (monthContainer[i] < monthContainer[j]) {
                var a = monthContainer[i]
                var b = monthContainer[j]
                monthContainer[j] = a
                monthContainer[i] = b
            }
        }
    }
    monthContainer = monthContainer.slice(0, 4).reverse();
    const list = []
    for (var i = 0; i < monthContainer.length; i++) {
        list.push([])
        for (order of data.orders) {
            const time = order.createdAt.split('-')
            const [checkYear, checkMonth] = time
            if (monthContainer[i] === Number(checkMonth)) {
                for (product of JSON.parse(order.detail)) {
                    list[i].push(Number(product.number))
                }
            }
        }
    }
    for (var i = 0; i < list.length; i++) {
        if (list[i].length == 1) {
            list[i] = list[i][0]
        }
        else {
            var sum = 0
            for (number of list[i]) {
                sum += number
            }
            list[i] = sum
        }
    }
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    (function ($) {
        "use strict"
        // LINE CHART
        // Morris bar chart
        Morris.Bar({
            element: 'morris-bar-chart',
            data: [{
                y: `${monthNames[monthContainer[0] - 1]}`,
                a: list[0]
            }, {
                y: `${monthNames[monthContainer[1] - 1]}`,
                a: list[1]
            }, {
                y: `${monthNames[monthContainer[2] - 1]}`,
                a: list[2]
            }, {
                y: `${monthNames[monthContainer[3] - 1]}`,
                a: list[3]
            }],
            xkey: 'y',
            ykeys: ['a'],
            labels: ['Sản phẩm'],
            barColors: ['#47d864'],
            hideHover: 'auto',
            gridLineColor: 'transparent',
            resize: true
        });
    })(jQuery);
}
function renderChartMax(data) {
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
            var idMaxInContainer1 = 0
            var newNumberContainer = []
            for (var i = 0; i < numberContainer.length; i++) {
                if (numberContainer[i] === max) {
                    idMaxInContainer1 = i
                    idMax = idItemContainer[i]
                    newNumberContainer = numberContainer.slice(i + 1, numberContainer.length)
                }
            }
            var idMax2 = 0
            var idMaxInContainer2 = 0
            const max2 = getMaxAndSum(newNumberContainer)
            for (var i = 0; i < numberContainer.length; i++) {
                if (numberContainer[i] === max2) {
                    idMaxInContainer2 = i
                    idMax2 = idItemContainer[i]
                }
            }
            const max1Div = document.querySelector(".best-seller .max-1")
            const max2Div = document.querySelector(".best-seller .max-2")
            const numberByDate1 = [[], []]
            const numberByDate2 = [[], []]
            for (item of response.items) {
                if (item.id === idMax) {
                    max1Div.innerText = item.name
                }
                else if (item.id === idMax2) {
                    max2Div.innerText = item.name
                }
            }
            for (order of data.orders) {
                const time = order.createdAt.split('-')
                const [checkYear, checkMonth] = time
                if (month === Number(checkMonth)) {
                    for (product of JSON.parse(order.detail)) {
                        if (Number(product.item_id) === idMax) {
                            const time = order.createdAt.split('-')
                            const [checkYear, checkMonth, checkDate] = time
                            if (Number(checkDate) <= 15) {
                                numberByDate1[0].push(product.number)
                            }
                            else {
                                numberByDate1[1].push(product.number)
                            }
                        }
                        else if (Number(product.item_id) === idMax2) {
                            const time = order.createdAt.split('-')
                            const [checkYear, checkMonth, checkDate] = time
                            if (Number(checkDate) <= 15) {
                                numberByDate2[0].push(product.number)
                            }
                            else {
                                numberByDate2[1].push(product.number)
                            }
                        }
                    }
                }

            }
            sumArray(numberByDate1)
            sumArray(numberByDate2);
            (function ($) {
                "use strict"
                let ctx = document.getElementById("chart_widget_2");
                ctx.height = 280;
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['', 'Trước ngày 15', 'Sau ngày 15'],
                        type: 'line',
                        defaultFontFamily: 'Montserrat',
                        datasets: [{
                            data: numberByDate1,
                            label: max1Div.innerText,
                            backgroundColor: '#847DFA',
                            borderColor: '#847DFA',
                            borderWidth: 0.5,
                            pointStyle: 'circle',
                            pointRadius: 5,
                            pointBorderColor: 'transparent',
                            pointBackgroundColor: '#847DFA',
                        }, {
                            label: max2Div.innerText,
                            data: numberByDate2,
                            backgroundColor: '#F196B0',
                            borderColor: '#F196B0',
                            borderWidth: 0.5,
                            pointStyle: 'circle',
                            pointRadius: 5,
                            pointBorderColor: 'transparent',
                            pointBackgroundColor: '#F196B0',
                        }]
                    },
                    options: {
                        responsive: !0,
                        maintainAspectRatio: false,
                        tooltips: {
                            mode: 'index',
                            titleFontSize: 12,
                            titleFontColor: '#000',
                            bodyFontColor: '#000',
                            backgroundColor: '#fff',
                            titleFontFamily: 'Montserrat',
                            bodyFontFamily: 'Montserrat',
                            cornerRadius: 3,
                            intersect: false,
                        },
                        legend: {
                            display: false,
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                fontFamily: 'Montserrat',
                            },


                        },
                        scales: {
                            xAxes: [{
                                display: false,
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                },
                                scaleLabel: {
                                    display: false,
                                    labelString: 'Month'
                                }
                            }],
                            yAxes: [{
                                display: false,
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Value'
                                }
                            }]
                        },
                        title: {
                            display: false,
                        }
                    }
                });





            })(jQuery);
        }
    });
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
function sumArray(list, index, total) {
    list.unshift([0])
    for (var i = 0; i < list.length; i++) {
        if (list[i].length == 1) {
            list[i] = Number(list[i][0])
        }
        else {
            var sum = 0
            for (number of list[i]) {
                sum += Number(number)
            }
            list[i] = sum
        }
    }
}









/*******************
Pignose Calender
*******************/
(function ($) {
    "use strict";

    $(".year-calendar").pignoseCalendar({
        theme: "blue"
    }), $("input.calendar").pignoseCalendar({
        format: "YYYY-MM-DD"
    });

})(jQuery);



