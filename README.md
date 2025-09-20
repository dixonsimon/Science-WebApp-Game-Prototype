# Field Scientist Sandbox 3D Game

<img src="https://res.cloudinary.com/dccrbxfro/image/upload/v1758355278/Screenshot_20-9-2025_133032__le6rfw.jpg" height=auto width=auto>

## Overview

**Field Scientist Sandbox** is a simple, browser-based 3D sandbox game built with Three.js. Step into the role of a field scientist exploring a vast open field, collecting various scientific samples like rocks, flowers, moss, and more. The game features random sample generation for replayability, intuitive first-person controls, and a research log to track your discoveries. It's designed as an educational prototype to simulate environmental fieldwork in a fun, interactive way.

This project was developed as a prototype for gamified environmental education, inspired by ideas for VR career simulations and hackathon projects like Smart India Hackathon. It's fully contained in a single HTML file for easy deployment and sharing.

## Features

- **Open-World Exploration**: Navigate a large 200x200 meter grassy field.
- **Random Sample Generation**: Collectibles (e.g., Wildflowers, Quartz Rocks, Moss Patches, Tree Cones, Shells, Ferns, Leaf Fossils) spawn randomly—some close to the starting point for quick engagement, others farther out for exploration.
- **Interactive Collection**: Approach samples and press 'E' to collect them. Samples highlight when nearby.
- **Research Log**: A UI panel tracks all collected items in real-time.
- **First-Person Controls**: Use WASD for movement (relative to camera direction) and mouse for looking around (with Pointer Lock API).
- **Custom 3D Models**: Simple procedural shapes for the scientist avatar and collectibles.
- **Browser-Based**: No installation required—runs directly in modern web browsers.
- **Replayability**: Sample positions randomize on each page reload.

## How to Play

1. **Download or Clone the Repository**:
* `git clone https://github.com/yourusername/field-scientist-sandbox.git`

2. **Run the Game**:
- Open `index.html` (or the main HTML file) in a modern web browser (e.g., Chrome, Firefox).
- Click anywhere on the game window to lock the mouse pointer and enable looking around.
- Explore, collect samples, and build your research log!

*Note*: The game uses a CDN for Three.js, so an internet connection is required on first load.

3. **Controls**:
- **W**: Move forward
- **A**: Move left
- **S**: Move backward
- **D**: Move right
- **Mouse Movement**: Look around (after clicking to lock pointer)
- **E**: Collect nearby sample
- **Click**: Lock/unlock mouse pointer (exit with ESC if needed)

4. **Objective**:
- Start at the center of the map.
- Find and collect as many samples as you like—some are nearby, others require venturing farther.
- Refresh the page for a new random layout!

## Technical Details

- **Tech Stack**: HTML5, JavaScript, Three.js (via CDN).
- **Game Loop**: Uses `requestAnimationFrame` for smooth rendering.
- **Randomization**: Collectibles are generated in two distance bands (20-48m close, 60-120m far) using polar coordinates for even distribution.
- **Customization**: Easily extend by adding more collectible types in the `collectibleTypes` array or tweaking the `randomPosition` function.

## Installation and Setup

No complex setup needed! Just open the HTML file in your browser. For development:

1. Ensure you have a local server if testing with stricter browser policies (e.g., via VS Code Live Server or `python -m http.server`).
2. Three.js is loaded from CDN: `https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js`.

## Contributing

Contributions are welcome! If you'd like to add features (e.g., more collectibles, scoring, multiplayer, VR support, or integration with C#/Python backends), follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a Pull Request.

Please ensure code is clean and tested in multiple browsers.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Developed as a prototype for educational gaming. If you have feedback or ideas (e.g., integrating with VR or hackathon themes), feel free to open an issue!
