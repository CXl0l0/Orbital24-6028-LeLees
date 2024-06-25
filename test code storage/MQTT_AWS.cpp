#include <Arduino.h>
#include <WiFiClientSecure.h>    // An extension of the 'WiFiClient" library which supports SSL/TLS connections.
#include <WiFiMulti.h> 
#include <ArduinoJson.h>    // A popular library for working with JSON on Arduino: https://arduinojson.org/v7/api/
#include <PubSubClient.h>     // Essential library for MQTT communication on Arduino platforms: https://pubsubclient.knolleary.net/api
#include <credentials_test.h>

WiFiMulti wifi;
WiFiClientSecure net;
PubSubClient client(net);    // 'net' is passed into the constructor of the 'PubSubClient' class while creating the partially (The constructor has many more parameters) initialised instance 'client'. (The client is this ESP32 microcontroller btw)
// This means that all MQTT communication by 'client' is done over a secure SSL/TLS connection through 'net'.

#define AO 36
#define publish_topic "esp32/publish"
#define subscribe_topic "esp32/subscribe"
int sound;

void connectWiFi() {
    wifi.addAP(wifi_ssid, wifi_pw);
    Serial.println("");    // So that the serial print below starts in a new line and not with the boot message.
    Serial.println("Wi-Fi not connected, trying to connect...");
    while (wifi.run() != WL_CONNECTED) {    // If Wi-Fi is not connected, the code will be stuck in this infinite loop and run wifi.run repeatedly to try to connect to the specified network.
        Serial.println("... ");
    }
    Serial.println("Connected to Wi-Fi");
}

void subscribeMessage(const char* topic, byte* payload, unsigned int length){    // The callback function that is passed into 'setCallback' must have the signature: void callback(const char[] topic, byte* payload, unsigned int length)
    JsonDocument docS;
    deserializeJson(docS, payload);    // This function parses the JSON input 'payload' and stores the result in the JSON document 'docS'.

    Serial.print("Subscription message from ");
    Serial.println(topic);
    
    const char* message = docS["message"];
    Serial.println(message);
}

void connectAWS() {
    // Configure the WiFiClientSecure instance 'net' to use the AWS IoT Core 'ESP32' Thing's credentials, since the 'ESP32' Thing is a digital representation of the actual hardware on AWS, so the 'ESP32' Thing's credentials belong to the actual ESP32 microcontroller.
    net.setCACert(aws_root_ca1);
    net.setCertificate(aws_device_cert);
    net.setPrivateKey(aws_priv_key);
 
    // Connect to the MQTT broker (the server) on the AWS IoT Core endpoint
    client.setServer(aws_endpoint, 8883);    // The standard MQTT port for secure communication with TLS is 8883 (1883 is the default and has no encryption - non-secure)

    client.setCallback(subscribeMessage);    // 'subscribeMessage' will be called when a message arrives for a subscription to a MQTT topic on AWS IoT.

    Serial.println("Connecting to AWS IOT Core...");
    while (!client.connect(aws_thing)) {    // Connects the client to the server using the ID 'ESP32', which matches the corresponding Thing name on AWS IoT Core. Returns Boolean (true: connection succeeded, false: connection failed)
        Serial.println("...");     // The loop will keep running and the client will keep trying to connect to the server until connection succeeds.
        delay(500);
    }
    Serial.println("AWS IoT Core Connected!");

    delay(500);

    Serial.print("Subscribing to ");
    Serial.print(subscribe_topic);
    Serial.println(" ...");
    while (!client.subscribe(subscribe_topic)) {   // Subscribe to messages to the specified topic.
        Serial.println("...");                       // The function returns true: subscription succeeded, false: subscription failed / connection lost / message is too large
        delay(500);
    }
    Serial.print("Subscribed to ");
    Serial.println(subscribe_topic);
    
}

void publishMessage() {
    JsonDocument docP;    // Creates an empty (null) JSON document called 'docP' and store it in the heap. (The estimated maximum number of bytes of each line of {"Sound value":sound} is 24)
    // In Version 6 of the ArduinoJson library, you can specify whether you want StaticJsonDocument or DynamicJsonDocument. 
        // StaticJsonDocument: A static JSON document is used to store the JSON document in a stack rather than in a heap ('DynamicJsonDocument'). You must specify the size of the static JSON document which will be allocated at compile time (when the program is turned into machine code). It is faster, more reliable, more predictable and suitable for documents with a known small size (< 1 KB).
        // DynamicJsonDocument: A dynamic JSON document is used to store the JSON document in a heap rather than in a stack ('StaticJsonDocument'). The memory is allocated flexibly during runtime (when the program is actually running). It is more flexible and convenient when the size of the JSON data is large or can vary significantly, though it is usually slower and riskier of memory errors.
            // The dynamic memory allocation is done through two functions during runtime: 'malloc' and 'free'.
                // malloc (memory allocation)
                    // There is a special part in memory called a heap. The heap is a pool of memory that programs can request at runtime.
                    // malloc, taking in one argument which is size in bytes, takes a chunk of memory of that size from the heap.
                    // If malloc is succesful in finding the free chunk of memory in the heap, it returns a pointer to the beginning of the memory chunk, which allows access to the data in the memory chunk.
                    // So in this case, malloc basically finds for you a chunk of memory in the heap that is big enough for the dynamic JSON document.
                // free
                    // free basically deallocates the memory allocated by malloc (or other memory allocation functions) and makes it available for future allocations.
                    // It takes one argument, which is a pointer to the memory block you want to deallocate. The pointer must have been previously returned by a successful memory allocation function like malloc.
                    // free prevents memory leaks which occur when you allocate memory but don't release it, causing your program to consume more and more memory over time.
    // In Version 7 (latest version as of 28/5/2024), StaticJsonDocument no longer exists and DynamicJsonDocument is renamed to JsonDocument (the one used here).
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
    
    // Serial.print("State: ");
    // Serial.println(client.state());
    // Serial.print("Connected: ");
    // Serial.println(client.connected());
    // https://pubsubclient.knolleary.net/api#connected

    if (!client.loop()){    // 'loop' allows the client (ESP32) to process incoming messages and maintain its connection to the server (AWS IoT Core).
        connectAWS();       // Returns true: the client is connected; or false: the client is not connected)
    }                       // If the client is not connected, attempts to connect again.

    sound = analogRead(AO);
    Serial.print("Sound value: ");
    Serial.println(sound);
    publishMessage();
    delay(100);
}