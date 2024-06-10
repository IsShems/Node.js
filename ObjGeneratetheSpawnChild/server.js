const express = require('express')
const cors = require('cors')
const { spawn } = require('child_process')
const bodyParser = require('body-parser');

const port = 3000
const app = express()

let arr = []

app.use(cors())
app.use(bodyParser.json())

const command = 'node'
const args = ['adding.js']
const childProcess = spawn(command, args)

childProcess.stdout.on('data', (data) => {
    console.log('stdout: ', `${data}`);
})

app.post('/addItem', (req, res) => {
    let item = req.body.item
    if (item) {
        arr.push(item)
    }
    console.log(arr);

})


app.listen(port, () => {
    console.log(`Server started on ${port}`);
});

