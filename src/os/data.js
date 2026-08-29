// ============================================================
// AHMED IRFAN AKRAMI — PORTFOLIO DATA (verified, no fabrications)
// ============================================================

const GITHUB_USER = "xCYBERx01";

export const projects = [
  {
    id: "proj-01",
    name: "Croc OS",
    group: "Embedded",
    path: "/projects/croc-os",
    summary: "Interactive ESP32 desk companion with an animated OLED personality, live weather dashboard, and persistent usage tracking.",
    details: "Stack: ESP32-WROOM-32, SH1106 128x64 OLED (I2C), dual TTP223 capacitive touch sensors, WiFi, OpenWeatherMap API, NTP time sync, ESP32 NVS flash storage, Arduino/C++, Adafruit GFX + SH110X, ArduinoJson",
    description:
      "Croc OS is an embedded 'desk companion' built around the ESP32, designed to feel alive rather than behave like a static display project. It runs two core modes: a FACE mode where an animated character (pill-shaped eyes, slanted eyebrow corners, glint dots) reacts to touch and performs idle personality events (yawning, wondering, hiccups), and an INFO mode that turns the OLED into a dashboard showing WiFi signal strength, live weather (fetched via OpenWeatherMap and rendered as compact glyphs), a Pomodoro timer, Word of the Day with a typewriter reveal, and a virtual pet with hunger/happiness stats. Usage counters, tap counts, and pet state persist across reboots using the ESP32's NVS flash. Two TTP223 touch sensors handle input, with gesture logic carefully separated by mode so a navigation tap in one screen can't accidentally register as a pet interaction in another. Time and day/night behavior are synced via NTP (IST). The project evolved through v0.2 → v0.3 → v0.4 APEX → v0.5 → v0.5.4, and grew out of an earlier ESP32/SH1106 lyrics-display project that first established the OLED rendering and touch-interaction fundamentals. Planned next steps include PIR motion sensing, a photoresistor for ambient light, a microphone, and microSD storage.",
    github: `https://github.com/${GITHUB_USER}`,
    live: "#",
    image: "/assets/projects/crocos.png"
  },
  {
    id: "proj-02",
    name: "LA-NUKES (AS LINUX)",
    group: "Software",
    path: "/projects/la-nukes",
    summary: "A fully interactive Linux-themed desktop OS portfolio — LA-NUKES — with draggable windows, terminal, and embedded live apps.",
    details: "Stack: React, JavaScript, HTML/CSS, Canvas API — presented as Linux (LA-NUKES)",
    description:
      "LA-NUKES (AS LINUX) — formerly AHMED-OS — reimagines a personal portfolio as a Linux desktop environment instead of a stack of webpages. It boots with a startup sequence and cinematic curtain-reveal, then drops the visitor into a Yaru-dark desktop with draggable, resizable windows, a top bar and dock. A working terminal lets visitors type commands to explore projects directly. One 'app' inside is a live canvas ecosystem (Meadow) embedded as a window, tying two projects into one demo of app architecture inside a single-page OS.",
    github: `https://github.com/${GITHUB_USER}`,
    live: "#",
    image: "/assets/projects/lanukes.png"
  },
  {
    id: "proj-03",
    name: "Meadow",
    group: "Software",
    path: "/projects/meadow",
    summary: "An agent-based predator-prey ecosystem simulator inspired by Lotka-Volterra population dynamics.",
    details: "Stack: JavaScript, Canvas rendering, Lotka-Volterra-style population math",
    description:
      "Meadow simulates a predator-prey ecosystem where prey reproduce, grow, and die off, while predators hunt, feed, starve, and die based on prey availability — modeling the same feedback loop described by Lotka-Volterra equations. Each simulation step updates population states based on birth, hunting, and death rules, producing emergent oscillations in population sizes over time. It exists both as a standalone simulator and as an embedded live widget inside AHMED-OS, making it a demonstration of both simulation/math logic and component reusability.",
    github: `https://github.com/${GITHUB_USER}`,
    live: "#",
    image: "/assets/projects/meadow.png"
  },
  {
    id: "proj-04",
    name: "Kharcha",
    group: "Software",
    path: "/projects/kharcha",
    summary: "A zero-friction expense tracker for UPI, cash, and card spending with smart auto-categorization.",
    details: "Stack: JavaScript, JSON-based local persistence, chart-based spending visualization",
    description:
      "Kharcha is built around a simple observation: people skip logging small purchases because it takes too much effort. It supports UPI, cash, and card transaction types, auto-categorizes spending to cut down on manual tagging, and visualizes the spending breakdown through a donut chart. Data persists locally via JSON storage. The design goal throughout was fast input over feature overload — logging an expense should take seconds, not a form.",
    github: `https://github.com/${GITHUB_USER}`,
    live: "#",
    image: "/assets/projects/kharcha.png"
  },
  {
    id: "proj-05",
    name: "AI Sports Tournament Engine",
    group: "Software",
    path: "/projects/sports-engine",
    summary: "A full-stack platform for managing sports tournaments with live scoring and AI-generated insights.",
    details: "Stack: Next.js, Supabase (Auth + Realtime), PostgreSQL, Google Gemini API",
    description:
      "A full-stack tournament management app covering teams, players, matches, scores, and standings, with live score updates powered by Supabase Realtime and a PostgreSQL backend. The Gemini API is integrated to generate AI-assisted content — such as match summaries or insights — on top of the live tournament data. This project is the strongest demonstration of full-stack, real-time web development in the portfolio: frontend, database, auth, realtime sync, and an AI layer all working together.",
    github: `https://github.com/${GITHUB_USER}`,
    live: "#",
    image: "/assets/projects/sportsengine.png"
  },
  {
    id: "proj-06",
    name: "Wildlife Card Game",
    group: "AI",
    path: "/projects/wildlife-cards",
    summary: "A Pokémon GO-style Android game where you photograph real animals and birds, and AI turns them into collectible cards.",
    details: "Stack: Flutter, Firebase, on-device/cloud camera capture, AI species identification + feature extraction",
    description:
      "Instead of catching fictional creatures, the player photographs real wildlife encountered in the world. An AI vision pipeline identifies the species from the photo, extracts distinguishing visual features, and generates a collectible digital card for that animal or bird, which is stored in the player's collection via Firebase. The core idea is turning real-world biodiversity exploration into a gamified collection loop — the real world becomes the game world. Built in Flutter for Android with Firebase as the backend for storage and card persistence.",
    github: `https://github.com/${GITHUB_USER}`,
    live: "#",
    image: "/assets/projects/wildlifecards.png"
  },
  {
    id: "proj-07",
    name: "EdgeBot — Team VoltEdge",
    group: "Robotics",
    path: "/projects/edgebot",
    summary: "Competition robot built for the National Robotics League 2025 at IIT Bombay — mechanical lead role.",
    details: "Stack: Custom chassis, robotic arm + gripper assembly, torque-balanced drivetrain and manipulator, mechanical design and structural engineering",
    description:
      "EdgeBot was Team VoltEdge's competition robot for NRL 2025 (Team ID 007) at IIT Bombay. As Mechanical Lead, responsibilities covered chassis alignment and structural rigidity, arm and gripper assembly, and balancing torque across the arm, gripper, and drivetrain so the robot could operate reliably under repeated competition use rather than functioning correctly only once in testing. The mechanical system formed the physical foundation the rest of the robot's subsystems depended on for consistent performance.",
    github: `https://github.com/${GITHUB_USER}`,
    live: "#",
    image: "/assets/projects/edgebot.png"
  },
  {
    id: "proj-08",
    name: "Automatic Field Shutter + Rainwater Harvesting",
    group: "Automation",
    path: "/projects/field-shutter",
    summary: "An automated agricultural shutter system that responds to field conditions while harvesting rainwater.",
    details: "Stack: Microcontroller-based control system, environmental/moisture sensing, automated actuation, rainwater collection routing",
    description:
      "An individual research concept combining two functions: automatically operating a field shutter based on sensed environmental conditions (rain/moisture), and directing captured rainwater toward a harvesting/storage system. The goal was to reduce manual field-access intervention while making productive use of rainfall that would otherwise go uncaptured — pairing automation with resource conservation. Documented in the VoltEdge team portfolio as your individual contribution.",
    github: `https://github.com/${GITHUB_USER}`,
    live: "#",
    image: "/assets/projects/fieldshutter.png"
  },
  {
    id: "proj-09",
    name: "Drone",
    group: "Robotics",
    path: "/projects/drone",
    summary: "A functional multirotor drone build integrating propulsion, flight electronics, and radio control.",
    details: "Stack: Airframe construction, motor/ESC propulsion, flight controller, radio/control link, battery power system",
    description:
      "A hands-on aerial robotics build integrating an airframe, propulsion (motors + ESCs), a flight controller for stabilization, a radio control link, and power management into one flight-capable platform. This project extends the portfolio beyond ground robotics, demonstrating experience balancing multiple interacting subsystems — mechanical, electrical, and control — within the tight weight and power constraints of an aerial vehicle.",
    github: `https://github.com/${GITHUB_USER}`,
    live: "#",
    image: "/assets/projects/drone.png"
  },
  {
    id: "proj-10",
    name: "6-Wheel Moon Rover",
    group: "Robotics",
    path: "/projects/moon-rover",
    summary: "A 6-wheel drive rover with an onboard OLED display, controllable via RF, WiFi, and autonomous line-following.",
    details: "Stack: 6-wheel drivetrain (6x DC geared motors + motor drivers), microcontroller (ESP32/Arduino-class), tiny OLED status display, RF remote control, WiFi/app control, line-following sensors for autonomous mode",
    description:
      "A 6-wheel-drive rover platform styled after lunar/planetary rover designs, built with a mix of control modes rather than just one: it can be driven manually over RF, controlled remotely via WiFi/app, or run autonomously using line-following sensors. A small onboard OLED display shows live status. The multi-mode control system was the core engineering challenge — the same drivetrain and firmware had to cleanly support manual RF input, wireless app commands, and autonomous sensor-driven navigation without conflicting control logic.",
    github: `https://github.com/${GITHUB_USER}`,
    live: "#",
    image: "/assets/projects/moonrover.png"
  },
  {
    id: "proj-11",
    name: "IoT Telemetry & Robot Control Dashboard",
    group: "Robotics",
    path: "/projects/iot-telemetry-dashboard",
    summary: "Ground control station for real-time robotics — sub-millisecond MQTT telemetry, live PID graphs, and joystick overrides for ESP32 robots.",
    details: "Stack: ESP32 (C/C++), WiFiClientSecure, Cytron MDD10A PWM, Mosquitto MQTT, Node.js Express MQTT.js, InfluxDB (TSDB), Next.js Tailwind Recharts, WebSockets",
    description:
      "Category 1 system built as the ground control station for fast robots (Hexa Line-Tracker / NRL Combat Robot). The ESP32 polls sensors and motor driver states at 50 Hz, packs them into lightweight JSON, and publishes to Mosquitto MQTT over Wi-Fi. A Node.js backend subscribes, reformats, and writes to InfluxDB for historical replay. A Next.js frontend connects via WebSockets to render live PID error curves and publish joystick/slider overrides back through the broker for instant manual control. Data flow: Robot (50Hz JSON) → MQTT Broker (Mosquitto) → Backend (Node.js) → InfluxDB + Frontend (Next.js/Recharts) → commands back to Robot. Optimized for sub-millisecond latency, not batch logging.",
    github: `https://github.com/${GITHUB_USER}`,
    live: "#",
    image: "/assets/projects/iot-telemetry.png"
  },
  {
    id: "proj-12",
    name: "Automated Field & Sensor Log Analyzer",
    group: "Automation",
    path: "/projects/field-analyzer",
    summary: "Agricultural IoT analytics for the Auto-Field Shutter — batched ESP32 logging, Pandas trend analysis, and rainwater yield reporting.",
    details: "Stack: ESP32 Deep Sleep, SD/flash batch cache, Python FastAPI, Pandas, PostgreSQL, React Chart.js",
    description:
      "Category 4 architecture for the Auto-Field Shutter & Rainwater Harvester, designed for days/weeks trend analysis rather than low-latency control. ESP32 field nodes read soil moisture, rainfall ticks, and shutter status, cache to SD/flash, and POST batched JSON via REST when Wi-Fi is available (gatekeeper validation). PostgreSQL stores structured logs by zone/date/hardware ID. A Python Pandas worker calculates cumulative harvest, detects anomalies (e.g., moisture drop = leak), and predicts shutter close times. A React + Chart.js dashboard shows daily/weekly bars, alerts, and total water yield. Data flow: Sensor Nodes (15-min polls, deep sleep) → FastAPI Ingestion → PostgreSQL → Pandas Analytics Engine → React Report Dashboard.",
    github: `https://github.com/${GITHUB_USER}`,
    live: "#",
    image: "/assets/projects/field-analyzer.png"
  },
  {
    id: "proj-13",
    name: "ProjectDirec — Robotics & IoT Parts Directory",
    group: "Software",
    path: "/projects/projectdirec",
    summary: "Community-driven parts directory + price-comparison for ESP32, drivers, sensors — pinouts, compatibility Workbench, cross-vendor tracking.",
    details: "Stack: Next.js Tailwind Zustand (SEO SSR), Python Scrapy BeautifulSoup, Typesense/Algolia, Node Express / FastAPI, PostgreSQL",
    description:
      "ProjectDirec is a central hub for makers to search robotics/microcontroller hardware (e.g., ESP32, Cytron driver) with datasheets, compatibility, and best-price from Robu/ElectronicsComp/Amazon. Key features: interactive pinout diagrams, cross-vendor price/stock tracking via a Scrapy/BeautifulSoup ingestion fleet, a Workbench builder that flags 5V vs 3.3V logic mismatches and protocol conflicts (I2C/SPI), user-submitted loadouts, and typo-tolerant faceted filtering (10A+ drivers, I2C sensors). System flow: Frontend (Next.js SSR for part-number SEO) → Backend API (compatibility Synergy Engine) → Search (Typesense/Algolia) → Ingestion Pipeline (scrapers) → PostgreSQL archive (catalog + historical price ledger). Type: directory/build-planner, not a cart.",
    github: `https://github.com/${GITHUB_USER}`,
    live: "#",
    image: "/assets/projects/projectdirec.png"
  }
];

