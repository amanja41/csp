interface VersionEventData {
  profile_id?: number;
  version_uuid?: string;
  source?: string;
  review_type?: string | null;
  review_status?: string | null;
  identity_attributes?: {
    email?: string;
    phone_number?: string;
    identity_uuid?: string;
    ssn_last_4?: string;
    date_of_birth?: string;
    first_name?: string;
    last_name?: string;
    title?: string | null;
    preferred_first_name?: string | null;
    middle_initial?: string | null;
    suffix?: string | null;
    address_1?: string;
    address_2?: string | null;
    city?: string;
    state?: string;
    zip?: string;
    zip4?: string | null;
    bank_account_number_uuid?: string | null;
    bank_account_number_last_4?: string | null;
    bank_account_type?: string | null;
    bank_routing_number?: string | null;
    bank_bad_account?: boolean | null;
    employer_name?: string | null;
    employer_phone_number?: string | null;
    employer_phone_number_extension?: string | null;
  };
  changes?: {
    changed_fields?: string[];
    confirmed_fields?: string[];
  };
  has_details?: boolean;
}

interface VersionEventCardProps {
  versionData: VersionEventData;
}

export function VersionEventCard({ versionData }: VersionEventCardProps) {
  const identity = versionData.identity_attributes;
  if (!identity) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSSN = (ssn?: string) => {
    if (!ssn) return 'N/A';
    return `***-**-${ssn}`;
  };

  const formatUUID = (uuid?: string) => {
    if (!uuid) return 'N/A';
    return `${uuid.slice(0, 8)}...`;
  };

  return (
    <div className="event-details">
      <div className="version-summary">
        <h4 className="section-title">Profile Update Summary</h4>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-value">{versionData.changes?.changed_fields?.length || 0}</span>
            <span className="stat-label">Fields Updated</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{versionData.changes?.confirmed_fields?.length || 0}</span>
            <span className="stat-label">Fields Confirmed</span>
          </div>
          {versionData.profile_id && (
            <div className="stat-item">
              <span className="stat-value">{versionData.profile_id}</span>
              <span className="stat-label">Profile ID</span>
            </div>
          )}
        </div>
      </div>

      <div className="details-section">
        <h4 className="section-title">Primary Identifiers</h4>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value primary">{identity.email || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Phone Number</span>
            <span className="detail-value primary">{identity.phone_number || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="details-section">
        <h4 className="section-title">Personal Information</h4>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">First Name</span>
            <span className="detail-value">{identity.first_name || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Last Name</span>
            <span className="detail-value">{identity.last_name || 'N/A'}</span>
          </div>
          {identity.preferred_first_name && (
            <div className="detail-item">
              <span className="detail-label">Preferred Name</span>
              <span className="detail-value">{identity.preferred_first_name}</span>
            </div>
          )}
          {identity.middle_initial && (
            <div className="detail-item">
              <span className="detail-label">Middle Initial</span>
              <span className="detail-value">{identity.middle_initial}</span>
            </div>
          )}
        </div>
      </div>

      <div className="details-section">
        <h4 className="section-title">Address Information</h4>
        <div className="details-grid">
          <div className="detail-item full-width">
            <span className="detail-label">Address Line 1</span>
            <span className="detail-value">{identity.address_1 || 'N/A'}</span>
          </div>
          {identity.address_2 && (
            <div className="detail-item full-width">
              <span className="detail-label">Address Line 2</span>
              <span className="detail-value">{identity.address_2}</span>
            </div>
          )}
          <div className="detail-item">
            <span className="detail-label">City</span>
            <span className="detail-value">{identity.city || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">State</span>
            <span className="detail-value">{identity.state || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">ZIP Code</span>
            <span className="detail-value">{identity.zip || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="details-section">
        <h4 className="section-title">Identity Verification</h4>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Identity UUID</span>
            <span className="detail-value uuid">{formatUUID(identity.identity_uuid)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">SSN</span>
            <span className="detail-value">{formatSSN(identity.ssn_last_4)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Date of Birth</span>
            <span className="detail-value">{formatDate(identity.date_of_birth)}</span>
          </div>
        </div>
      </div>

      {(identity.employer_name || identity.bank_account_type) && (
        <div className="details-section">
          <h4 className="section-title">Additional Information</h4>
          <div className="details-grid">
            {identity.employer_name && (
              <div className="detail-item">
                <span className="detail-label">Employer</span>
                <span className="detail-value">{identity.employer_name}</span>
              </div>
            )}
            {identity.bank_account_type && (
              <div className="detail-item">
                <span className="detail-label">Bank Account Type</span>
                <span className="detail-value">{identity.bank_account_type}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
