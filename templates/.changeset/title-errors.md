---
'template-vite': minor
---

A blank title no longer disables the Add and Save buttons: submitting it shows "The title is blank" under the field, with `role="alert"`, `aria-invalid` and `aria-describedby`, and the e2e test runs axe on that state. `TodoInput.tsx` and `TodoEditor.tsx` read their field through `src/features/todo-list/shared/useTitleForm.ts`.
