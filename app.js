const express = require('express')
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
require("dotenv").config()
const port = process.env.PORT
const mongoose = require('mongoose');
var mqtt = require('mqtt')
mongoose.connect(process.env.MONGODB_CON, { useUnifiedTopology: true });

const SensorData = mongoose.model('SensorData', {
  dataAsString: String,
  registerDate: Date
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

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

client.on('message', async function (topic, message) {
  // message is Buffer
  console.log(topic.toString())
  console.log(message.toString())
  const sensorData = new SensorData({
    dataAsString: message,
    registerDate: Date.now()
  });
  const data = await sensorData.save();
  console.log('Saved', data);
  io.emit('sio_sensordata', sensorData);
  //Socket.io to emit message
  // client.end()
})

client.subscribe('#');


app.get('/', (req, res) => {
  client.publish("lars.nice", "{snail:ost, frog:øf}")
  res.send('Hello World!')
})

app.get('$', (req, res) => {
  res.send('MacNAMAM')
})

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
