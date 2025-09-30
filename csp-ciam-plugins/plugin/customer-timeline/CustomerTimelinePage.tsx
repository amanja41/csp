import React from "react";

export function CustomerTimelineWidget() {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        margin: "5px 0",
      }}
    >
      <h4>Customer Timeline</h4>
      <p>Recent customer activities...</p>
      <ul>
        <li>Login - 2 hours ago</li>
        <li>Purchase - 1 day ago</li>
        <li>Support ticket - 3 days ago</li>
      </ul>
    </div>
  );
}

export function CustomerTimelinePage() {
  return (
    <div>
      <h2>Customer Timeline</h2>
      <p>Detailed timeline view for customer activities.</p>
      <CustomerTimelineWidget />
    </div>
  );
}
