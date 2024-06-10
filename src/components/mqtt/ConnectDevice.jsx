import React from "react";
import mqtt from "mqtt";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";

const ConnectDevice = () => {
  //Mqtt configurations
  const [client, setClient] = useState(null);
  const [payload, setPayload] = useState("");
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    if (client) {
      console.log(client);
      client.on("connect", () => {
        console.log("Succesfully connected to public broker EMQX");
        setStatus("Connected");
      });
      client.on("error", (err) => {
        console.log("Connection error: ", err);
        client.end();
        setStatus("Disconnected");
      });
      client.on("reconnect", () => {
        console.log("MQTT Client Reconnecting");
      });
      client.on("message", (topic, payload) => {
        setPayload(topic + ": " + payload);
        console.log(payload.toString());
      });
    }
  }, [client]);

  function handleConnect() {
    if (status === "Disconnected") {
      console.log("Connecting...");
      setStatus("Connecting...");
      setClient(mqtt.connect("wss://broker.emqx.io:8084/mqtt"));
    }
  }

  function handleDisconnect() {
    if (client) {
      setStatus("Disconnecting...");
      client.end(() => {
        console.log("Disconnected");
        setStatus("Disconnected");
      });
    }
  }

  function handleSubscribe() {
    if (status === "Connected" || status === "Subscribed") {
      client.subscribe("urusai1234");
      console.log("Successfully subscribed to urusai1234");
      setStatus("Subscribed");
    } else {
      setStatus("Error, please connect first");
      setTimeout(() => {
        setStatus("Disconnected");
      }, 2000);
    }
  }

  //End of Mqtt configuration

  return (
    <>
      <Button variant="contained" onClick={handleConnect}>
        Connect
      </Button>
      <Button variant="contained" color="error" onClick={handleDisconnect}>
        Disconnect
      </Button>
      <Button variant="contained" onClick={handleSubscribe}>
        Subscribe
      </Button>
      <div>Status: {status}</div>
      <div>
        Message received: <br />
        {payload.toString()}
      </div>
    </>
  );
};

export default ConnectDevice;
