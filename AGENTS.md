# NOMAD Video Storyboard — Agent Guide

This is a local, static planning website for NOMAD campaign videos. The user will usually provide transcript sentences, footage descriptions, locations, actors, production notes, screenshots, and duration changes in conversational form. Turn those inputs into consistent storyboard pages without requiring the user to restate the site architecture.

## Project purpose

The site has a campaign home page listing all planned videos. Selecting a video opens an interactive 120-second storyboard with:

- a transcript organized by scene;
- a proportional timeline;
- previous/next scene navigation;
- a visual or placeholder for the planned footage;
- footage, location, actor, production, and duration details;
- an optional details-panel toggle.

This site is a production-planning tool, not the final NOMAD product website.

## Important files

- `local/index.html` — campaign home page and video cards.
- `local/central.html` — NOMAD Central storyboard shell.
- `local/app.js` — Central transcript, timings, footage data, and special visual logic.
- `local/oasis.html` — NOMAD Oasis storyboard shell.
- `local/oasis.js` — Oasis transcript, timings, footage data, and Christoph visual logic.
- `app/globals.css` — shared styles for the home page and all storyboards.
- `public/` — screenshots, generated illustrations, speakers, and official logos.

The campaign library is `/local/`. Every other `local/*.html` file, except
`index.html`, is a storyboard route and must remain linked from the library.

## Core consistency rules

1. Preserve the established dark production-planning interface unless the user requests a redesign.
2. Each video card on the home page must show its title, content category, duration, scene count, product family, short description, and a working link.
3. Storyboards should use the same transcript, timeline, stage, navigation, and details-panel layout.
4. Use the user’s wording as authoritative. Correct obvious spelling and punctuation without changing meaning.
5. Keep scene titles short and descriptive. They are navigation labels, not replacements for the transcript.
6. Store real production facts separately from visual descriptions: footage, location, actors, and production notes should remain distinguishable.
7. Do not invent names, locations, dates, DOIs, instruments, or filming commitments. Mark unknowns as `TBC` or use a clearly labeled placeholder.
8. Do not create or generate images unless the user explicitly asks. New scenes start with the existing footage placeholder.
9. User-supplied screenshots and official logos take precedence over generated approximations.
10. Preserve unrelated user edits and existing assets.

## Scene data format

Each storyboard script defines a `raw` array. A row has this exact order:

```js
[id, title, start, duration, sentence, footage, location, actors, type]
```

Field meanings:

- `id`: sequential scene number beginning at 1.
- `title`: concise internal scene title.
- `start`: start time in seconds.
- `duration`: scene duration in seconds.
- `sentence`: complete spoken transcript for that scene.
- `footage`: planned shot or screen-recording description.
- `location`: filming location or `Screen recording`.
- `actors`: array of people or roles, such as `['Christoph Koch']` or `['Screen only']`.
- `type`: `camera`, `screen`, or `mixed`.

The visible footage taxonomy is fixed:

- `camera` → `CAMERA FOOTAGE`
- `screen` → `SCREEN RECORDING`
- `mixed` → `MIXED MEDIA`

Every stage label combines the unique scene-local footage ID and category, for
example `FOOTAGE 03 · SCREEN RECORDING`. Multi-shot cards use the explicit shot
ID from their data, for example `FOOTAGE 2.1` and `FOOTAGE 2.2`. Do not introduce
synonyms such as “video,” “screen capture,” “talking shot,” or “mixed footage” in
these category labels.

Example:

```js
[4,
  'Control storage and access',
  33,
  8,
  'At the same time, you want control over where your data is stored and who can access it.',
  'Christoph Koch speaks directly to camera with the screen visible behind him.',
  'Christoph’s lab or room 1.108',
  ['Christoph Koch'],
  'camera'
]
```

## Timing rules

- Spoken-content runtimes vary by campaign. Every storyboard adds a separate
  four-second FAIRmat closing scene after that content runtime.
