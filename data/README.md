# Desko Data — Portable Portfolio Data

Copy this `data/` folder into any other project. No build step needed.

## Files
- `projects.json` — 13 main projects (Croc OS, Desko, Meadow, Kharcha, AI Sports Engine, Wildlife Card Game, EdgeBot, Field Shutter, Drone, Moon Rover, IoT Telemetry, Field Analyzer, ProjectDirec)
- `bonusProjects.json` — 2 bonus (PC Benchmark, Pet Feeder)
- `awards.json` — 9 awards (NRL 2025 Community Champions, Aspire, Young Researcher, CODEx, Stackathon, TCS Quiz, Influenstar, Brand Builder, Changemakers)
- `contact.json` — email, github, linkedin, website, cli
- `resume.md` — full markdown resume (Ahmed Irfan Akrami)
- `aboutStats.json` — counts
- `all.json` — everything combined + `GITHUB_USER`

All `github` fields already resolved to `https://github.com/xCYBERx01`. Images are `/assets/projects/*.png`.

## Use

### JavaScript / React / Next.js / Vite
```js
import projects from './data/projects.json' with { type: 'json' }
import awards from './data/awards.json' with { type: 'json' }
import contact from './data/contact.json' with { type: 'json' }

// or via helper
import { projects, awards, contact } from './data/index.js'
```

### Node (CommonJS)
```js
const projects = require('./data/projects.json')
```

### Python
```py
import json, pathlib
projects = json.loads(pathlib.Path('data/projects.json').read_text(encoding='utf-8'))
awards = json.loads(pathlib.Path('data/awards.json').read_text(encoding='utf-8'))
```

### Copy to another repo
```bash
cp -r data /path/to/other-project/
# or as git subtree
```

Source: `src/os/data.js` in Desko (`C:\Users\ahmed\ahmed-os - Copy\src\os\data.js:1`). This folder is the single source of truth — `src/os/data.js` now re-exports from here.
