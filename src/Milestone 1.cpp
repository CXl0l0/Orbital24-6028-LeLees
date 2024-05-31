#include <Arduino.h>
#include <WiFiClientSecure.h>    // An extension of the 'WiFiClient" library which supports SSL/TLS connections.
#include <WiFiMulti.h> 
#include <ArduinoJson.h>    // A popular library for working with JSON on Arduino.
#include <PubSubClient.h>     // Essential library for MQTT communication on Arduino platforms.
#include <credentials.h>

WiFiMulti wifi;
WiFiClientSecure net;
PubSubClient client(net);
// This means that all MQTT communication by 'client' is done over a secure TLS connection through 'net'.

#define AO 36
#define publish_topic "esp32/publish"
#define subscribe_topic "esp32/subscribe"
int sound;

void connectWiFi() {
    wifi.addAP(wifi_ssid, wifi_pw);
    Serial.println("");    // So that the serial print below starts in a new line and not with the boot message.
    Serial.println("Wi-Fi not connected, trying to connect...");
    while (wifi.run() != WL_CONNECTED) {    // If Wi-Fi is not connected, the code run wifi.run repeatedly to try to connect to the specified network.
        Serial.println("... ");
    }
    Serial.println("Connected to Wi-Fi");
}

void subscribeMessage(const char* topic, byte* payload, unsigned int length){    // The callback function that is passed into 'setCallback' function below must have the signature: void callback(const char[] topic, byte* payload, unsigned int length)
    JsonDocument docS;
    deserializeJson(docS, payload);    // This function parses the JSON input 'payload' and stores the result in the JSON document 'docS'.

    Serial.print("Subscription message from ");
    Serial.println(topic);
    
    const char* message = docS["message"];
    Serial.println(message);
}

void connectAWS() {
    // Configure the WiFiClientSecure instance 'net' to use the AWS IoT Core 'ESP32' Thing's (which is a representation of the actual ESP32 hardware) credentials.
    net.setCACert(aws_root_ca1);
    net.setCertificate(aws_device_cert);
    net.setPrivateKey(aws_priv_key);
 
    // Connect to the MQTT broker (the server) on the AWS IoT Core endpoint
    client.setServer(aws_endpoint, 8883);    // The standard MQTT port for secure communication with TLS is 8883 (1883 is the default and has no encryption - non-secure)

    client.setCallback(subscribeMessage);    // 'subscribeMessage' will be called when a message arrives for a subscription to a MQTT topic on AWS IoT.

    Serial.println("Connecting to AWS IOT Core...");
    while (!client.connect(aws_thing)) {    // Connects the client (the ESP32 microcontroller) to the server using the ID 'ESP32', which matches the corresponding Thing name on AWS IoT Core. Returns Boolean (true: connection succeeded, false: connection failed)
        Serial.println("...");     // The client will keep trying to connect to the server until connection succeeds.
        delay(500);
    }
    Serial.println("AWS IoT Core Connected!");

    delay(500);

    Serial.print("Subscribing to ");
    Serial.print(subscribe_topic);
    Serial.println(" ...");
    while (!client.subscribe(subscribe_topic)) {    // The function returns true: subscription succeeded, false: subscription failed / connection lost / message is too large
        Serial.println("...");                      
        delay(500);
    }
    Serial.print("Subscribed to ");
    Serial.println(subscribe_topic);
    
}

void publishMessage() {
    JsonDocument docP;    // Creates an empty (null) JSON document called 'docP' and store it in the heap. (The estimated maximum number of bytes of each line of {"Sound value":sound} is 24).
    docP["Sound value"] = sound;    // 'docP' now contains {"Sound value":sound}
    char JSONbuffer[50];
    int n = serializeJson(docP, JSONbuffer);   // To serialise (convert) a JSON object or array ('docP') into a JSON-encoded string (no spaces, line break, etc.), which can be more easily transmitted or stored, and stores (writes) it to a specified output ('char' buffer, 'String' object, a stream, etc.), in this case, it's the 'char' buffer 'JSONbuffer'.
    // The function returns the number of bytes written.
    client.publish(publish_topic, JSONbuffer);
    // Serial.print("n = ");
    // Serial.println(n);    // From here, we can know that the number of bytes written into JSONbuffer, i.e., the size of the JSON-encoded string is 18 bytes. This allows us to allocate a better size to the JSONbuffer 'char' array. (50 is safe)
}

void setup() {
    Serial.begin(115200);
    connectWiFi();
    delay(500);
    connectAWS();
}

void loop() {
    if (WiFi.status() != WL_CONNECTED) {
        connectWiFi();
    }

    if (!client.loop()){    // 'loop' allows the client (ESP32) to process incoming messages and maintain its connection to the server (AWS IoT Core).
        connectAWS();       // Returns true: the client is connected; or false: the client is not connected)
    }                       // If the client is not connected, attempts to connect again.

    sound = analogRead(AO);
    Serial.print("Sound value: ");
    Serial.println(sound);
    publishMessage();
    delay(1000);
}