<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_lists', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->bigInteger('order_id_number');
            $table->bigInteger('order_product_id');
            $table->string('order_product_name');
            $table->string('order_product_category_name');
            $table->string('order_product_variant');
            $table->decimal('order_product_original_price', 8, 2);
            $table->string('order_product_note')->nullable();
            $table->decimal('order_product_price', 8, 2);
            $table->integer('order_qty');
            $table->foreign('order_id_number')->references('order_id_number')->on('orders')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();

            $table->index('user_id');
            $table->index('order_id_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_lists');
    }
};