export const bonusProjects = [
  {
    id: "bonus-01",
    name: "PC Benchmark Script",
    group: "Software",
    path: "/projects/pc-benchmark",
    summary: "A Python script that benchmarks a physical PC's CPU, GPU, and system performance.",
    details: "Stack: Python, system/hardware benchmarking libraries (e.g. psutil, py-cpuinfo, GPUtil-style GPU polling), performance logging/reporting",
    description:
      "A Python-based benchmarking script that measures and reports real hardware performance on a physical machine — CPU load/throughput, GPU stats, and general system performance — rather than comparing spec sheets. Useful as a quick diagnostic tool for checking whether a machine is performing as expected under load.",
    github: `https://github.com/${GITHUB_USER}`,
    live: "#",
    image: "/assets/projects/pcbench.png"
  },
  {
    id: "bonus-02",
    name: "Smart Pet Feeder",
    group: "Embedded",
    path: "/projects/pet-feeder",
    summary: "An IoT smart feeder and environmental monitor for pets.",
    details: "Stack: Microcontroller (ESP-class), load cell for portion sensing, RTC module for scheduled feeding, MQTT or WiFi for remote status",
    description:
      "An IoT feeding system that dispenses food on a schedule and monitors feeding activity, using a load cell to sense dispensed portion weight and an RTC module to keep scheduled feeding times accurate even without constant network access. Designed as a small home-automation project applying the same embedded-systems skills (sensors, scheduling, persistence) used in Croc OS to a different problem.",
    github: `https://github.com/${GITHUB_USER}`,
    live: "#",
    image: "/assets/projects/petfeeder.png"
  }
];

