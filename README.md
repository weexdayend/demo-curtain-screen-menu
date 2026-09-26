# Motion Studies --- Fullscreen Menu

A cinematic fullscreen menu built with **Next.js, React, TypeScript,
Tailwind CSS, and GSAP**.

This repository is the public demo/source code for **Motion Studies by
UIGERHANA**. The project is intentionally transparent: the React
structure, refs, state, GSAP setup, timeline choreography, and cleanup
are exposed so the animation can be studied and manually rebuilt rather
than consumed as a black-box component.

------------------------------------------------------------------------

## What this project demonstrates

The animation is built from five layers of responsibility:

``` text
UI Structure
     ↓
React State
     ↓
DOM Refs
     ↓
GSAP Timeline
     ↓
Motion
```

React answers **what state the interface is in**. Refs identify **which
DOM nodes GSAP controls**. GSAP answers **how and when those nodes
move**.

The result is a fullscreen navigation menu with layered curtain reveals,
image/content reveals, staggered navigation, opening/closing
choreography, and scroll locking.

------------------------------------------------------------------------

## Tech Stack

-   Next.js
-   React
-   TypeScript
-   GSAP
-   Tailwind CSS

------------------------------------------------------------------------

## Project Structure

``` text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
└── components/
    └── FullScreenMenu.tsx

public/
└── assets/
    ├── store.jpg
    └── board.jpg
```

The main file to study is:

``` text
src/components/FullScreenMenu.tsx
```

Read it in this order:

1.  component markup
2.  React state
3.  refs
4.  scroll locking
5.  initial GSAP state
6.  open handler
7.  open timeline
8.  close handler
9.  close timeline
10. toggle interaction

------------------------------------------------------------------------

# Getting Started

``` bash
git clone https://github.com/weexdayend/demo-curtain-screen-menu.git
cd demo-curtain-screen-menu
npm install
npm run dev
```

Then open:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

# The Core Mental Model

## 01 --- Page

`page.tsx` provides the environment where the menu lives.

## 02 --- Structure

`FullScreenMenu.tsx` creates the visual layers:

``` text
Menu
├── accent curtain
├── dark curtain
├── main surface
├── image
├── content
└── navigation links
```

## 03 --- Control

React state controls whether the menu is open.

Refs connect React-rendered DOM elements to GSAP.

## 04 --- Motion

The GSAP timeline controls sequence, timing, easing, overlap, and
stagger.

The complete mental model is:

``` text
STRUCTURE → CONTROL → TIMING → MOTION
```

------------------------------------------------------------------------

# React State vs GSAP State

A menu state can be as simple as:

``` tsx
const [openState, setOpenState] = useState(false);
```

That state answers:

> Is the menu open?

It should not become a storage system for every animation property.

Avoid turning values such as these into React state unless the
application actually needs them:

``` text
curtain position
image opacity
menu scale
text y-position
```

A useful rule:

``` text
React state = application state
GSAP = animation state
```

React decides the interface state. GSAP owns the visual interpolation.

------------------------------------------------------------------------

# Why `useRef` Matters

GSAP needs access to the actual DOM element.

Example:

``` tsx
const accentRef = useRef<HTMLDivElement | null>(null);
```

Then:

``` tsx
gsap.to(accentRef.current, {
  yPercent: 0,
});
```

The relationship is:

``` text
React
  ↓
useRef
  ↓
DOM element
  ↓
GSAP
```

This is preferable to repeatedly querying the DOM with selectors
throughout an interactive component.

------------------------------------------------------------------------

# Establishing Initial State

A deterministic starting state is critical.

Use `gsap.set()`:

``` tsx
gsap.set(accentRef.current, {
  yPercent: 100,
});
```

This does not animate anything. It establishes the starting position.

Compare:

``` tsx
gsap.set(element, { yPercent: 100 });
```

with:

``` tsx
gsap.to(element, {
  yPercent: 0,
  duration: 0.8,
});
```

Think of it as:

``` text
gsap.set() = WHERE DO WE START?
gsap.to()  = HOW DO WE GET THERE?
```

------------------------------------------------------------------------

