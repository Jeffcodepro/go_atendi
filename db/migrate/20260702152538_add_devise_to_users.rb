# frozen_string_literal: true

class AddDeviseToUsers < ActiveRecord::Migration[7.1]
  def up
    # Database authenticatable
    unless column_exists?(:users, :email)
      add_column :users, :email, :string, null: false, default: ""
    else
      change_column_default :users, :email, ""
      execute "UPDATE users SET email = '' WHERE email IS NULL"
      change_column_null :users, :email, false
    end

    unless column_exists?(:users, :encrypted_password)
      add_column :users, :encrypted_password, :string, null: false, default: ""
    end

    # Recoverable
    unless column_exists?(:users, :reset_password_token)
      add_column :users, :reset_password_token, :string
    end

    unless column_exists?(:users, :reset_password_sent_at)
      add_column :users, :reset_password_sent_at, :datetime
    end

    # Rememberable
    unless column_exists?(:users, :remember_created_at)
      add_column :users, :remember_created_at, :datetime
    end

    # Trackable
    # Descomente se quiser rastrear logins no futuro.
    # add_column :users, :sign_in_count, :integer, default: 0, null: false unless column_exists?(:users, :sign_in_count)
    # add_column :users, :current_sign_in_at, :datetime unless column_exists?(:users, :current_sign_in_at)
    # add_column :users, :last_sign_in_at, :datetime unless column_exists?(:users, :last_sign_in_at)
    # add_column :users, :current_sign_in_ip, :inet unless column_exists?(:users, :current_sign_in_ip)
    # add_column :users, :last_sign_in_ip, :inet unless column_exists?(:users, :last_sign_in_ip)

    # Confirmable
    # Descomente se quiser confirmação de e-mail no futuro.
    # add_column :users, :confirmation_token, :string unless column_exists?(:users, :confirmation_token)
    # add_column :users, :confirmed_at, :datetime unless column_exists?(:users, :confirmed_at)
    # add_column :users, :confirmation_sent_at, :datetime unless column_exists?(:users, :confirmation_sent_at)
    # add_column :users, :unconfirmed_email, :string unless column_exists?(:users, :unconfirmed_email)

    # Lockable
    # Descomente se quiser bloqueio após tentativas erradas no futuro.
    # add_column :users, :failed_attempts, :integer, default: 0, null: false unless column_exists?(:users, :failed_attempts)
    # add_column :users, :unlock_token, :string unless column_exists?(:users, :unlock_token)
    # add_column :users, :locked_at, :datetime unless column_exists?(:users, :locked_at)

    unless index_exists?(:users, :email)
      add_index :users, :email, unique: true
    end

    unless index_exists?(:users, :reset_password_token)
      add_index :users, :reset_password_token, unique: true
    end

    # add_index :users, :confirmation_token, unique: true unless index_exists?(:users, :confirmation_token)
    # add_index :users, :unlock_token, unique: true unless index_exists?(:users, :unlock_token)
  end

  def down
    remove_index :users, :reset_password_token if index_exists?(:users, :reset_password_token)

    # Não removemos :email porque ela já existia antes do Devise.
    remove_column :users, :encrypted_password if column_exists?(:users, :encrypted_password)
    remove_column :users, :reset_password_token if column_exists?(:users, :reset_password_token)
    remove_column :users, :reset_password_sent_at if column_exists?(:users, :reset_password_sent_at)
    remove_column :users, :remember_created_at if column_exists?(:users, :remember_created_at)
  end
end
