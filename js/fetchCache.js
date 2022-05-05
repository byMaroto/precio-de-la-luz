"use strict";

// Price calculation function. Receives the price and consumption.
function priceCalculation(price, consumption) {
    // Variables
    const day = new Date();
    const currentTime = day.getHours() + ':' + day.getMinutes() + ':' + day.getSeconds();

    // Price / Consumption
    const result = price/consumption;
    console.log(result + ' €/hour');
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
            console.log(data);

            // For to get the Price and Hour and assign to the Arrays
            for (let i in data) {
                if (data[i].hasOwnProperty('price')) {
                    prices[i] = data[i].price;
                    hours[i] = data[i].hour;
                }
            }
            console.log(prices);
            console.log(hours);
              

            // LocalStorage code
            //localStorage.setItem("data", JSON.stringify(data));
            //console.log(localStorage.getItem("data"));

            //priceCalculation('500', '1000');
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