class Enrollment::ApiServiceNational < Enrollment
  protected

  def sent_validation
    super

    scopes_validation
    responsable_technique_validation
  end
end
