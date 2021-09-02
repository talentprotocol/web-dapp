class Admin::WaitListController < ApplicationController
  before_action :set_wait_list, only: [:show, :edit, :update, :destroy]

  def index
    @pagy, @wait_list = pagy(get_wait_list.order(id: :desc))
  end

  def show
  end

  def new
    @wait_list = WaitList.new
  end

  def create
    @wait_list = WaitList.new(wait_list_params)

    if @wait_list.save
      redirect_to(
        admin_wait_list_path(@wait_list),
        flash: {success: "Successfully added to wait list."}
      )
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @wait_list.update(wait_list_params)
      redirect_to(
        admin_wait_list_path(@wait_list),
        flash: {success: "Wait list successfully updated."}
      )
    else
      render :edit
    end
  end

  def destroy
    if @wait_list.destroy
      redirect_to(
        admin_wait_list_index_path,
        flash: {warning: "Wait list successfully destroyed."}
      )
    else
      render :show
    end
  end

  private

  def get_wait_list
    if params[:search]
      WaitList.where("email ilike ?", "%#{params[:search]}%")
    else
      WaitList.all
    end
  end

  def set_wait_list
    @wait_list = WaitList.find(params[:id])
  end

  def wait_list_params
    params.require(:wait_list).permit(
      :approved,
      :talent,
      :email
    )
  end
end
