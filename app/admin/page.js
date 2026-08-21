'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminPage() {
  const [appointments, setAppointments] = useState([]);

  const fetchTodayAppointments = async () => {
    if (!supabase) return;
    await supabase.rpc('auto_drop_expired_tokens');
    
    const { data } = await supabase
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
    fetchTodayAppointments();
  }, []);

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
