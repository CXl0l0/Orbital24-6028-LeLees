#include <pgmspace.h>
// pgmspace: program memory space, a set of utilities in the Arduino platform for handling data stored (usually program code) in the flash memory (program memory) of AVR microcontrollers. (You can do low level coding on ESP chips just like AVR chips)
// Normally, strings and other volatile data are stored in SRAM (static random-access memory), which is faster and more reliable but volatile and limited in size.
// By storing constant data in flash memory instead, you can save valuable SRAM for variables and other dynamic data.

const char aws_thing[] = "ESP32";
// Preface 1: the 'const' keyword is used to define variables whose value cannot be changed after initialization. Any attempt to change the values will result in a compilation error.
// Preface 2: Single quotes ' are used to denote a single character ('char'), Double quotes " are used to denote arrays of characters, i.e., strings ('const char *' or 'const char [N]' where N is the size of the character array including the null terminator).
// Here, without the square brackets [] that signifies an array, it will return an error because you're trying to assign a string ('const char *') to a single character ('char').
// 'char' means one single character, for example, "char thing_name = 'a'", will be correct as 'a' (with single quotes) is a single character ('char').
// The double quotes denote a string which has type 'const char *' (More specifically, it is a pointer that points to the first character of the character array).
// Obviously, you cannot assign something of different data type to a data type.
// To solve this we can:
        // const char *thing_name = ""; or
        // const char thing_name[] = ""; as above
            // Without N (size of character array) within [], the compiler will use the assigned value (a.k.a. the initialiser) to self-determine the size of the array.

const char wifi_ssid[] = "me";
const char wifi_pw[] = "tofu11122004";
const char aws_endpoint[] = "a3fh404lk71g2d-ats.iot.ap-southeast-1.amazonaws.com";    // This is basically the AWS IoT Core broker server address

static const char aws_root_ca1[] PROGMEM = R"CA1(
-----BEGIN CERTIFICATE-----
MIIDQTCCAimgAwIBAgITBmyfz5m/jAo54vB4ikPmljZbyjANBgkqhkiG9w0BAQsF
ADA5MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6
b24gUm9vdCBDQSAxMB4XDTE1MDUyNjAwMDAwMFoXDTM4MDExNzAwMDAwMFowOTEL
MAkGA1UEBhMCVVMxDzANBgNVBAoTBkFtYXpvbjEZMBcGA1UEAxMQQW1hem9uIFJv
b3QgQ0EgMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALJ4gHHKeNXj
ca9HgFB0fW7Y14h29Jlo91ghYPl0hAEvrAIthtOgQ3pOsqTQNroBvo3bSMgHFzZM
9O6II8c+6zf1tRn4SWiw3te5djgdYZ6k/oI2peVKVuRF4fn9tBb6dNqcmzU5L/qw
IFAGbHrQgLKm+a/sRxmPUDgH3KKHOVj4utWp+UhnMJbulHheb4mjUcAwhmahRWa6
VOujw5H5SNz/0egwLX0tdHA114gk957EWW67c4cX8jJGKLhD+rcdqsq08p8kDi1L
93FcXmn/6pUCyziKrlA4b9v7LWIbxcceVOF34GfID5yHI9Y/QCB/IIDEgEw+OyQm
jgSubJrIqg0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMC
AYYwHQYDVR0OBBYEFIQYzIU07LwMlJQuCFmcx7IQTgoIMA0GCSqGSIb3DQEBCwUA
A4IBAQCY8jdaQZChGsV2USggNiMOruYou6r4lK5IpDB/G/wkjUu0yKGX9rbxenDI
U5PMCCjjmCXPI6T53iHTfIUJrU6adTrCC2qJeHZERxhlbI1Bjjt/msv0tadQ1wUs
N+gDS63pYaACbvXy8MWy7Vu33PqUXHeeE6V/Uq2V8viTO96LXFvKWlJbYK8U90vv
o/ufQJVtMVT8QtPHRh8jrdkPSHCa2XV4cdFyQzR1bldZwgJcJmApzyMZFo6IQ6XU
5MsI+yMRQ+hDKXJioaldXgjUkK642M4UwtBV8ob2xJNDd2ZhwLnoQdeXeGADbkpy
rqXRfboQnoZsG4q5WTP468SQvvG5
-----END CERTIFICATE-----
)CA1";
// The 'static' keyword in front of global variables functions to limit the scope of the variable to the file in which they are declared.
    // This means that the variable's value is only visible and accessible within the file and not from other files.
    // This prevents unintended access, modification, and name conflicts of the variable from other files.
    // For example, here, aws_root_ca1's value is only visible and accessible (modifiable) in this header file, though, it can still be used in other files, such as files with the header included.
