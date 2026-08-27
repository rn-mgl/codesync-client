# CodeSync Client — Adding a New Language

This document describes the steps required to add a new programming language to
the CodeSync client. It is intended as a reference for both developers and AI
assistants working on this codebase.

---

## Architecture Overview

Languages flow through four layers in the client:

```
Type definition  →  Zod validation  →  UI picker  →  Boilerplate generation
```

Each layer is independently hardcoded — updating one does not automatically
update the others. All four must be modified when adding a new language.

### Files That Must Be Updated

| # | File | Purpose |
|---|------|---------|
| 1 | `src/interfaces/language.interface.ts` | Canonical `SupportedLanguages` type union |
| 2 | `src/schemas/submission.schema.ts` | Zod enum validation on the submission API route |
| 3 | `src/components/features/problem/read/Languages.tsx` | Language picker dropdown in the editor toolbar |
| 4 | `src/utils/problem.util.ts` | Boilerplate code generator (`generateBoilerPlate`) |

### Files That Need NO Changes

These files import `SupportedLanguages` and use it as a type. Once the type
union is updated, they propagate the new value automatically:

- `src/interfaces/submission.interface.ts`
- `src/interfaces/field.interface.ts`
- `src/hooks/useSingleProblem.tsx`
- `src/components/features/problem/read/ProblemActions.tsx`
- `src/components/features/problem/read/SingleProblem.tsx`
- `src/components/features/problem/read/RunResults.tsx`
- `src/components/features/problem/read/SubmittedCodePreview.tsx`
- `src/components/ui/fields/CodeEditor.tsx`

The Monaco editor (`@monaco-editor/react`) passes the language string directly
to Monaco. Monaco ships with built-in grammar support for most popular
languages (JavaScript, Python, Java, C/C++, Go, Rust, etc.). Verify the new
language is supported before proceeding — see the [Monaco Editor docs](https://microsoft.github.io/monaco-editor/).

---

## Step 1 — Add to the Type Union

**File:** `src/interfaces/language.interface.ts`

```typescript
// Before
export type SupportedLanguages = "javascript" | "php" | "java" | "python";

// After (adding "rust" as an example)
export type SupportedLanguages = "javascript" | "php" | "java" | "python" | "rust";
```

This is the single source of truth. All other files that accept a language
value import this type.

---

## Step 2 — Add to the Zod Validation Schema

**File:** `src/schemas/submission.schema.ts`

```typescript
// Before
language: z.enum(["javascript", "php", "java", "python"], {
  error: "Please choose a supported language.",
}),

// After
language: z.enum(["javascript", "php", "java", "python", "rust"], {
  error: "Please choose a supported language.",
}),
```

This schema validates incoming submissions on the
`POST /api/submission` route. Without this step, submissions in the new
language will be rejected by the server.

---

## Step 3 — Add to the Language Picker UI

**File:** `src/components/features/problem/read/Languages.tsx`

```typescript
// Before
const languages: SupportedLanguages[] = React.useMemo(
  () => ["javascript", "php", "java", "python"],
  [],
);

// After
const languages: SupportedLanguages[] = React.useMemo(
  () => ["javascript", "php", "java", "python", "rust"],
  [],
);
```

The language name is rendered as-is with CSS `capitalize`. The button label
will be the lowercase language string (e.g., `"rust"` renders as `Rust`).

---

## Step 4 — Add Boilerplate Generation

**File:** `src/utils/problem.util.ts`

Add a new `case` to the `switch (language)` block inside
`generateBoilerPlate()`. The function receives:

- `inputFormat.style` — `"function"` or `"class"`
- `inputFormat.name` — the function/class name
- `inputFormat.method` — the method name for class style (defaults to `"solve"`)
- `inputFormat.params` — array of `{ name: string; type: string }`
- `outputFormat.type` — the return type string

### Example: Adding Rust

```typescript
case "rust":
  if (style === "class") {
    parameters = inputFormat.params
      .map((param) => `${param.name}: ${getRustType(param.type)}`)
      .join(", ");
    boilerPlate = `struct ${name} {\n\t${methodName}: fn(${parameters}) -> ${getRustType(outputFormat.type)},\n}`;
  } else {
    parameters = inputFormat.params
      .map((param) => `${param.name}: ${getRustType(param.type)}`)
      .join(", ");
    boilerPlate = `fn ${name}(${parameters}) -> ${getRustType(outputFormat.type)} {\n\ttodo!()\n}`;
  }
  break;
```

If your language requires type mapping (like Java's `getJavaType`), define a
helper function following the same pattern. Place it after the
`generateBoilerPlate` function.

### Boilerplate Patterns by Language

| Language | Function style | Class style |
|----------|---------------|-------------|
| JavaScript | `function name(params) { }` | `class Name { method(params) { } }` |
| PHP | `<?php function name($params) { } ?>` | `<?php class Name { public function method($params) { } } ?>` |
| Java | `static Type name(Type param) { }` | `static class Name { public Type method(Type param) { } }` |
| Python | `def name(params): pass` | `class Name: def method(self, params): pass` |

---

## Data Flow

```
useSingleProblem (hook)
  ├─ currentLanguage state  →  defaults to "javascript"
  ├─ generateBoilerPlate()  →  fills editor with starter code
  ├─ localStorage key       →  `{problemSlug}_{userId}_{language}`
  └─ submission body        →  { code, language, problem, ... }
                                    │
                                    ▼
                              POST /api/submission
                                    │
                                    ▼
                          SubmissionSchema.safeParse()
                            (validates language enum)
                                    │
                                    ▼
                              Backend server
```

### Key Behaviors

- **Per-language code persistence**: Each language's code is stored
  independently in `localStorage` under the key
  `{slug}_{userId}_{language}`. Switching languages saves/restores
  separate buffers.

- **Default language**: The editor defaults to `"javascript"`. This is set
  in `useSingleProblem.tsx:120`. Change this only if you want a different
  default.

- **Language display**: The picker renders names with CSS `capitalize`.
  Lowercase strings like `"python"` display as `Python`. No special
  formatting is needed.

---

## Checklist

When adding a new language, verify:

- [ ] `SupportedLanguages` type updated
- [ ] Zod enum updated
- [ ] Language picker array updated
- [ ] `generateBoilerPlate` switch case added
- [ ] Monaco Editor supports the language natively
  ([docs](https://microsoft.github.io/monaco-editor/))
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)
- [ ] Backend server accepts the new language value
- [ ] Boilerplate renders correctly for both `function` and `class` styles
- [ ] Language picker button displays correctly (capitalize, sizing)
