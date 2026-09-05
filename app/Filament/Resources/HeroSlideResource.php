<?php

namespace App\Filament\Resources;

use App\Filament\Resources\HeroSlideResource\Pages;
use App\Models\HeroSlide;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class HeroSlideResource extends Resource
{
    protected static ?string $model = HeroSlide::class;
    protected static ?string $navigationIcon = 'heroicon-o-photo';
    protected static ?string $navigationLabel = 'Hero Slides';
    protected static ?string $navigationGroup = 'Storefront';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([

            Forms\Components\Section::make('Slide Content')
                ->description('Configure what media appears on this slide.')
                ->schema([

                    Forms\Components\Select::make('type')
                        ->label('Slide Type')
                        ->options([
                            'image' => '🖼️  Image',
                            'video' => '🎬  Video',
                        ])
                        ->default('image')
                        ->required()
                        ->live()
                        ->columnSpanFull(),

                    // IMAGE tab
                    Forms\Components\Fieldset::make('Image Source')
                        ->schema([
                            Forms\Components\Tabs::make('Image Input')
                                ->tabs([
                                    Forms\Components\Tabs\Tab::make('Upload File')
                                        ->icon('heroicon-o-arrow-up-tray')
                                        ->schema([
                                            Forms\Components\FileUpload::make('src')
                                                ->label('Upload Image')
                                                ->image()
                                                ->imageEditor()
                                                ->directory('hero-slides')
                                                ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                                                ->maxSize(5120)
                                                ->helperText('Max 5MB · JPG, PNG, WebP'),
                                        ]),
                                    Forms\Components\Tabs\Tab::make('External URL')
                                        ->icon('heroicon-o-link')
                                        ->schema([
                                            Forms\Components\TextInput::make('src')
                                                ->label('Image URL')
                                                ->url()
                                                ->placeholder('https://images.unsplash.com/...')
                                                ->helperText('Paste any public image URL (Unsplash, CDN, etc.)'),
                                        ]),
                                ])
                                ->columnSpanFull(),
                        ])
                        ->visible(fn (Get $get) => $get('type') === 'image')
                        ->columnSpanFull(),

                    // VIDEO section
                    Forms\Components\Fieldset::make('Video Source')
                        ->schema([
                            Forms\Components\TextInput::make('src')
                                ->label('Video URL (.mp4)')
                                ->url()
                                ->placeholder('https://assets.mixkit.co/videos/... or /storage/hero-slides/video.mp4')
                                ->helperText('Direct MP4 video URL. Use Mixkit, Coverr, or upload to storage.')
                                ->required()
                                ->columnSpanFull(),

                            Forms\Components\Fieldset::make('Poster / Thumbnail')
                                ->description('Shown before the video loads')
                                ->schema([
                                    Forms\Components\Tabs::make('Poster Input')
                                        ->tabs([
                                            Forms\Components\Tabs\Tab::make('Upload Poster')
                                                ->icon('heroicon-o-arrow-up-tray')
                                                ->schema([
                                                    Forms\Components\FileUpload::make('poster')
                                                        ->label('Upload Poster Image')
                                                        ->image()
                                                        ->directory('hero-slides/posters')
                                                        ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp']),
                                                ]),
                                            Forms\Components\Tabs\Tab::make('Poster URL')
                                                ->icon('heroicon-o-link')
                                                ->schema([
                                                    Forms\Components\TextInput::make('poster')
                                                        ->label('Poster Image URL')
                                                        ->url()
                                                        ->placeholder('https://images.unsplash.com/...'),
                                                ]),
                                        ])
                                        ->columnSpanFull(),
                                ])
                                ->columnSpanFull(),
                        ])
                        ->visible(fn (Get $get) => $get('type') === 'video')
                        ->columnSpanFull(),

                ]),

            Forms\Components\Section::make('Overlay Text')
                ->description('Text shown over the slide at the bottom-left.')
                ->columns(2)
                ->schema([
                    Forms\Components\TextInput::make('label')
                        ->label('Slide Title')
                        ->placeholder('The Bloom Edit')
                        ->maxLength(60),

                    Forms\Components\TextInput::make('sub')
                        ->label('Subtitle / Tag')
                        ->placeholder('New Season Arrivals')
                        ->maxLength(60),
                ]),

            Forms\Components\Section::make('Visibility & Order')
                ->columns(2)
                ->schema([
                    Forms\Components\TextInput::make('sort_order')
                        ->label('Order (lower = first)')
                        ->numeric()
                        ->default(0)
                        ->minValue(0),

                    Forms\Components\Toggle::make('is_active')
                        ->label('Show on homepage')
                        ->default(true)
                        ->onColor('success')
                        ->offColor('danger'),
                ]),

        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('src')
                    ->label('Preview')
                    ->height(60)
                    ->width(80)
                    ->defaultImageUrl(fn (HeroSlide $r) => $r->type === 'video' ? null : null)
                    ->getStateUsing(fn (HeroSlide $r) => str_starts_with($r->src, 'http') ? $r->src : asset('storage/' . $r->src))
                    ->visible(fn (HeroSlide $r) => $r->type === 'image'),

                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'image' => 'info',
                        'video' => 'warning',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'image' => '🖼️  Image',
                        'video' => '🎬  Video',
                        default => $state,
                    }),

                Tables\Columns\TextColumn::make('label')
                    ->label('Title')
                    ->searchable()
                    ->default('—'),

                Tables\Columns\TextColumn::make('sub')
                    ->label('Subtitle')
                    ->color('gray')
                    ->default('—'),

                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Order')
                    ->sortable(),

                Tables\Columns\ToggleColumn::make('is_active')
                    ->label('Active')
                    ->onColor('success')
                    ->offColor('danger'),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options(['image' => 'Image', 'video' => 'Video']),
                Tables\Filters\TernaryFilter::make('is_active')->label('Active'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No hero slides yet')
            ->emptyStateDescription('Add your first slide using the button above.')
            ->emptyStateIcon('heroicon-o-photo');
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListHeroSlides::route('/'),
            'create' => Pages\CreateHeroSlide::route('/create'),
            'edit'   => Pages\EditHeroSlide::route('/{record}/edit'),
        ];
    }
}