// 'static' serves different purposes in different parts of a code
    // For example, it is most notably used to initialise a variable only once and maintain its state in the 'loop' function.
// PROGMEM is a macro used to tell the compiler to store the variable in the flash memory
// R"{delimiter}( {raw string} ){delimiter}" is the syntax of a raw string literal.
    // Raw string literals are string literals that are designed to make it easier to include nested characters like quotation marks and backslashes that normally have meanings as delimiters and escape characters (\n, \t, \", etc.). The content between these delimiters is treated as-is and will not be interpreted otherwise, preserving all characters including newlines, backslashes, and quotes.
    // Literals are constant variables whose values remain constant over the course of the program.
    // {delimiter} is optional and can be any sequence of characters, as long as it does not appear in the raw string content and is not the backlash "/"", whitespace " ", and parentheses "()".
        // The {delimiter} at the front and the one at the back must match.
        // EOF above means End of File
    // Raw string literals improve readability when dealing with strings that contain many special characters.
    // They are useful for embedding code snippets, regular expressions, or multi-line strings within your code without needing to escape characters.

static const char aws_device_cert[] PROGMEM = R"CERT(
-----BEGIN CERTIFICATE-----
MIIDWjCCAkKgAwIBAgIVAJmUZgdDO7xk7+fYD4jOeBabOzfKMA0GCSqGSIb3DQEB
CwUAME0xSzBJBgNVBAsMQkFtYXpvbiBXZWIgU2VydmljZXMgTz1BbWF6b24uY29t
IEluYy4gTD1TZWF0dGxlIFNUPVdhc2hpbmd0b24gQz1VUzAeFw0yNDA1MjgxMDM4
MTZaFw00OTEyMzEyMzU5NTlaMB4xHDAaBgNVBAMME0FXUyBJb1QgQ2VydGlmaWNh
dGUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDYYKAUaz/Sp3UPc/+Q
tqmbBq4HM07bYSyj7LPtdqawerDHh6l2Frc5w8Q9FGFZ6WjzpnruJFetNu+0/7f3
rT4bxqXXhDGbQ81PHGMXsz53DMPAiSC94QryhLZC3c1eHk+gcEa1GrHthjwRqhaH
a42TZSJ6XE2nvwYWu0S579yDMXYkOEYqBOvJc1ct+m7YzocAbvMB2dBds4oJ2Kus
CAJGh4HLu4q6h+3blIGVkGHNoMWSr8ATglp9bhMyhCU7zam3FVaN56LowA5q8eg4
LgBpVt+PggxyoyLxGVR6Kw47q9OAXO8qfvX7TrmTGKKaCRiQUCKptPMGx72B/UX6
8DJLAgMBAAGjYDBeMB8GA1UdIwQYMBaAFPWdhG9H7pamUUx7YGp7C2CP1/yuMB0G
A1UdDgQWBBTj6NnP+v7v//Je51LRXxZwS8j+VDAMBgNVHRMBAf8EAjAAMA4GA1Ud
DwEB/wQEAwIHgDANBgkqhkiG9w0BAQsFAAOCAQEApHhpyUKFZIhwxIXLjeibv56E
+3dQkdzFDZq+O77kmoaJUReU9Ra8hGpn71QE9f1DGoroSn/jv3DH/al7el8Reu+m
MU51VXlFmI00blDiFAcXwKHYUjpzPDWzXL2+EIzzoVFbeMKfrH2UKpH05tkAsA89
wEFf2jnyWkx6JpVrM81eSu1xkvW7A15x0y6JXmF257ccU9H4Kp5uBWEWzgyo+X9d
12hIzdqE7Lzixpn4kINCnZtC4JFX8VcML6Q2p7u2z1MN8jL2XyoiQ8j6K0aNoiyv
1mBHKNriX4MXumZ+eMXh+XSTzVEHm2qM96WhkTrDmigE/hnGOovudkHNEY0/UA==
-----END CERTIFICATE-----
)CERT";
static const char aws_priv_key[] PROGMEM = R"KEY(
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEA2GCgFGs/0qd1D3P/kLapmwauBzNO22Eso+yz7XamsHqwx4ep
dha3OcPEPRRhWelo86Z67iRXrTbvtP+3960+G8al14Qxm0PNTxxjF7M+dwzDwIkg
veEK8oS2Qt3NXh5PoHBGtRqx7YY8EaoWh2uNk2UielxNp78GFrtEue/cgzF2JDhG
KgTryXNXLfpu2M6HAG7zAdnQXbOKCdirrAgCRoeBy7uKuoft25SBlZBhzaDFkq/A
E4JafW4TMoQlO82ptxVWjeei6MAOavHoOC4AaVbfj4IMcqMi8RlUeisOO6vTgFzv
Kn71+065kxiimgkYkFAiqbTzBse9gf1F+vAySwIDAQABAoIBAE260GblbEUJgSTu
/9UFuYIGcUgG54Ips3aj1rMsl474VD8pfff9Cw9GQ13Jz3sUPW6h1LFt/s0r2grE
flsMMi6aOwNj6sojHkMYKITgEEWGIWAuIsPzbxJWGH+G3Hq+Gs7A5rWyhE6WlUen
OXambXKQt0ULmZ30IoTR+0tsXmQGHISxuJQSH3s4LxHvTNxUGIv06/RhFRM9xMnG
+0X0MVPiS5r5HCyDqwxc3s+mIFqiv3+DL9aAM1i3AIKPM4B0HPgbSe+7gxPaFYKN
bxLszColD0jtdCsQ0UfspbtepidzEWq3j3gF3Wuz8K89wjzVZ6Q3XzVOzAlDZp/1
M184CgkCgYEA8qBMffTfwfhjDRY4bxEyV6niDAmpaT044HfvrYpkp/SQHNUL/kUX
qgBXW7OyYTPVwl3w5WgJBKzYI8gwzPP8oKP1St0aaF7OZo64TdkWgEVM0+HImz0+
/JmVZpOsJp7C4eUNNLp0DNWa9BQz+ucQb+/NiyAvjr0Lcr616e4NGA8CgYEA5E3u
LqPrRAH6LhSv+QUzBsoW5s2Yp7aXseSu8r9QFvTm/dLOOMof8hXvo2GRoBPLiHMk
cYvMY+4HJmMCvL8gj62YLZVzC0nfztiz2XT10tuYmG2doxdvLAVPkLDO2n+G16+i
eardpkSJQwqrh7wb8FJRKpByk5PCUTqQu1qbpgUCgYBlBCSU1J1MzzO+QSAh7hD9
urdot6UXMew6WPUrVdFutD5EItepd+7QUvAMOBburXw0PpSLjvMiRSyASVs4GeV2
pIz+LGxQRBi/TnChyN67bR79oKW7LJbK6M7xNE6ajcMp9gm3iGHE7jJjqP2zWvzW
/gqgADiMv1zC23A2A2zkNQKBgH22Z7vo6OhGynLLU2aktUc8ykWG2lMnWPpMuQTT
0Y8ChZsolANzUQnliFIHrL9fhwh4lo2rc/1mmStLA7vY5l4XMZ+QFowVvpZQfx/z
plTYNHtiiJXAlqe/uOMsaIqqBB8KCEZEjs46GPcAjhksvJmlSipM5bpbd3lw7Tct
Gl3dAoGAdTXd9yFTr1NTecTVR9QNopVDEFaRdEysUCZ3WDBV2kKT/mylaKrQW6Up
RkJuvUkwXy4OZLn8yixyC4ME8lx03cVGN3ft0PInyG6Fxp6X2STpIlCJAN3qtdi5
/oelo72v1U9mDJur5NkxUuJd6KXVN2rIVl/FEoyhV8xZmBt7mKA=
-----END RSA PRIVATE KEY-----
)KEY";
