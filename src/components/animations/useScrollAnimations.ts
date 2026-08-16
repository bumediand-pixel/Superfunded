'use client';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export function useParallaxSection(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      const heroImg = el.querySelector('.hero-img');
      if (heroImg) {
        gsap.fromTo(heroImg, { scale: 1.15, opacity: 0.7 }, {
          scale: 1, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
        });
      }
      const layerFg = el.querySelector('.layer-fg');
      if (layerFg) {
        gsap.to(layerFg, { y: -80, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
      }
      const layerBg = el.querySelector('.layer-bg');
      if (layerBg) {
        gsap.to(layerBg, { y: -30, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 2 } });
      }
      const revealTexts = el.querySelectorAll('.reveal-text');
      if (revealTexts.length) {
        gsap.fromTo(revealTexts,
          { y: 60, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
          { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 0.9, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none reverse' } }
        );
      }
    }, el);
    return () => ctx.revert();
  }, [ref]);
}

export function useAmbientFloat(selector: string, intensity = 15) {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    const ctx = gsap.context(() => {
      gsap.to(selector, { y: `${intensity}px`, repeat: -1, yoyo: true, duration: 3, ease: 'sine.inOut', stagger: { each: 0.4, from: 'random' } });
    });
    return () => ctx.revert();
  }, [selector, intensity]);
}

export function useCounterAnimation(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll('[data-count]');
    const ctx = gsap.context(() => {
      els.forEach(el => {
        const target = parseInt(el.getAttribute('data-count') || '0');
        ScrollTrigger.create({
          trigger: el, start: 'top 85%',
          onEnter: () => {
            gsap.fromTo({ val: 0 }, { val: target }, {
              duration: 1.8, ease: 'power2.out',
              onUpdate: function () {
                el.textContent = Math.round((this.targets()[0] as { val: number }).val).toLocaleString('ro-RO');
              },
            });
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [ref]);
}
