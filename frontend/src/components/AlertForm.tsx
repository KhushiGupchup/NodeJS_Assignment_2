import React, { useState } from 'react';
import axios from 'axios';

function AlertForm() {
  const [form, setForm] = useState({
    userEmail: '',
    cryptoSymbol: 'bitcoin',
    condition: '>',
    targetPrice: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/alerts', {
        ...form,
        targetPrice: parseFloat(form.targetPrice),
      });
      alert('Alert created successfully!');
    } catch (err) {
      alert('Failed to create alert');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="userEmail" placeholder="Email" value={form.userEmail} onChange={handleChange} required />
      <select name="cryptoSymbol" value={form.cryptoSymbol} onChange={handleChange}>
        <option value="bitcoin">Bitcoin</option>
        <option value="ethereum">Ethereum</option>
      </select>
      <select name="condition" value={form.condition} onChange={handleChange}>
        <option value=">">Greater Than</option>
        <option value="<">Less Than</option>
      </select>
      <input name="targetPrice" type="number" placeholder="Target Price" value={form.targetPrice} onChange={handleChange} required />
      <button type="submit">Set Alert</button>
    </form>
  );
}

export default AlertForm;
