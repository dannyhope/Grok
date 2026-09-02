grok- introduce projects – a project has 0 or more input files, an input file can have 0 or more output versions an output version stores all of its stantes (think sapling style infinite undo and branching)

## Auto-investigation
**Investigated:** 2026-02-09

### Findings
- This is a **feature idea** to add project/file management to Sapling's version control model
- Current Sapling: Single textarea with version control (branches, undo/redo, timeline)
- Proposed: Multi-file project structure where each file has its own Sapling-style version history
- Architecture shift: From single-document versioning to project-based multi-document versioning
- Typo: "stantes" should probably be "states"
- Similar to VS Code's workspace concept or Git's multi-file tracking

### Scope
- **This would be a major feature graduation** — likely needs its own project directory in `.in/`
- **Files likely needing changes:**
  - New: `projectManager.js` — Manage projects, files, switching between files
  - New: UI for file tree/list sidebar
  - Modify: `versionControl.js` — Support multiple file instances or project-level versioning
  - Modify: `app.js` — Initialise project structure, not just single textarea
  - Modify: `index.html` — Add file navigation UI
  - New: `storageManager.js` — Store/load multi-file projects (currently persistence is disabled)
- **Estimated complexity:** Large (architectural change, multi-session implementation)

### Questions for refinement
1. **When someone edits a file, should they see only that file’s history, or one history for the whole project?**
2. **What should happen when someone adds, removes, or renames a file?** For example, should the action be undoable?
3. **Where should projects be saved?** Choose one for the first version: this browser on this device, files on the device, or an online account.
4. **Should Grok become a multi-file tool, or should it stay focused on one file?**
5. **If it becomes a multi-file tool, should this be a separate product rather than a change to Grok?**

### Dependencies
- May conflict with current single-document architecture
- Would require re-enabling and expanding storage (currently disabled)
