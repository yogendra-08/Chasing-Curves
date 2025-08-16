# Dream Date Journey

An interactive dating simulation game where you go on a virtual date with your crush. Experience different activities like a long drive, a walk in the park, dancing, shopping, and more!

## Features

- 🚗 Interactive long drive scene with smooth car controls
- 🌳 Beautifully animated park scene
- 💃 Fun rhythm-based dance mini-game
- 🛍️ Shopping experience with gift-giving mechanics
- 🕉️ Peaceful temple visit with interactive elements
- 🍽️ Cafe date with dialogue choices
- 🌌 Romantic stargazing ending
- 🎵 Immersive background music and sound effects
- 🎨 Stunning visuals with smooth animations
- 📱 Fully responsive design that works on desktop and mobile

## Technologies Used

- HTML5 Canvas for rendering
- JavaScript (ES6+) for game logic
- TailwindCSS for UI components
- GSAP for animations
- Howler.js for audio management
- Vite for development server and building

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dream-date-journey.git
   cd dream-date-journey
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## How to Play

- Use arrow keys to move your character
- Press SPACE to interact with objects and characters
- Make dialogue choices to progress the story
- Complete mini-games to increase your relationship level
- Manage your energy and mood stats throughout the date

## Project Structure

```
dream-date-journey/
├── src/
│   ├── js/
│   │   ├── entities/       # Game entities (player, NPCs, etc.)
│   │   ├── scenes/         # Game scenes (longDrive, park, etc.)
│   │   ├── ui/             # UI components
│   │   ├── utils/          # Utility functions and helpers
│   │   └── game.js         # Main game class
│   ├── scss/               # Styles
│   └── assets/             # Game assets (images, audio, etc.)
├── index.html              # Main HTML file
├── package.json            # Project dependencies
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all the open-source libraries used in this project
- Special thanks to the game development community for inspiration and resources
