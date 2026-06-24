class CreateFeatures < ActiveRecord::Migration[7.1]
  def change
    create_table :features do |t|
      t.string :title, null: false
      t.string :subtitle
      t.text :description
      t.string :icon
      t.string :category
      t.boolean :active, null: false, default: true
      t.integer :position, null: false, default: 0

      t.timestamps
    end

    add_index :features, :active
    add_index :features, :category
    add_index :features, :position
  end
end
