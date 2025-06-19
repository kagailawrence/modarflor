"use client";

// Admin FAQ management page for ModarFlor
// Lists, creates, edits, and deletes FAQs

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authFetch } from '@/lib/authFetch';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const emptyFAQ: Omit<FAQ, 'id'> = { question: '', answer: '' };

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState(emptyFAQ);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const fetchFaqs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch('/api/faqs');
      if (!res.ok) throw new Error('Failed to fetch FAQs');
      const data = await res.json();
      setFaqs(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleEdit = (faq: FAQ) => {
    setEditing(faq);
    setForm({ question: faq.question, answer: faq.answer });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this FAQ?')) return;
    setSubmitting(true);
    try {
      const res = await authFetch(`/api/faqs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchFaqs();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/faqs/${editing.id}` : '/api/faqs';
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Save failed');
      setEditing(null);
      setForm(emptyFAQ);
      await fetchFaqs();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">FAQ Management</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded shadow">
        <h2 className="font-semibold mb-2">{editing ? 'Edit FAQ' : 'Add FAQ'}</h2>
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Question"
          value={form.question}
          onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
          required
        />
        <textarea
          className="w-full mb-2 p-2 border rounded"
          placeholder="Answer"
          value={form.answer}
          onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
          required
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={submitting}>
            {editing ? 'Update' : 'Add'}
          </button>
          {editing && (
            <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => { setEditing(null); setForm(emptyFAQ); }}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <h2 className="font-semibold mb-2">All FAQs</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-4">
          {faqs.map(faq => (
            <li key={faq.id} className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-medium">Q: {faq.question}</div>
                <div className="text-gray-700">A: {faq.answer}</div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(faq)} disabled={submitting}>Edit</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(faq.id)} disabled={submitting}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
