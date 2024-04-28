# MuseumMate Hardware (BLE Version)

The BLE version is the initial approach to hardware development in the MuseumMate project, utilizing Bluetooth Low Energy technology for location tracking. Developed and refined during the Fall 2023 semester, it serves as the foundational implementation, focusing on proving the basic concept and functionality of the system.

**Note:** Since BLE is no longer supported in the current version of the server, please refer to the server at [commit ef4d642](https://github.com/jculley01/MuseumMate/tree/ef4d64260be4e71acbddcd881e881e67de98a0bf) for compatibility.

## Features

- **BLE Beacon**: Operates in advertising mode to send beacon signals.
- **User Device**: Listens for targeted advertising messages and measures RSSI (Received Signal Strength Indicator).
- **RFID Integration**: User Device detects RFID Card ID.
- **Network Connectivity**: User Device connects to the eduroam network via WPA2-PEAP.
- **Data Transmission**: User Device sends BLE RSSI and RFID readings to the server via UDP.

## Prerequisites

- ESP-IDF development environment
- Adafruit HUZZAH32 - ESP32 Feather board
- RC522 RFID reader module
- Eduroam network certification

## Directory Structure

- `/ESP_Beacon`: Contains firmware for the BLE Beacon.
- `/ESP_UD`: Contains firmware for the User Device.

## Configuration and Installation

Ensure you have the [ESP-IDF environment set up](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/get-started/index.html#installation) for ESP32 development.

### Install BLE Beacon

1. Connect your Adafruit HUZZAH32 to your computer.
2. Navigate to the `/ESP_Beacon` directory.
3. Execute `idf.py build flash monitor -p $PORT$` to build the firmware, flash it to the board, and monitor the output.

### Configure and Install User Device

1. Navigate to the `/ESP_UD` directory.
2. Replace `/main/ca.pem` and `/main/server.pem` with your institution's certificates if not on BU campus.
3. Run `idf.py build` to compile the firmware if it's the first build.
4. Execute `idf.py menuconfig` to open the project configuration menu. Adjust settings as needed.
5. Rebuild and flash the firmware with `idf.py build flash monitor -p $PORT$`.
6. Monitor the serial output to confirm the firmware is running correctly.

## Usage

- Document the BLE MAC addresses and IDs of each Beacon and User Device. Register these in the server's Beacon Map and User Device Map.
- Power the User Device. It will automatically listen for BLE advertisements and RFID Card ID, then send these information to the server via UDP. No manual intervention is needed after setup.