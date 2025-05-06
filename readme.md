# 🦟 Mosquito Manifesto

## Introduction

**Mosquito Manifesto** is a narrative-driven political simulator game where you lead a small, newly-formed party through a fictional yet familiar political landscape. Manage candidates, volunteers, public image, and resources while navigating events, scandals, and elections.

Your strategy and storytelling shape public perception, party growth, and election results over time. The simulation emphasizes cause-and-effect, emergent consequences, and reactive gameplay without sacrificing immersion.

---

## Game Loop

Each month, the simulation processes:

- National and local events
- Shifts in voter sentiment and demographics
- Player actions (e.g. outreach, media, recruitment)
- Internal party changes (resource use, morale)
- World state changes (e.g. economic drift, scandals)

During campaign season, the loop advances daily instead of monthly, giving tighter control over political maneuvers, outreach, and election preparations.

---

## Roadmap

- [x] Set up project folder structure with `frontend/` (Electron + TS) and `backend/` (Node.js + TS)
- [x] Initialize `git` and install required dependencies
- [ ] Define CSV schemas for `people`, `parties`, `electorate`, `elections`, `towns`, and `gamestate`
- [ ] Define JSON schema for append-only event logs
- [ ] Create `types.ts` with shared TypeScript types
- [ ] Implement CSV and JSON savers/loaders for each file
- [ ] Implement append-only JSON logger and CRUD meta-log
- [ ] Seed initial world state: electorate, towns, parties, and people
- [ ] Build core game loop: monthly state progression, event processing, player action execution
- [ ] Add mock LLM integration for early event content generation
- [ ] Implement UI shell: basic frontend to visualize game state and interact with core systems
- [ ] Add candidate and volunteer management features
- [ ] Simulate campaign period
- [ ] Implement election simulation with vote counting and results
- [ ] Implement real LLM API handling with structure-aware calls
- [ ] Add CSV update tracing and historical diffs from LLM-generated events
- [ ] Expand frontend to include campaign interactions and result dashboards
- [ ] Create bootstrapping process to add contextual events to the world state
- [ ] Polish UI
