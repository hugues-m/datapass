# frozen_string_literal: true

class BaseNotifier < AbstractNotifier
  include EmailNotifierMethods

  def create
    deliver_created_mail_to_enrollment_creator
  end

  def update(diff:, user_id:)
  end

  def team_member_update(team_member_type:)
    if team_member_type.in?(%w[delegue_protection_donnees responsable_traitement])
      deliver_rgpd_email_for(team_member_type)
    end
  end

  def submit(comment:, current_user:)
    deliver_event_mailer(__method__, comment)

<<<<<<< HEAD
    if enrollment.technical_team_type == "software_company" && !enrollment.technical_team_value.match?(/^\d{14}$/)
      notify_administrators_for_unknown_software_enrollment
=======
    if enrollment.technical_team_type == "software_company"
      unless enrollment.technical_team_value.match?(/^\d{14}$/)
        notify_administrators_for_unknown_software_enrollment
      end
>>>>>>> fbf667c7b987e444e6140f12b4791c58034aff0c
    end
    notify_subscribers_by_email_for_submitted_enrollment
  end

  def notify(comment:, current_user:)
    deliver_event_mailer(__method__, comment)
  end

  def request_changes(comment:, current_user:)
    deliver_event_mailer(__method__, comment)
  end

  def refuse(comment:, current_user:)
    deliver_event_mailer(__method__, comment)
  end

  def validate(comment:, current_user:)
    deliver_event_mailer(__method__, comment)

    if enrollment.team_members.exists?(type: "responsable_traitement")
      deliver_rgpd_email_for("responsable_traitement")
    end

    if enrollment.team_members.exists?(type: "delegue_protection_donnees")
      deliver_rgpd_email_for("delegue_protection_donnees")
    end
  end

  def revoke(comment:, current_user:)
    deliver_event_mailer(__method__, comment)
  end
end
