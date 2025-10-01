interface EmailEventData {
  uuid?: string;
  delivery_status?: string;
  delivered?: boolean;
  bounced?: boolean;
  subject?: string;
  direction?: string;
  email_uri?: string;
  bounced_at?: string | null;
  meta?: {
    email?: string;
    mailer_class?: string;
    mailer_template?: string;
    customer_application_uuid?: string;
    product_type?: string;
    product_uuid?: string;
  };
}

interface EmailEventCardProps {
  emailData: EmailEventData;
}

export function EmailEventCard({ emailData }: EmailEventCardProps) {
  const getStatusColor = (status?: string, delivered?: boolean) => {
    if (delivered) return 'success';
    if (status === 'Bounced') return 'error';
    return 'neutral';
  };

  const getDirectionLabel = (direction?: string) => {
    return direction === 'outbound' ? 'Sent' : direction === 'inbound' ? 'Received' : direction || 'Unknown';
  };

  return (
    <div className="event-details">
      <div className="details-section">
        <h4 className="section-title">Email Details</h4>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Subject</span>
            <span className="detail-value">{emailData.subject || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Direction</span>
            <span className={`detail-value status-badge direction-${emailData.direction}`}>
              {getDirectionLabel(emailData.direction)}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span
              className={`detail-value status-badge status-${getStatusColor(emailData.delivery_status, emailData.delivered)}`}
            >
              {emailData.delivery_status || 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      <div className="details-section">
        <h4 className="section-title">Delivery Status</h4>
        <div className="status-indicators">
          <div className={`status-indicator ${emailData.delivered ? 'delivered' : 'not-delivered'}`}>
            <span className="indicator-icon">{emailData.delivered ? '✓' : '✗'}</span>
            <span className="indicator-label">{emailData.delivered ? 'Delivered' : 'Not Delivered'}</span>
          </div>
          {emailData.bounced && (
            <div className="status-indicator bounced">
              <span className="indicator-icon">!</span>
              <span className="indicator-label">Bounced</span>
            </div>
          )}
        </div>
      </div>

      {emailData.meta && (
        <div className="details-section">
          <h4 className="section-title">Metadata</h4>
          <div className="details-grid">
            {emailData.meta.email && (
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{emailData.meta.email}</span>
              </div>
            )}
            {emailData.meta.mailer_class && (
              <div className="detail-item">
                <span className="detail-label">Mailer Class</span>
                <span className="detail-value">{emailData.meta.mailer_class}</span>
              </div>
            )}
            {emailData.meta.mailer_template && (
              <div className="detail-item">
                <span className="detail-label">Template</span>
                <span className="detail-value">{emailData.meta.mailer_template}</span>
              </div>
            )}
            {emailData.meta.customer_application_uuid && (
              <div className="detail-item">
                <span className="detail-label">Application UUID</span>
                <span className="detail-value uuid">{emailData.meta.customer_application_uuid.slice(0, 8)}...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
