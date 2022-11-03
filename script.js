const body = document.querySelector('body');
const textInput = document.getElementById('textInput');
const submitInput = document.getElementById('submitInput');
const btn = document.querySelector('button');
const h2TodayOrTomorrow = document.getElementById('todayOrTomorrow');
const currentTemerature = document.getElementById('currentTemperature');
const currentIcon = document.getElementById('currentIcon');
const cityAndCountry = document.getElementById('cityAndCountry');
const currentDate = document.getElementById('currentDate');
const insideOuterDivs = document.querySelectorAll('div.insideOuterDiv');
// weather details section:
const paraPrecipitation = document.getElementById('paraPrecipitation');
const paraHumidity = document.getElementById('paraHumidity');
const paraWind = document.getElementById('paraWind');
const paraUV = document.getElementById('paraUV');
const paraFeelsLike = document.getElementById('paraFeelsLike');
const paraVisibility = document.getElementById('paraVisibility');
const paraSunrise = document.getElementById('paraSunrise');
const paraSunset = document.getElementById('paraSunset');



function executeProgram(input) {
    if (input === '') {
        transformedUserInput = getUserInput();
        input = transformedUserInput;
    }
    getLocationKey(input)
        .then(() => {
            getForcast(locationKey)
            .then(() => {
                createAndFillClickableDivs(forecastArray);
                changeDetails('0', forecastArray);
                getSunriseAndSunset();
            })
            .catch(() => {
                console.error('The allowed number of requests has been exceeded. Displaying fake forcast.');
                whenLimitHasExceeded();
            })
        })
        .catch((err) => {
            console.error(err + 'getForcast() did not exectute properly');
            //whenLimitHasExceeded();
        });
}

window.onload = () => {
    textInput.value = ''
    executeProgram('berlin');
}

// PRESS ENTER = CLICK THE BUTTON
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        btn.click()
    }
})

//REMOVING DIGITS, SPECIAL CHAR FROM THE INPUT
let getUserInput = () => {
    return transformUserInput(textInput.value);
}
let transformedUserInput;
function transformUserInput(input) {
    if (typeof input === 'string') {
        return input.replace(/[0-9\s\W]/ig, '')
    } else {
        console.error('User input is not a string.')
    }
}

