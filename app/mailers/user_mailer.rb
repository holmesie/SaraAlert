# frozen_string_literal: true

require 'chronic'

# UserMailer: mailers for users
class UserMailer < ApplicationMailer
  default from: 'notifications@saraalert.org'

  def welcome_email(user, password)
    @user = user
    @password = password
    mail(to: user.email, subject: 'Welcome to the Sara Alert system')
  end

  def purge_notification
    receipients = User.with_any_role(:public_health, :public_health_enroller)
    @expiration_date = Chronic.parse(ADMIN_OPTIONS['weekly_purge_date']).strftime('%A %B %d, at %l:%M %p %Z')

    receipients.each do |user|
      @user = user
      @num_purgeable_records = user.viewable_patients.purge_eligible.length

      mail(to: user.email, subject: 'Sara Alert User Records Expiring Soon')
    end
  end
end
