const Connect = () => {
  const mqtt = require("mqtt");
  mqtt.connect("mqtt://broker.hivemq.com");
};

export default Connect;