# The GSAP Timeline

A timeline is the animation's choreography.

``` tsx
const tl = gsap.timeline();
```

Instead of independently managing:

``` text
curtain animation
timer
another animation
timer
image animation
timer
text animation
```

you describe the sequence directly:

``` text
curtain
  ↓
surface
  ↓
image
  ↓
content
  ↓
navigation
```

That sequence becomes readable and tunable.

------------------------------------------------------------------------

# Reading a Tween

Given:

``` tsx
tl.to(photoRef.current, {
  opacity: 1,
  duration: 0.8,
  ease: "power2.out",
}, "-=0.3");
```

read it as:

``` text
TARGET
photo

PROPERTY
opacity

VALUE
1

DURATION
0.8 seconds

EASING
power2.out

POSITION
0.3 seconds before the previous timeline position
```

This is the fastest way to understand and manually modify the timeline.

------------------------------------------------------------------------

# Position Parameters

Position parameters are one of the most important GSAP concepts in this
project.

Default:

``` tsx
tl.to(element, vars);
```

The next tween starts after the previous one finishes.

Start at the same time:

``` tsx
tl.to(element, vars, "<");
```

Start slightly after the previous tween starts:

``` tsx
tl.to(element, vars, "<0.15");
```

Overlap the previous animation:

``` tsx
tl.to(element, vars, "-=0.25");
```

Add a gap:

``` tsx
tl.to(element, vars, "+=0.25");
```

Start at an exact timeline time:

``` tsx
tl.to(element, vars, 1.5);
```

### Why this matters

Compare:

``` text
A ─────────
            B ─────────
```

with:

``` text
A ─────────────
       B ─────────────
```

The second feels more continuous because the animations overlap.

A value such as:

``` tsx
"-=0.25"
```

is therefore a design decision, not a random number.

------------------------------------------------------------------------

# Timeline Tuning

When editing the animation, change one variable at a time.

## Duration

``` tsx
duration: 0.8
```

Faster:

``` tsx
duration: 0.5
```

Slower:

``` tsx
duration: 1.2
```

Duration controls **how long** a tween takes.

It does not decide its relationship to other tweens.

------------------------------------------------------------------------

## Easing

Easing controls acceleration and deceleration.

Useful starting points:

``` text
power2.out
power3.out
power3.inOut
expo.out
circ.out
back.out
```

For controlled UI motion:

``` tsx
ease: "power3.out"
```

For larger movement:

``` tsx
ease: "power3.inOut"
```

For a sharper reveal:

``` tsx
ease: "expo.out"
```

Do not change duration and easing at the same time when debugging.
Change one, preview, then decide.

------------------------------------------------------------------------

## Overlap

Try:

``` text
-=0.10
-=0.25
-=0.40
-=0.60
```

Small overlap creates continuity.

Too much overlap removes hierarchy.

If everything starts at once, nothing feels important.

------------------------------------------------------------------------

## Stagger

For a group of links:

``` tsx
gsap.to(linksRef.current, {
  opacity: 1,
  y: 0,
  duration: 0.6,
  stagger: 0.05,
  ease: "power3.out",
});
```

Small:

``` tsx
stagger: 0.03
```

Tighter.

Larger:

``` tsx
stagger: 0.12
```

More deliberate.

The point of stagger is not "because GSAP supports stagger." It creates
internal rhythm inside a related group.

------------------------------------------------------------------------

# Curtain Direction

If the curtain starts below the viewport:

``` tsx
gsap.set(accentRef.current, {
  yPercent: 100,
});
```

and enters toward:

``` tsx
yPercent: 0
```

the movement is:

``` text
below viewport → visible
```

For a top entry:

``` tsx
yPercent: -100
```

then:

``` text
above viewport → visible
```

For horizontal movement, use:

``` tsx
xPercent
```

instead of:

``` tsx
yPercent
```

For an exit through the top:

``` tsx
yPercent: -100
```

For an exit through the bottom:

``` tsx
yPercent: 100
```

The mental model is simple:

``` text
-100 = outside above/left
  0  = visible
+100 = outside below/right
```

