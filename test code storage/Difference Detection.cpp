#include <Arduino.h>
#include <algorithm>   // to use std::max_element and std::min_element
#include <iterator>   // to use std::begin and std::end

#define AO 36

void setup() {
    Serial.begin(115200);     
    // GPIO36 is an INPUT only pin, so don't need to do pinMode
}

void loop() {
    int sum = 0;
    for (int count = 0; count < 10; count++){
        int sound;
        const int arraySize = 100;
        int array[arraySize];    // Creates an array named 'array' that can hold up to 'arraySize' 'int' type elements.
        for (int index = 0; index < arraySize; index++){    // Syntax: for (initialization; condition; increment) {}
            sound = analogRead(AO);    // It's 12-bit here, so it can read a value from 0 to 4095
            array[index] = sound;      // Store the sound value in the array at index 'index'.
            delay(5);
        }
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

        int range = *Max - *Min;
        sum += range; 
    }
    float average = float(sum) / float(10);   // Float division, '/' alone, without the three 'float's is floor division.
    Serial.print("Average = ");
    Serial.println(average);
}