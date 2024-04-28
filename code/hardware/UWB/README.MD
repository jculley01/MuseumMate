# MuseumMate Hardware (UWB Version)

The UWB (Ultra-Wideband) version of MuseumMate was developed as a significant upgrade to overcome the localization limitations observed with the BLE version. Utilizing UWB technology, this version provides vastly improved accuracy in localization. It was developed during the Spring 2024 semester, representing a major evolution in the project.

## Features

- **UWB Beacon**: Acts as a UWB transmitter.
- **TourTag**: UWB receiver that calculates distance using Time of Flight (TOF) technology.
- **RFID Integration**: TourTag detects RFID card data.
- **Battery Powered**: Operates on a battery with auto sleep upon charging and auto wakeup upon discharging.
- **Battery Level Monitor**: Monitors and reports battery level.
- **Network Connectivity**: TourTag connects to the eduroam network via WPA2-PEAP.
- **Data Transmission**: TourTag sends distance measurements from beacons, RFID readings, and battery information to the server via UDP.

## Prerequisites

- Arduino IDE
- [ESP32 UWB DW3000](https://www.makerfabs.com/esp32-uwb-dw3000.html)
- RC522 RFID reader module
- [USB LiIon/LiPoly charger - v1.2](https://www.adafruit.com/product/259)
- LiIon Battery
- Eduroam network certification

## Directory Structure

- `/MuseumMate_Beacon`: Contains firmware for the UWB Beacon.
- `/MuseumMate_TourTag`: Contains firmware for the TourTag device.
- `/lib/Dw3000`: Contains the necessary library files for the DW3000 module.

## Configuration and Installation

1. Ensure you have the [Arduino environment set up](https://support.arduino.cc/hc/en-us/articles/360019833020-Download-and-install-Arduino-IDE) for ESP32 development.
2. [Install](https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries/) the dw3000 library to your Arduino environment.

### Configure and Install MuseumMate Beacon

1. Connect your ESP32 UWB DW3000 to your computer.
2. Navigate to the `/MuseumMate_Beacon` directory.
3. Open `MuseumMate_Beacon.ino` in the IDE.
4. Modify `BEACON_ID` in line 36 to the correct value.
5. Adjust bytes 7 to 10 in `tx_resp_msg` in line 38 to match the `BEACON_ID`.
6. Build and flash the firmware to the ESP32 UWB DW3000 board and monitor the output.

### Configure and Install MuseumMate TourTag

1. Navigate to the `/MuseumMate_TourTag` directory.
2. Open `common_definition.h` and modify `USERID` on line 5 to the correct value.
3. In `MuseumMateWifi.h`, update `SSID`, `EAP_ANONYMOUS_IDENTITY`, `EAP_IDENTITY`, `EAP_PASSWORD`, `EAP_USERNAME`, and `HOST` (server IP address) as necessary from lines 11 to 20.
4. In `MuseumMateWifi.cpp`, replace `test_root_ca` on line 11 with your institution's certificates if not on BU campus.
5. Build and flash `MuseumMate_TourTag.ino` to your ESP32 UWB DW3000 board, then monitor the serial output to confirm the firmware is running correctly.

## Usage

- Plug the UWB Beacons into wall outlets at desired locations.
- Charge the TourTag device; it automatically begins functioning once unplugged. It will capture distances from beacons, RFID card data, and battery status, and transmit this data to the server via UDP with no need for manual intervention.
