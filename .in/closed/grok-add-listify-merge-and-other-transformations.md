# Add listify, merge, and other paragraph transformations
Paragraph transformation operations for the restructured panel beyond split.

## Potential operations
- **Listify** — convert a paragraph into a list
- **Merge** — combine adjacent paragraphs
- Other operations can be added later once the first two are tested.

## Context
- Split has its own task (see grok-add-listify-split-etc.md)
- All transformations should maintain relationships to source text

## Questions for refinement
1. **Which operation should be built first after Split: Listify or Merge?**
2. **When someone changes a paragraph, should the original source stay unchanged and the new result appear in the restructured panel?**
3. **If a transformation cannot be applied, what should the person see?** For example, a short explanation beside the action.
4. **Which other transformation would be most useful after Listify and Merge?** Please name one concrete operation.
