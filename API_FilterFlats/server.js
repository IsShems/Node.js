const express = require("express");
const cors = require("cors");
const app = express();

const PORT = 5000;

app.use(cors());

let apartments = [
  {
    id: 1,
    city: "Baku",
    address: "Street 1, Baku",
    price: 500,
    name: "Apartment 1",
    rooms: 3,
  },
  {
    id: 2,
    city: "Baku",
    address: "Street 2, Baku",
    price: 700,
    name: "Apartment 2",
    rooms: 4,
  },
  {
    id: 3,
    city: "Sumqayit",
    address: "Street 3, Sumqayit",
    price: 300,
    name: "Apartment 3",
    rooms: 2,
  },
  {
    id: 4,
    city: "Sumqayit",
    address: "Street 4, Sumqayit",
    price: 450,
    name: "Apartment 4",
    rooms: 3,
  },
  {
    id: 5,
    city: "Ganja",
    address: "Street 5, Ganja",
    price: 400,
    name: "Apartment 5",
    rooms: 2,
  },
  {
    id: 6,
    city: "Ganja",
    address: "Street 6, Ganja",
    price: 600,
    name: "Apartment 6",
    rooms: 4,
  },
];

app.get("/apartments", (req, res) => {
  const query = req.query.city;
  if (query) {
    const filteredApartments = apartments.filter(
      (apartment) => apartment.city.toLowerCase() === query.toLowerCase()
    );
    res.json(filteredApartments);
  } else {
    res.json(apartments);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
