import { Customer } from '../models/customer';

export function CompactCustomerItem({
  customer,
  onSelect,
}: {
  customer: Customer;
  onSelect?: (customer: Customer) => void;
}) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'prospect':
        return 'status-prospect';
      default:
        return 'status-unknown';
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const highlightMatchedField = (field: string, value: string) => {
    if (customer.matched_fields?.includes(field)) {
      return <span className="matched-field">{value}</span>;
    }
    return value;
  };

  return (
    <div className="search-result-item" onClick={() => onSelect?.(customer)}>
      <div className="customer-item">
        {/* Customer Header */}
        <div className="customer-header">
          <div className="customer-main-info">
            <div className="customer-name">{highlightMatchedField('full_name', customer.full_name)}</div>
            <div className="customer-id">
              ID: {highlightMatchedField('basic_customer_id', customer.basic_customer_id.toString())}
            </div>
          </div>
          {customer.status && (
            <div className={`customer-status ${getStatusColor(customer.status)}`}>{customer.status}</div>
          )}
        </div>

        {/* Customer Details */}
        <div className="customer-details">
          <div className="customer-contact">
            <div className="customer-email">{highlightMatchedField('email', customer.email)}</div>
            {customer.phone_number && (
              <div className="customer-phone">
                📞 {highlightMatchedField('phone_number', formatPhoneNumber(customer.phone_number))}
              </div>
            )}
          </div>

          {customer.company && (
            <div className="customer-company">{highlightMatchedField('company', customer.company)}</div>
          )}

          <div className="customer-ssn">SSN: ***-**-{highlightMatchedField('ssn_last_4', customer.ssn_last_4)}</div>
        </div>

        {/* Applications and Services */}
        <div className="customer-services">
          {customer.basic_orig_ids.length > 0 && (
            <div className="service-group">
              <span className="service-label">Applications:</span>
              <div className="service-ids">
                {customer.basic_orig_ids.slice(0, 3).map(id => (
                  <span key={id} className="service-id application-id">
                    {highlightMatchedField('basic_orig_ids', id.toString())}
                  </span>
                ))}
                {customer.basic_orig_ids.length > 3 && (
                  <span className="service-more">+{customer.basic_orig_ids.length - 3} more</span>
                )}
              </div>
            </div>
          )}

          {customer.basic_serv_loan_ids.length > 0 && (
            <div className="service-group">
              <span className="service-label">Loans:</span>
              <div className="service-ids">
                {customer.basic_serv_loan_ids.slice(0, 3).map(id => (
                  <span key={id} className="service-id loan-id">
                    {highlightMatchedField('basic_serv_loan_ids', id.toString())}
                  </span>
                ))}
                {customer.basic_serv_loan_ids.length > 3 && (
                  <span className="service-more">+{customer.basic_serv_loan_ids.length - 3} more</span>
                )}
              </div>
            </div>
          )}

          {customer.basic_serv_card_ids.length > 0 && (
            <div className="service-group">
              <span className="service-label">Cards:</span>
              <div className="service-ids">
                {customer.basic_serv_card_ids.slice(0, 3).map(id => (
                  <span key={id} className="service-id card-id">
                    {highlightMatchedField('basic_serv_card_ids', id.toString())}
                  </span>
                ))}
                {customer.basic_serv_card_ids.length > 3 && (
                  <span className="service-more">+{customer.basic_serv_card_ids.length - 3} more</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Matched Fields Indicator */}
        {customer.matched_fields && customer.matched_fields.length > 0 && (
          <div className="matched-fields-indicator">
            <span className="matched-text">Matched: {customer.matched_fields.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
