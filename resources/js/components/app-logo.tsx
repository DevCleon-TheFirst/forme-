import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <div className="flex items-center">
            <img 
                src="/images/forme-logo.png" 
                alt="Formé" 
                className="h-10 w-auto object-contain dark:brightness-0 dark:invert" 
            />
        </div>
    );
}
