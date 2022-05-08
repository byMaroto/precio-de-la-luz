"use strict";

const day = new Date();
const currentDay = String(day.getDate()).padStart(2, '0');
const currentMonth = String(day.getMonth() + 1).padStart(2, '0');
const currentYear = day.getFullYear();
const currentHour = String(day.getHours()).padStart(2, '0');
const currentMinutes = String(day.getMinutes()).padStart(2, '0');
const currentSeconds = String(day.getSeconds()).padStart(2, '0');
const currentTime =
    Math.floor(new Date(currentYear + '.' + currentMonth + '.' + currentDay + ' ' + currentHour + ':' + currentMinutes + ':' + currentSeconds) / 1000);
let timeStorage = ""; // Time Unix get from LocalStorage
let result = 0;

async function loadConsuptionData() {
  const jsonData = await fetch("../JSON/consumokwh.json");
  const response = await jsonData.json();
  return response;
}

// Price calculation function. Receives the price and consumption.

function priceCalculation(price, hour) {
  let finalPrice = "";

  for (let i in hour) {
    if (currentHour == hour[i]) {
      finalPrice = price[i];
    }
  }

  // Price / Consumption

  result = finalPrice / 1000000;
  console.log(result + " €/hour");

  // change image - get item consumption - make calculation € //

  const handleDeviceChange = (event) => {
    const deviceId = event.target.value;
    document.querySelector("#deviceImg").src = `img/${deviceId}.png`;
    loadConsuptionData().then((consumptions) => {
      const deviceConsuption = consumptions.find(
        (device) => device.aparato == deviceId
      );
      document.querySelector("#resultado").innerHTML =
        deviceConsuption.consumo * result + "€";
      document.querySelector("#fecha").innerHTML = currentYear + '/' + currentMonth + '/' + currentDay;
      document.querySelector("#hora").innerHTML = currentHour + ':' + currentMinutes + ':' + currentSeconds;
      document.querySelector("#precio").innerHTML = (result * 1000000).toFixed(2) + "€";
    });
  };

  const deviceSelect = document.querySelector("#aparatos");

  deviceSelect.addEventListener("change", handleDeviceChange);
}

// Fetch function code
async function fetchApiCall() {
  try {
    const response = await fetch(
      "https://api.allorigins.win/get?url=https://api.preciodelaluz.org/v1/prices/all?zone=PCB"
    );
    const prices = [];
    const hours = [];

    if (response.ok) {
      const dataJSON = await response.json();
      const data = JSON.parse(dataJSON.contents);

      // For to get the Price and Hour and assign to the Arrays
      for (let i in data) {
        if (data[i].hasOwnProperty("price")) {
          prices[i] = data[i].price;
          hours[i] = data[i].hour.slice(0, 2);
        }
      }
      
      priceCalculation(prices, hours);
    } else {
      console.log("Error");
    }
  } catch (error) {
    console.log(error.message);
  }
}

var intervalId = window.setInterval(function(){
  // Caché logic
  if (localStorage.getItem("time") == "") {
    fetchApiCall();
  } else {
    timeStorage = localStorage.getItem("time");
    
    if (timeStorage == currentTime) {} else {
      const newTime = Math.floor(new Date(currentYear + '.' + currentMonth + '.' + currentDay + ' ' + currentHour + ':' + currentMinutes + ':' + currentSeconds) / 1000);
      
      // Call API every 5 minutes
      if (timeStorage <= newTime - 300) {
        fetchApiCall();
        // LocalStorage code. Save result and currentTime.
        localStorage.setItem("price", result);
        localStorage.setItem("time", currentTime);
      } else {
        fetchApiCall();
      }
    }
  }
}, 1000);