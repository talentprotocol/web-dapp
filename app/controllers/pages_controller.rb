class PagesController < ApplicationController
  def investor
    render layout: "investor"
  end

  def talent
    render layout: "talent"
  end

  def admin
    render layout: "admin"
  end

  def home
    render layout: "home"
  end

  private

  def verify_investor
    unless signed_in? && current_user.investor?
      deny_access_by_role
    end
  end

  def verify_talent
    unless signed_in? && current_user.talent?
      deny_access_by_role
    end
  end

  def verify_admin
    unless signed_in? && current_user.admin?
      deny_access_by_role
    end
  end
end
