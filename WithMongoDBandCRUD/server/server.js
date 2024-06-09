const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

mongoose.connect('mongodb://localhost:27017/market')
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(cors());

const productRoutes = require('./routes/productRoutes');

app.use('/products', productRoutes);

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});
