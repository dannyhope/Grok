# Sapling-style versioning per transclusion
**Done when:** Each transclusion maintains its own version history with branching, allowing users to navigate between past edits and create alternative versions.

## Context
- Depends on editable transclusions with diff/patch storage (see grok-make-right-dide-editable-including-show-diffs-feature.md)
- The diff/patch storage from v1 provides the foundation — graduate it to a full version graph
- Each transclusion would have its own lightweight version tree
- UI needed for navigating, branching, and comparing versions
