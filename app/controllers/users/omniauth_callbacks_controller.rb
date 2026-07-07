module Users
  class OmniauthCallbacksController < Devise::OmniauthCallbacksController
    def google_oauth2
      @user = User.from_omniauth(request.env["omniauth.auth"])

      if @user.persisted?
        sign_in_and_redirect @user, event: :authentication
        set_flash_message(:notice, :success, kind: "Google") if is_navigational_format?
      else
        session["devise.google_data"] = request.env["omniauth.auth"].except("extra")
        redirect_to new_user_registration_url, alert: "Não foi possível entrar com Google."
      end
    rescue StandardError => e
      Rails.logger.error("[Google OAuth] #{e.class}: #{e.message}")
      redirect_to new_user_session_path, alert: "Não foi possível entrar com Google. Tente novamente."
    end

    def failure
      redirect_to new_user_session_path, alert: "Autenticação cancelada ou não autorizada."
    end
  end
end
