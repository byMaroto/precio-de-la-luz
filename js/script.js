"use strict";

async function loadConsuptionData() {
  const jsonData = await fetch("../JSON/consumokwh.json");
  const response = await jsonData.json();
  return response;
}

// Price calculation function. Receives the price and consumption.
function priceCalculation(price, hour) {
  // Variables
  const day = new Date();
  const currentHour = day.getHours();
  const currentTime =
    day.getHours() + ":" + day.getMinutes() + ":" + day.getSeconds();
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
      document.getElementById("resultado").innerHTML =
        deviceConsuption.consumo * result;
    });
  };

  const deviceSelect = document.querySelector("#aparatos");

  deviceSelect.addEventListener("change", handleDeviceChange);

  // LocalStorage code
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

// Call API every 5 minutes
//window.setInterval(function () {
fetchApiCall();
//}, 300000);
