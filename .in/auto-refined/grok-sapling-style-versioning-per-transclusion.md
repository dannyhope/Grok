# Sapling-style versioning per transclusion
**Done when:** Each transclusion maintains its own version history with branching, allowing users to navigate between past edits and create alternative versions.

## Context
- Depends on editable transclusions with diff/patch storage (see grok-make-right-dide-editable-including-show-diffs-feature.md)
- The diff/patch storage from v1 provides the foundation — graduate it to a full version graph
- Each transclusion would have its own lightweight version tree
- UI needed for navigating, branching, and comparing versions

## Auto-investigation
**Investigated:** 2026-02-09

### Findings
- Task requires detailed investigation during interactive refinement
- Context and codebase research needed to understand scope
- Auto-investigation performed as batch processing during `/refine auto`

### Scope
- To be determined during interactive refinement
- **Estimated complexity:** Unknown pending investigation

### Questions for refinement
1. **When someone edits one transclusion, should its past versions be separate from the past versions of every other transclusion?**
2. **What should someone be able to do with an older version?** For example, view it, restore it, compare it with the current version, or make a new branch from it.
3. **How should someone find a transclusion’s past versions?** For example, a history button on each transclusion or one history view for the whole document.
4. **What is the smallest useful first version of this feature?** Choose the first action to support: view, restore, compare, or create a branch.

### Dependencies
- To be determined
