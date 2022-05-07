"use strict";

const day = new Date();
const currentHour = day.getHours();
const currentTime =
    day.getHours() + ":" + day.getMinutes() + ":" + day.getSeconds();
let timeStorage = "";

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

  const result = finalPrice / 500;
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
      document.querySelector("#fecha").innerHTML = day;
      document.querySelector("#hora").innerHTML = currentTime;
      document.querySelector("#precio").innerHTML = result.toFixed(2) + "€";
    });
  };

  const deviceSelect = document.querySelector("#aparatos");

  deviceSelect.addEventListener("change", handleDeviceChange);

  // LocalStorage code. Save result and currentTime.
  localStorage.setItem("price", result);
  localStorage.setItem("time", currentTime);
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








// Caché logic
if (localStorage.getItem("time") == "") {
  fetchApiCall();
} else {
  timeStorage = localStorage.getItem("time");
  
  // Call API every 5 minutes
  if (timeStorage == currentTime) {
    console.log("YES");
  } else {
    console.log(Math.floor(new Date('2012.08.10').getTime() / 1000));
    console.log("------------");
    console.log(timeStorage);
    console.log(currentTime);
  }
}