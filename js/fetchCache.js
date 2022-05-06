"use strict";

// Price calculation function. Receives the price and consumption.
function priceCalculation(price, hour) {
    // Variables
    const day = new Date();
    const currentHour = day.getHours();
    const currentTime = day.getHours() + ":" + day.getMinutes() + ":" + day.getSeconds();
    let finalPrice = "";

    for (let i in hour) {
        if (currentHour == hour[i]) {
            finalPrice = price[i];
        }
    }

    // Price / Consumption
    const result = finalPrice/500;
    console.log(result + ' €/hour');

    // LocalStorage code
    
}

// Fetch function code
async function fetchApiCall() {
    try {
        const response = await fetch('https://api.allorigins.win/get?url=https://api.preciodelaluz.org/v1/prices/all?zone=PCB');
        const prices = [];
        const hours = [];

        if(response.ok){
            const dataJSON = await response.json();
            const data = JSON.parse(dataJSON.contents);

            // For to get the Price and Hour and assign to the Arrays
            for (let i in data) {
                if (data[i].hasOwnProperty('price')) {
                    prices[i] = data[i].price;
                    hours[i] = data[i].hour.slice(0,2);
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