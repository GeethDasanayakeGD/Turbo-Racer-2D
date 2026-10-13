# 🏎️ Turbo Racer 2D

A lightweight, high-performance 2D arcade car racing game built entirely using native **HTML5 Canvas**, **CSS3**, and modern **JavaScript (ES6+)**. No external game engines or heavy libraries required—just pure web technologies!

![Project Banner](https://img.shields.io/badge/HTML5Canvas-GameDevelopment-orange?style=for-the-badge&logo=html5)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?style=for-the-badge&logo=javascript)
![CSS3](https://img.shields.io/badge/CSS3-Glassmorphism-blue?style=for-the-badge&logo=css3)

---

## ✨ Features

- **Custom HTML5 Canvas Rendering:** Smooth 60 FPS gameplay with dynamic road rendering, striped side-borders, and lane markers.
- **Dynamic Obstacle & Speed Scaling:** Procedural enemy car spawner with increasing difficulty as your score rises.
- **AABB Collision Detection:** Accurate bounding-box collision detection for realistic crashes.
- **Procedural Sound Effects:** Built-in audio generation using the browser's native **Web Audio API** (no external audio files needed for crash and score effects).
- **Particle Effects:** Dynamic dust particles generated when steering.
- **State Management:** High-score tracking persisted locally using browser `LocalStorage`.
- **Modern UI/UX:** Styled with clean Glassmorphism design principles, responsive overlays for Start and Game Over states.

---

## 🎮 How to Play

1. Use the **Left/Right Arrow keys** or **A / D keys** to steer your car across the lanes.
2. Avoid incoming obstacle cars.
3. Survive as long as you can to rack up points and beat your high score!

---

## 🚀 Getting Started Locally

Getting this project running on your local machine is extremely simple. Follow these steps:

1. **Clone or Download** this repository:
   ```bash
   git clone https://github.com/your-username/turbo-racer-2d.git
   ```
2. Open the project folder in your favorite code editor (like VS Code).
3. Ensure you have the following three files in the same directory:
   - `index.html`
   - `style.css`
   - `script.js`
4. Double-click **`index.html`** or open it using a live server in your browser (e.g., Live Server extension in VS Code) to start playing instantly!

---

## 🛠️ Built With

- **HTML5** – Game structure and Canvas element.
- **CSS3** – Modern glassmorphic styling, animations, and overlays.
- **JavaScript (ES6+)** – Game loops, collision math, event listeners, and Web Audio API synthesis.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
