const textInput = document.getElementById('textInput');
const submitInput = document.getElementById('submitInput');
const btn = document.querySelector('button');
const h2TodayOrTomorrow = document.getElementById('todayOrTomorrow');
const currentTemerature = document.getElementById('currentTemperature')
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
                changeDetails('0');
                getSunriseAndSunset();
            })
            .catch(() => {
                console.error('Array methods did not work')
            })
        })
        .catch((err) => {
            console.error(err + 'getForcast() did not exectute properly')
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
            await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=3gDsGAEp75BGo46eDPbNWjDL6zlFGslw&q=${input}`);
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
        await fetch(`http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=%203gDsGAEp75BGo46eDPbNWjDL6zlFGslw&details=true&metric=true`)
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
        insideOuterDiv.appendChild(paraTemp);
        outerDiv.appendChild(insideOuterDiv);
        eightHoursDiv.appendChild(outerDiv);
    }
    let displayedTime = '0HoursFromNow'
    let insideOuterDivs = document.querySelectorAll('div.insideOuterDiv');
    insideOuterDivs.forEach((div) => {
        div.addEventListener('click', () => {
            displayedTime = div.id;
            changeDetails(displayedTime);
    })})
}

//MANIPULATING WEATHER DETAILS
function changeDetails(timeFromNow) {
    let hourFromNow = Number(timeFromNow[0]);
    let hoursFromMidnight = todayOrTomorrow();
    if (hoursFromMidnight != -1) {
        if (hourFromNow >= hoursFromMidnight) {
            h2TodayOrTomorrow.textContent = 'Tomorrow'
        } else {
            h2TodayOrTomorrow.textContent = 'Today'
        }
    }
    currentTemerature.textContent = forecastArray[hourFromNow]['Temperature']['Value'] + '°';
    paraPrecipitation.textContent = forecastArray[hourFromNow]['PrecipitationProbability'] + '%';
    paraHumidity.textContent = forecastArray[hourFromNow]['RelativeHumidity'] + '%';
    paraWind.textContent = forecastArray[hourFromNow]['Wind']['Speed']['Value'] + ' km/h';
    paraUV.textContent = forecastArray[hourFromNow]['UVIndexText'];
    paraFeelsLike.textContent = forecastArray[hourFromNow]['RealFeelTemperature']['Value'] + '°';
    paraVisibility.textContent = forecastArray[hourFromNow]['Visibility']['Value'] + ' km';
}

//FETCHING SUNSET & SUNRISE HOURS FROM A DIFFERENT API
async function getSunriseAndSunset() {
    let promise = 
        await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=%203gDsGAEp75BGo46eDPbNWjDL6zlFGslw&details=true`);
    let obj = await promise.json();
    let sunObj = obj['DailyForecasts'][0]['Sun'];
    paraSunrise.textContent = sunObj['Rise'].substr(11,5);
    paraSunset.textContent = sunObj['Set'].substr(11,5);
}

// PROMISE CHECKER
function isPromise(p) {
    if (typeof p === 'object' && typeof p.then === 'function') {
      return true;
    }
    return false;
  }