#include <Arduino.h>
#include <WiFiClientSecure.h>    // An extension of the 'WiFiClient" library which supports SSL/TLS connections.
#include <WiFiMulti.h> 
#include <ArduinoJson.h>    // A popular library for working with JSON on Arduino.
#include <PubSubClient.h>     // Essential library for MQTT communication on Arduino platforms.
#include <credentials_test.h>

WiFiMulti wifi;
WiFiClientSecure net;
PubSubClient client(net);    // 'net' is passed into the constructor of the 'PubSubClient' class while creating the partially (The constructor has many more parameters) initialised instance 'client'. (The client is this ESP32 microcontroller btw)
// This means that all MQTT communication by 'client' is done over a secure SSL/TLS connection through 'net'.

#define AO 36
#define publish_topic "esp32/publish"
int sound;

void connectWiFi() {
    wifi.addAP(wifi_ssid, wifi_pw);
    Serial.println("");    // So that the serial print below starts in a new line and not with the boot message.
    Serial.println("Wi-Fi not connected, trying to connect...");
    while (wifi.run() != WL_CONNECTED) {    // If Wi-Fi is not connected, the code will be stuck in this infinite loop and run wifi.run repeatedly to try to connect to the specified network.
        Serial.print("... ");
    }
    Serial.println("Connected to Wi-Fi");
}

void connectAWS() {
    // Configure the WiFiClientSecure instance 'net' to use the AWS IoT Core 'ESP32' Thing's credentials, since the 'ESP32' Thing is a digital representation of the actual hardware on AWS, so the 'ESP32' Thing's credentials belong to the actual ESP32 microcontroller.
    net.setCACert(aws_root_ca1);
    net.setCertificate(aws_device_cert);
    net.setPrivateKey(aws_priv_key);
 
    // Connect to the MQTT broker (the server) on the AWS IoT Core endpoint
    client.setServer(aws_endpoint, 8883);    // The standard MQTT port for secure communication with TLS is 8883 (1883 is the default and has no encryption - non-secure)
 
    Serial.println("Connecting to AWS IOT Core");
 
    while (!client.connect(aws_thing)) {    // Connects the client to the server using the ID 'ESP32', which matches the corresponding Thing name on AWS IoT Core. Returns Boolean (true: connection succeeded, false: connection failed)
        Serial.print("... ");     // The loop will keep running and the client will keep trying to connect to the server until connection succeeds.
        delay(500);
    }
 
    Serial.println("AWS IoT Core Connected!");
}

void publishMessage() {
    JsonDocument doc;    // Creates an empty (null) JSON document called 'doc' and store it in the allocated memory pool. (The estimated maximum number of bytes of each line of {"Sound value":sound} is 24)
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
    doc["Sound value"] = sound;    // 'doc' now contains {"Sound value":sound}
    char JSONbuffer[50];
    int n = serializeJson(doc, JSONbuffer);   // To serialise (convert) a JSON object or array ('doc') into a JSON-encoded string (no spaces, line break, etc.), which can be more easily transmitted or stored, and stores (writes) it to a specified output ('char' buffer, 'String' object, a stream, etc.), in this case, it's the 'char' buffer 'JSONbuffer'.
    // The function returns the number of bytes written.
    client.publish(publish_topic, JSONbuffer);
    // Serial.print("n = ");
    // Serial.println(n);    // From here, we can know that the number of bytes written into JSONbuffer, i.e., the size of the JSON-encoded string is 18 bytes. This allows us to allocate a better size to the JSONbuffer 'char' array. (50 is safe)
}

void setup() {
    Serial.begin(115200);
    connectWiFi();
    connectAWS();
}

void loop() {
    if (WiFi.status() != WL_CONNECTED) {
        connectWiFi();
    }
    if (!client.connected()){    // Checks whether the client is connected to the server (true: the client is connected, false: the client is not connected)
        connectAWS();
    }
    sound = analogRead(AO);
    Serial.println(sound);
    publishMessage();
    delay(1000);
}