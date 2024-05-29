#include <Arduino.h>

// To include the WiFiMulti library
// Similar to Python's import
#include <WiFiMulti.h>  

#define RED 5
#define BLUE 14
#define SSID "me"
#define PW "tofu11122004"

// To create an instance of the WiFiMulti library using the name "wifi"
// Equivalent to how we usually define a variable of the data type (Exp: int RED;).
// Similar to how we create an instance for a class in python (Exp: wifi = WiFiMulti())
// Here, "WiFiMulti" is the data type / class / library, "wifi" is the instance / variable name.
WiFiMulti wifi;   

void setup(){
  Serial.begin(115200);     
  pinMode(RED, OUTPUT);
  pinMode(BLUE, OUTPUT);
  wifi.addAP(SSID, PW);     // Calling a method from the WifiMulti library
                            // Simlar to calling a method in Python
  while (wifi.run() != WL_CONNECTED) {       // If Wi-Fi is not connected, the code will be stuck in this infinite loop and run wifi.run repeatedly to try to connect to the specified network.                        
    digitalWrite(BLUE, 1);                   // This while loop is known as a "block", since it blocks the code if Wi-Fi is not connected.
    digitalWrite(RED, 0);                    // The LED shines blue if Wi-Fi is not connected.
  }
  Serial.println("Connected");  // If Wi-Fi is connected, the code will pass the while loop and print this line.
}

void loop(){
  digitalWrite(RED, WiFi.status() == WL_CONNECTED); // The WiFiMulti library is built on top of the WiFi library, so you can access everything in WiFi.h using WiFiMulti.h.
  digitalWrite(BLUE, WiFi.status() != WL_CONNECTED); 
  // Returns of the WiFi.status method:
  // WL_IDLE_STATUS (0): The WiFi is idle, meaning it is currently trying to connect or is in an idle state.
  // WL_NO_SSID_AVAIL (1): No SSID (Service Set Identifier) is available, which means the configured SSID cannot be found.
  // WL_SCAN_COMPLETED (2): A scan for available networks has been completed.
  // WL_CONNECTED (3): The device is connected to a WiFi network.
  // WL_CONNECT_FAILED (4): The connection attempt failed, typically due to incorrect credentials or other connection issues.
  // WL_CONNECTION_LOST (5): The connection was lost after being established.
  // WL_DISCONNECTED (6): The device is not connected to any network.

  // You can use HIGH/LOW or 1/0 for the second argument of digitalWrite.

  // Why not just hardcode the digitalWrite functions to switch off blue and switch on red, since the loop block will only run if Wi-Fi is connected?
  // Well, the short answer is Wi-Fi can be disconnected after being connected.
  // So in each loop, if WL_CONNECTED, then the RED LED turns on and vice versa.

  // One thing to note is, if Wi-Fi is disconnected, WiFi.status will run WiFi.begin(SSID, PW) first to attempt reconnecting to the Wi-Fi before returning anything.
  // During the attempt, the status is 0 (see above). If Wi-Fi is successfully restored, it will return 3. If it fails to reconnect to Wi-Fi after the number of attempts expires, then only will it return 4.
  // This means that even though there is no WiFi.begin(SSID, PW) or WiFiMulti.run() in the loop block, the ESP32 will still be able to reconnect to Wi-Fi after being disconnected.

  // WiFi.begin(ssid, password)  is a function provided by the WiFi library for ESP8266 and ESP32 that is typically used to initiate a connection to a specific SSID with a given password (one network only).
  // WiFiMulti.run() is a function provided by the WiFiMulti class which allows you to manage multiple WiFi networks, automatically connecting to the best available network from a list of pre-configured networks. (can choose one network from many)
} 