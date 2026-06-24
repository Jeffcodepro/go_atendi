class Solution < ApplicationRecord
  validates :title, presence: true

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(:position, :title) }
  scope :by_audience, ->(audience) { where(audience: audience) }
end
