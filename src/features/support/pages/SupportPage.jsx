import React, { useEffect, useState } from 'react';
import { MessageSquare, Plus, Send } from 'lucide-react';
import { supportService } from '../../../services/supportService';

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTicket, setNewTicket] = useState({ title: '', message: '' });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await supportService.getTickets();
      setTickets(data);
      if (data[0]) {
        setSelectedTicket(data[0]);
        const msg = await supportService.getTicketMessages(data[0].id);
        setMessages(msg);
      }
    } catch (err) {
      console.error('Support tickets error', err);
    } finally {
      setLoading(false);
    }
  };

  const openTicket = async (ticket) => {
    setSelectedTicket(ticket);
    try {
      const msg = await supportService.getTicketMessages(ticket.id);
      setMessages(msg);
    } catch (err) {
      console.error('Ticket messages error', err);
    }
  };

  const createTicket = async (e) => {
    e.preventDefault();
    try {
      await supportService.createTicket(newTicket);
      setNewTicket({ title: '', message: '' });
      loadTickets();
    } catch (err) {
      console.error('Create ticket error', err);
    }
  };

  if (loading) return <div className="text-sm text-slate-500">Chargement des tickets...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Support client</h2>
        <p className="text-sm text-slate-500">Suivez et répondez aux demandes de vos clients.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Tickets</h3>
            <button className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white">
              <Plus size={14} /> Nouveau
            </button>
          </div>

          <div className="space-y-3">
            {(tickets || []).map((ticket) => (
              <button key={ticket.id} onClick={() => openTicket(ticket)} className={`w-full rounded-xl border p-3 text-left transition ${selectedTicket?.id === ticket.id ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">{ticket.title}</span>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${ticket.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{ticket.status === 'open' ? 'Ouvert' : 'Résolu'}</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">{ticket.client}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {selectedTicket ? (
            <>
              <div className="mb-5 flex items-center gap-2">
                <MessageSquare size={18} className="text-brand-600" />
                <h3 className="text-lg font-bold text-slate-900">{selectedTicket.title}</h3>
              </div>

              <div className="space-y-4">
                {(messages || []).map((message) => (
                  <div key={message.id} className={`max-w-xl rounded-2xl p-3 ${message.sender === 'client' ? 'bg-slate-100 text-slate-700' : 'ml-auto bg-brand-600 text-white'}`}>
                    <div className="text-xs font-semibold uppercase opacity-80">{message.sender === 'client' ? 'Client' : 'Support'}</div>
                    <p className="mt-1 text-sm">{message.body}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={createTicket} className="mt-6 space-y-3">
                <input value={newTicket.title} onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm" placeholder="Objet du ticket" />
                <textarea value={newTicket.message} onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm" rows="3" placeholder="Votre message..." />
                <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
                  <Send size={16} /> Répondre
                </button>
              </form>
            </>
          ) : (
            <div className="text-sm text-slate-500">Aucun ticket sélectionné.</div>
          )}
        </div>
      </div>
    </div>
  );
}
