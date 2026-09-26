"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const LINKS = ["Work", "About", "Contact"];

export function FullScreenMenu() {
  const [openState, setOpenState] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(surfaceRef.current, { autoAlpha: 0 });
      gsap.set(darkRef.current, { yPercent: -100 });
      gsap.set(accentRef.current, { yPercent: -100 });
      gsap.set(photoRef.current, { yPercent: -120 });
      gsap.set(contentRef.current, { autoAlpha: 0 });
      gsap.set(linksRef.current, { yPercent: 115, autoAlpha: 0 });
    }, root);

    return () => {
      ctx.revert();
      unlockScroll();
    };
  }, []);

  const lockScroll = () => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  };

  const open = () => {
    if (openState) return;

    lockScroll();
    setOpenState(true);

    gsap.killTweensOf([
      darkRef.current,
      accentRef.current,
      photoRef.current,
      contentRef.current,
      linksRef.current,
    ]);

    gsap.set(rootRef.current, { autoAlpha: 1, pointerEvents: "auto" });
    gsap.set(surfaceRef.current, { autoAlpha: 0 });
    gsap.set(darkRef.current, { yPercent: -100 });
    gsap.set(accentRef.current, { yPercent: -100 });
    gsap.set(photoRef.current, { yPercent: -120 });
    gsap.set(contentRef.current, { autoAlpha: 0 });
    gsap.set(linksRef.current, { yPercent: 115, autoAlpha: 0 });

    const tl = gsap.timeline();

    // 1. Build the curtain stack.
    tl.
      to(accentRef.current, {
        yPercent: 0,
        duration: 0.8,
        ease: "power2.inOut",
      }, "-=0.02")
      .to(darkRef.current, {
        yPercent: 0,
        duration: 0.9,
        ease: "power2.inOut",
      }, -0.25)

      // 2. Once the screen is safely covered, reveal the actual menu surface.
      .set(surfaceRef.current, { autoAlpha: 1 })

      // 3. Curtains leave in a tight overlap: accent first, dark second.
      .to(accentRef.current, {
        yPercent: 100,
        duration: 0.55,
        ease: "power3.inOut",
      })
      .to(darkRef.current, {
        yPercent: 100,
        duration: 0.4,
        ease: "power3.inOut",
      }, "-=0.55")

      // 4. Reveal content while the dark curtain is still leaving.
      .to(photoRef.current, {
        yPercent: 0,
        duration: 0.7,
        ease: "power3.inOut",
      }, "-=0.28")
      .to(contentRef.current, {
        autoAlpha: 1,
        duration: 0.25,
        ease: "power2.out",
      }, "-=0.2")
      .to(linksRef.current, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.6,
        stagger: 0.06,
        ease: "power4.out",
      }, "-=0.3");
  };

  const close = () => {
    if (!openState) return;

    gsap.killTweensOf([
      darkRef.current,
      accentRef.current,
      photoRef.current,
      contentRef.current,
      linksRef.current,
    ]);

    setOpenState(false);

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(rootRef.current, {
          autoAlpha: 0,
          pointerEvents: "none",
        });

        unlockScroll();
      },
    });

    // 1. Cover the menu quickly.
    tl.to(darkRef.current, {
      yPercent: 0,
      duration: 0.4,
      ease: "power3.inOut",
    })
      .to(
        accentRef.current,
        {
          yPercent: 0,
          duration: 0.32,
          ease: "power3.inOut",
        },
        "-=0.18"
      )

      // 2. The menu is now completely hidden.
      // Reset everything instantly behind the curtains.
      .set(contentRef.current, {
        autoAlpha: 0,
      })
      .set(linksRef.current, {
        yPercent: 115,
        autoAlpha: 0,
      })
      .set(surfaceRef.current, {
        autoAlpha: 0,
      })
      .set(photoRef.current, {
        yPercent: -120,
      })

      // 3. Lift the curtains together.
      .to([accentRef.current, darkRef.current], {
        yPercent: -100,
        duration: 0.3,
        ease: "power3.inOut",
      });
  };

  const toggle = () => (openState ? close() : open());

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={openState}
        aria-controls="fullscreen-menu"
        className="fixed right-6 top-5 z-60 text-xs font-semibold uppercase tracking-[0.25em] text-white mix-blend-difference"
      >
        {openState ? "Close" : "Menu"}
      </button>

      <div
        id="fullscreen-menu"
        ref={rootRef}
        aria-hidden={!openState}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        {/* Layer 1: the resting menu surface. It does not move. */}
        <div
          ref={surfaceRef}
          className="absolute inset-0 bg-(--cream)"
        />

        {/* Layer 2: the image is clipped by its frame and enters independently. */}
        <div className="absolute bottom-0 right-0 z-10 h-[34vh] w-full overflow-hidden md:w-[42vw]">
          <img
            ref={photoRef}
            src="/assets/board.jpg"
            alt="Editorial detail"
            className="absolute inset-0 h-full w-full object-cover grayscale"
          />
        </div>

        {/* Layer 3 + 4: the actual moving curtains. */}
        <div
          ref={darkRef}
          aria-hidden="true"
          className="absolute inset-0 z-40 bg-(--ink)"
        />
        <div
          ref={accentRef}
          aria-hidden="true"
          className="absolute inset-0 z-50 bg-(--accent)"
        />

        <div
          ref={contentRef}
          className="relative z-20 flex h-full flex-col px-6 pt-28 pb-8 text-(--ink) md:px-10"
        >
          <div className="flex flex-1 items-start">
            <nav aria-label="Primary navigation">
              <ul className="flex flex-col items-start">
                {LINKS.map((label, index) => (
                  <li key={label}>
                    <a
                      href={`#${label.toLowerCase()}`}
                      ref={(node) => {
                        if (node) linksRef.current[index] = node;
                      }}
                      className="block overflow-hidden px-2 py-1 text-[clamp(3rem,7vw,7rem)] font-semibold uppercase leading-[0.82] tracking-[-0.06em]"
                      onClick={close}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
