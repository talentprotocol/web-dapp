class ChangeNotifications < ActiveRecord::Migration[6.1]
  def change
    add_reference :notifications, :recipient, polymorphic: true
    add_column :notifications, :params, :jsonb
    add_column :notifications, :read_at, :datetime
    add_index :notifications, :read_at

    reversible do |dir|
      dir.up do
        execute <<~SQL
          DELETE FROM notifications WHERE type = 'Notifications::TalentListed';

          UPDATE notifications SET
            type = regexp_replace(type, 'Notifications::(.+)', '\\1Notification');

          UPDATE notifications SET
            recipient_id = user_id,
            recipient_type = 'User',
            params = jsonb_build_object(
              'body', body,
              'source_id', source_id,
              'title', title);

          UPDATE notifications SET read_at = NOW() WHERE read;
        SQL
      end

      dir.down do
        execute <<~SQL
          UPDATE notifications SET read = TRUE WHERE read_at IS NOT NULL;

          UPDATE notifications SET
            user_id = recipient_id,
            body = params->>'body',
            source_id = CASE WHEN params->>'source_id' IS NOT NULL
                        THEN (params->'source_id')::bigint END,
            title = params->>'title';

          UPDATE notifications SET
            type = regexp_replace(type, '(.+)Notification', 'Notifications::\\1');
        SQL
      end
    end

    change_column_null :notifications, :recipient_id, false
    change_column_null :notifications, :recipient_type, false
    change_column_default :notifications, :type, from: "", to: nil
    remove_reference :notifications, :user, index: true
    remove_reference :notifications, :source, index: true
    remove_column :notifications, :body, :text, default: "", null: false
    remove_column :notifications, :title, :text, default: "", null: false
    remove_column :notifications, :read, :boolean, default: false
  end
end
