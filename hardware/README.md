# MuseumMate Hardware

This directory contains all hardware component files for the MuseumMate project, including PCB designs and enclosure models for the TourTag device and Beacon. These files are crucial for the manufacturing and assembly of the hardware components.

## Directory Structure

- `/PCB_KiCAD`: Contains all KiCAD files for the PCB design of the TourTag.
- `/Enclosures`: Includes the CAD files for the enclosures of both the TourTag and Beacon.

## PCB Design for TourTag

### Schematic Diagram

The schematic diagram provides a detailed visual representation of the electrical connections and components within the TourTag device, crucial for circuit design and troubleshooting.

- **TourTag Device Schematic**: This schematic displays the circuit design, detailing all integrated circuits, their connections, and header pins for modular component attachment.

![image](/media/pcbschematic.PNG)

**Links to TourTag Device Schematic**:
- [TourTag Device Schematic (PDF)](/media/pcbschematic.pdf)
- [Source Files (CAD)](/hardware/PCB_KiCAD/UWB_PCB/UWB_PCB.kicad_sch)

### PCB Layout

This section shows the arrangement of components on the TourTag circuit board, essential for manufacturing and assembly guidance.

- **TourTag Devices PCB**: A detailed layout showing the placement of components, traces, vias, and header connectors.

![image](/media/pcbdesign.PNG)

**Links to TourTag Devices PCB Layout**:
- [TourTag Devices PCB Layout (PDF)](/media/pcbdesign.pdf)
- [Editable PCB Design File (KiCAD)](/hardware/PCB_KiCAD/UWB_PCB/UWB_PCB.kicad_pcb)

## Enclosure Designs

### TourTag Enclosure

The enclosure for the TourTag is designed to protect the device while maintaining functionality and accessibility for maintenance and upgrades.

- **Design Overview**: 
The TourTag enclosure encloses the PCB, the RFID, the ultra-wideband ESP, the battery monitor and the battery. The Enclosure is designed to be attached to the back of the user's phone using MagSafe. Each enclosure will have a Magsafe Magnet inside ensuring a seamless experience for the user. On the Enclosure, there will also be three holes. The hole on the right side of the enclosure will be for the ultra-wideband antenna. This ensures that the beacons can accurately detect where the user is in the museum. The hole on the left side of the enclosure will allow the museum to charge the enclosure without taking the PBC out of the enclosure. Finally, the hole on the top of the enclosure will allow the museum to take the electronic components out of the enclosure is needed. 

- **Manufacturing and Assembly**: There were two materials that were taken into consideration when making the enclosure. The main two factors in deciding on a material were weight and cost. First off, the enclosure had to be light because it was going to be put on the back of the phone. If the enclosure was too heavy, the enclosure would fall off the phone making the user experience bad. Secondly, the enclosure has to be inexpensive. This is because the museum has to make as many enclosures as there are users in a museum. If the enclosure were expensive it would cost the museum a lot of money making them not want to use MuseumMate. The two materials considered were PLA and ABS. After weighing the pros and cons of each material like how brittle the material is and the heat tolerance, we went with PLA because it is not as brittle as ABS and if the public is using the enclosures, we want the enclosures to hold up to wear and tear. To manufacture the enclosures, we 3D printed them. This is because they are easy to manufacture yet strong.

**Links to TourTag Enclosure Design**:
- [TourTag Enclosure Design (Onshape)](#[[link_to_tourtag_onshape_file](https://cad.onshape.com/documents/7aaab9504794f084db368c22/w/5395925245216489e8e7f16a/e/d80cc8f357e229253dcfb44c)])

### Beacon Enclosure

Similarly, the enclosure for the Beacon ensures it is safeguarded against environmental factors and blends seamlessly within its deployment setting.

- **Design Overview**: The beacon enclosure also has three holes in it. The first hole on the bottom of the enclosure is for the ultra-wideband antenna. This allows the antenna to have nothing in its way to make the most accurate location tracking. The hole on the left side of the enclosure is for the charger. The hole on the top of the enclosure is so we can put the UWB in the enclosure. Also, the MuseamMate holes allow for heat dissipation. 


- **Manufacturing and Assembly**:Like the TourTag enclosure, there were two materials that were taken into consideration when making the enclosure. The main two factors in deciding on a material were weight and cost. We decided that ABS was the right material for this because it can handle more heat just in case the UWB gets warm. .

**Links to Beacon Enclosure Design**:
- [Beacon Enclosure Design (Onshape)](#[[link_to_beacon_onshape_file](https://cad.onshape.com/documents/9a545c80bb0287f4124073f7/w/fd1997773b928c532072d26f/e/a766d1128aeb9f154a371a63)])

**Note**: Ensure you have the necessary software to view and edit the design files, such as Onshape or other CAD software.

This README provides detailed information about the PCB and enclosures, supporting the project's requirements for durability, functionality, and ease of integration within the MuseumMate system.
<img width="323" alt="Screen Shot 2024-04-28 at 8 28 43 AM" src="https://github.com/jculley01/MuseumMate/assets/91488781/81752479-b0e6-49b4-9777-bfb5fa4ea413">
<img width="314" alt="Screen Shot 2024-04-28 at 8 28 19 AM" src="https://github.com/jculley01/MuseumMate/assets/91488781/de260560-c768-49fa-a7e2-2ab83af7b597">



