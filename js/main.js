"use strict";

const day = new Date();
const currentDay = String(day.getDate()).padStart(2, "0");
const currentMonth = String(day.getMonth() + 1).padStart(2, "0");
const currentYear = day.getFullYear();
const currentHour = String(day.getHours()).padStart(2, "0");
const currentMinutes = String(day.getMinutes()).padStart(2, "0");
const currentSeconds = String(day.getSeconds()).padStart(2, "0");

const time = localStorage.getItem("time");

let result = 0;
let maxHour = 0;
let maxPrice = 0;
let minHour = 0;
let minPrice = 1000; // 1000 because is just a big number to not have problems with the condition

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

    // change image - get item consumption - make calculation € //

    const handleDeviceChange = (event) => {
        const deviceId = event.target.value;
        document.querySelector("#deviceImg").src = `img/${deviceId}.png`;
        loadConsuptionData().then((consumptions) => {
        const deviceConsuption = consumptions.find(
            (device) => device.aparato == deviceId
        );

        let consumeMath = (deviceConsuption.consumo * result).toFixed(3);

        document.querySelector("#resultado").innerHTML = consumeMath + "€";
        document.querySelector("#fecha").innerHTML =
            currentYear + "/" + currentMonth + "/" + currentDay;
        document.querySelector("#hora").innerHTML =
            currentHour + ":" + currentMinutes + ":" + currentSeconds;
        document.querySelector("#precio").innerHTML = result * 1000000 + "€";
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
  
            if (prices[i] > maxPrice) {
              maxHour = data[i].hour;
              maxPrice = data[i].price;
              document.querySelector("#maxprice").innerHTML = maxHour + "hs";
            }
  
            if (prices[i] < minPrice) {
              minHour = data[i].hour;
              minPrice = data[i].price;
              document.querySelector("#minprice").innerHTML = minHour + "hs";
            }
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

if (!time) {
    fetchApiCall();

    // LocalStorage code. Save data.
    localStorage.setItem("price", result);
    localStorage.setItem("time", Date.now());
} else {
    if (Date.now() - time >= 300000) {
        fetchApiCall();

        // LocalStorage code. Save data.
        localStorage.setItem("price", result);
        localStorage.setItem("time", Date.now());
    }
    else {
        // Call function without saving data in LocalStorage
        fetchApiCall();
    }
}