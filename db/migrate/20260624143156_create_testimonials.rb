class CreateTestimonials < ActiveRecord::Migration[7.1]
  def change
    create_table :testimonials do |t|
      t.string :name, null: false
      t.string :role
      t.string :company_name
      t.text :quote, null: false
      t.boolean :active, null: false, default: true
      t.integer :position, null: false, default: 0

      t.timestamps
    end

    add_index :testimonials, :active
    add_index :testimonials, :position
  end
end
