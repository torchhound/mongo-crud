const express = require('express')
const bodyParser = require('body-parser')

const routes = require('./routes/routes.js')
const port = process.env.PORT || 80
const app = express()
const http = require('http').Server(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', routes)
app.use(function(req, res) {
    res.status(404)
});

http.listen(port, function() {
  console.log("Listening on port " + port)
});

module.exports = app