import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function revealSection(heading: Element | null, subtitle?: Element | null) {
  if (!heading) return;
  gsap.from([heading, subtitle].filter(Boolean) as Element[], {
    y: 50,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: { trigger: heading, start: 'top 88%' },
  });
}

export function revealCards(cards: Element[], stagger = 0.1) {
  if (!cards.length) return;
  gsap.from(cards, {
    y: 70,
    opacity: 0,
    duration: 0.75,
    stagger,
    ease: 'power3.out',
    scrollTrigger: { trigger: cards[0], start: 'top 88%' },
  });
}

export function countUp(element: Element, target: number, suffix = '') {
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: { trigger: element, start: 'top 85%', once: true },
    onUpdate: () => {
      element.textContent = Math.round(obj.val) + suffix;
    },
  });
}
