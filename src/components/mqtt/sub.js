const mqtt = require("mqtt");
var client = mqtt.connect("ws://broker.emqx.io:8083/mqtt");

client.on("connect", function () {
  client.subscribe("urusai");
  console.log("Client has subscribed successfully");
});

client.on("message", function (topic, payload) {
  console.log(payload.toString());
});
