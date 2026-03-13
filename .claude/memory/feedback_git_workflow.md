---
name: git_pull_before_changes
description: Always pull from remote before making any code changes in both backend and frontend repos
type: feedback
---

Before making any changes to either repo, always run:

```bash
git pull origin main
```

in the current working directory.

This applies to ALL changes — code edits, new components, service updates, etc.
User explicitly asked for this after a session where stale local state caused confusion.

**Why:** Prior incident where stale local state caused merge conflicts and confusion.
**How to apply:** Run `git pull origin main` at the start of every session, before any edits.
