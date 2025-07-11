MoonKnight-3D-Profile
A modern, single-page website showcasing Moon Knight, featuring a 3D model viewer with orbit controls and detailed character information. Built with HTML, CSS, Three.js, and GLTFLoader, it offers a clean, aesthetic design with a lunar-themed dark background, inspired by Marvel Comics' Moon Knight.
Features

3D Model Viewer: Interactive Moon Knight model with orbit controls (rotation via mouse/touch drag).
Character Profile: Sections for bio, key characteristics, and story, styled with elegant typography (Cinzel and Inter).
Aesthetic Design: Deep black background, pulsing moon gradient, twinkling stars, and a fixed header.
Responsive Layout: Two-column design (model on left, info on right) that stacks vertically on mobile devices.

Setup

Clone the Repository:git clone https://github.com/your-username/MoonKnight-3D-Profile.git
cd MoonKnight-3D-Profile


Serve the Files:
Use a local server (e.g., VS Code Live Server, or python -m http.server 8000) to view the site, as Three.js requires a server to load the GLTF model.
Alternatively, open index.html directly in a browser, but note that the GLTF model may not load due to CORS restrictions (fallback model will display).


Dependencies:
The project uses external CDNs for Three.js (r128) and GLTFLoader.
Ensure an internet connection or host the libraries locally if needed.


Model File:
Place your scene.gltf (or equivalent GLTF/GLB file) in the project root. If absent, a fallback geometric model is used.



File Structure
MoonKnight-3D-Profile/
├── index.html        # Main HTML file
├── style.css         # Styles for layout, typography, and animations
├── script.js         # Three.js logic for 3D model rendering and orbit controls
└── README.md         # Project documentation

Usage

Open the website in a browser via a local server.
Rotate the 3D model using mouse drag or touch gestures.
Scroll the right column to view Moon Knight’s bio, characteristics, and story.

Notes

The model is not zoomable; only orbit controls are enabled for a stable view.
For production, consider hosting the GLTF model and libraries locally to avoid CDN dependency.
Ensure the GLTF model (scene.gltf) is optimized for web use to reduce load times.

Credits

Built with Three.js and GLTFLoader.
Inspired by Marvel Comics' Moon Knight character.
Fonts: Cinzel and Inter from Google Fonts.

License
This project is for educational and demonstration purposes, inspired by Marvel Comics. Ensure proper licensing for any assets (e.g., GLTF model) used in production.
