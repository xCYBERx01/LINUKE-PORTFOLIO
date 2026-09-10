// ============================================================
// AHMED IRFAN AKRAMI — PORTFOLIO DATA (single source: /data)
// Edit /data/*.json and this file re-exports for the OS.
// For other projects, just copy the /data folder.
// ============================================================

import projects from '../../data/projects.json' with { type: 'json' }
import bonusProjects from '../../data/bonusProjects.json' with { type: 'json' }
import awards from '../../data/awards.json' with { type: 'json' }
import contact from '../../data/contact.json' with { type: 'json' }
import aboutStats from '../../data/aboutStats.json' with { type: 'json' }
import GITHUB_USER from '../../data/GITHUB_USER.json' with { type: 'json' }
import resumeMarkdownRaw from '../../data/resume.md?raw'

// Re-export (keeps old import paths working)
export { projects, bonusProjects, awards, contact, aboutStats, GITHUB_USER }
export const PROJECTS = projects
export const PROJECTS_ALL = [...projects, ...bonusProjects]
export const resumeMarkdown = resumeMarkdownRaw

export const CONTACT = {
  email: contact.email,
  github: contact.github.replace('https://', ''),
}

export const terminalConfig = {
  whoami: 'Ahmed Irfan Akrami — Robotics & AI Engineer, building across embedded systems, full-stack software, and applied AI.',
  extraCommands: {
    projects: 'Lists all projects — type \'open <project-name>\' to view details.',
    stack: 'Prints full technical stack across all projects.',
    contact: 'Prints contact information.',
  },
}

export const nautilusFiles = {
  documents: ['Resume.pdf', 'VoltEdge_Portfolio.pdf', 'Croc_OS_Notes.md'],
  downloads: ['CrocOS_Firmware.zip', 'Meadow_Sim.zip'],
  pictures: ['edgebot_build.jpg', 'crocos_v0.5.png'],
}