- `start` values must be cumulative. A scene starts when the previous scene ends.
- The final FAIRmat scene’s `start + duration` must equal the displayed total runtime.
- Timeline widths are calculated as `duration / 1.2` percent for a 120-second video.
- After changing a duration, recalculate every later `start` value.
- Update the duration and scene count shown on the home-page card and storyboard header.
- Keep the scrubber maximum, total-time label, playback limit, and timeline calculation aligned if a future video is not 120 seconds.

Before finishing a timing change, verify:

```text
scene 1 start = 0
scene N start = scene N-1 start + scene N-1 duration
last start + last duration = total runtime
```

## Adding or revising content

When the user pastes a new script:

1. Identify every distinct spoken statement. Each normally becomes one scene.
2. Keep multiple footage ideas attached to the relevant statement rather than creating extra transcript scenes unless the user requests that split.
3. Draft a concise scene title.
4. Normalize the footage description into readable production language.
5. Preserve all supplied locations, actors, dates, and owner initials.
6. Assign `camera`, `screen`, or `mixed` based on the planned visual.
7. Allocate durations proportional to spoken length and visual complexity, then ensure the exact total runtime.
8. Add the rows to the correct storyboard JavaScript file.
9. Update visible scene counts and home-page metadata.
10. Validate navigation, search, playback, and the final timestamp.

When the user asks to modify only content or durations, do not rebuild the page or change its visual system.

## Adding a new video page

Use the existing Oasis storyboard as the clean baseline when a new video has no images yet.

1. Copy the storyboard HTML shell to `local/<short-name>.html`.
2. Set the page title, header title, scene count, runtime, and script source.
3. Create `local/<short-name>.js` with its own `raw` scene data and standard render functions.
4. Keep placeholders visible until images are explicitly requested.
5. Add a new card to `local/index.html` with a unique index, title, summary, scene count, runtime, product family, and route.
   Use exactly one content category: `Explainer`, `Developer story`, or
   `Researcher story`.
6. Give the card a restrained visual variation through existing CSS rather than creating an unrelated design.
7. Add an `All videos` link to the storyboard header.
8. Test the home-page link and direct storyboard URL.

Avoid sharing mutable scene arrays between videos. Each video should remain independently editable.

## Multiple shots within one scene

If a scene needs two or more representative visuals, follow the Central storyboard’s `shotArrays` pattern:

- use equal rectangular zones;
- use `two-shot-array` for two equal halves;
- keep screenshots fitted with `object-fit: contain` so the full interface remains visible;
- use a nested `representative-pair` when two screenshots represent moments from one continuous screen recording;
- do not label separate images as separate footage when the user says they are one recording;
- keep the side-panel descriptions aligned and readable.

Scene indexes in JavaScript are zero-based even though visible scene IDs begin at 1. For example, visible scene 7 is `active === 6`.

## Image and asset handling

- Save project assets under `public/` with lowercase kebab-case names. Do not use
  spaces, uppercase extensions, personal shorthand, or generic names such as
  `scene1.png`.
- Scene visuals use `<video-slug>-scene-<two-digit-scene>-<description>.<ext>`.
  Multi-shot visuals insert `shot-<two-digit-shot>`, for example
  `central-scene-07-shot-02-xps-visualization.png`.
- Reusable speaker visuals use `speaker-<person-name>-<context>.png`, for example
  `speaker-victoria-coors-lab.png`.
- Shared logos use `brand-<brand>-<orientation>.png`, except the existing favicon.
- Keep original supplied assets intact. Copy them into `public/` rather than relying on temporary clipboard paths.
- Use official horizontal brand assets where the layout is horizontal:
  - `public/brand-nomad-horizontal.png`
  - `public/brand-oasis-horizontal.png`
  - `public/brand-fairmat.png`
