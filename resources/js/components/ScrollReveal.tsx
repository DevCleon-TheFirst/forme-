import React, { useEffect, useRef } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    animation?: string;
    delay?: number;
    delayMs?: number;
    threshold?: number;
    as?: React.ElementType;
}

export default function ScrollReveal({
    children,
    className = '',
    style,
    animation,
    delay,
    delayMs,
    threshold = 0.15,
    as: Component = 'div',
}: ScrollRevealProps) {
    const finalDelay = delay ?? delayMs ?? 0;
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('reveal-visible');
                    observer.unobserve(el);
                }
            },
            {
                threshold,
                rootMargin: '0px 0px -40px 0px',
            }
        );

        observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
        };
    }, [threshold]);

    return (
        <Component
            ref={ref}
            className={`reveal-on-scroll ${className}`}
            style={{ ...style, ...(finalDelay ? { transitionDelay: `${finalDelay}ms` } : {}) }}
        >
            {children}
        </Component>
    );
}
