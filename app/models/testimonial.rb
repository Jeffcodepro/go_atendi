class Testimonial < ApplicationRecord
  validates :name, presence: true
  validates :quote, presence: true

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(:position, :name) }
end