------------------------------------------------------------------------

# Open Timeline

A useful storyboard is:

``` text
01  accent curtain enters
02  dark curtain follows
03  main surface becomes visible
04  curtains leave
05  image reveals
06  content reveals
07  navigation links stagger
```

A simplified implementation:

``` tsx
const tl = gsap.timeline();

tl.to(accentRef.current, {
  yPercent: 0,
  duration: 0.8,
  ease: "power3.inOut",
})
.to(darkRef.current, {
  yPercent: 0,
  duration: 0.8,
  ease: "power3.inOut",
}, "-=0.25")
.to(accentRef.current, {
  yPercent: -100,
  duration: 0.8,
  ease: "power3.inOut",
})
.to(darkRef.current, {
  yPercent: -100,
  duration: 0.8,
  ease: "power3.inOut",
}, "-=0.5")
.to(photoRef.current, {
  opacity: 1,
  duration: 0.8,
  ease: "power2.out",
})
.to(contentRef.current, {
  opacity: 1,
  y: 0,
  duration: 0.7,
  ease: "power3.out",
}, "-=0.4")
.to(linksRef.current, {
  opacity: 1,
  y: 0,
  duration: 0.6,
  stagger: 0.05,
  ease: "power3.out",
}, "-=0.3");
```

The exact numbers are not sacred. The choreography is the important
part.

------------------------------------------------------------------------

# Open vs Close

Opening and closing do not have to be literal opposites.

Opening reveals information:

``` text
curtain
→ surface
→ image
→ content
→ links
```

Closing can remove information in the opposite visual hierarchy:

``` text
links
→ content
→ image
→ curtain
```

Think about what the viewer's eye should perceive.

The goal is not simply "reverse the numbers." The goal is to create a
convincing visual transition.

------------------------------------------------------------------------

# Killing Conflicting Tweens

Interactive animations can be interrupted.

For example:

``` text
OPEN starts
   ↓
animation still running
   ↓
CLOSE is triggered
   ↓
another animation starts
```

Both can try to control the same element.

Use:

``` tsx
gsap.killTweensOf([
  darkRef.current,
  accentRef.current,
  photoRef.current,
  contentRef.current,
  linksRef.current,
]);
```

before starting a new interaction when appropriate.

This gives the new animation a clean handoff.

------------------------------------------------------------------------

# Resetting Animation State

Every open should have a predictable starting point.

Every close should have a predictable ending point.

Do not rely on whatever values happen to remain after a previous
interrupted animation.

Use explicit initial values and reset properties where necessary.

The desired lifecycle is:

``` text
CLOSED
  ↓
known initial state
  ↓
OPEN
  ↓
known open state
  ↓
CLOSE
  ↓
known closed state
```

------------------------------------------------------------------------

# Scroll Lock

A fullscreen menu generally should prevent the page underneath from
scrolling.

A simple implementation is:

``` tsx
document.body.style.overflow = "hidden";
```

and restoring:

``` tsx
document.body.style.overflow = "";
```

The important principle is consistency:

``` text
menu closed → normal page scroll
menu open   → background scroll locked
```

If your application already has a scroll-management system, use that
rather than adding a second competing system.

------------------------------------------------------------------------

# Manual Editing Guide

You can customize almost everything without rebuilding the component.

### Faster

``` tsx
duration: 0.5
```

### Slower / cinematic

``` tsx
duration: 1.1
```

### More overlap

``` tsx
"-=0.4"
```

### Less overlap

``` tsx
"-=0.1"
```

### Faster navigation cascade

``` tsx
stagger: 0.03
```

### More dramatic navigation cascade

``` tsx
stagger: 0.12
```

### Softer motion

``` tsx
ease: "power2.out"
```

### Stronger acceleration

``` tsx
ease: "power3.out"
```

### Opposite curtain direction

``` tsx
yPercent: -100
```

instead of:

``` tsx
yPercent: 100
```

### Horizontal curtain

Use:

``` tsx
xPercent
```

------------------------------------------------------------------------

# A Better Motion-Tuning Workflow

Do not randomly change ten values.

Use this process:

