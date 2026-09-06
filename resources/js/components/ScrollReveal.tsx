import React, { useEffect, useRef } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    delayMs?: number;
    threshold?: number;
    as?: React.ElementType;
}

export default function ScrollReveal({
    children,
    className = '',
    style,
    delayMs = 0,
    threshold = 0.15,
    as: Component = 'div',
}: ScrollRevealProps) {
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
            style={{ ...style, ...(delayMs ? { transitionDelay: `${delayMs}ms` } : {}) }}
        >
            {children}
        </Component>
    );
}
