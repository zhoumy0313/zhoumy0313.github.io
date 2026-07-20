---
title: RoboMaster Combat Robot
summary: >-
  As a core member of the LuoJiaFox team from Wuhan University, I was involved
  in the design and development of RoboMaster robots from scratch. 


  In the 2025 RoboMaster University Robot Competition, we achieved outstanding
  results including the second prize at the Zhejiang Station Alliance Tournament
  and the first prize in the Infantry Combat Competition, ultimately winning
  multiple national awards at the National Finals.
date: 2026-07-20
featured: false
---
<div style="text-align: center;">

  <figure style="display: inline-block; margin: 10px;">

    <img src="[https://raw.githubusercontent.com/zhoumy0313/zhoumy0313.github.io/main/assets/images/work/robomaster/team_group_photo.jpg](https://raw.githubusercontent.com/zhoumy0313/zhoumy0313.github.io/main/assets/images/work/robomaster/team_group_photo.jpg)" alt="Group Photo of Our Team" style="width: 100%; max-width: 600px;">

    <figcaption>Group Photo of Our Team</figcaption>

  </figure>

</div>

## Awards

- 2025 RoboMaster University Robot Competition

  - First Prize at National Finals (the first-ever national first prize in Wuhan University's history)

  - Second Prize at National Finals

  - Third Prize at National Finals

  - Robot Competition Award

  - Runner-up in Infantry Combat Competition at Zhejiang Station

  

<div style="text-align: center;">

  <figure style="display: inline-block; margin: 10px;">

    <img src="[https://raw.githubusercontent.com/zhoumy0313/zhoumy0313.github.io/main/assets/images/work/robomaster/prize_group_photo.jpg](https://raw.githubusercontent.com/zhoumy0313/zhoumy0313.github.io/main/assets/images/work/robomaster/prize_group_photo.jpg)" alt="Group Photo of Our Team Winning Runner-up" style="width: 100%; max-width: 600px;">

    <figcaption>Group Photo of Our Team Winning Runner-up</figcaption>

  </figure>

</div>

## Technical Skills

### Mechanical Design

The infantry and sentry robots for the RoboMaster University Alliance Tournament were designed and modeled by team members Peng Jie and me, referencing the official RoboMaster A1 infantry robot. Peng was responsible for the chassis design and modeling, while I handled the gimbal design and modeling.

The robot is assembled from 3mm carbon fiber plates, high-strength connectors, and PLC 3D-printed parts. The shell uses carbon fiber plates capable of withstanding intense collisions and impacts; the central frame adopts aluminum square tubes, which not only achieve high weight loading but also meet high-strength requirements; complex modules with smaller force requirements use PLC printed parts from a Bambu printer, eliminating the need for custom processing and significantly saving time and economic costs.

<div style="display: flex; justify-content: space-around; text-align: center;">

  <figure style="display: inline-block; margin: 10px;">

    <img src="[https://raw.githubusercontent.com/zhoumy0313/zhoumy0313.github.io/main/assets/images/work/robomaster/infantry_close_up.jpg](https://raw.githubusercontent.com/zhoumy0313/zhoumy0313.github.io/main/assets/images/work/robomaster/infantry_close_up.jpg)" alt="Infantry Robot" style="width: 100%; max-width: 350px; height: 90%;">

    <figcaption>Infantry Robot</figcaption>

  </figure>

  <figure style="display: inline-block; margin: 10px;">

    <img src="[https://raw.githubusercontent.com/zhoumy0313/zhoumy0313.github.io/main/assets/images/work/robomaster/sentry_close_up.jpg](https://raw.githubusercontent.com/zhoumy0313/zhoumy0313.github.io/main/assets/images/work/robomaster/sentry_close_up.jpg)" alt="Sentry Robot" style="width: 100%; max-width: 350px; height: 90%;">

    <figcaption>Sentry Robot</figcaption>

  </figure>

</div>

The robot chassis is a four-wheel omnidirectional wheel chassis, with each wheel group using a spring shock absorption module to ensure separate movement between the robot chassis and the gimbal, allowing accurate movement while the chassis spins at high speed.

The connection between the chassis and the gimbal uses a Mofulong multi-channel high-power electric slip ring, enabling the chassis and gimbal to rotate 360 degrees relative to each other without mechanical limit concerns.

The gimbal consists of a control system, computing system, ammunition supply system, shooting system, and sensor system. The control system is a DJI RoboMaster C-type development board equipped with an STM32F407 chip, running the FreeRTOS operating system to manage overall robot system control; the computing system is an Nvidia Jetson Orin NX development board, responsible for robot computation and planning, and uses OpenCV for visual recognition and target locking; the ammunition supply system comprises a bullet feed disc and feed chain, responsible for delivering standard 17mm fluorescent pellets to the shooting system; the shooting system includes two friction wheels, pellet limiter, and muzzle velocity measurement module, capable of firing 17mm fluorescent pellets at different speeds to achieve precise strikes on targets; the sensor system includes a Daheng industrial camera and a Livox mid-360 LiDAR, enabling perception of the surrounding environment and detection and tracking of targets.

<div style="text-align: center;">

  <figure style="display: inline-block; margin: 10px;">

    <img src="[https://raw.githubusercontent.com/zhoumy0313/zhoumy0313.github.io/main/assets/images/work/robomaster/gimbal_close_up.jpg](https://raw.githubusercontent.com/zhoumy0313/zhoumy0313.github.io/main/assets/images/work/robomaster/gimbal_close_up.jpg)" alt="Gimbal Close Up" style="width: 100%; max-width: 300px;">

    <figcaption>Gimbal Close Up</figcaption>

  </figure>

</div>

### Electrical System

The entire robot is controlled by a DJI RoboMaster C-type development board with an STM32F407 chip, featuring a high-speed clock, Flash memory, 6 PWM channels, 3 UART serial ports, 2 CAN buses, and 1 I2C bus, capable of achieving high-speed control, high-precision control, high-precision data acquisition, and high-precision data processing functions.

In our design, CAN1 bus is used for chassis control communication, relayed through a RoboMaster ESC center board to connect to 4 C620 ESCs of the wheel groups, driving four 3508 motors to control the four wheels respectively; CAN2 bus is used for gimbal control communication, relayed through two RoboMaster ESC center boards to connect to 2 GM6020 motors, controlling the yaw and pitch axes of the gimbal respectively, and also connecting to two friction wheel motors for shooting speed, and one bullet feed disc motor for starting and stopping ammunition supply.

UART1 serial port is used for data transmission between the control system and the computing system. After the computing system acquires data from sensors and processes it through algorithms, it transmits the results to the control system to complete robot control. The control system then feeds back the control results to the computing system, completing the closed loop; UART2 serial port is used for communication between the robot and the competition judging system, allowing real-time data acquisition from the judging system for status judgment and implementation planning, while also transmitting robot control information to the judging system to synchronize robot and competition data.

<div style="display: flex; justify-content: space-around; text-align: center;">

  <figure style="display: inline-block; margin: 10px;">

    <img src="[https://raw.githubusercontent.com/zhoumy0313/zhoumy0313.github.io/main/assets/images/work/robomaster/control_system.jpg](https://raw.githubusercontent.com/zhoumy0313/zhoumy0313.github.io/main/assets/images/work/robomaster/control_system.jpg)" alt="Control System" style="width: 100%; max-width: 350px; height: 100%;">

    <figcaption>Control System</figcaption>

  </figure>

  <figure style="display: inline-block; margin: 10px;">

    <img src="[https://raw.githubusercontent.com/zhoumy0313/zhoumy0313.github.io/main/assets/images/work/robomaster/in_progress.jpg](https://raw.githubusercontent.com/zhoumy0313/zhoumy0313.github.io/main/assets/images/work/robomaster/in_progress.jpg)" alt="Building Robots" style="width: 100%; max-width: 350px; height: 100%;">

    <figcaption>Building Robots</figcaption>

  </figure>

</div>

### Software Architecture

The software architecture of the computing system is mainly divided into vision software and navigation software.

After acquiring camera data from the sensor system, the YOLOv5 model performs target detection, extracting valuable targets from images, then crops the image to retain only the valuable target area, removing meaningless background regions. Subsequently, OpenCV is used for threshold judgment, color recognition, line extraction, and other operations to accurately locate the target center coordinates, calculate the offset between the target center and the robot's line of sight center, and transmit this to the control system to complete target aiming and locking.

Upon obtaining LiDAR data, the navigation software uses Fast-LIO for map construction and LIO-SAM for map optimization, ultimately generating a map. The robot can navigate based on prior maps and LiDAR data, completing automatic robot movement.

## Competition Review Video

<div style="text-align: center;">

  <iframe 

    src="//player.bilibili.com/player.html?isOutside=true&aid=114220981027869&bvid=BV1zyoWYJEe1&cid=29056175278&p=1" 

    scrolling="no" 

    border="0" 

    frameborder="no" 

    framespacing="0" 

    allowfullscreen="true" 

    style="width: 100%; max-width: 560px; aspect-ratio: 16 / 9;">

  </iframe>

</div>

## Promotion for Engineering Practice and Innovation Club

As an important part of Wuhan University's Engineering Practice and Innovation Club, the LuoJiaFox team demonstrates our university's strength in the field of robotics technology. Our project not only enhances team members' comprehensive abilities in mechanical design, electronic control, computer vision, and other areas, but also wins honor for the school in high-level science and technology competitions. Through continuous technological innovation and teamwork, we are committed to promoting the development of robotics technology and contributing to cultivating more outstanding engineering and technical talents.

This competition experience fully demonstrated the power of teamwork and the importance of technical practice. Facing complex system integration challenges, we successfully built a competitive robotic system through interdisciplinary collaboration, creating the best performance in Wuhan University's history in RoboMaster competitions.

For more information about the Engineering Practice and Innovation Club of Wuhan University, please scan the QR code to access the club's WeChat official account:

<div style="text-align: center;">

  <figure style="display: inline-block; margin: 10px;">

    <img src="[https://raw.githubusercontent.com/zhoumy0313/zhoumy0313.github.io/main/assets/images/work/robomaster/WHU_GC_Team_QRcode.jpg](https://raw.githubusercontent.com/zhoumy0313/zhoumy0313.github.io/main/assets/images/work/robomaster/WHU_GC_Team_QRcode.jpg)" alt="WHU GC-Team QR Code" style="width: 100%; max-width: 300px;">

  </figure>

</div>

