# ESP32-Based Intelligent Fire Detection System

## Project Overview
- **Title**: ESP32-Based Intelligent Fire Detection System Utilizing Machine Learning
- **Purpose**: Smart fire detection for commercial environments (e.g., companies, marts)
- **Features**:
  - Real-time detection of smoke, flames, and heat using image processing and ML
  - Integrates with existing security infrastructures
  - Optimized for small/micro businesses in India
  - Cost-effective and reliable fire safety solution
- **Hardware**: Arduino, ESP32, ESP32-CAM with OV2640 camera module
- **Project Achievement**:
  - [Certificate](https://mehtabk.netlify.app/CERTIFICATE.pdf)
  - [Research Paper](https://d197for5662m48.cloudfront.net/documents/publicationstatus/260984/preprint_pdf/ddf88a7a5c1f2df26dcb07c151bd2b9f.pdf)

## Components
- **ESP32 32Pin Development Board**: Wi-Fi enabled Arduino microcontroller
- **ESP32-CAM with OV2640 Camera (2MP)**: Captures images/video for fire detection
- **ESP32-CAM-MB Micro USB**: USB interface for ESP32-CAM
- **DHT11 Sensor**: Measures temperature and humidity
- **Infrared Obstacle Avoidance Sensor (Active Low)**: Detects obstacles via IR
- **Sound Detection Module**: Senses sound intensity
- **MQ-2 Gas Sensor**: Detects smoke, propane, methane, etc.
- **Jumper Wires**: Female-to-Female (40 pcs, 10cm), Male-to-Female (40 pcs, 20cm)
- **MB102 Breadboard (830 pins, 2 units)**: For prototyping circuits

## Connections
- **ESP32 Pin Assignments**:
  - DHT11: VCC → 3.3V, GND → GND, DATA → GPIO4
  - MQ-2: VCC → 5V, GND → GND, AO → GPIO36
  - IR Sensor: VCC → 5V, GND → GND, OUT → GPIO14
  - Sound Sensor: VCC → 3.3V, GND → GND, OUT → GPIO13
  - LED: Anode → GPIO12, Cathode → GND
- **ESP32-CAM**: Connect via ESP32-CAM-MB USB interface
- **Breadboard Setup**:
  - Breadboard 1: Power management (3.3V, GND rails)
  - Breadboard 2: Sensor-to-ESP32 GPIO connections

## Flowcharts
- **Data Flow**:
Start → Initialize ESP32 → Read Sensor Data → If Data Received: Send to Cloud → Else: Wait

- **System Operation**:
Start → Initialize Sensors → Collect Data → Process Data → Display on OLED → Send to Cloud → Repeat


## Libraries and Program
- **Arduino IDE Setup**:
- Add ESP32 board: `https://dl.espressif.com/dl/package_esp32_index.json`
- Install libraries: DHT Sensor Library, Adafruit Unified Sensor Library
- **Code**:
Check Repository

## Execution:
Connect ESP32 to PC via USB
Upload code via Arduino IDE (Board: ESP32 Dev Module, Baud: 115200)
Monitor output via Serial Monitor
Initial Setup Steps
Install Arduino IDE and ESP32 board package
Install required libraries (DHT, Adafruit Unified Sensor)
Connect sensors to ESP32 as per pin assignments
Upload provided code to ESP32
Open Serial Monitor to view sensor data

© 2025 PROJECTNINE32 | All Rights Reserved