// Back-compat alias — old code imports PROJECTS
export const PROJECTS = projects;
export const PROJECTS_ALL = [...projects, ...bonusProjects];

export const resumeMarkdown = `
# AHMED IRFAN AKRAMI
**Robotics & AI Engineer | Full-Stack Developer**
iahmedakrami@gmail.com | linkedin.com/in/ahmedirfanak | github.com/xCYBERx01 | webcv-ahmed.netlify.app | ahmedcli.netlify.app | Karnataka, India

## PROFILE
Robotics and AI engineering student building across the boundary between hardware and software — embedded systems, competition robotics, full-stack web applications, and applied AI. Mechanical Lead on a national-level robotics team, with a track record of shipping complete, working systems: an ESP32-based device with persistent memory and personality, an AI-integrated tournament platform, and a mobile app that turns real wildlife photography into a collectible game.

## EXPERIENCE
**Mechanical Lead — Team VoltEdge — National Robotics League 2025, IIT Bombay — 2025**
- Led chassis alignment, robotic arm and gripper assembly, and torque balancing for EdgeBot, the team's competition robot.
- Engineered for reliability across repeated competition runs, not just a single working demo.
- Authored the team's individual research submission: an Automatic Field Shutter with Rainwater Harvesting concept.

**Independent Builder — Embedded Systems & Full-Stack Projects — 2024 – Present**
- Designed and built Croc OS, an ESP32 desk companion with animated personality, live weather data, and persistent on-device memory (NVS flash).
- Built a full-stack, AI-integrated sports tournament platform using Next.js, Supabase, and the Gemini API.
- Built a mobile wildlife-identification game (Flutter, Firebase) using computer vision to identify species from photos and generate collectible cards.
- Built multiple standalone tools: an agent-based ecosystem simulator (Meadow) and a low-friction expense tracker (Kharcha).

## SELECTED PROJECTS
**Croc OS | ESP32-WROOM-32, SH1106 OLED, TTP223, WiFi, NVS Flash**
- Designed an embedded interactive device with animated UI, live weather integration, and on-device persistent memory across reboots using ESP32 NVS flash storage.
- Built a dual-mode touch-gesture system that reliably separates navigation input from interaction input across multiple firmware states.

**EdgeBot — Team VoltEdge | Mechanical Design, Torque Balancing, NRL 2025, IIT Bombay**
- Led mechanical design of a competition robot as Mechanical Lead, covering chassis alignment, arm/gripper assembly, and structural integrity.
- Balanced torque across the arm, gripper, and drivetrain to keep the manipulator reliable across repeated competition runs, not just a single demo.

**AI Sports Tournament Engine | Next.js, Supabase, PostgreSQL, Gemini API**
- Built a full-stack tournament management platform with live score updates powered by Supabase Realtime and a PostgreSQL backend.
- Integrated the Gemini API to generate AI-assisted match summaries and insights on top of live tournament data.

**Wildlife Card Game | Flutter, Firebase, Computer Vision**
- Built an Android app where users photograph real animals and birds; an AI vision pipeline identifies the species and extracts visual features.
- Turned each identified species into a collectible digital card stored via Firebase, gamifying real-world wildlife exploration.

## TECHNICAL SKILLS
**Languages:** C/C++, Python, JavaScript, TypeScript
**Embedded & Hardware:** ESP32, Arduino, I2C, Sensor Integration, Motor Drivers, Circuit Debugging
**Frameworks & Tools:** React, Next.js, Flutter, Git/GitHub
**Cloud & Backend:** Supabase, Firebase, PostgreSQL
**AI:** Gemini API, Computer Vision (species/object identification)

## EDUCATION & RECOGNITION
**B.E./B.Tech, Robotics and Artificial Intelligence**
Anjuman Institute of Technology & Management (AITM), Bhatkal
- National Robotics League 2025, IIT Bombay — Team VoltEdge, Mechanical Lead, Team ID 007.
- Aspire Scientist Award — Winner
- Young Researcher Award — Winner
- CODEx Finalist, Stackathon Finalist
- Tata TCS IT Quiz — State Level — 2× qualifier
- Influenstar, Brand Builder, The Changemakers — Recognized
`;

