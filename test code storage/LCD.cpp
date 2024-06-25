/*
  LCD Display with I2C Interface Demo
  lcd-i2c-demo.ino
  // Use NewLiquidCrystal Library
  Used hd44780 LCD Library by Bill Perry instead
  DroneBot Workshop 2018
  https://dronebotworkshop.com
*/
 
#include <Wire.h>                          // Allows for and simplifies the implementation of I2C communication between devices. I2C allows multiple devices (slaves) to communicate with one or more master devices using only two wires: SDA (data line) and SCL (clock line). Each I2C device is identified by a unique address, which is used to specify the target device for communication.
#include <hd44780.h>                       // Main hd44780 header
#include <hd44780ioClass/hd44780_I2Cexp.h> // I2C expander i/o class header

// Declare an instance that auto locates & auto configs the expander chip (the I2C adapter).
hd44780_I2Cexp lcd;
// Auto locate: The I2C adapter has a unique address. The hd44780 LCD Library is convenient in that it auto locates the I2C's adapter address, so you don't need to run I2CAddressScanner.ino to find the address.
// Auto configs: The pin connections between the I2C adapter and the LCD will be different from that between the ESP32 and LCD. Worst still, different I2C adapters may have different pinouts and it will be a pain to find them out. However, again, the hd44780 LCD Library is convenient in that it auto configs the pinout for you.
  /* Without using the hd44780 LCD Library, you'll have to find out and do everything below yourself.
  const int  en = 2, rw = 1, rs = 0, d4 = 4, d5 = 5, d6 = 6, d7 = 7, bl = 3;
  const int i2c_addr = 0x27;
  LiquidCrystal_I2C lcd(i2c_addr, en, rw, rs, d4, d5, d6, d7, bl, POSITIVE);
  */
//
// If you wish to use an i/o expander (I2C adapter) at a specific address, you can specify the I2C address and let the library auto configure it. If you don't specify the address, or use an address of zero, the library will search for the I2C address of the device.
// hd44780_I2Cexp lcd(i2c_address); // specify a specific I2C address
// 
// It is also possible to create multiple/seperate LCD objects and the library can still automatically locate them.
// Example:
// hd4480_I2Cexp lcd1;
// hd4480_I2Cexp lcd2;
// The individual LCDs would be referenced as lcd1 and lcd2
// i.e. lcd1.home() or lcd2.clear()
//
// It is also possible to specify the I2C address
// when declaring the LCD objects.
// Example:
// hd44780_I2Cexp lcd1(0x20);
// hd44780_I2Cexp lcd2(0x27);
// This ensures that each each lcd object is assigned to a specific LCD device rather than letting the library automatically asign it.
 
void setup()
{
  // Set display type as 16 char, 2 rows
  lcd.begin(16,2);
  
  // Print on first row
  lcd.setCursor(0,0);
  lcd.print("Hello world!");
  
  // Wait 1 second
  delay(1000);
  
  // Print on second row
  lcd.setCursor(0,1);
  lcd.print("How are you?");
  
  // Wait 8 seconds
  delay(8000);
  
  // Clear the display
  lcd.clear();
}
 
 
void loop()
{
  // Demo 1 - flash backlight
  lcd.setCursor(0,0);
  lcd.print("Backlight demo");
  lcd.setCursor(0,1);
  lcd.print("Flash 4 times");
  
  delay(3000);
  lcd.clear();
  
  // Flash backlight 4 times
  for(int i = 0; i< 4; i++)
    {
    lcd.backlight();
    delay(250);
    lcd.noBacklight();
    delay(250);
    }
 
  // Turn backlight back on
  lcd.backlight();
    
  // Demo 2 - scroll
  lcd.setCursor(0,0);
  lcd.print("Scroll demo - ");
  delay(1500);
  // set the display to automatically scroll:
  lcd.autoscroll();
  // print from 0 to 9:
  for (int thisChar = 0; thisChar < 10; thisChar++) {
    lcd.print(thisChar);
    delay(500);
    }
  // turn off automatic scrolling
  lcd.noAutoscroll();
 
  // clear screen 
  lcd.clear();
  
  //Delay
  delay(1000);
}