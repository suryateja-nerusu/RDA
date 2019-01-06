module ApplicationHelper
  PREFACE      = ('A'..'Z').to_a << ?_
  SUFFIX       = ('0'..'9').to_a
  PREFACE_SIZE = 4
  SUFFIX_SIZE  = 2

  def self.gen_name
    PREFACE.sample(PREFACE_SIZE).join << SUFFIX.sample(SUFFIX_SIZE).join
  end
end
