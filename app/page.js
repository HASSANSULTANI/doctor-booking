'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function BookingPage() {
  const [supabase, setSupabase] = useState(null);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('Morning');
  const [token, setToken] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    setSupabase(client);
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!supabase) return;

    const { data, error } = await supabase
      .from('appointments')
      .insert([{ patient_name: name, mobile_number: mobile, appointment_date: date, slot }])
      .select()
      .single();

    if (!error && data) {
      setToken(data.token_number);
      fetchHistory(mobile);
    }
  };

  const fetchHistory = async (phone) => {
    if (!supabase) return;
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('mobile_number', phone)
      .order('created_at', { ascending: false });
    if (data) setHistory(data);
  };

  return (
    <div style={{ maxWidth: '450px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#1E3A8A' }}>Doctor Appointment</h1>
      
      {token && (
        <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>Booking Successful!</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>Token #{token}</p>
        </div>
      )}

      <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#F3F4F6', padding: '20px', borderRadius: '8px' }}>
        <input type="text" placeholder="Patient Name" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #CCC' }} value={name} onChange={(e) => setName(e.target.value)} />
        <input type="tel" placeholder="Mobile Number" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #CCC' }} value={mobile} onChange={(e) => { setMobile(e.target.value); fetchHistory(e.target.value); }} />
        <input type="date" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #CCC' }} value={date} onChange={(e) => setDate(e.target.value)} />
        <select style={{ padding: '10px', borderRadius: '4px', border: '1px solid #CCC' }} value={slot} onChange={(e) => setSlot(e.target.value)}>
          <option value="Morning">Morning Slot</option>
          <option value="Evening">Evening Slot</option>
        </select>
        <button type="submit" style={{ padding: '12px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Book Appointment</button>
      </form>

      {history.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>Past History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {history.map((h) => (
              <div key={h.id} style={{ padding: '10px', border: '1px solid #E5E7EB', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>{h.appointment_date} ({h.slot})</span>
                <span style={{ fontWeight: 'bold' }}>{h.status} (Token #{h.token_number})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
