#include <Arduino.h>
#include <LiquidCrystal.h>

// initialize the library by associating any needed LCD interface pin
// with the arduino pin number it is connected to
const int rs = 17, en = 16, d4 = 32, d5 = 33, d6 = 25, d7 = 26, a0 = 36;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);    // The order of arguments is like this for 6 arguments, for other number of arguments: https://www.arduino.cc/reference/en/libraries/liquidcrystal/liquidcrystal/

void setup() {
  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  // Print a message to the LCD.
  lcd.print("Sound: ");
}

void loop() {
  // set the cursor to column 0, line 1
  // (note: line 1 is the second row, since counting begins with 0):
  lcd.setCursor(0, 1);
  // print the number of seconds since reset: millis() returns the number of milliseconds that have passed since the program started.
  lcd.print(analogRead(a0));    // Can only print 'char', 'byte', 'int', 'long' or 'string', so 'millis() / 1000' will get approximated.
  delay(200);
}