//GET A LOCATION KEY
let locationKey = 'location key not working hoe';
async function getLocationKey(input) {
    try {
        let promise = 
            await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=3gDsGAEp75BGo46eDPbNWjDL6zlFGslw&q=${input}`, {mode: 'cors'});
        let obj = await promise.json();
        let firstLocationObj = obj[0];
        cityAndCountry.textContent = firstLocationObj['EnglishName'].concat(', ', firstLocationObj['Country']['EnglishName'])
        locationKey = firstLocationObj['Key'];
    } catch (err) {
        alert('Entered city does not exist.');
    }    
}

//GET WEATHER DETAILS IN AN ARRAT OF OBJECTS
let forecastArray = [];
async function getForcast(locationKey) {
    let forcastPromise = 
        await fetch(`http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=%203gDsGAEp75BGo46eDPbNWjDL6zlFGslw&details=true&metric=true`, {mode: 'cors'})
    let obj = await forcastPromise.json();
    if (forecastArray.length != 0) forecastArray = [];
    for (let x of obj) {
        forecastArray.push(x)
    }
}

// FIND AN INDEX OF '00:00' TO SWITCH BETWEEN TODAY/TOMORROW
function todayOrTomorrow() {
    let hourArr = []
    for (let i = 0; i < 8; i++) {
        hourArr.push(forecastArray[i]['DateTime'].substr(11,5));
    }
    return hourArr.indexOf('00:00')
}

//24H FORMAT -> 12H FORMAT CONVERTER
function convertTwentyFourHourFormatToTwelve(hour) {
    let firtTwoDigits = +hour.slice(0, 2);
    let amOrPm = firtTwoDigits >= 12 ? 'pm' : 'am';
    let hours = (firtTwoDigits % 12) || 12;
    return hours + ' ' + amOrPm
}

//CREATING EIGHT FUTURE HOURS FORECAST
let eightHoursDiv = document.querySelector('div.eightHours');
function createAndFillClickableDivs(arr) {
    // current date
    let dateNow = new Date(arr[0]['DateTime']);
    let convertedDate = dateNow.toDateString();
    let convertedDateSliced = convertedDate.slice(0,3) + ', ' + convertedDate.slice(4,10);
    currentDate.textContent = convertedDateSliced;

    eightHoursDiv.textContent = '';
    // create divs
    for (let x = 0; x < 8; x++) {
        // p that displays hours
        let outerDiv = document.createElement('div');
        outerDiv.classList.add('eightHoursChildDivs');
        let icon = document.createElement('i');
        displayWeatherIcon(arr, icon, x);
        let paraTime = document.createElement('p');
        paraTime.textContent = convertTwentyFourHourFormatToTwelve(arr[x]['DateTime'].substr(11,5));
        if (x === 0) paraTime.textContent = 'Now';
        outerDiv.appendChild(paraTime);
        // outer outer div with an icon and temperature
        let insideOuterDiv = document.createElement('div');
        insideOuterDiv.classList.add('insideOuterDiv');
        insideOuterDiv.setAttribute('id', `${x}HoursFromNow`);
        let paraTemp = document.createElement('p');
        let temp = arr[x]['Temperature']['Value'];
        paraTemp.textContent = +temp % 1 === 0 ? temp + '.0' + '°': temp + '°'; 
        insideOuterDiv.appendChild(icon);
        insideOuterDiv.appendChild(paraTemp);
        outerDiv.appendChild(insideOuterDiv);
        eightHoursDiv.appendChild(outerDiv);
    }
    let displayedTime = '0HoursFromNow'
    let insideOuterDivs = document.querySelectorAll('div.insideOuterDiv');
    insideOuterDivs.forEach((div) => {
        div.addEventListener('click', () => {
            body.style.cssText = 'background: none';
            displayedTime = div.id;
            changeDetails(displayedTime, arr);
            if (div.getAttribute('class').includes('clickedDiv')) {
                div.classList.remove('clickedDiv');
                changeDetails('0', arr)
            }
            changeColorsOfAClickedDiv(insideOuterDivs, div)

    })})
}

//MANIPULATING WEATHER DETAILS
function changeDetails(timeFromNow, arr) {
    let hourFromNow = Number(timeFromNow[0]);
    let hoursFromMidnight = todayOrTomorrow();
    if (hoursFromMidnight != -1) {
        if (hourFromNow >= hoursFromMidnight) {
            h2TodayOrTomorrow.textContent = 'Tomorrow'
        } else {
            h2TodayOrTomorrow.textContent = 'Today'
        }
    }
    displayWeatherIcon(arr, currentIcon, hourFromNow);
    let temp = arr[hourFromNow]['Temperature']['Value'];
    currentTemerature.textContent = +temp % 1 === 0 ? temp + '.0' + '°': temp + '°';
    body.style.cssText = 'background: none';
    setABackgroundColor(temp);
    paraPrecipitation.textContent = arr[hourFromNow]['PrecipitationProbability'] + '%';
    paraHumidity.textContent = arr[hourFromNow]['RelativeHumidity'] + '%';
    paraWind.textContent = arr[hourFromNow]['Wind']['Speed']['Value'] + ' km/h';
    paraUV.textContent = arr[hourFromNow]['UVIndexText'];
    paraFeelsLike.textContent = arr[hourFromNow]['RealFeelTemperature']['Value'] + '°';
    paraVisibility.textContent = arr[hourFromNow]['Visibility']['Value'] + ' km';
}

function displayWeatherIcon(arr, el, index) {
    el.removeAttribute('class');
    el.classList.add('bi');
    let assingedIconNumber = arr[index]['WeatherIcon'];
    let iconClass = pickAWeatherIconClass(assingedIconNumber);
    el.classList.add(`${iconClass}`);
}

function pickAWeatherIconClass(fetchedIconNumber) {
    switch (fetchedIconNumber) {
        case 1:
        case 2:
        case 3:
            return 'bi-sun'
            break;
        case 4:
        case 5:
        case 6:
            return 'bi-cloud-sun'
            break;
        case 7:
        case 8:
            return 'bi-clouds'
            break;
        case 11: 
            return 'bi-cloud-fog'
            break;
        case 12:
        case 13:
        case 14:
        case 18:
        case 39:
        case 40:
            return 'bi-cloud-rain'
            break;
        case 15:
        case 16:
        case 17:
        case 41:
        case 42:
            return 'bi-cloud-lightning-rain'
            break;
        case 19:
        case 20:
        case 21:
        case 22:
        case 23:
        case 43:
        case 44:
            return 'bi-cloud-snow'
            break;
        case 24:
        case 25:
            return 'bi-snow'
            break;
        case 26:
        case 29:
            return 'bi-cloud-hail'
            break;
        case 32:
            return 'bi-wind'
            break;
        case 33:
        case 34:
        case 35:
            return 'bi-moon'
            break;
        case 36:
        case 37:
        case 38:
            return 'bi-cloud-moon'
            break;
        default:
            return 'error'
            break;
    }
}

function changeColorsOfAClickedDiv(els, el) {
    els.forEach(div => {
        div.classList.remove('clickedDiv')
    });    
    el.classList.add('clickedDiv');
}

//CHANGING A BACKGROUND COLOR DEPENDING ON A TEMPERATURE
function setABackgroundColor(temp) {
    body.style.cssText = 'background: none';
    if (temp < -10) body.style.cssText = 'background: linear-gradient(180deg, rgba(4,50,255,1) 0%, rgba(255,84,31,1) 100%);'
    else if (-10 <= temp && temp < -5) body.style.cssText = 'background: linear-gradient(180deg, rgba(28,155,142,1) 0%, rgba(156,44,145,1) 100%); '
    else if (-5 <= temp && temp < 0) body.style.cssText = 'background: linear-gradient(180deg, rgba(80,167,249,1) 0%, rgba(250,113,105,1) 100%); '
    else if (0 <= temp && temp < 5) body.style.cssText = 'background: linear-gradient(180deg, rgba(4,211,188,1) 0%, rgba(212,25,200,1) 100%); '
    else if (5 <= temp && temp < 10) body.style.cssText = 'background: linear-gradient(180deg, rgba(112,191,64,1) 0%, rgba(84,96,191,1) 100%);'
    else if (10 <= temp && temp < 15) body.style.cssText = 'background: linear-gradient(180deg, rgba(2,137,75,1) 0%, rgba(138,31,15,1) 100%);'
    else if (15 <= temp && temp < 20) body.style.cssText = 'background: linear-gradient(180deg, rgba(245,211,40,1) 0%, rgba(245,15,190,1) 100%);'
    else if (20 <= temp && temp < 25) body.style.cssText = 'background: linear-gradient(180deg, rgba(255,131,0,1) 0%, rgba(0,187,255,1) 100%);'
    else if (25 <= temp && temp < 30) body.style.cssText = 'background: linear-gradient(180deg, rgba(234,109,93,1) 0%, rgba(102,82,235,1) 100%);'  
    else if (30 <= temp) body.style.cssText = 'background: linear-gradient(180deg, rgba(252,46,32,1) 0%, rgba(252,220,58,1) 100%);'
}

//FETCHING SUNSET & SUNRISE HOURS FROM A DIFFERENT API
async function getSunriseAndSunset() {
    let promise = 
        await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=%203gDsGAEp75BGo46eDPbNWjDL6zlFGslw&details=true`, {mode: 'cors'});
    let obj = await promise.json();
    let sunObj = obj['DailyForecasts'][0]['Sun'];
    paraSunrise.textContent = sunObj['Rise'].substr(11,5);
    paraSunset.textContent = sunObj['Set'].substr(11,5);
}

