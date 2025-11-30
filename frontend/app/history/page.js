'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if(userId) {
        axios.get(`http://localhost:3001/api/orders?user_id=${userId}`)
             .then(res => setOrders(res.data));
    }
  }, []);

  return (
    <div className="p-10">
        <h1 className="text-2xl font-bold mb-6">📜 ประวัติการเติมเงิน</h1>
        <table className="w-full border-collapse border text-left">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2">วันที่</th>
                    <th className="border p-2">เกม</th>
                    <th className="border p-2">สินค้า</th>
                    <th className="border p-2">ราคา</th>
                </tr>
            </thead>
            <tbody>
                {orders.map(o => (
                    <tr key={o.id}>
                        <td className="border p-2">{new Date(o.created_at).toLocaleString()}</td>
                        <td className="border p-2">{o.game_name}</td>
                        <td className="border p-2">{o.item_name}</td>
                        <td className="border p-2">{o.price} บาท</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}