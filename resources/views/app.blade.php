<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }

            #forme-preloader {
                position: fixed;
                inset: 0;
                z-index: 99999;
                background-color: oklch(1 0 0);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: opacity 0.6s ease-out, visibility 0.6s ease-out;
            }

            html.dark #forme-preloader {
                background-color: oklch(0.145 0 0);
            }

            #forme-preloader.hidden {
                opacity: 0;
                visibility: hidden;
            }

            .forme-logo-text {
                font-family: 'Syne', sans-serif; 
                font-size: 24px; 
                font-weight: 800; 
                letter-spacing: 8px; 
                text-transform: uppercase;
                color: #111;
                animation: pulse 1.5s ease-in-out infinite;
            }

            html.dark .forme-logo-text {
                color: #fff;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(0.98); }
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <div id="forme-preloader">
            <span class="forme-logo-text">FORME</span>
        </div>
        <script>
            window.addEventListener('load', function() {
                // Ensure a minimum display time for the preloader
                setTimeout(() => {
                    const preloader = document.getElementById('forme-preloader');
                    if (preloader) {
                        preloader.classList.add('hidden');
                        setTimeout(() => preloader.remove(), 600); // Remove from DOM after fade out
                    }
                }, 800);
            });
        </script>
        <x-inertia::app />
    </body>
</html>