### 1. Identify the symptom

``` text
too fast
too slow
too stiff
too floaty
too much overlap
too little overlap
links feel rushed
image appears too early
```

### 2. Map symptom to variable

``` text
speed            → duration
timing relation  → position parameter
acceleration     → ease
group rhythm     → stagger
direction        → xPercent / yPercent
visibility       → opacity
scale movement   → scale
```

### 3. Change one variable

Preview.

### 4. Compare

Keep the old value mentally or in Git so you can revert quickly.

### 5. Tune again

Motion design is usually refinement, not one perfect first attempt.

------------------------------------------------------------------------

# Debugging Checklist

When something looks wrong, check these in order:

## 1. Is the initial state correct?

Inspect `gsap.set()`.

## 2. Is the target correct?

Check the ref:

``` tsx
accentRef.current
darkRef.current
photoRef.current
contentRef.current
linksRef.current
```

## 3. Is the property correct?

Common properties:

``` text
x
y
xPercent
yPercent
opacity
scale
rotation
```

## 4. Is the timeline position correct?

Inspect:

``` text
"<"
"-=0.25"
"+=0.25"
"label+=0.2"
```

## 5. Is the easing causing the visual problem?

If the timing is correct but the motion feels wrong, test another ease.

------------------------------------------------------------------------

# Avoid These Patterns

## Avoid animation values in React state

Do not turn every visual property into `useState`.

React should not re-render the component for every frame of a GSAP
animation.

## Avoid `setTimeout()` for choreography

Prefer the timeline:

``` tsx
tl.to(...)
  .to(...)
  .to(...);
```

instead of manually synchronizing animation with timers.

## Avoid excessive timelines

One coherent choreography is often easier to maintain as one master
timeline.

## Avoid excessive overlap

Overlap is useful only when it communicates continuity.

## Avoid layout-heavy animation when transforms work

Prefer:

``` text
transform
opacity
```

such as:

``` text
x
y
xPercent
yPercent
scale
rotation
opacity
```

------------------------------------------------------------------------

# Labels For Larger Timelines

Small timeline:

``` tsx
tl.to(...)
  .to(...)
  .to(...);
```

is fine.

As the choreography grows, labels improve readability:

``` tsx
tl.addLabel("curtain");
tl.addLabel("content");
tl.addLabel("navigation");
```

Then:

``` tsx
tl.to(image, vars, "content");
tl.to(links, vars, "navigation");
```

You can also offset from a label:

``` tsx
tl.to(image, vars, "content+=0.25");
```

This turns the timeline into named sections rather than a long list of
anonymous numbers.

------------------------------------------------------------------------

# Timeline Quick Reference

``` tsx
const tl = gsap.timeline();
```

### `to`

``` tsx
tl.to(target, {
  x: 0,
  duration: 0.8,
});
```

### `from`

``` tsx
tl.from(target, {
  opacity: 0,
});
```

### `fromTo`

``` tsx
tl.fromTo(
  target,
  { opacity: 0 },
  { opacity: 1, duration: 0.8 }
);
```

### `set`

``` tsx
tl.set(target, {
  opacity: 0,
});
```

### `stagger`

``` tsx
tl.to(targets, {
  opacity: 1,
  stagger: 0.05,
});
```

### same start

``` tsx
tl.to(a, vars)
  .to(b, vars, "<");
```

### overlap

``` tsx
tl.to(a, vars)
  .to(b, vars, "-=0.25");
```

### gap

``` tsx
tl.to(a, vars)
  .to(b, vars, "+=0.25");
```

### exact time

``` tsx
tl.to(a, vars, 1.5);
```

------------------------------------------------------------------------

# Accessibility

A fullscreen menu should remain usable without relying entirely on
animation.

Consider:

-   semantic navigation links
-   keyboard access
-   visible focus states
-   readable contrast
-   preventing background interaction while open
-   reduced-motion support

For reduced motion, consider shortening or removing large transitions
rather than forcing every user through the same animation.

------------------------------------------------------------------------

# Performance

Prefer transform and opacity for high-frequency motion.

