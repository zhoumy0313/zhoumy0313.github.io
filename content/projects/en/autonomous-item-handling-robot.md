---
title: Autonomous Item Handling Robot
summary: An autonomous robot capable of navigating simple terrain, avoiding
  obstacles, and performing item handling tasks based on known maps. The robot
  can autonomously navigate, grasp items, carry them, and sort them into
  designated recycling areas marked with QR codes.
date: 2026-07-20
featured: false
---
```markdown
## Hardware Components

The robot's hardware system is designed for robust performance in varied environments:

### Sensors
- **Mid-360 LiDAR**: Provides comprehensive environment scanning for navigation and obstacle detection
- **USB Camera**: Enables visual recognition and item identification capabilities

### Manipulator System
- **Stepper Motor-driven Robotic Arm**: Offers precise control for lifting and moving objects
- **Servo-driven Gripper**: Ensures reliable grasping of various item types and sizes

### Mobility Platform
- **Mecanum Wheel Chassis**: Enables omnidirectional movement for flexible navigation in tight spaces

### Control Units
- **Jetson Orin NX Computing Module**: Handles complex computational tasks including navigation and object recognition
- **STM32F407 Control Board**: Manages real-time control of motors and sensors

## Software Architecture

The software framework integrates multiple technologies to enable autonomous operation:

### Mapping and Navigation
- **FAST-LIO**: Implements efficient scanning and mapping algorithms for real-time localization

### Object Detection
- **YOLOv5**: Provides fast and accurate item detection capabilities

### Vision Processing
- **OpenCV**: Processes visual data for coordinate calculation and spatial awareness

## Key Features

The robot offers several distinct capabilities that make it suitable for automated item handling tasks:

1. **Autonomous Navigation**
   - Map-based path planning for efficient route calculation
   - Advanced obstacle avoidance capabilities for safe operation
   - Terrain traversal including curbs and slopes

2. **Item Handling**
   - Visual recognition of items for identification and sorting
   - Precise grasping mechanism for reliable item pickup
   - QR code-based sorting system for accurate item placement

3. **Multi-modal Mobility**
   - Omnidirectional movement for flexible positioning
   - Obstacle negotiation capabilities for navigating complex environments

## Demonstration

<div style="text-align: center;">
<iframe width="560" height="315" src="https://www.youtube.com/embed/ERiQQB5y8SE" frameborder="0" allowfullscreen></iframe>
</div>

## Images

#### Chassis movement demonstration
<div style="text-align: center;">
  <img src="assets/images/work/item-handling-robot/chassis-movement.gif" alt="Chassis Movement" />
</div>

#### Robotic arm elevation
<div style="text-align: center;">
  <img src="assets/images/work/item-handling-robot/arm-elevation.gif" alt="Arm Elevation" />
</div>

#### Robotic arm extension
<div style="text-align: center;">
  <img src="assets/images/work/item-handling-robot/arm-extension.gif" alt="Arm Extension" />
</div>

#### Robot traversing speed bumps
<div style="text-align: center;">
  <img src="assets/images/work/item-handling-robot/obstacle-negotiation.gif" alt="Obstacle Negotiation" />
</div>

#### Robot traversing slopes
<div style="text-align: center;">
  <img src="assets/images/work/item-handling-robot/uphill.gif" alt="Traversing Slopes" />
</div>

#### Robot gripper opening and closing
<div style="text-align: center;">
  <img src="assets/images/work/item-handling-robot/claw-operation.gif" alt="Gripper Opening and Closing" />
</div>

#### Robot storage box switch
<div style="text-align: center;">
  <img src="assets/images/work/item-handling-robot/storage-box-rotate.gif" alt="Storage Box Switch" />
</div>

## Future Improvements

Several enhancements are planned to further improve the robot's capabilities:

- Enhanced object recognition capabilities for better item identification
- Improved terrain handling algorithms for more challenging environments
- Extended battery life and efficiency for longer operational periods
- More sophisticated sorting mechanisms for complex classification tasks
```

