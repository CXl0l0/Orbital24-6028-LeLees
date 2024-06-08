const { wait } = require("@testing-library/user-event/dist/utils");
const mqtt = require("mqtt");
var client = mqtt.connect("ws://broker.emqx.io:8083/mqtt");

client.on("connect", function () {
  setInterval(() => {
    var random = Math.random() * 50;
    console.log(random);
    client.publish("urusai1234", random.toString());
  }, 1000);
});
