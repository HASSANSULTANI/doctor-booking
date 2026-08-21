'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function AdminPage() {
  const [supabase, setSupabase] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    setSupabase(client);
  }, []);

  const fetchTodayAppointments = async (client) => {
    const db = client || supabase;
    if (!db) return;
    await db.rpc('auto_drop_expired_tokens');
    
    const { data } = await db
      .from('appointments')
      .select('*')
      .order('token_number', { ascending: true });
    if (data) setAppointments(data);
  };

  const updateStatus = async (id, status) => {
    if (!supabase) return;
    await supabase.from('appointments').update({ status }).eq('id', id);
    fetchTodayAppointments();
  };

  useEffect(() => {
    if (supabase) {
      fetchTodayAppointments(supabase);
    }
  }, [supabase]);

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Doctor Admin Panel</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#F3F4F6' }}>
            <th style={{ padding: '10px', border: '1px solid #DDD' }}>Token</th>
            <th style={{ padding: '10px', border: '1px solid #DDD' }}>Patient</th>
            <th style={{ padding: '10px', border: '1px solid #DDD' }}>Mobile</th>
            <th style={{ padding: '10px', border: '1px solid #DDD' }}>Slot</th>
            <th style={{ padding: '10px', border: '1px solid #DDD' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #DDD' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((item) => (
            <tr key={item.id}>
              <td style={{ padding: '10px', border: '1px solid #DDD', fontWeight: 'bold' }}>#{item.token_number}</td>
              <td style={{ padding: '10px', border: '1px solid #DDD' }}>{item.patient_name}</td>
              <td style={{ padding: '10px', border: '1px solid #DDD' }}>{item.mobile_number}</td>
              <td style={{ padding: '10px', border: '1px solid #DDD' }}>{item.slot}</td>
              <td style={{ padding: '10px', border: '1px solid #DDD' }}>{item.status}</td>
              <td style={{ padding: '10px', border: '1px solid #DDD' }}>
                <button onClick={() => updateStatus(item.id, 'In Treatment')} style={{ background: '#F59E0B', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }}>Treatment</button>
                <button onClick={() => updateStatus(item.id, 'Completed')} style={{ background: '#10B981', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Complete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
