<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Category;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;
    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';
    protected static ?string $navigationGroup = 'Catalogue';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Group::make()->schema([
                Forms\Components\Section::make('Product Details')->schema([
                    Forms\Components\TextInput::make('name')
                        ->required()
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                    Forms\Components\TextInput::make('slug')->required()->unique(ignoreRecord: true),
                    Forms\Components\Textarea::make('short_description')->rows(2),
                    Forms\Components\RichEditor::make('description')->columnSpanFull(),
                ])->columns(2),

                Forms\Components\Section::make('Images')->schema([
                    Forms\Components\Repeater::make('images')
                        ->relationship()
                        ->schema([
                            Forms\Components\FileUpload::make('image_path')
                                ->image()->required()->directory('products'),
                            Forms\Components\TextInput::make('alt_text'),
                            Forms\Components\Toggle::make('is_primary')->label('Primary Image'),
                            Forms\Components\TextInput::make('sort_order')->numeric()->default(0),
                        ])->columns(2),
                ]),

                Forms\Components\Section::make('Variants')->schema([
                    Forms\Components\Repeater::make('variants')
                        ->relationship()
                        ->schema([
                            Forms\Components\TextInput::make('color'),
                            Forms\Components\ColorPicker::make('color_hex')->label('Hex'),
                            Forms\Components\TextInput::make('size'),
                            Forms\Components\TextInput::make('sku'),
                            Forms\Components\TextInput::make('price_modifier')->numeric()->prefix('₦')->default(0),
                            Forms\Components\TextInput::make('stock_quantity')->numeric()->default(0),
                            Forms\Components\Toggle::make('is_active')->default(true),
                        ])->columns(3),
                ]),

                Forms\Components\Section::make('Additional Info')->schema([
                    Forms\Components\TextInput::make('material'),
                    Forms\Components\TextInput::make('care_instructions'),
                ])->columns(2),
            ])->columnSpan(2),

            Forms\Components\Group::make()->schema([
                Forms\Components\Section::make('Status')->schema([
                    Forms\Components\Select::make('category_id')
                        ->label('Category')
                        ->options(Category::pluck('name', 'id'))
                        ->searchable()
                        ->required(),
                    Forms\Components\Select::make('gender')
                        ->options([
                            'female' => 'Female',
                            'male' => 'Male',
                            'kids' => 'Kids',
                            'unisex' => 'Unisex',
                        ])
                        ->required()
                        ->default('female'),
                    Forms\Components\Toggle::make('is_active')->default(true),
                    Forms\Components\Toggle::make('is_featured'),
                    Forms\Components\TextInput::make('sort_order')->numeric()->default(0),
                ]),

                Forms\Components\Section::make('Pricing')->schema([
                    Forms\Components\TextInput::make('base_price')->required()->numeric()->prefix('₦'),
                    Forms\Components\TextInput::make('compare_price')->numeric()->prefix('₦')
                        ->helperText('Original price (for sale display)'),
                ]),
            ])->columnSpan(1),
        ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\ImageColumn::make('primary_image')->state(fn ($record) => $record->primaryImage()?->image_path)->disk('public')->label(''),
            Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
            Tables\Columns\TextColumn::make('category.name')->sortable(),
            Tables\Columns\TextColumn::make('gender')->sortable()->badge()->color(fn (string $state): string => match ($state) {
                'female' => 'pink',
                'male' => 'blue',
                'kids' => 'success',
                'unisex' => 'gray',
                default => 'gray',
            }),
            Tables\Columns\TextColumn::make('base_price')->money('NGN')->sortable(),
            Tables\Columns\TextColumn::make('variants_count')->counts('variants')->label('Variants'),
            Tables\Columns\IconColumn::make('is_featured')->boolean()->label('Featured'),
            Tables\Columns\IconColumn::make('is_active')->boolean()->label('Active'),
        ])
        ->filters([
            Tables\Filters\SelectFilter::make('category')->relationship('category', 'name'),
            Tables\Filters\SelectFilter::make('gender')->options([
                'female' => 'Female',
                'male' => 'Male',
                'kids' => 'Kids',
                'unisex' => 'Unisex',
            ]),
            Tables\Filters\TernaryFilter::make('is_featured'),
            Tables\Filters\TernaryFilter::make('is_active'),
        ])
        ->groups([
            Tables\Grouping\Group::make('category.name')
                ->label('Category'),
        ])
        ->defaultGroup('category.name')
        ->actions([Tables\Actions\EditAction::make()])
        ->bulkActions([Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit'   => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
