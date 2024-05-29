#include <Arduino.h>
#include <string>
// #include <iostream>  // For basic I/O (Input/Output) operations.

#define AO 36

void setup() {
    Serial.begin(115200);
}

void loop() {
    int sound;
    sound = analogRead(AO);    // It's 12-bit here, so it can read a value from 0 to 4095
    std::string dash = "|";
    for (int i = 1; i < sound; i++){  // Start from i = 1 because the initial dash has one dash "-" already
        dash += "|";
    }
    Serial.print(dash.c_str());   // Use c_str() to convert std::string to C-string
    Serial.println(sound);
    delay(10);
}

// When working with Arduino, you typically use the 'Serial' library for communication rather than standard C++ libraries like '<iostream>', which are not supported on Arduino.
// The below are previous codes used
// std::cout << dash << std::endl;
    // 'std::cout' along with '<<' is used to print various data types to the console.
    // 'std::cout' is a C++ object provided by the <iostream> header representing the standard output stream, typically the console or the terminal. It automatically converts data to a string representation suitable for output.
    // '<<' is the stream insertion operator, used to insert data into the output stream.
    // So, 'std::cout << dash' is like inserting 'dash' into the standard output stream to output 'dash'!
    // 'std::sendl' is a manipulator to insert a newline character.
    // Typing 'std::' can be annoying, to mitigate this, you can type 'using namespace std;' above (which is generally not recommended in larger programs to avoid namespace pollution).