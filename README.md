# Scientist Sandbox

<img src="https://res.cloudinary.com/dccrbxfro/image/upload/v1758381634/Screenshot_20-9-2025_204921_science-web-game.vercel.app_sq8yy4.jpg" height=auto width=auto>


## Description

Scientist Sandbox is a browser-based 3D game built with Three.js, where you explore a rolling terrain, collect environmental samples, and learn fun facts. The game features smooth third-person controls, procedural Perlin noise terrain, drifting clouds, a stamina-based running system, jumping mechanics, a rotating compass for navigation, ambient audio, and intuitive UI elements. It's designed as a single HTML file for easy deployment and play—perfect for educational purposes like gamified environmental learning.

This project was developed iteratively, starting from basic camera movement to advanced features like audio and UI polish. It's inspired by open-world exploration games with an educational twist, aligning with initiatives like the Smart India Hackathon for environmental education platforms.

## Features

- **Procedural Terrain:** Smooth, hilly landscape generated with Perlin noise for endless exploration.
- **Player Controls:** WASD movement, Shift to run (with stamina bar), Space to jump (tuned for height and speed), mouse for camera look (pointer lock).
- **Collecting Mechanics:** Interact with spinning samples (wildflowers, rocks, water, shells) using E key; updates research log and shows facts.
- **Dynamic Sky & Clouds:** Animated day-to-evening sky cycle and drifting fluffy clouds.
- **Compass Navigation:** Rotating arrow pointing north with N/S/E/W labels for orientation.
- **Audio:** Ambient nature sounds and grass footsteps (activates on interaction due to browser policies).
- **UI Elements:** Research log, sample score, pop-up facts, stamina bar, how-to-play instructions (fades out but hover to show).
- **Invisible Boundaries:** Prevents falling off the world edges.
- **Responsive Design:** Works in modern browsers; click to lock pointer for immersive play.

## How to Run

1. **Download the HTML File:** Save the provided `index.html`, `script.js`, and `style.css` file (or clone this repo).
2. **Open in Browser:** Double-click the file or open it in a web browser (Chrome/Firefox recommended for best performance).
3. **Play:** Click anywhere to lock the pointer and start exploring. Use controls below.

No installation or dependencies needed—it's a self-contained HTML file with embedded JavaScript and Three.js via CDN.

### Live Demo
* Play Online: https://science-web-game.vercel.app

## Controls

- **WASD:** Move forward/left/back/right.
- **Shift:** Run (depletes stamina; recharges when not running).
- **Space:** Jump (higher and snappier fall).
- **Mouse:** Look around (click to lock pointer).
- **E:** Collect nearby samples.
- **Compass:** Always points north to guide exploration.

## Technologies Used

- **Three.js:** For 3D rendering and scene management.
- **JavaScript (ES6+):** Core game logic, Perlin noise generation, audio handling.
- **HTML/CSS:** UI elements like stamina bar, compass, instructions.
- **AudioContext API:** For ambient and footstep sounds (using free Pixabay assets).

## Development Notes

- The game is built as a single file for simplicity, making it easy to share or embed.
- Procedural generation ensures unique terrain each load.
- Browser policies require user interaction (e.g., click) to start audio—ensured via event listener.
- For contributions: Fork the repo, update the code, and submit a pull request.

## Credits

- Developed by [Your Name] with assistance from Perplexity AI.
- Three.js library: [threejs.org](https://threejs.org)
- Audio assets: Free from Pixabay (nature ambient and grass footsteps).
- Inspired by environmental education projects like gamified platforms for schools.

## License

MIT License. Feel free to use, modify, and distribute. See [LICENSE](LICENSE) for details.
