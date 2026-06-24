class Feature < ApplicationRecord
  validates :title, presence: true

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(:position, :title) }
  scope :by_category, ->(category) { where(category: category) }
end
