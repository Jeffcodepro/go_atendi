class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:google_oauth2]

  validates :full_name, presence: true, on: :create, unless: :oauth_user?
  validates :phone, presence: true, on: :create, unless: :oauth_user?
  validates :company_name, presence: true, on: :create, unless: :oauth_user?

  def self.from_omniauth(auth)
    user = where(provider: auth.provider, uid: auth.uid).first_or_initialize

    user.email = auth.info.email
    user.full_name = auth.info.name if user.respond_to?(:full_name) && user.full_name.blank?
    user.avatar_url = auth.info.image if user.respond_to?(:avatar_url) && user.avatar_url.blank?
    user.password = Devise.friendly_token[0, 24] if user.encrypted_password.blank?

    user.save!
    user
  end

  def oauth_user?
    provider.present? && uid.present?
  end
end
