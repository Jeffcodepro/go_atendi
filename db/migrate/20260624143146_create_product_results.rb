class CreateProductResults < ActiveRecord::Migration[7.1]
  def change
    create_table :product_results do |t|
      t.string :title, null: false
      t.string :metric
      t.text :description
      t.string :icon
      t.boolean :active, null: false, default: true
      t.integer :position, null: false, default: 0

      t.timestamps
    end

    add_index :product_results, :active
    add_index :product_results, :position
  end
end
