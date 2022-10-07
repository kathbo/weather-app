const he1 = document.querySelector('h1') // ????????
const textInput = document.getElementById('textInput');
const submitInput = document.getElementById('submitInput');
const btn = document.querySelector('button');

let userInput;

btn.addEventListener('click', () => {
    userInput = getUserInput();
    //console.log(userInput)
    he1.textContent = userInput;
    console.log(getLocationKey(userInput))
})


let getUserInput = () => {
    return transformUserInput(textInput.value);
}

function transformUserInput(input) {
    if (typeof input === 'string') {
        return input.replace(/[0-9\s\W]/ig, '')
    } else {
        return 'user input is not a string. fix up your shit hoe'
    }
}

//GET A LOCATION KEY
let locationKey;
async function getLocationKey(input) {
    try {
        let promise = 
            await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=3gDsGAEp75BGo46eDPbNWjDL6zlFGslw&q=${input}`);
        let obj = await promise.json();
        he1.textContent = obj[0]['Key']; /// ???
        locationKey = obj[0]['Key'];
        console.log(locationKey);

    } catch (err) {
        console.log('something went wrong with location key')
    }    
}






// PROMISE CHECKER
function isPromise(p) {
    if (typeof p === 'object' && typeof p.then === 'function') {
      return true;
    }
    return false;
  }



// let wether;
// fetch('http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/178087?apikey=%203gDsGAEp75BGo46eDPbNWjDL6zlFGslw&details=true&metric=true', {mode: 'cors'})
//     .then((w) => {
//         return w.json();
//     }).then((e) => {
//         wether = e;
//         console.log(wether)
//     })
//     .catch((err) => {console.log(err)});
