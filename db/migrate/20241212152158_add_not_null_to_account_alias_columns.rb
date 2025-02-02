# frozen_string_literal: true

class AddNotNullToAccountAliasColumns < ActiveRecord::Migration[7.2]
  def up
    connection.execute(<<~SQL.squish)
      DELETE FROM account_aliases
      WHERE account_id IS NULL
    SQL

    safety_assured { change_column_null :account_aliases, :account_id, false }
  end

  def down
    safety_assured { change_column_null :account_aliases, :account_id, true }
  end
end
