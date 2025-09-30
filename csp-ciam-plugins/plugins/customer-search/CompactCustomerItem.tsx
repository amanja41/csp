import { Customer } from '../models/customer';

export function CompactCustomerItem({
  customer,
  onSelect,
}: {
  customer: Customer;
  onSelect?: (customer: Customer) => void;
}) {
  return (
    <div className="search-result-item" onClick={() => onSelect?.(customer)}>
      <div className="customer-item ">
        <div className="customer-name ">{customer.full_name}</div>
        <div className="customer-email">{customer.email}</div>
        <div>
          applications:
          {customer.basic_orig_ids.map(id => (
            <span key={id}>{id.toString()}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
