/** Adapted from
 * @file streams-i2s-serial.ino
 * @author Phil Schatzmann
 * @brief see https://github.com/pschatzmann/arduino-audio-tools/blob/main/examples/examples-stream/streams-i2s-serial/README.md
 * @author Phil Schatzmann
 * @copyright GPLv3
 */

// ! Failed because the sensor does not have a master clock.

#include "AudioTools.h"    // https://pschatzmann.github.io/arduino-audio-tools/modules.html

AudioInfo info(44100, 2, 16);    // Creates an instance with the basic audio configuration which will be used to drive the I2S digital communication protocol. In order, sampleRate (sample_rate_t), channelCount (uint16_t), bitsPerSample (uint8_t). 44.1 kHz sample rate and 16 bits per sample (bit depth)  is the standard for CD, most streaming services and digital audio files, 16-bit can capture a dynamic range of around 96 dB. 2 channels = stereo.
CsvOutput<int32_t> csvStream(Serial);    // https://pschatzmann.github.io/arduino-audio-tools/classaudio__tools_1_1_csv_output.html CsvOutput<int32_t> means you specialised the template class CsvOutput for the 32-bit signed integer data type.
I2SStream i2sStream;    // https://pschatzmann.github.io/arduino-audio-tools/classaudio__tools_1_1_i2_s_stream.html#details
StreamCopy copier(csvStream, i2sStream);     // From i2sStream print to csvStream

void setup(void) {
    Serial.begin(115200);
    auto cfg = i2sStream.defaultConfig(RX_MODE);    // Argument can be RX_MODE, TX_MODE or RXTX_MODE. Use RX_MODE when the microcontroller is the audio sink, TX_MODE when it is the audio source, RXTX_MODE when it is the source and sink at the same time.
    cfg.copyFrom(info);    // Use the basic audio configuration defined above.
    cfg.i2s_format = I2S_STD_FORMAT; // or try with I2S_LSB_FORMAT, list of formats: https://pschatzmann.github.io/arduino-audio-tools/namespaceaudio__tools.html#a720616ce211566d808f3e441f9b18cda
    cfg.is_master = true;
    // This module needs a master clock if the ESP32 is master
    // The ESP32 is the master as it controls the flow of digital audio data and coordinates overall audio processing.
        // As the master, the ESP32 has to:
            // Set the clock speed for audio data transmission to ensure all involved components (slaves: other microcontrollers, audio codecs, digital signal processors, etc.) are synchronised and process the data at the correct pace.
            // Initiate communication with slaves through protocols like I2S here.
            // Manage data flow by determining the direction and timing of audio data transfer. It might send commands or data to slave devices or receive processed audio data from them.
            // Overseas processing by handling some audio processing tasks itself or delegate them to slave devices while maintaining overall controll.
    cfg.use_apll = false;  // try with yes
    // APLL (Audio Phase-Locked Loop) is a component in I2S that significantly enhances audio quality (prevents jitter - unwanted fluctuations in the clock signal - which translates to audio imperfections like pops, clicks, or distorted sound.) by providing a meticulously synchronised clock signal for audio data transmission.
    cfg.pin_mck = 3; 
    i2sStream.begin(cfg);    // Starts the I2S interface with the configuration.

    csvStream.begin(info);    // Starts the processing using "info"
}

void loop() {
    copier.copy();    // Copies all bytes from i2sStream to csvStream (Serial plotter)
}