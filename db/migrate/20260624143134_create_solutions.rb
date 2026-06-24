class CreateSolutions < ActiveRecord::Migration[7.1]
  def change
    create_table :solutions do |t|
      t.string :title, null: false
      t.string :subtitle
      t.text :description
      t.string :icon
      t.string :audience
      t.boolean :active, null: false, default: true
      t.integer :position, null: false, default: 0

      t.timestamps
    end

    add_index :solutions, :active
    add_index :solutions, :audience
    add_index :solutions, :position
  end
end
