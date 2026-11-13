# Amit Yadav — Portfolio

A black-background React portfolio with an animated avatar introduction, a React Flow project network, an automatic skills shooting animation, education, and contact links.

## Run locally

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Deploy the generated `dist` folder to a static host. The site requires no backend. The contact link opens an email client; it does not store or send form submissions.

## Content

- Edit projects, skills, education, and social links in `src/main.jsx`.
- Edit colors and layouts in `src/style.css`.
- Images live in `public/assets`. Original uploads at the project root are preserved.
- Project descriptions are based on the supplied screenshots. GitHub links point to the supplied profile because individual repository URLs were not provided.

## Animation and accessibility

The hero uses the original photographic avatar and matching sideways-pull poses in `src/AvatarIntro.jsx`. The former procedural 3D character is no longer used. GSAP waits three seconds after the images load, transitions to both hands gripping the goggles, separates the two lens halves sideways, and reveals the name only after the entire removal sequence ends. The introduction loops automatically, holding the revealed name for 4.5 seconds before beginning again. No replay button is shown. This is a layered image animation, not a 3D character rig.

Motion animates project cards, skill targets, and completion badges. Lenis handles smooth scrolling. React Flow renders the input/hidden/output visualization. Lucide supplies icons.

Reduced-motion preferences bypass the intro delay, disable automatic project rotation and smooth scrolling, and minimize transitions. The skills sequence starts when its section enters view, automatically aims and fires at seven targets, and checks off each skill only after impact. It holds the completed checklist before repeating. It pauses off-screen or in a hidden browser tab. No game or reset buttons are shown. Reduced motion displays the completed checklist without shooting animations. Project images can be enlarged and closed with Escape.

## Avatar generation

Asset: `public/assets/avatar-sequence.png`. Generated using the built-in image generation tool from the provided `ai avtara.png`; the source is preserved.

Sideways-pull asset: `public/assets/avatar-sideways.png`, generated with the built-in image tool using `avatar-sequence.png` as the identity reference. Prompt: Preserve the exact photographic character, face, hair, leather jacket and cyan piping; create three equal-width panels showing both hands gripping intact goggles, separating them at the bridge, and pulling the two lens halves completely sideways off the face. Fixed framing and scale, pure black background, no brain graphic, no cartoon styling, no text, bottom faded to black. All earlier assets remain preserved.

Prompt: Edit the attached avatar into an equal-width three-panel sprite strip on pure black. Preserve Amit's recognizable face, hair, black leather jacket and cyan piping. Remove the blue AI brain, chip and temple circuitry and restore natural hair and skin. Panel one: folded arms and sunglasses. Panel two: both hands grip the sunglasses at the temples. Panel three: both hands hold the sunglasses below the chin with eyes visible. Keep the camera, head position and scale consistent; no text or borders, fade to black at the bottom.