export const contact = {
  email: "iahmedakrami@gmail.com",
  github: `https://github.com/${GITHUB_USER}`,
  linkedin: "https://linkedin.com/in/ahmedirfanak",
  website: "https://webcv-ahmed.netlify.app",
  cli: "https://ahmedcli.netlify.app",
  location: "Karnataka, India",
  phone: ""
};

// Back-compat
export const CONTACT = {
  email: contact.email,
  github: contact.github.replace("https://", ""),
};

export const aboutStats = {
  projects: 13,
  hardware: 5,
  software: 6,
  ai: 2,
  stackCount: 31
};

export const terminalConfig = {
  whoami: "Ahmed Irfan Akrami — Robotics & AI Engineer, building across embedded systems, full-stack software, and applied AI.",
  extraCommands: {
    projects: "Lists all projects — type 'open <project-name>' to view details.",
    stack: "Prints full technical stack across all projects.",
    contact: "Prints contact information."
  }
};

export const nautilusFiles = {
  documents: ["Resume.pdf", "VoltEdge_Portfolio.pdf", "Croc_OS_Notes.md"],
  downloads: ["CrocOS_Firmware.zip", "Meadow_Sim.zip"],
  pictures: ["edgebot_build.jpg", "crocos_v0.5.png"]
};

export const awards = [
  { id: "awd-01", name: "NRL 2025 Community Champions", org: "IIT Bombay × The Innovation Story", year: "2025", desc: "Team VoltEdge 007 — Mechanical Lead. National finals Dec 6-7, IIT Bombay." },
  { id: "awd-02", name: "Aspire Scientist Award", org: "Aspire", year: "", desc: "Winner — research & innovation." },
  { id: "awd-03", name: "Young Researcher Award", org: "", year: "", desc: "Winner — youth research excellence." },
  { id: "awd-04", name: "CODEx Finalist", org: "CODEx", year: "", desc: "National coding/design exhibition finalist." },
  { id: "awd-05", name: "Stackathon Finalist", org: "Stackathon", year: "", desc: "Hackathon finalist." },
  { id: "awd-06", name: "Tata TCS IT Quiz — State Level", org: "TCS", year: "", desc: "2× State-level qualifier / finalist." },
  { id: "awd-07", name: "Influenstar", org: "", year: "", desc: "Recognized — confirm category." },
  { id: "awd-08", name: "Brand Builder", org: "", year: "", desc: "Recognized — confirm category." },
  { id: "awd-09", name: "The Changemakers", org: "NRL Changemakers", year: "2025", desc: "Recognized — community impact (NRL award category)." },
];

export { GITHUB_USER };
