class CreatePlans < ActiveRecord::Migration[7.1]
  def change
    create_table :plans do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.text :description
      t.integer :price_cents, null: false, default: 0
      t.string :billing_period, null: false, default: "monthly"
      t.boolean :highlighted, null: false, default: false
      t.boolean :active, null: false, default: true
      t.integer :position, null: false, default: 0
      t.string :cta_label
      t.string :cta_url

      t.timestamps
    end

    add_index :plans, :slug, unique: true
    add_index :plans, :active
    add_index :plans, :position
  end
end
