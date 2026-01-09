# Mobile releasing (and release notes)

This repo keeps user-facing release notes in versioned files:

- `apps/mobile/${VERSION}_RELEASE_NOTES.md`

The goal is to make it hard to forget release notes, and easy to publish updates in the tone of the public changelog: [`app.leather.io/changelog`](https://app.leather.io/changelog).

## Quick process

1. **Decide the target version** (and bump `apps/mobile/package.json` if needed).
2. **Confirm last public store versions** (iOS + Android). If they differ, call it out explicitly.
3. **Create/update** `apps/mobile/${VERSION}_RELEASE_NOTES.md`
4. **Review constraints**:
   - Exclude anything behind feature flags (unless explicitly ungating for this release)
   - Avoid dependency bumps / CI-only work unless user-facing
   - Avoid sensitive/security details
5. **Publish**:
   - Copy “What’s New” into App Store Connect + Play Console
   - Use the richer section as the draft for `app.leather.io/changelog` (add screenshots/gifs/video)

## Copy/paste prompt (scaffold release notes)

Paste this into Cursor/Claude and fill in values:

```text
App: mobile
Target version: ${VERSION}
Last public versions: iOS ${IOS_LAST_PUBLIC_VERSION}, Android ${ANDROID_LAST_PUBLIC_VERSION}

Please scaffold release notes in the tone of https://app.leather.io/changelog and write them to:
apps/mobile/${VERSION}_RELEASE_NOTES.md

Constraints:
- Exclude anything behind feature flags unless explicitly ungating in this release.
- Avoid dependency bumps / CI-only changes unless user-facing.
- Avoid sensitive/security details (describe impact, not exploit mechanics).

Must-mention items:
- <bullet 1>
- <bullet 2>

Do-not-mention items:
- <bullet 1>

Output:
- App Store / Play Store “What’s New” (5–8 bullets)
- Richer changelog entry (title + sections)
```

