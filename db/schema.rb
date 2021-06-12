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

ActiveRecord::Schema.define(version: 2021_06_12_230805) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

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

  create_table "talents", force: :cascade do |t|
    t.string "username", null: false
    t.string "wallet_id", null: false
    t.string "description"
    t.string "public_key"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id"
    t.index ["public_key"], name: "index_talents_on_public_key", unique: true
    t.index ["user_id"], name: "index_talents_on_user_id"
    t.index ["username"], name: "index_talents_on_username", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "email"
    t.string "encrypted_password", limit: 128
    t.string "remember_token", limit: 128, null: false
    t.string "role", null: false
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

end
