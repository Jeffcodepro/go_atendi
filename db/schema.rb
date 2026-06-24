# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_06_24_143216) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "faqs", force: :cascade do |t|
    t.string "question", null: false
    t.text "answer", null: false
    t.string "category"
    t.boolean "active", default: true, null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_faqs_on_active"
    t.index ["category"], name: "index_faqs_on_category"
    t.index ["position"], name: "index_faqs_on_position"
  end

  create_table "features", force: :cascade do |t|
    t.string "title", null: false
    t.string "subtitle"
    t.text "description"
    t.string "icon"
    t.string "category"
    t.boolean "active", default: true, null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_features_on_active"
    t.index ["category"], name: "index_features_on_category"
    t.index ["position"], name: "index_features_on_position"
  end

  create_table "leads", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "phone", null: false
    t.string "company_name"
    t.string "company_size"
    t.string "interest", null: false
    t.text "message"
    t.string "source", default: "website", null: false
    t.integer "status", default: 0, null: false
    t.boolean "accepted_terms", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_leads_on_created_at"
    t.index ["email"], name: "index_leads_on_email"
    t.index ["interest"], name: "index_leads_on_interest"
    t.index ["status"], name: "index_leads_on_status"
  end

  create_table "plans", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.text "description"
    t.integer "price_cents", default: 0, null: false
    t.string "billing_period", default: "monthly", null: false
    t.boolean "highlighted", default: false, null: false
    t.boolean "active", default: true, null: false
    t.integer "position", default: 0, null: false
    t.string "cta_label"
    t.string "cta_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_plans_on_active"
    t.index ["position"], name: "index_plans_on_position"
    t.index ["slug"], name: "index_plans_on_slug", unique: true
  end

  create_table "product_results", force: :cascade do |t|
    t.string "title", null: false
    t.string "metric"
    t.text "description"
    t.string "icon"
    t.boolean "active", default: true, null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_product_results_on_active"
    t.index ["position"], name: "index_product_results_on_position"
  end

  create_table "solutions", force: :cascade do |t|
    t.string "title", null: false
    t.string "subtitle"
    t.text "description"
    t.string "icon"
    t.string "audience"
    t.boolean "active", default: true, null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_solutions_on_active"
    t.index ["audience"], name: "index_solutions_on_audience"
    t.index ["position"], name: "index_solutions_on_position"
  end

  create_table "testimonials", force: :cascade do |t|
    t.string "name", null: false
    t.string "role"
    t.string "company_name"
    t.text "quote", null: false
    t.boolean "active", default: true, null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_testimonials_on_active"
    t.index ["position"], name: "index_testimonials_on_position"
  end

end
