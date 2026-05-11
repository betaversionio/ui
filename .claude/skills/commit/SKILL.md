---
name: commit
description: Create a git commit with gitmoji convention
disable-model-invocation: true
argument-hint: "[optional commit message hint]"
allowed-tools:
  - Bash
  - Glob
  - Grep
  - Read
---

Create a git commit following these rules:

1. Run `git status` and `git diff --staged` to understand the changes.
2. If nothing is staged, stage the relevant changed files (prefer specific files over `git add .`).
3. Write a commit message using **gitmoji** convention:
   - Format: `<emoji> <short description>`
   - Use the actual unicode emoji character, NOT the `:shortcode:` form
   - Keep the subject line under 72 characters
   - Use lowercase after the emoji
   - No period at the end of the subject line
4. **Do NOT add a `Co-Authored-By` line.**
5. Common gitmoji references:
   - ✨ new feature
   - 🐛 bug fix
   - 🔧 config / tooling
   - ♻️ refactor
   - 🎨 style / formatting
   - 🔥 remove code / files
   - 📝 docs
   - ✅ tests
   - 🚀 deploy / performance
   - 📦 dependencies
   - 🏗️ architecture changes
   - 🔒 security
   - 💄 UI / cosmetic
   - 🚚 move / rename files
   - 🗃️ database
   - 🔀 merge
   - 🎉 initial commit

If the user provided a hint via `$ARGUMENTS`, incorporate it into the commit message.

Use a HEREDOC to pass the message:
```
git commit -m "$(cat <<'EOF'
<emoji> <message>
EOF
)"
```
