const express = require('express')
const app = express()
const port = process.env.PORT || 3000
var mqtt = require('mqtt')

let client  = mqtt.connect(
  'mqtt://' + process.env.MQTT_ADDRESS,
  {
    port: +process.env.MQTT_PORT,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
  })

client.on('connect', function () {
  console.log('Connected!! Lars is the King of the planet');
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  // client.end()
})

client.subscribe('#');


app.get('/', (req, res) => {
  client.publish("lars.nice", "{snail:ost, frog:øf}")
  res.send('Hello World!')
})

app.get('/snurif', (req, res) => {
  res.send('MacNAMAM')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
