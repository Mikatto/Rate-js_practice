async function getCurrency() {
    let response = await fetch('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11');
    let currency = await response.json();
    let currencyData=currency[0].sale;
    let currencyRound = Math.ceil(currencyData * 100) / 100;
    localStorage.setItem('currency',currencyRound);
}

// CURRENCY
let currencyRender = document.getElementById('currency');
currencyRender.innerHTML = `${localStorage.getItem('currency')} $`;
getCurrency();

// RATE
let rate = document.querySelector('[name=rate]');
let ratePush = document.getElementById('ratePush');
let totalPerHour = document.getElementById('totalPerHour');

ratePush.addEventListener('click', function () {
    setTimeout(() => this.classList.toggle('rotate'));
    this.classList.remove('rotate');
    let rateRound = Math.ceil((localStorage.getItem('currency') * rate.value) * 100) / 100;
    totalPerHour.innerHTML = `= ${rateRound} ₴`;
    localStorage.setItem('rate',rate.value);
})

window.onload =  function () {
    rate.value = localStorage.getItem('rate');
    let rateRound = Math.ceil((localStorage.getItem('currency') * localStorage.getItem('rate')) * 100) / 100;
    totalPerHour.innerHTML = `= ${rateRound} ₴`;
}

// DAYS
let hoursInput = document.querySelector('#day-hours');
let daysWrapper = document.querySelector('.days');
hoursInput.addEventListener('focus', function () {
    hoursInput.value = ""
})

// CARDS RENDER
function renderInfoCard() {
    let salary = (hoursInput.value*localStorage.getItem('rate'))*localStorage.getItem('currency');
    let salaryRound = Math.ceil(salary * 100) / 100;

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    today = mm + '.' + dd ;

    let cardWrapper = document.createElement('div');
    cardWrapper.classList.add('info-card__wrapper');

    let dltBtn = document.createElement('button');
    dltBtn.classList.add('delete-info');
    dltBtn.addEventListener('click',removeCard);

    let div = document.createElement('div');
    div.className ="info-card";
    
    cardWrapper.innerHTML = (`
        <div class="info-card__text" id="date">${today}</div>
        <div class="info-card__text info-card__text-main" id="hours">${hoursInput.value} h</div>
        <div class="info-card__text info-card__text-main" id="salary">${salaryRound} ₴</div>
    `);

    cardWrapper.append(dltBtn);
    div.append(cardWrapper);
    daysWrapper.append(div);
}

// CARDS DELETE
function removeCard(){
    this.closest('.info-card').remove();
}

//FIELDS COUNTER
function Article() {
    this.created = new Date();
    Article.count++; 
    Article.last = this.created; 
}
let totalDays = document.getElementById('total-days');
Article.count = 0; 

Article.showStats = function() {
    totalDays.innerHTML =`${this.count} days`;
};

let totalHoursArray = [];

// CARDS ADDING
let addCard = document.getElementById('add-hours');
addCard.addEventListener('click', function () {
    

    let totalTime = document.getElementById('total-time');
    let hoursToNum = Number(hoursInput.value);

    if (hoursToNum == "" || 0) {
        hoursInput.style.boxShadow = '0 0 0 2px #FF7A7A';
        hoursInput.style.background = '#FFD1D1';
    } else{
        hoursInput.removeAttribute("style");
        renderInfoCard();
        new Article();
        Article.showStats();

        totalHoursArray.push(hoursToNum);
        localStorage.setItem('totalHoursArray',totalHoursArray)
        let sumHrs = totalHoursArray.reduce((previous, current) => previous + current,0);
        totalTime.innerHTML =`${sumHrs} h`;

        let totalSalary = document.getElementById('total-salary');
        totalSalary.innerHTML = `${(sumHrs*rate.value)*localStorage.getItem('currency')} ₴`
    }
});
