<?php

namespace App\Filament\Pages;

use App\Models\StoreSetting;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class StoreSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-megaphone';
    protected static ?string $navigationGroup = 'System';
    protected static ?string $title = 'Store Settings';

    protected static string $view = 'filament.pages.store-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $setting = StoreSetting::firstOrCreate(['id' => 1], [
            'announcement_text' => 'Free Shipping on Orders Over ₦50,000',
            'announcement_link' => '/shop',
            'announcement_is_active' => true,
        ]);
        
        $this->form->fill($setting->attributesToArray());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Announcement Bar')
                    ->description('Manage the global announcement bar shown at the top of the store.')
                    ->schema([
                        Forms\Components\Toggle::make('announcement_is_active')
                            ->label('Show Announcement Bar')
                            ->default(true),
                        Forms\Components\TextInput::make('announcement_text')
                            ->label('Announcement Text')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('announcement_link')
                            ->label('Link URL')
                            ->placeholder('/shop')
                            ->nullable()
                            ->maxLength(255),
                    ])
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        try {
            $data = $this->form->getState();
            
            $setting = StoreSetting::first();
            $setting->update($data);

            Notification::make()
                ->title('Saved successfully')
                ->success()
                ->send();
        } catch (\Exception $e) {
            Notification::make()
                ->title('Failed to save')
                ->danger()
                ->send();
        }
    }
}
