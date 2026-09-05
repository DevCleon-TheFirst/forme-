<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;
    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';
    protected static ?string $navigationGroup = 'Sales';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Order Info')->schema([
                Forms\Components\TextInput::make('order_number')->disabled(),
                Forms\Components\Select::make('status')
                    ->options(['pending' => 'Pending', 'processing' => 'Processing', 'shipped' => 'Shipped', 'delivered' => 'Delivered', 'cancelled' => 'Cancelled'])
                    ->required(),
                Forms\Components\Select::make('payment_status')
                    ->options(['unpaid' => 'Unpaid', 'paid' => 'Paid', 'refunded' => 'Refunded'])
                    ->required(),
                Forms\Components\TextInput::make('payment_reference')->disabled(),
            ])->columns(2),

            Forms\Components\Section::make('Customer')->schema([
                Forms\Components\TextInput::make('customer_name')->disabled(),
                Forms\Components\TextInput::make('customer_email')->disabled(),
                Forms\Components\TextInput::make('customer_phone')->disabled(),
            ])->columns(3),

            Forms\Components\Section::make('Shipping')->schema([
                Forms\Components\TextInput::make('shipping_address')->disabled()->columnSpanFull(),
                Forms\Components\TextInput::make('shipping_city')->disabled(),
                Forms\Components\TextInput::make('shipping_state')->disabled(),
                Forms\Components\TextInput::make('shipping_country')->disabled(),
            ])->columns(3),

            Forms\Components\Section::make('Totals')->schema([
                Forms\Components\TextInput::make('subtotal')->disabled()->prefix('₦'),
                Forms\Components\TextInput::make('shipping_fee')->disabled()->prefix('₦'),
                Forms\Components\TextInput::make('total_amount')->disabled()->prefix('₦'),
            ])->columns(3),

            Forms\Components\Section::make('Notes')->schema([
                Forms\Components\Textarea::make('notes')->disabled()->columnSpanFull(),
            ]),

            Forms\Components\Section::make('Order Items')->schema([
                Forms\Components\Repeater::make('items')
                    ->relationship('items')
                    ->schema([
                        Forms\Components\TextInput::make('product_name')
                            ->disabled()
                            ->label('Product'),
                        Forms\Components\TextInput::make('variant_description')
                            ->disabled()
                            ->label('Variant'),
                        Forms\Components\TextInput::make('quantity')
                            ->disabled()
                            ->numeric(),
                        Forms\Components\TextInput::make('unit_price')
                            ->disabled()
                            ->prefix('₦')
                            ->label('Unit Price'),
                        Forms\Components\TextInput::make('total_price')
                            ->disabled()
                            ->prefix('₦')
                            ->label('Line Total'),
                    ])
                    ->columns(5)
                    ->disabled()
                    ->deletable(false)
                    ->addable(false)
                    ->reorderable(false),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('order_number')->searchable()->sortable(),
            Tables\Columns\TextColumn::make('customer_name')->searchable(),
            Tables\Columns\TextColumn::make('customer_email')->searchable(),
            Tables\Columns\BadgeColumn::make('status')
                ->colors(['warning' => 'pending', 'primary' => 'processing', 'info' => 'shipped', 'success' => 'delivered', 'danger' => 'cancelled']),
            Tables\Columns\BadgeColumn::make('payment_status')
                ->colors(['danger' => 'unpaid', 'success' => 'paid', 'warning' => 'refunded']),
            Tables\Columns\TextColumn::make('total_amount')->money('NGN')->sortable(),
            Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable(),
        ])
        ->defaultSort('created_at', 'desc')
        ->filters([
            Tables\Filters\SelectFilter::make('status')
                ->options(['pending' => 'Pending', 'processing' => 'Processing', 'shipped' => 'Shipped', 'delivered' => 'Delivered', 'cancelled' => 'Cancelled']),
            Tables\Filters\SelectFilter::make('payment_status')
                ->options(['unpaid' => 'Unpaid', 'paid' => 'Paid', 'refunded' => 'Refunded']),
        ])
        ->actions([Tables\Actions\ViewAction::make(), Tables\Actions\EditAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListOrders::route('/'),
            'view'   => Pages\ViewOrder::route('/{record}'),
            'edit'   => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
