Build a complete, single-file, mobile-first **Progressive Web App (PWA)** kids' memory card matching game titled **"Joey & Alina's Super Match"** using HTML5, Tailwind CSS (via CDN), vanilla JavaScript, inline custom SVG illustrations, and the Web Audio API (no external audio or image URLs).

### 1. Progressive Web App (PWA) & Offline Support
- Make the single HTML file fully installable on mobile home screens (iOS Safari & Android Chrome) as a standalone app (`display: "standalone"`, `orientation: "portrait"`).
- Dynamically generate a custom SVG app icon (rainbow/sky gradient with a thick-outlined gold coin and star), attach it to `<link rel="apple-touch-icon">` and a dynamically generated `Blob` Web App Manifest (`<link rel="manifest">`), and register an inline Service Worker via `Blob` URL for offline caching.
- Include an install helper banner on the lobby screen that triggers `beforeinstallprompt` on Android/Chrome or shows `"Tap Share → Add to Home Screen"` instructions on iOS Safari when not already running in standalone mode.

### 2. Visual Aesthetic: Saturday-Morning Cartoon Style
- **Color Palette & Background:** Vibrant sunny cartoon world with a sky-to-pastel gradient (`#38bdf8` → `#7dd3fc` → `#fef08a` → `#fbcfe8`), an animated spinning smiling sun, a pastel rainbow arc, drifting puffy outlined clouds, twinkling 4-point cartoon stars, and rolling green/mint cartoon hills along the bottom.
- **Cartoon Ink & 3D Depth:** Use thick dark-navy ink outlines (`3.5px solid #1e1b4b`), hard offset drop shadows (`0 6px 0 #1e1b4b`), squishy 3D press physics on buttons, and Google Fonts (`Titan One` with `-webkit-text-stroke: 2px #1e1b4b` for chunky titles, `Fredoka` for headers, and `Nunito` for body text).
- **Cards:** Smooth 3D `rotateY(180deg)` flip animations. Card backs feature a purple/pink rainbow polka-dot gradient with a glossy top shine and a yellow circular `?` badge. Card fronts have glossy highlights, team color borders/gradients (sky-blue for Blue Team, bubblegum-pink for Pink Team), a `🔵` or `🩷` corner badge, custom illustrated SVG artwork, and the character's name.

### 3. Players, Live Selfie Booth & Lobby Controls
- **Two Editable Players:** Default to **"Joey"** (Blue Team) and **"Alina"** (Pink Team), with editable name inputs and persistent lifetime star counters (`⭐ Stars`) saved in `localStorage`.
- **Selfie Camera & Sticker Booth:** Tapping either player's avatar opens a modal supporting live front-facing camera capture (`getUserMedia` mirrored), photo file upload, or a cute default cartoon SVG avatar. Include selectable wearable stickers (`None`, `🦖 Dino`, `👑 Crown`, `🐰 Bunny`, `🤠 Cowboy`) that preview live and bake onto the circular avatar canvas.
- **High-Contrast Lobby Selectors:** Ensure both selected and unselected buttons have rich, clearly visible pastel fills with dark outlines:
  - **Who is Playing?:** `👫 Together` (2-player alternating turns), `👦 Joey Solo`, `👧 Alina Solo` (sky-blue palette).
  - **Board Size:** `🐣 Easy (8)`, `🌟 Med (12)`, `🚀 Hard (16)`, `👑 Super (20)` (warm amber palette).
  - **Card Deck:** `🎨 Mixed All` (balanced even split of Blue and Pink pairs so the board is always 100% clearable), `🦖 Joey's` (Blue deck), `🎀 Alina's` (Pink deck) (lavender/pink palette).

### 4. Custom Illustrated SVG Character Decks
- **Blue Team Cards:** T-Rex, Stego, Blue Pup (Bluey-inspired), Penguin, Space Ranger (Buzz-inspired), Space Alien (Toy Story three-eyed alien).
- **Pink Team Cards:** Bow Kitty (Hello Kitty-inspired), Princess Tiara, Pink Castle, Bunny with Carrot, Cowgirl Hat (Jessie-inspired), Rainbow Unicorn.

### 5. Asymmetric Team Scoring & Flip-Back Mechanics
- **Exact Picture Match:** Cards stay matched face-up, trigger mini confetti and a comic starburst popup (`POW! +4` or `SUPER! +3`), and award a **bonus turn** in 2-player mode:
  - Active player matches an exact pair of their **own team color** = **+4 points**.
  - Active player matches an exact pair of the **other team color** = **+3 points**.
- **Color-Only Match (Different Pictures, Same Color):** Awards points once per unique card-pair combination (preventing repeat point-farming), shows a comic popup (`NICE! +2` or `COOL! +1`), and **flips both cards back face-down** after a short pause so all exact picture pairs can still be found to clear the board, then passes the turn:
  - Active player matches two different cards of their **own team color** = **+2 points**.
  - Active player matches two different cards of the **other team color** = **+1 point**.
- **Mismatch (Different Colors):** **0 points**, cards flip back face-down, turn passes.
- Display a live dynamic scoring banner and bottom legend that updates on every turn to show the active player's exact point values.

### 6. Mum's Passcode Gate & Countdown Timer Cutoff
- **First-Play Passcode Lock:** Clicking **PLAY GAME!** for the first time prompts for Mum's alphanumeric passcode (default `1234`, case-insensitive). **`ruie`** must always work as a permanent master passcode alongside Mum's customizable passcode.
- **Secret Parent Controls (`🔒 Mum` button in header, tap or 2.2s hold):**
  - Set or adjust the session countdown timer in minutes (`Lock / 0m`, `5m`, `10m`, `15m`, `30m`, `-1 Min`, `+2 Mins`).
  - Toggle Web Audio synthesized cartoon sound effects ON/OFF, reset lifetime stars, or change Mum's alphanumeric passcode.
- **Progressive Warnings & Hard Cutoff:**
  - Show a live `⏱️ Time Left: MM:SS` pill in the top header.
  - Trigger progressive audio/toast alerts at **1 minute left** (amber pill), **30 seconds left**, and a **10-to-1 second countdown** (pulsing red pill).
  - When the timer reaches `00:00`, **immediately end the session regardless of whether a game is currently in progress** (cancelling pending card timers and closing modals), and display a sleepy night-sky **"TIME'S UP!"** screen showing both kids' final scores, lifetime stars, **"Please hand the phone back to Mum!"**, and a `🔒 Mum's Unlock` link.
- Never use browser `alert()` or `confirm()` dialogs; use custom modals and floating toast banners instead.