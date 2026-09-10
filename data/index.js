// Desko Data — ESM entry for other projects
// Usage: import { projects, awards, contact } from './data/index.js'

import projects from './projects.json' with { type: 'json' }
import bonusProjects from './bonusProjects.json' with { type: 'json' }
import awards from './awards.json' with { type: 'json' }
import contact from './contact.json' with { type: 'json' }
import aboutStats from './aboutStats.json' with { type: 'json' }
import GITHUB_USER from './GITHUB_USER.json' with { type: 'json' }
import all from './all.json' with { type: 'json' }

export { projects, bonusProjects, awards, contact, aboutStats, GITHUB_USER, all }
export const PROJECTS = projects
export const PROJECTS_ALL = [...projects, ...bonusProjects]
export default all

// For Vite/Node <22 without `with` support, fallback:
// import projects from './projects.json' assert { type: 'json' }