function whenLimitHasExceeded() {
    paraSunrise.textContent = '06:47 am';
    paraSunset.textContent = '05:03 pm';
    createAndFillClickableDivs(fakeForecastArray);
    changeDetails('0', fakeForecastArray);
}


const fakeForecastArray = [
    {
        WeatherIcon: 8,
        DateTime:'2022-10-30T09:00:00-07:00',
        Temperature: {Value: 26},
        PrecipitationProbability: 60,
        RelativeHumidity: 54,
        Wind: {Speed: {Value: 5.7}},
        UVIndexText: 'Moderate',
        RealFeelTemperature: {Value: 21.3},
        Visibility: {Value: 16.1}
    },
    {
        WeatherIcon: 11,
        DateTime:'2022-10-30T10:00:00-07:00',
        Temperature: {Value: 25},
        PrecipitationProbability: 47,
        RelativeHumidity: 54,
        Wind: {Speed: {Value: 8.1}},
        UVIndexText: 'Low',
        RealFeelTemperature: {Value: 24.9},
        Visibility: {Value: 13.9}
    },
    {
        WeatherIcon: 8,
        DateTime:'2022-10-30T11:00:00-07:00',
        Temperature: {Value: 24},
        PrecipitationProbability: 63,
        RelativeHumidity: 54,
        Wind: {Speed: {Value: 6.2}},
        UVIndexText: 'Low',
        RealFeelTemperature: {Value: 25.1},
        Visibility: {Value: 17.3}
    },
    {
        WeatherIcon: 40,
        DateTime:'2022-10-30T12:00:00-07:00',
        Temperature: {Value: 23},
        PrecipitationProbability: 100,
        RelativeHumidity: 58,
        Wind: {Speed: {Value: 5.7}},
        UVIndexText: 'Low',
        RealFeelTemperature: {Value: 22.4},
        Visibility: {Value: 12.6}
    },
    {
        WeatherIcon: 40,
        DateTime:'2022-10-30T13:00:00-07:00',
        Temperature: {Value: 22},
        PrecipitationProbability: 100,
        RelativeHumidity: 61,
        Wind: {Speed: {Value: 3.9}},
        UVIndexText: 'Low',
        RealFeelTemperature: {Value: 24.7},
        Visibility: {Value: 12.5}
    },
    {
        WeatherIcon: 15,
        DateTime:'2022-10-30T14:00:00-07:00',
        Temperature: {Value: 21},
        PrecipitationProbability: 79,
        RelativeHumidity: 64,
        Wind: {Speed: {Value: 15.6}},
        UVIndexText: 'Low',
        RealFeelTemperature: {Value: 20.3},
        Visibility: {Value: 9.9}
    },
    {
        WeatherIcon: 7,
        DateTime:'2022-10-30T15:00:00-07:00',
        Temperature: {Value: 20},
        PrecipitationProbability: 32,
        RelativeHumidity: 59,
        Wind: {Speed: {Value: 14.5}},
        UVIndexText: 'Moderate',
        RealFeelTemperature: {Value: 21.3},
        Visibility: {Value: 14.0}
    },
    {
        WeatherIcon: 4,
        DateTime:'2022-10-30T16:00:00-07:00',
        Temperature: {Value: 19},
        PrecipitationProbability: 11,
        RelativeHumidity: 52,
        Wind: {Speed: {Value: 2.6}},
        UVIndexText: 'High',
        RealFeelTemperature: {Value: 20.3},
        Visibility: {Value: 19.6}
    }
];

// PROMISE CHECKER
function isPromise(p) {
    if (typeof p === 'object' && typeof p.then === 'function') {
      return true;
    }
    return false;
  }