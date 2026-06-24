class CreateLeads < ActiveRecord::Migration[7.1]
  def change
    create_table :leads do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :phone, null: false
      t.string :company_name
      t.string :company_size
      t.string :interest, null: false
      t.text :message
      t.string :source, null: false, default: "website"
      t.integer :status, null: false, default: 0
      t.boolean :accepted_terms, null: false, default: false

      t.timestamps
    end

    add_index :leads, :email
    add_index :leads, :interest
    add_index :leads, :status
    add_index :leads, :created_at
  end
end
