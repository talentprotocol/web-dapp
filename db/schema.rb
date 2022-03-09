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

ActiveRecord::Schema.define(version: 2022_02_24_105745) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "career_goals", force: :cascade do |t|
    t.text "description"
    t.bigint "talent_id", null: false
    t.date "target_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "bio"
    t.string "pitch"
    t.string "challenges"
    t.index ["talent_id"], name: "index_career_goals_on_talent_id"
  end

  create_table "comments", force: :cascade do |t|
    t.text "text"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id"
    t.bigint "post_id"
    t.index ["post_id"], name: "index_comments_on_post_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "discovery_rows", force: :cascade do |t|
    t.string "title", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "badge"
    t.string "badge_link"
  end

  create_table "feed_posts", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "feed_id"
    t.bigint "post_id"
    t.index ["feed_id", "post_id"], name: "index_feed_posts_on_feed_id_and_post_id", unique: true
    t.index ["feed_id"], name: "index_feed_posts_on_feed_id"
    t.index ["post_id"], name: "index_feed_posts_on_post_id"
  end

  create_table "feeds", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id"
    t.index ["user_id"], name: "index_feeds_on_user_id"
  end

  create_table "follows", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id"
    t.bigint "follower_id"
    t.index ["follower_id"], name: "index_follows_on_follower_id"
    t.index ["user_id", "follower_id"], name: "index_follows_on_user_id_and_follower_id", unique: true
    t.index ["user_id"], name: "index_follows_on_user_id"
  end

  create_table "goals", force: :cascade do |t|
    t.date "due_date", null: false
    t.string "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "career_goal_id"
    t.string "title"
    t.index ["career_goal_id"], name: "index_goals_on_career_goal_id"
  end

  create_table "investors", force: :cascade do |t|
    t.string "description"
    t.string "public_key"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id"
    t.text "profile_picture_data"
    t.index ["public_key"], name: "index_investors_on_public_key", unique: true
    t.index ["user_id"], name: "index_investors_on_user_id"
  end

  create_table "invites", force: :cascade do |t|
    t.string "code", null: false
    t.integer "uses", default: 0
    t.integer "max_uses", default: 2
    t.boolean "talent_invite", default: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_invites_on_user_id"
  end

  create_table "marketing_articles", force: :cascade do |t|
    t.string "link", null: false
    t.string "title", null: false
    t.string "description"
    t.text "image_data"
    t.date "article_created_at"
    t.bigint "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_marketing_articles_on_user_id"
  end

  create_table "messages", force: :cascade do |t|
    t.integer "sender_id"
    t.integer "receiver_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "text_ciphertext"
    t.boolean "is_read", default: false, null: false
    t.index ["receiver_id"], name: "index_messages_on_receiver_id"
    t.index ["sender_id"], name: "index_messages_on_sender_id"
  end

  create_table "milestones", force: :cascade do |t|
    t.string "title", null: false
    t.date "start_date", null: false
    t.date "end_date"
    t.string "description"
    t.string "link"
    t.string "institution"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "talent_id"
    t.index ["talent_id"], name: "index_milestones_on_talent_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.string "type", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "recipient_type", null: false
    t.bigint "recipient_id", null: false
    t.jsonb "params"
    t.datetime "read_at"
    t.datetime "emailed_at"
    t.index ["read_at"], name: "index_notifications_on_read_at"
    t.index ["recipient_type", "recipient_id"], name: "index_notifications_on_recipient"
  end

  create_table "perks", force: :cascade do |t|
    t.integer "price", null: false
    t.string "title", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "talent_id"
    t.index ["talent_id"], name: "index_perks_on_talent_id"
  end

  create_table "posts", force: :cascade do |t|
    t.text "text"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id"
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "discovery_row_id"
    t.boolean "hidden", default: false
    t.index ["description"], name: "index_tags_on_description"
    t.index ["discovery_row_id"], name: "index_tags_on_discovery_row_id"
  end

  create_table "talent", force: :cascade do |t|
    t.string "public_key"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id"
    t.datetime "ito_date"
    t.integer "activity_count", default: 0
    t.text "profile_picture_data"
    t.boolean "public", default: false
    t.jsonb "profile", default: {}
    t.boolean "disable_messages", default: false
    t.text "banner_data"
    t.boolean "token_launch_reminder_sent", default: false
    t.string "notion_page_id"
    t.index ["activity_count"], name: "index_talent_on_activity_count"
    t.index ["ito_date"], name: "index_talent_on_ito_date"
    t.index ["public_key"], name: "index_talent_on_public_key", unique: true
    t.index ["user_id"], name: "index_talent_on_user_id"
  end

  create_table "talent_tags", force: :cascade do |t|
    t.bigint "talent_id"
    t.bigint "tag_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["tag_id"], name: "index_talent_tags_on_tag_id"
    t.index ["talent_id", "tag_id"], name: "index_talent_tags_on_talent_id_and_tag_id", unique: true
    t.index ["talent_id"], name: "index_talent_tags_on_talent_id"
  end

  create_table "tokens", force: :cascade do |t|
    t.string "ticker"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "talent_id"
    t.boolean "deployed", default: false
    t.string "contract_id"
    t.datetime "deployed_at"
    t.index ["talent_id"], name: "index_tokens_on_talent_id"
    t.index ["ticker"], name: "index_tokens_on_ticker", unique: true
  end

  create_table "transfers", force: :cascade do |t|
    t.bigint "amount"
    t.string "tx_hash"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id"
    t.index ["user_id"], name: "index_transfers_on_user_id"
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
    t.integer "sign_in_count", default: 0
    t.datetime "last_sign_in_at"
    t.string "wallet_id"
    t.string "nounce"
    t.string "email_confirmation_token", default: "", null: false
    t.datetime "email_confirmed_at"
    t.string "display_name"
    t.bigint "invite_id"
    t.boolean "welcome_pop_up", default: false
    t.boolean "tokens_purchased", default: false
    t.boolean "token_purchase_reminder_sent", default: false
    t.string "theme_preference", default: "light"
    t.boolean "disabled", default: false
    t.boolean "messaging_disabled", default: false
    t.jsonb "notification_preferences", default: {}
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invite_id"], name: "index_users_on_invite_id"
    t.index ["remember_token"], name: "index_users_on_remember_token"
    t.index ["username"], name: "index_users_on_username", unique: true
    t.index ["wallet_id"], name: "index_users_on_wallet_id", unique: true
  end

  create_table "wait_list", force: :cascade do |t|
    t.boolean "approved", default: false
    t.string "email", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "talent", default: false
    t.index ["approved"], name: "index_wait_list_on_approved"
    t.index ["email"], name: "index_wait_list_on_email", unique: true
  end

  add_foreign_key "career_goals", "talent"
  add_foreign_key "comments", "posts"
  add_foreign_key "comments", "users"
  add_foreign_key "feed_posts", "feeds"
  add_foreign_key "feed_posts", "posts"
  add_foreign_key "feeds", "users"
  add_foreign_key "follows", "users"
  add_foreign_key "follows", "users", column: "follower_id"
  add_foreign_key "goals", "career_goals"
  add_foreign_key "invites", "users"
  add_foreign_key "marketing_articles", "users"
  add_foreign_key "milestones", "talent"
  add_foreign_key "perks", "talent"
  add_foreign_key "posts", "users"
  add_foreign_key "tags", "discovery_rows"
  add_foreign_key "talent_tags", "tags"
  add_foreign_key "talent_tags", "talent"
  add_foreign_key "tokens", "talent"
  add_foreign_key "transfers", "users"
end
