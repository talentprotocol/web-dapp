class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit_profile]

  def index
    if user_params[:email].present?
      @user = User.find_by(email: user_params[:email].downcase)
    elsif user_params[:username].present?
      @user = User.find_by(username: user_params[:username])
    end

    if @user.present?
      @user.update!(nounce: SecureRandom.uuid) if @user.nounce.nil?

      render json: {id: @user.id, nounce: @user.nounce}, status: :ok
    else
      render json: {error: "Couldn't find the user for that email or username"}, status: :not_found
    end
  end

  def show
    talent = @user.talent

    if talent
      @talent = TalentBlueprint.render_as_json(
        talent,
        view: :extended,
        current_user: current_user,
        tags: @user.tags.where(hidden: false)
      )
    else
      puts "investor"
    end
  end

  def create
    if !verify_captcha
      render json: {error: "We were unable to validate your captcha.", field: "captcha"}, status: :conflict
    elsif !User.valid_username?(user_params[:username])
      render json: {error: "Invalid username.", field: "username"}, status: :conflict
    elsif !User.valid_email?(user_params[:email])
      render json: {error: "Email is not valid.", field: "email"}, status: :conflict
    else
      service = CreateUser.new
      @result = service.call(
        email: user_params[:email],
        username: user_params[:username],
        password: user_params[:password],
        invite_code: user_params[:code],
        theme_preference: user_params[:theme_preference]
      )

      if @result[:success]
        UserMailer.with(user: @result[:user]).send_sign_up_email.deliver_later

        render json: @result[:user], status: :created
      else
        render json: @result, status: :conflict
      end
    end
  end

  def edit_profile
    if @user.id != current_user.id
      redirect_to root_url
    end

    @talent = @user.talent
    @investor = @user.investor
  end

  def send_confirmation_email
    UserMailer.with(user: User.find(params[:user_id])).send_sign_up_email.deliver_later

    render json: {id: params[:user_id]}, status: :ok
  end

  private

  def set_user
    @user = User.find_by!(username: params[:username])
  end

  def user_params
    params.permit(:email, :username, :password, :code, :captcha, :mode, :theme_preference)
  end

  def verify_captcha
    request = Faraday.post("https://www.google.com/recaptcha/api/siteverify",
      {
        secret: ENV["RECAPTCHA_SECRET_KEY"],
        response: user_params[:captcha]
      },
      {"Content-Type": "application/x-www-form-urlencoded"})

    result = JSON.parse(request.body)
    result["success"]
  end
end
