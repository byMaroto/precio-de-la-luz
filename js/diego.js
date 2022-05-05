"use strict";

const select = document.getElementById("aparatos");

let value = select.addEventListener("change", function handleChange(event) {
  document.getElementById("deviceImg").src = `img/${event.target.value}.png`;
});

const jsonData = fetch("../JSON/consumokwh.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => console.log(data));

console.log(data);

// como accedo a los datos de aca arriba desde afuera?? //

// funcion find en array //

const prueba = [
  { nombre: "aire acondicionado", consumo: 2500 },
  { nombre: "ordenador", consumo: 1200 },
  { nombre: "batidora", consumo: 500 },
];

function buscar(aparato) {
  return aparato.nombre === "ordenador";
}

console.log(prueba.find(buscar));

// hacer una variable que sea solo el consumo //

// hacer el calculo matematico de € por hora con la info del API//

// €mw/1000= kw  -> kw * aparatoW -> //
