const express = require('express');
const app = express();
const port = process.env.PORT || 5000;


app.get('/', async(req, res) => {
    res.send("Library server is running")
})


app.listen(port, () => {
    console.log(`Server listen on port ${port}`)
})