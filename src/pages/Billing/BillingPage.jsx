import { useEffect, useState } from "react";
import { billingAPI } from "../../api/api";

export default function BillingPage() {
  const [invoices, setInvoices] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newMethod, setNewMethod] = useState({ type: "Credit Card", details: "" });

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const data = await billingAPI.getInvoices();
        setInvoices(data || []);
      } catch (err) {
        console.error("Failed to load invoices:", err);
        setInvoices([]);
      }
    }
    fetchInvoices();
    
    // Set default payment methods (these would come from API in production)
    setPaymentMethods([
      { id: "pm_1", type: "Credit Card", details: "**** **** **** 4242" },
      { id: "pm_2", type: "PayPal", details: "user@example.com" },
    ]);
  }, []);

  function downloadInvoice(inv) {
    const blob = new Blob(
      [`Invoice ID: ${inv.id}\nDate: ${inv.date}\nAmount: $${inv.amount}\nStatus: ${inv.status}`],
      { type: "application/pdf" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${inv.id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleAddPaymentMethod() {
    if (!newMethod.details.trim()) return alert("Please enter payment details.");
    const id = `pm_${Date.now()}`;
    const updated = [...paymentMethods, { id, ...newMethod }];
    setPaymentMethods(updated);
    setShowPaymentModal(false);
    setNewMethod({ type: "Credit Card", details: "" });
  }

  function removePaymentMethod(id) {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
  }

  return (
    <div className="text-neutral-50">
      <h2 className="text-xl font-semibold mb-4">Billing & Invoices</h2>

      {/* Invoice List */}
      <div className="overflow-auto">
        <table className="w-full text-left rounded-lg shadow-lg border-separate border-spacing-y-2">
          <thead className="text-sm bg-blue-950 rounded-lg shadow-lg">
            <tr>
              <th className="p-3">Invoice</th>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} className="text-xs bg-blue-950 rounded-lg shadow-lg">
                <td className="p-3">{inv.id}</td>
                <td className="p-3">{new Date(inv.created_at || inv.date).toLocaleDateString()}</td>
                <td className="p-3">${inv.amount}</td>
                <td className="p-3">
                  {inv.status}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => downloadInvoice(inv)}
                    className="px-2 py-2 rounded-lg bg-sky-400"
                  >
                    Download PDF
                  </button>
                  {inv.status === "Pending" && (
                    <button className="px-2 py-2 ml-2 bg-sky-400 rounded-lg">
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr className="bg-blue-950">
                <td colSpan="5" className="p-4">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Methods */}
      <div className="bg-blue-950 rounded shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Payment Methods</h3>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-3 py-2 bg-sky-400 rounded-lg text-xs"
          >
            + Add Method
          </button>
        </div>

        {paymentMethods.length === 0 && (
          <div className="p-3 bg-sky-400 text-sm rounded-lg">No payment methods added yet.</div>
        )}

        <div className="space-y-3">
          {paymentMethods.map(pm => (
            <div
              key={pm.id}
              className="flex items-center text-xs justify-between p-3 rounded-lg bg-sky-400"
            >
              <div>
                <div className="text-sm">{pm.type}</div>
                <div>{pm.details}</div>
              </div>
              <button
                onClick={() => removePaymentMethod(pm.id)}
                className="text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Payment Method</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Type</label>
                <select
                  value={newMethod.type}
                  onChange={e => setNewMethod({ ...newMethod, type: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                >
                  <option>Credit Card</option>
                  <option>PayPal</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Details</label>
                <input
                  type="text"
                  placeholder="**** **** **** 4242 or email"
                  value={newMethod.details}
                  onChange={e => setNewMethod({ ...newMethod, details: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPaymentMethod}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Add Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
