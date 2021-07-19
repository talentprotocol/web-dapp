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

ActiveRecord::Schema.define(version: 2021_07_19_141349) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "alert_configurations", force: :cascade do |t|
    t.string "page", null: false
    t.string "alert_type"
    t.string "text"
    t.string "href"
    t.string "button_text"
    t.string "css_class"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["page"], name: "index_alert_configurations_on_page", unique: true
  end

  create_table "career_goals", force: :cascade do |t|
    t.text "description"
    t.bigint "talent_id", null: false
    t.date "target_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["talent_id"], name: "index_career_goals_on_talent_id"
  end

  create_table "coins", force: :cascade do |t|
    t.integer "price"
    t.integer "market_cap"
    t.string "ticker"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "talent_id"
    t.index ["talent_id"], name: "index_coins_on_talent_id"
    t.index ["ticker"], name: "index_coins_on_ticker"
  end

  create_table "investors", force: :cascade do |t|
    t.string "username", null: false
    t.string "wallet_id", null: false
    t.string "description"
    t.string "public_key"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id"
    t.index ["public_key"], name: "index_investors_on_public_key", unique: true
    t.index ["user_id"], name: "index_investors_on_user_id"
    t.index ["username"], name: "index_investors_on_username", unique: true
  end

  create_table "messages", force: :cascade do |t|
    t.integer "sender_id"
    t.integer "receiver_id"
    t.string "text"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["receiver_id"], name: "index_messages_on_receiver_id"
    t.index ["sender_id"], name: "index_messages_on_sender_id"
  end

  create_table "rewards", force: :cascade do |t|
    t.integer "required_amount"
    t.text "description"
    t.bigint "talent_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["talent_id"], name: "index_rewards_on_talent_id"
  end

  create_table "talent", force: :cascade do |t|
    t.string "username", null: false
    t.string "wallet_id", null: false
    t.string "description"
    t.string "public_key"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id"
    t.datetime "ito_date"
    t.string "category"
    t.integer "activity_count", default: 0
    t.string "linkedin_url"
    t.text "profile_picture_data"
    t.string "youtube_url"
    t.index ["activity_count"], name: "index_talent_on_activity_count"
    t.index ["category"], name: "index_talent_on_category"
    t.index ["ito_date"], name: "index_talent_on_ito_date"
    t.index ["public_key"], name: "index_talent_on_public_key", unique: true
    t.index ["user_id"], name: "index_talent_on_user_id"
    t.index ["username"], name: "index_talent_on_username", unique: true
  end

  create_table "transactions", force: :cascade do |t|
    t.integer "amount"
    t.string "status"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "coin_id"
    t.bigint "investor_id"
    t.index ["coin_id"], name: "index_transactions_on_coin_id"
    t.index ["investor_id"], name: "index_transactions_on_investor_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "email"
    t.string "encrypted_password", limit: 128
    t.string "remember_token", limit: 128, null: false
    t.string "role"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "confirmation_token", limit: 128
    t.string "external_id"
    t.integer "sign_in_count", default: 0
    t.datetime "last_sign_in_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["external_id"], name: "index_users_on_external_id"
    t.index ["remember_token"], name: "index_users_on_remember_token"
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  create_table "wait_list", force: :cascade do |t|
    t.boolean "approved", default: false
    t.string "email", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["approved"], name: "index_wait_list_on_approved"
    t.index ["email"], name: "index_wait_list_on_email", unique: true
  end

  add_foreign_key "career_goals", "talent"
  add_foreign_key "coins", "talent"
  add_foreign_key "rewards", "talent"
  add_foreign_key "transactions", "coins"
  add_foreign_key "transactions", "investors"
end
