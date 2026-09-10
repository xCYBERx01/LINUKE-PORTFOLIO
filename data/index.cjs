// Desko Data — CommonJS fallback
const projects = require('./projects.json')
const bonusProjects = require('./bonusProjects.json')
const awards = require('./awards.json')
const contact = require('./contact.json')
const aboutStats = require('./aboutStats.json')
const GITHUB_USER = require('./GITHUB_USER.json')
const all = require('./all.json')

module.exports = { projects, bonusProjects, awards, contact, aboutStats, GITHUB_USER, all, PROJECTS: projects, PROJECTS_ALL: [...projects, ...bonusProjects] }