- Talking-to-camera assets currently include:
  - `public/speaker-victoria-coors-lab.png`
  - `public/speaker-christoph-koch-lab.png`
- Central scenes featuring Victoria use her established laboratory visual.
- Oasis scenes featuring Christoph use his established laboratory visual.
- All full-frame screenshots and generated scene images must fit inside the stage. Do not crop essential interface content.
- Include useful `alt` text for every image.
- Increase the stylesheet cache query in edited HTML files when CSS changes, such as `globals.css?v=11`.

## Closing-card rules

Explainer and developer-story closing cards are configured centrally in
`local/closing-card.js`. Add new eligible pages to the `closingCards` map rather
than duplicating closing logic in the storyboard script.

Central and Oasis closing cards share the same structure:

- speaker speaking to camera across the left two-thirds;
- a white information panel across the right third;
- the appropriate official horizontal logo at the top;
- the product statement in the middle;
- `Developed by` with `public/brand-fairmat-with-text.png` at the bottom.

NOMAD Central uses `From research data to shared knowledge.` NOMAD Oasis uses
`One platform, built around your laboratory.` Use the respective speaker for each video. If that speaker does
not yet have an approved image, retain the named `Speaker image pending`
placeholder; never substitute another person. Do not add other institutional
developer logos unless the user explicitly requests them.

Every video—including researcher stories—then ends with a separate four-second
FAIRmat logo scene configured by `local/final-logo.js`. It uses
`public/brand-fairmat-end-card.png` centered on white. Keep this scene last,
include it in the scene count, and add its four seconds to the displayed runtime,
timeline, scrubber maximum, and home-page metadata. The product/speaker closing
card remains immediately before it on eligible explainer and developer videos.

## Editing cautions

- `local/app.js` contains layered render wrappers for special Central scenes. Read the entire rendering section before adding another wrapper.
- When adding a special image, ensure the normal placeholder, speaker image, shot array, and end card are mutually exclusive.
- When navigating away from a special scene, its visual must become hidden again.
- Do not delete older assets merely because a scene no longer displays them; they may still be user references.
- Keep new JavaScript dependency-free unless a genuine requirement justifies a library.

## Local verification

The site can be served from the `video-storyboard` directory with:

```powershell
python -m http.server 4173
```

Then use:

- `http://127.0.0.1:4173/local/`
- `http://127.0.0.1:4173/local/central.html`
- `http://127.0.0.1:4173/local/oasis.html`

For every change:

1. Check modified JavaScript syntax.
2. Confirm the home page and affected storyboard return successfully.
3. Confirm every newly referenced asset loads successfully.
4. Check scene count, cumulative timings, and total runtime.
5. Confirm previous/next buttons, transcript selection, timeline selection, search, playback, and details toggle remain functional.
6. Perform visual browser testing only when explicitly requested, but always do lightweight local response checks.

## GitHub preparation

The project is static and suitable for source control. Before publishing:

- commit the HTML, JavaScript, CSS, `public/` assets, and this guide;
- do not commit temporary clipboard files, generated-image caches, credentials, or local runtime files;
- preserve descriptive commit history for script, timing, and visual changes;
- check filename capitalization because GitHub hosting is case-sensitive;
- decide whether the site will be hosted at a domain root or a repository subpath.

Current asset and route references begin with `/`, which is correct for local root hosting and a custom-domain root. GitHub Pages repository hosting uses a subpath such as `/repository-name/`; before deploying there, convert routes/assets to a configurable base path or relative references. Do not make that migration until the hosting target is known.

## Completion checklist

- User wording and production facts are preserved.
- Scene IDs are sequential.
- Starts and durations are valid and total correctly.
- Home-page metadata matches the storyboard.
- Footage type, location, actors, and notes are populated.
- No unrequested images or invented factual details were added.
- Official logos are used.
- Images fit the frame without hiding essential content.
- Home and storyboard links work.
- JavaScript passes syntax validation.
- The local preview remains usable.
