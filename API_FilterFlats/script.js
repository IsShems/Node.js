let list = document.querySelector("#list");
let buttons = document.querySelectorAll("#filter button");
let value = "Baku";

buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    value = event.target.textContent;
    getFilteredList();
  });
});

const getFilteredList = async () => {
  console.log(value);

  let response = await fetch(`http://localhost:5000/apartments?city=${value}`);
  let data = await response.json();
  list.innerHTML = "";
  data.forEach((element) => {
    let li = document.createElement("li");
    li.innerHTML = `<p>Name: ${element.name}</p><p>Price: ${element.price}</p><p>Rooms: ${element.rooms}</p><p>City: ${element.city}</p><p>Address: ${element.address}</p>`;
    list.appendChild(li);
  });
};

// Initial load
getFilteredList();
