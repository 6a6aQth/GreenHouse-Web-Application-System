"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editRfqId, setEditRfqId] = useState<number | null>(null);
  const [editItems, setEditItems] = useState<any[]>([]);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "mike") {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  useEffect(() => {
    if (authenticated) {
      setLoading(true);
      fetch("/api/quote-request")
        .then((res) => res.json())
        .then((data) => setRfqs(data))
        .finally(() => setLoading(false));
    }
  }, [authenticated]);

  const startEdit = (rfq: any) => {
    setEditRfqId(rfq.id);
    setEditItems(rfq.quoteItems.map((item: any) => ({ ...item, adminPrice: item.adminPrice || "", notes: item.notes || "" })));
    setEditNotes(rfq.adminNotes || "");
    setEditStatus(rfq.status || "pending");
  };

  const handleItemChange = (idx: number, field: string, value: string) => {
    setEditItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const saveEdit = async () => {
    setSaving(true);
    // TODO: Implement backend update API
    // For now, just update local state
    setRfqs((prev) => prev.map(rfq => {
      if (rfq.id !== editRfqId) return rfq;
      return {
        ...rfq,
        quoteItems: editItems,
        adminNotes: editNotes,
        status: editStatus,
      };
    }));
    setEditRfqId(null);
    setSaving(false);
  };

  const cancelEdit = () => {
    setEditRfqId(null);
  };

  const sendEmail = async (rfq: any) => {
    try {
      const res = await fetch(`/api/quote-request?email=1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rfq.id }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Email sent successfully!');
      } else {
        alert('Failed to send email: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to send email');
    }
  };

  const downloadPDF = async (rfq: any) => {
    try {
      const res = await fetch(`/api/quote-request?pdf=${rfq.id}`);
      if (!res.ok) throw new Error('Failed to generate PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quote-${rfq.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download PDF');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xs flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-2 text-center">Admin Login</h2>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">Login</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-green-700">Admin Dashboard</h2>
        <p className="mb-4">Below are successful RFQ submissions.</p>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : rfqs.length === 0 ? (
          <div className="border rounded p-4 text-gray-500 text-center">No RFQs yet.</div>
        ) : (
          <div className="space-y-6">
            {rfqs.map((rfq) => (
              <div key={rfq.id} className="border rounded p-4">
                <div className="mb-2 font-semibold text-green-700">{rfq.userName} ({rfq.userEmail}, {rfq.userPhone})</div>
                <div className="text-sm text-gray-500 mb-2">Submitted: {new Date(rfq.createdAt).toLocaleString()}</div>
                <div className="mb-2">
                  <span className="font-semibold">Status:</span> {rfq.status}
                </div>
                <div>
                  <span className="font-semibold">Items:</span>
                  <ul className="list-disc ml-6 mt-1">
                    {rfq.quoteItems.map((item: any) => (
                      <li key={item.id}>
                        {item.product?.name || "Unknown Product"} (Qty: {item.quantity})
                        <span className="text-xs text-gray-400 ml-2">[{item.product?.category}]</span>
                        {typeof item.adminPrice !== "undefined" && (
                          <span className="ml-2 text-green-700 font-semibold">Price: {item.adminPrice}</span>
                        )}
                        {item.notes && <span className="ml-2 text-xs text-gray-500">Note: {item.notes}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
                {rfq.adminNotes && (
                  <div className="mt-2 text-sm text-gray-700"><span className="font-semibold">Admin Notes:</span> {rfq.adminNotes}</div>
                )}
                {editRfqId === rfq.id ? (
                  <div className="mt-4 border-t pt-4">
                    <div className="mb-2 font-semibold">Edit Quote Items</div>
                    {editItems.map((item, idx) => (
                      <div key={item.id} className="flex gap-2 items-center mb-2">
                        <span className="flex-1">{item.product?.name || "Unknown Product"}</span>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Set price"
                          value={item.adminPrice}
                          onChange={e => handleItemChange(idx, "adminPrice", e.target.value)}
                          className="w-24"
                        />
                        <Input
                          type="text"
                          placeholder="Notes"
                          value={item.notes}
                          onChange={e => handleItemChange(idx, "notes", e.target.value)}
                          className="w-32"
                        />
                      </div>
                    ))}
                    <div className="mb-2">
                      <Textarea
                        placeholder="Overall notes to user (optional)"
                        value={editNotes}
                        onChange={e => setEditNotes(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <label>Status: </label>
                      <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="border rounded px-2 py-1">
                        <option value="pending">Pending</option>
                        <option value="quoted">Quoted</option>
                        <option value="responded">Responded</option>
                      </select>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button onClick={saveEdit} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">{saving ? "Saving..." : "Save"}</Button>
                      <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => startEdit(rfq)} className="bg-blue-600 hover:bg-blue-700 text-white">Edit/Respond</Button>
                    <Button onClick={() => sendEmail(rfq)} className="bg-green-600 hover:bg-green-700 text-white">Send Email</Button>
                    <Button onClick={() => downloadPDF(rfq)} className="bg-gray-600 hover:bg-gray-700 text-white">Download PDF</Button>
                  </div>
                )}
                <div className="mt-6 border-t pt-4 text-xs text-gray-500">
                  <div className="font-semibold mb-1">Standard Terms & Conditions</div>
                  <ul className="list-disc ml-6">
                    <li>All quotes are valid for 30 days from the date of issue.</li>
                    <li>Payment is due upon acceptance of the quote unless otherwise agreed.</li>
                    <li>Delivery timelines are estimates and subject to change.</li>
                    <li>Products remain the property of the company until full payment is received.</li>
                    <li>Other terms and conditions may apply. Please contact us for details.</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 