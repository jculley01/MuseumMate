# MuseumMate Hardware Report

This document serves as a comprehensive guide to the hardware components used in the MuseumMate project. It includes schematics, vendor information, technical specifications, and setup instructions for various hardware elements. Additionally, this report covers the integration of external systems and sensors.

## Schematic and PCB Diagrams

This section provides detailed access to the schematic diagram and the PCB layout for the TourTag device, which is the central component of the MuseumMate system. The modular design of the TourTag allows various hardware components to be connected via headers, facilitating ease of assembly, upgrades, and maintenance.

### Schematic Diagram

The schematic diagram offers a detailed visual representation of the electrical connections and components within the TourTag device. It is essential for understanding the circuit design and for troubleshooting.

- **TourTag Device Schematic**: Shows the circuit design for the TourTag device, detailing all integrated circuits, their connections, and header pins used for modular component attachment.

**Link to TourTag Device Schematic**:
- [TourTag Device Schematic (PDF)](/media/pcbschematic.pdf)
![image](/media/pcbschematic.png)
- [Source Files (CAD)](/hardware/PCB_KiCAD/UWB_PCB/UWB_PCB.kicad_sch)

### PCB Layout

The PCB layout provides detailed information on the arrangement of components on the TourTag circuit board. This layout is crucial for manufacturing the PCB and for guiding the assembly process.

- **TourTag Devices PCB**: Detailed layout showing the placement of components, traces, vias, and header connectors on the TourTag PCB. This layout aids in understanding how various modules and accessories can be attached and configured.

**Link to TourTag Devices PCB Layout**:
- [TourTag Devices PCB Layout (PDF)](/media/pcbdesign.pdf)
![image](/media/pcbdesign.PNG) 
- [Editable PCB Design File (KiCAD)](/hardware/PCB_KiCAD/UWB_PCB/UWB_PCB.kicad_pcb)

**Note**: Ensure that you have the necessary software to open CAD/CAM and PCB design files, such as KiCAD or another compatible viewer.

This section aims to provide the necessary technical documentation for the electronics design community involved with the MuseumMate project, particularly focusing on the TourTag device. It enables engineers and technicians to access, review, and potentially modify the electronic design to suit their specific needs or to develop additional functionalities.

## Vendor Information and Bill of Materials

This section presents a detailed Bill of Materials (BOM) for the MuseumMate hardware. Each component listed includes direct links to vendors, clearly displayed pricing, and the unit costs for efficient sourcing and budgeting.

### User Device (TourTag)

