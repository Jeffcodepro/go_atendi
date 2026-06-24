class Faq < ApplicationRecord
  validates :question, presence: true
  validates :answer, presence: true

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(:position, :question) }
  scope :by_category, ->(category) { where(category: category) }
end
