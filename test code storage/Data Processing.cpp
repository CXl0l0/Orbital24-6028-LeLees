#include <Arduino.h>
#include <algorithm>   // to use std::max_element and std::min_element
#include <iterator>   // to use std::begin and std::end

#define AO 36

void setup() {
    Serial.begin(115200);     
    // GPIO36 is an INPUT only pin, so don't need to do pinMode
}

void loop() {
    int sound;
    const int arraySize = 10;
    int array[arraySize];    // Creates an array named 'array' that can hold up to 'arraySize' 'int' type elements.
    int sum = 0;
    for (int index = 0; index < arraySize; index++){    // Syntax: for (initialization; condition; increment) {}
        sound = analogRead(AO);    // It's 12-bit here, so it can read a value from 0 to 4095
        Serial.println(sound);
        array[index] = sound;      // Store the sound value in the array at index 'index'.
        sum += sound;              // Calculating the sum of 10 readings, so that we can find the average sound value in the end.
        delay(100);
    }
    // Print the maximum and minimum sound value in every 10 readings
    
    char buffer[50];    // This creates an array named 'buffer' that can hold up to 50 'char' type elements. 'char' arrays are often used to store strings as strings in C is an array of characters terminated by the null character '\0'. So 'char buffer[50]' reserves space for a string of up to 49 characters plus the null terminator.
    
    // Obtaining the minimum and maximum value in the array
    auto Min = std::min_element(std::begin(array), std::end(array));
    auto Max = std::max_element(std::begin(array), std::end(array));
    
    // 'auto' is a placeholder data type which allows the compiler to deduce the actual data type of the variable based on its declared value.
    // 'std::begin' and 'std::end' are used to return an iterator pointing to the first element and one past the last element of the array, respectively.
    // Both 'std::max_element' and 'std::min_element' take two iterators as arguments, representing the start and end of the range to search.
        // They return an iterator pointing to the first occurrence of the maximum or minimum element in the range.
        // So, we can deduce that 'auto' will deduce 'Min' and 'Max' to be iterators (instead of 'int', which is what we expect).
        // Even though we know 'Min' and 'Max' will be iterators, we still use 'auto', if not we'll have to type something quite complex for the data type (So complex that I don't know how to jot it down).
    // An iterator is an object that allows you to traverse or iterate over the elements of a container (such as an array, vector, list, etc.) in a generic way, without exposing the underlying details of the container's implementation.
        // Traversal: Iterators provide a way to move sequentially through the elements of a container, typically using operators like ++ (increment) and -- (decrement).
        // Access: Iterators provide a way to access the elements of a container, typically using the * (dereference) operator.
        // Range: Iterators define a range of elements within a container, often representing a start and end point for iteration.
        // Genericity: Iterators are designed to work with different types of containers and are often templated to allow for this generic behavior.
    
    int n = snprintf(buffer, sizeof(buffer), "Range = [%u, %u]", *Min, *Max);
    // Syntax: snprintf(buffer, size, formatted string, format specifier replacements);
        // 'snprintf' is used to format a string and store it in a buffer while ensuring that you do not write more characters than the specified size (in number of bytes).
        // In this case, the buffer is a 'char' array, which is an array of 1-byte elements. Since the 'size' argument is in bytes, the 'size' argument can be interpreted as the number of characters that you want the buffer to hold.
        // Here, we just use 'sizeof' to return the size of the buffer in bytes which is equivalent to the maximum number of characters the buffer can hold, because we want to use all of the available space in the buffer.
        // Compared to 'sprintf', 'snprintf' helps prevent buffer overflow ('sprintf' does not have the second argument).
        // 'snprintf' returns, in 'int' data type, the number of characters in the formatted string character array / number of bytes of the formatted string that would have been written if the buffer was large enough, not counting the null terminator. If the return value is equal to or greater than size, it indicates that the output was truncated.
        // %u is a format specifier meaning unsigned integer, other common format specifiers include:
            // %d or %i: Signed integer
            // %f: Floating-point number
            // %c: Character
            // %s: String
            // %x: Unsigned hexadecimal integer (lowercase)
            // %X: Unsigned hexadecimal integer (uppercase)
            // %p: Pointer
            // %o: Unsigned octal integer
            // %e: Scientific notation (lowercase)
            // %E: Scientific notation (uppercase)
            // %%: Percent sign
        // * is placed before 'Min' and 'Max' to dereference the iterators and return the actual minimum and maximum values.
            // Dereferencing an iterator means accessing the value pointed to by the iterator.

    Serial.print(buffer);    // After storing your formatted string into your buffer, you can finally serial print it out.
    Serial.print(' ');
    Serial.println(*Max - *Min);
    // Serial.print("n = ");
    // Serial.println(n);    // 'n', as explained above, should be the length of the formatted string, which should be 18 if the 'Max' and 'Min' values are 3-digit

    float average = float(sum) / float(arraySize);   // Float division, '/' alone, without the three 'float's is floor division.
    Serial.print("Average = ");
    Serial.println(average);
}