Avoid unnecessarily animating layout properties such as `top`, `left`,
`width`, and `height` when a transform can produce the same visual
result.

Also avoid creating dozens of independent tweens when a parent transform
can achieve the intended effect.

------------------------------------------------------------------------

# Turning This Into Your Own Menu

Keep the architecture:

``` text
React state
Refs
Initial state
Open timeline
Close timeline
Cleanup
```

Change the creative layer:

``` text
colors
typography
images
navigation labels
curtain direction
timing
easing
stagger
layout
```

The same architecture can be adapted to:

-   portfolio navigation
-   agency websites
-   editorial websites
-   fashion sites
-   creative developer portfolios
-   product landing pages
-   fullscreen search
-   project browsers
-   page transitions

------------------------------------------------------------------------

# Suggested Experiments

### Experiment 01 --- Reverse the curtain

Change:

``` tsx
yPercent: 100
```

to:

``` tsx
yPercent: -100
```

### Experiment 02 --- Compare overlap

Test:

``` text
-=0.10
-=0.25
-=0.40
-=0.60
```

### Experiment 03 --- Remove stagger

Compare:

``` tsx
stagger: 0
```

with:

``` tsx
stagger: 0.08
```

### Experiment 04 --- Compare easing

Try:

``` text
power2.out
power3.out
power3.inOut
expo.out
```

### Experiment 05 --- Rebuild the choreography

Delete the timeline and rebuild:

``` text
curtain
→ surface
→ image
→ content
→ links
```

If you can rebuild the sequence intentionally, you understand the system
rather than just copying the implementation.

------------------------------------------------------------------------

# Why This Repository Uses Direct GSAP

The code intentionally does not hide the animation behind a custom
abstraction such as:

``` tsx
<AnimatedMenu preset="cinematic" />
```

Abstractions are useful in production design systems.

For a motion study, direct GSAP is more valuable because you can see:

-   what moves
-   where it moves
-   when it starts
-   how long it runs
-   how it overlaps
-   what easing it uses
-   how multiple elements are coordinated

The goal is understanding the motion system.

------------------------------------------------------------------------

# Motion Studies

This repository belongs to **Motion Studies**, a practical series by
UIGERHANA exploring creative frontend motion with GSAP.

``` text
01 — Page Structure
        ↓
02 — Fullscreen Menu
        ↓
03 — State & Refs
        ↓
04 — GSAP Timeline
        ↓
05 — Curtain Transition
```

The progression is deliberate:

``` text
STRUCTURE
    +
CONTROL
    +
TIMING
    =
MOTION
```

------------------------------------------------------------------------

# License

This repository uses the **MIT License** for the original source code.

MIT is appropriate for a public demo/learning repository because it
permits:

-   personal use
-   commercial use
-   modification
-   distribution
-   private use
-   redistribution of modified versions

The copyright and license notice must remain with copies of the
software.

## Important: third-party assets

The MIT license applies to the original code in this repository.

It does **not automatically license third-party photographs, fonts,
logos, videos, icons, or other assets**.

If an asset is not created by UIGERHANA, check its individual license
before redistributing it or using it commercially.

For production projects, replace demo assets with assets you have the
right to use.

------------------------------------------------------------------------

# MIT License

``` text
MIT License

Copyright (c) 2026 UIGERHANA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

------------------------------------------------------------------------

# Credits

Created by **UIGERHANA**.

Part of **Motion Studies**.

Built with:

-   Next.js
-   React
-   TypeScript
-   GSAP
-   Tailwind CSS

------------------------------------------------------------------------

# Final Principle

There is no universally correct combination of:

``` tsx
duration: 0.8
ease: "power3.out"
stagger: 0.05
```

Those are design decisions.

The useful skill is knowing what each value changes.

When you can read:

``` tsx
.to(element, {
  yPercent: -100,
  duration: 0.8,
  ease: "power3.inOut",
}, "-=0.25");
```

and immediately understand:

``` text
WHAT moves
WHERE it moves
HOW LONG it moves
HOW it accelerates
WHEN it starts
```

you are no longer just copying a GSAP animation.

**You are designing motion.**