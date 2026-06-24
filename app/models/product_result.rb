class ProductResult < ApplicationRecord
  validates :title, presence: true

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(:position, :title) }
end