| Component | Price | Units | Unit Cost |
|-----------|-------|-------|-----------|
| [ESP32 UWB DW3000](https://www.makerfabs.com/esp32-uwb-dw3000.html) | $43.80 | 1 | $43.80 |
| [RC522 RFID Module](https://www.amazon.com/RC522-Module-Reader-Sensor-White/dp/B0CC4JGN3P) | $9.99 | 6 | $1.67 |
| [USB LiIon/LiPoly charger](https://www.adafruit.com/product/259) | $12.50 | 1 | $12.50 |
| [Mini B USB Cable](https://www.digikey.com/en/products/detail/qualtek/3021003-03/1531289) | $27.05 | 10 | $2.71 |
| [LiIon Polymer Battery 3.7V 420mAh](https://www.adafruit.com/product/4236) | $6.95 | 1 | $6.95 |
| [RS-06K103JT 10K Ohm Resistor](https://jlcpcb.com/) | $0.0420 | 20 | $0.840 |
| [PCB Board](https://jlcpcb.com/) | $27.00 | 10 | $2.70 |
| [Enclosure](http://www.bu.edu/epic/3d) | $3.50 | 7 | $0.50 |
| **Total User Device Unit Cost:** | | | **$70.82** |

### Beacon

| Component | Price | Units | Unit Cost |
|-----------|-------|-------|-----------|
| [ESP32 UWB DW3000](https://www.makerfabs.com/esp32-uwb-dw3000.html) | $43.80 | 1 | $43.80 |
| [Enclosure](http://www.bu.edu/epic/3d) | $6.50 | 15 | $0.43 |
| **Total Beacon Unit Cost:** | | | **$44.23** |

### RFID Sticker

| Component | Price | Units | Unit Cost |
|-----------|-------|-------|-----------|
| [13.56MHz RFID Sticker NTAG213 Tag](https://www.adafruit.com/product/4032) | $26.60 | 10 | $2.66 |
| **Total Beacon Unit Cost:** | | | **$2.66** |

### Total Build Cost - ECE day @ PHO 9th floor

| Component | Unit Cost | Units | Cost |
|-----------|-----------|-------|------|
| User Devices | $70.82 | 12 | $849.84 |
| Beacons | $44.23 | 14 | $619.27 |
| RFID Stickers | $2.66 | 30 | $79.80 |
| **Total System Build Cost:** | | | **$1,548.91** |


## Technical Specifications and Resources

This section provides comprehensive specifications and a centralized repository of resources for each hardware component integrated into the MuseumMate system. These specifications and resources include detailed information on microcontrollers, UWB modules, RFID readers, battery systems, and other crucial hardware utilized in the design and functioning of the system. They are critical for development, troubleshooting, and expansion of the system.

### Microcontroller and UWB Module
- **[ESP32 UWB DW3000](https://wiki.makerfabs.com/ESP32_DW3000_UWB.html)**
  - **Microcontroller**: [ESP32 WROOM32](https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32_datasheet_en.pdf) - Features dual-core CPUs, standard Wi-Fi, and Bluetooth capabilities.
  - **UWB Module**: [DW3000](https://www.qorvo.com/products/d/da008142) - Provides precise location capabilities and communication functionalities.
- **Design Templates and Resources**:
  - [Reference to connect ESP32 to eduroam](https://github.com/martinius96/ESP32-eduroam)
  - [UWB System Design Template](https://github.com/Makerfabs/Makerfabs-ESP32-UWB-DW3000/tree/main/example/range)

### RFID System
- **RFID Reader**: [MFRC522](https://www.nxp.com/docs/en/data-sheet/MFRC522.pdf) - Operates at 13.56 MHz for efficient reading and writing to RFID tags.
- **RFID Tag**: [13.56MHz RFID Sticker NTAG213 Tag](https://www.nxp.com/docs/en/data-sheet/NTAG213_215_216.pdf) - Offers advanced features for security and quick sensing.
- **Design Templates and Resources**:
  - [RFID System Design Template](https://github.com/miguelbalboa/rfid/tree/master/examples/rfid_read_personal_data)

### Power Management
- **Battery Charger**: [MCP73833](https://cdn-shop.adafruit.com/datasheets/MCP73833.pdf) - Manages charging for single-cell Lithium-Ion or Lithium-Polymer batteries.
- **Battery**: [LiIon Polymer Battery 3.7V 420mAh](https://cdn-shop.adafruit.com/product-files/4236/4236_ds_LP552535+420mAh+3.7V.pdf) - Provides stable and reliable power.

These resources are intended for engineers and technicians involved in the design, maintenance, and upgrade of the MuseumMate system, providing them with quick access to technical details and application guidance.

## Power Requirements

This section details the power supply requirements for all hardware components in the MuseumMate system, ensuring optimal performance and reliability.

### Beacon

- **Voltage Requirement**: 5V provided via Micro USB.
- **Operating Voltage**: 3.3V.
- **Power Source**: Recommended to be powered through a standard wall outlet using a Micro USB cable.

### User Device

- **Voltage Requirement**: Minimum 3.3V from a lithium battery.
- **Operating Voltage**: 3.3V.
- **Battery Specifications**: 3.7V 420mAh lithium battery.
- **Power Consumption**: Approximately 0.39 watts.
- **Battery Life**: The battery allows for at least 4 hours of continuous use on a single charge.
- **Recommended Power Supply Model**: Any standard LiIon Polymer Battery with a voltage output of at least 3.3V.
- **Charging Requirements**: User device should be charged using a Mini B USB Cable with at least 3.75V input voltage. It is recommended to charge the device through an AC-DC 5V adapter connected via Mini B USB Cable for efficient power delivery.

These specifications ensure that both the Beacon and User Device operate efficiently, with reliable power sources suited to their design and functional requirements.

## System Assembly and Photographic Documentation

This section provides detailed visual documentation of the MuseumMate hardware, which is essential for understanding the assembly and layout of the system. The documentation is divided into two parts to cover both the internal setup within the enclosure and the entire assembled system.

### Clear Picture of System Inside the Enclosure

This subsection provides clear images from multiple angles of the internal components and setup within the system’s enclosure. These photographs are crucial for visualizing the arrangement and integration of components, which is beneficial for assembly, maintenance, and troubleshooting.

- **Top View**: Shows how the components are arranged within the enclosure, highlighting space utilization and component layout.
- **Side Views**: Display the connections and mounting from the sides, showing component depth and attachment points.
- **Close-up Views**: Detailed views of specific areas like wiring, connectors, and mounting of modules like the UWB DW3000 and RFID readers.

### Photographs Documenting the Assembled Entire System

This subsection focuses on the overall assembly of the entire system, providing a broader perspective that includes external interfaces and operational setup.

- **Full System View**: An image showing the complete system assembled and ready for use, providing an overall perspective.
- **Operational Setup**: Photos of the system in its operational environment, illustrating how it interfaces with other systems or modules.
- **Interaction Points**: Images highlighting user interaction points such as power switches, USB ports, or other control interfaces.

![image](/media/tourtag.jpg)

