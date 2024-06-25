const mqtt = require("mqtt");
//var client = mqtt.connect("wss://broker.emqx.io:8084/mqtt");
var client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

client.on("connect", function () {
  client.subscribe("urusai1234");
  console.log("Client has subscribed successfully");
});

client.on("message", function (topic, payload) {
  console.log(payload.toString());
});
