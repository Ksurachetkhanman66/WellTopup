"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0.00);
  const [activeTab, setActiveTab] = useState("history"); 
  const [history, setHistory] = useState([]);
  const [passForm, setPassForm] = useState({ old: "", new: "", confirm: "" });

  const apiHost = process.env.NEXT_PUBLIC_API_HOST;

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedUser = localStorage.getItem("username");
    
    if (!storedId) { router.push("/login"); return; }
    setUser({ id: storedId, username: storedUser });

    fetch(`${apiHost}/api/users/${storedId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.balance) setBalance(parseFloat(data.balance)); });

    fetch(`${apiHost}/api/orders?user_id=${storedId}`)
      .then(res => res.json())
      .then(data => setHistory(data));

  }, [router, apiHost]);

  const handleLogout = () => {
    if(confirm("ยืนยันการออกจากระบบ?")) {
        localStorage.clear();
        window.location.href = "/login";
    }
  };

  const handleWalletTopup = async (amount) => {
    if(!confirm(`ยืนยันการเติมเงิน ${amount} บาท?`)) return;
    try {
        const res = await fetch(`${apiHost}/api/topup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.id, amount: amount })
        });
        const data = await res.json();
        if (res.ok) {
            alert("✅ " + data.message);
            setBalance(parseFloat(data.newBalance));
        } else { alert("❌ " + data.message); }
    } catch(err) { alert("Error connecting server"); }
  };

  const handleChangePassword = async () => {
    if(passForm.new !== passForm.confirm) return alert("❌ รหัสผ่านใหม่ไม่ตรงกัน");
    try {
        const res = await fetch(`${apiHost}/api/change_password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id, old_password: passForm.old, new_password: passForm.new })
        });
        const data = await res.json();
        if(res.ok) {
            alert("✅ เปลี่ยนรหัสผ่านสำเร็จ");
            setPassForm({ old: "", new: "", confirm: "" });
        } else { alert("❌ " + data.message); }
    } catch(err) { alert("Error connecting server"); }
  };

  if (!user) return null;

  const menuStyle = (tabName) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '15px 20px',
    border: 'none',
    background: activeTab === tabName ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
    color: activeTab === tabName ? 'white' : '#94a3b8',
    fontWeight: activeTab === tabName ? '700' : '600',
    borderLeft: activeTab === tabName ? '4px solid #10b981' : '4px solid transparent',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    borderBottom: '1px solid #1e293b'
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', paddingBottom: '4rem' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .topup-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
        }
      `}</style>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Header */}
        <div style={{ 
          marginBottom: '2rem', 
          animation: 'fadeIn 0.6s ease-out'
        }}>
          <Link href="/" style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none', 
            color: '#f1f5f9',
            fontSize: '1.1rem',
            background: '#1e293b',
            padding: '12px 24px',
            borderRadius: '12px',
            border: '2px solid #334155',
            fontWeight: '700',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#10b981';
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#334155';
            e.currentTarget.style.transform = 'translateX(0)';
          }}>
            <span style={{ fontSize: '1.3rem' }}>←</span> กลับหน้าหลัก
          </Link>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '320px 1fr', 
          gap: '2rem', 
          alignItems: 'start' 
        }}>
          
          {/* ================= ซ้าย: เมนูลิสต์ (Sidebar) ================= */}
          <div style={{ 
            background: '#1e293b',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid #334155',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            animation: 'slideIn 0.8s ease-out'
          }}>
              
              {/* ส่วนหัว Profile */}
              <div style={{ 
                padding: '2.5rem 2rem', 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                borderBottom: '2px solid #334155'
              }}>
                  <div style={{ 
                    width: '90px', 
                    height: '90px', 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '50%', 
                    margin: '0 auto 15px', 
                    fontSize: '2.5rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                    border: '4px solid #1e293b'
                  }}>
                      👤
                  </div>
                  <h3 style={{ 
                    margin: '0 0 15px 0', 
                    color: '#f1f5f9',
                    fontSize: '1.5rem',
                    fontWeight: '800'
                  }}>{user.username}</h3>
                  <div style={{ 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    display: 'inline-block',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}>
                      <div style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: '600' }}>ยอดคงเหลือ</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '4px' }}>
                          ฿ {Number(balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                  </div>
              </div>

              {/* รายการเมนู */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button 
                    style={menuStyle('history')} 
                    onClick={() => setActiveTab('history')}
                    onMouseEnter={(e) => {
                      if(activeTab !== 'history') {
                        e.currentTarget.style.background = '#334155';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if(activeTab !== 'history') {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                      <span style={{ marginRight: '12px', fontSize: '1.2rem' }}>📜</span> ประวัติการซื้อ
                  </button>
                  <button 
                    style={menuStyle('topup')} 
                    onClick={() => setActiveTab('topup')}
                    onMouseEnter={(e) => {
                      if(activeTab !== 'topup') {
                        e.currentTarget.style.background = '#334155';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if(activeTab !== 'topup') {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                      <span style={{ marginRight: '12px', fontSize: '1.2rem' }}>💰</span> เติมเงินเข้ากระเป๋า
                  </button>
                  <button 
                    style={menuStyle('password')} 
                    onClick={() => setActiveTab('password')}
                    onMouseEnter={(e) => {
                      if(activeTab !== 'password') {
                        e.currentTarget.style.background = '#334155';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if(activeTab !== 'password') {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                      <span style={{ marginRight: '12px', fontSize: '1.2rem' }}>🔒</span> เปลี่ยนรหัสผ่าน
                  </button>
                  <button 
                      style={{ 
                        ...menuStyle('logout'), 
                        color: '#ef4444', 
                        borderBottom: 'none',
                        fontWeight: '700'
                      }} 
                      onClick={handleLogout}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                  >
                      <span style={{ marginRight: '12px', fontSize: '1.2rem' }}>🚪</span> ออกจากระบบ
                  </button>
              </div>
          </div>

          {/* ================= ขวา: เนื้อหา (Content Area) ================= */}
          <div style={{ 
            background: '#1e293b',
            padding: '2.5rem', 
            minHeight: '600px',
            borderRadius: '16px',
            border: '2px solid #334155',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            animation: 'fadeIn 1s ease-out 0.2s both'
          }}>
              
              {/* 1. History Content */}
              {activeTab === 'history' && (
                  <div>
                      <h2 style={{ 
                        marginBottom: '2rem', 
                        borderBottom: '2px solid #334155', 
                        paddingBottom: '15px',
                        color: '#f1f5f9',
                        fontSize: '1.8rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <span>📜</span> ประวัติการซื้อ
                      </h2>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#0f172a' }}>
                                    <th style={{ 
                                      padding: '15px', 
                                      textAlign: 'left',
                                      color: '#10b981',
                                      fontWeight: '700',
                                      fontSize: '0.95rem',
                                      borderBottom: '2px solid #334155'
                                    }}>รายการ</th>
                                    <th style={{ 
                                      padding: '15px', 
                                      textAlign: 'left',
                                      color: '#10b981',
                                      fontWeight: '700',
                                      fontSize: '0.95rem',
                                      borderBottom: '2px solid #334155'
                                    }}>วันที่</th>
                                    <th style={{ 
                                      padding: '15px', 
                                      textAlign: 'right',
                                      color: '#10b981',
                                      fontWeight: '700',
                                      fontSize: '0.95rem',
                                      borderBottom: '2px solid #334155'
                                    }}>ราคา</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(item => (
                                    <tr key={item.id} style={{ 
                                      borderBottom: '1px solid #334155',
                                      transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = '#0f172a';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = 'transparent';
                                    }}>
                                        <td style={{ padding: '15px' }}>
                                            <strong style={{ color: '#f1f5f9', fontSize: '1rem' }}>{item.game_name}</strong>
                                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>{item.item_name}</div>
                                        </td>
                                        <td style={{ padding: '15px', color: '#94a3b8', fontSize: '0.9rem' }}>
                                            {new Date(item.created_at).toLocaleDateString('th-TH')}
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'right', fontWeight: '800', color: '#ef4444', fontSize: '1.1rem' }}>
                                            -{Number(item.price).toLocaleString()} ฿
                                        </td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                  <tr>
                                    <td colSpan="3" style={{ 
                                      padding: '60px', 
                                      textAlign: 'center', 
                                      color: '#64748b',
                                      fontSize: '1.1rem'
                                    }}>
                                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                                      ไม่มีประวัติการซื้อ
                                    </td>
                                  </tr>
                                )}
                            </tbody>
                        </table>
                      </div>
                  </div>
              )}

              {/* 2. Topup Content */}
              {activeTab === 'topup' && (
                  <div>
                      <h2 style={{ 
                        marginBottom: '2rem', 
                        borderBottom: '2px solid #334155', 
                        paddingBottom: '15px',
                        color: '#f1f5f9',
                        fontSize: '1.8rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <span>💰</span> เติมเงินเข้ากระเป๋า
                      </h2>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
                        gap: '20px' 
                      }}>
                          {[50, 100, 300, 500, 1000, 5000].map(amount => (
                              <button 
                                key={amount} 
                                className="topup-btn"
                                onClick={() => handleWalletTopup(amount)} 
                                style={{ 
                                    padding: '25px 20px', 
                                    border: '2px solid #334155', 
                                    borderRadius: '16px', 
                                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                                    fontSize: '1.1rem', 
                                    cursor: 'pointer',
                                    fontWeight: '800', 
                                    color: '#f1f5f9',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#10b981';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#334155';
                                }}
                              >
                                  <div style={{ fontSize: '2rem' }}>💵</div>
                                  <div style={{ color: '#10b981', fontSize: '1.5rem' }}>
                                    {amount.toLocaleString()}
                                  </div>
                                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>บาท</div>
                              </button>
                          ))}
                      </div>
                  </div>
              )}

              {/* 3. Password Content */}
              {activeTab === 'password' && (
                  <div style={{ maxWidth: '500px' }}>
                      <h2 style={{ 
                        marginBottom: '2rem', 
                        borderBottom: '2px solid #334155', 
                        paddingBottom: '15px',
                        color: '#f1f5f9',
                        fontSize: '1.8rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <span>🔒</span> เปลี่ยนรหัสผ่าน
                      </h2>
                      <div style={{ display: 'grid', gap: '1.5rem' }}>
                          <div>
                              <label style={{ 
                                display: 'block', 
                                marginBottom: '8px',
                                color: '#e2e8f0',
                                fontWeight: '700',
                                fontSize: '0.95rem'
                              }}>รหัสผ่านเดิม</label>
                              <input 
                                type="password" 
                                required 
                                style={{ 
                                  width: '100%', 
                                  padding: '15px 20px',
                                  background: '#0f172a',
                                  border: '2px solid #334155',
                                  borderRadius: '12px',
                                  color: '#f1f5f9',
                                  fontSize: '1rem',
                                  fontWeight: '600',
                                  transition: 'all 0.3s ease',
                                  outline: 'none'
                                }}
                                value={passForm.old} 
                                onChange={e => setPassForm({...passForm, old: e.target.value})}
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = '#10b981';
                                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2)';
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = '#334155';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              />
                          </div>
                          <div>
                              <label style={{ 
                                display: 'block', 
                                marginBottom: '8px',
                                color: '#e2e8f0',
                                fontWeight: '700',
                                fontSize: '0.95rem'
                              }}>รหัสผ่านใหม่</label>
                              <input 
                                type="password" 
                                required 
                                style={{ 
                                  width: '100%', 
                                  padding: '15px 20px',
                                  background: '#0f172a',
                                  border: '2px solid #334155',
                                  borderRadius: '12px',
                                  color: '#f1f5f9',
                                  fontSize: '1rem',
                                  fontWeight: '600',
                                  transition: 'all 0.3s ease',
                                  outline: 'none'
                                }}
                                value={passForm.new} 
                                onChange={e => setPassForm({...passForm, new: e.target.value})}
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = '#10b981';
                                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2)';
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = '#334155';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              />
                          </div>
                          <div>
                              <label style={{ 
                                display: 'block', 
                                marginBottom: '8px',
                                color: '#e2e8f0',
                                fontWeight: '700',
                                fontSize: '0.95rem'
                              }}>ยืนยันรหัสผ่านใหม่</label>
                              <input 
                                type="password" 
                                required 
                                style={{ 
                                  width: '100%', 
                                  padding: '15px 20px',
                                  background: '#0f172a',
                                  border: '2px solid #334155',
                                  borderRadius: '12px',
                                  color: '#f1f5f9',
                                  fontSize: '1rem',
                                  fontWeight: '600',
                                  transition: 'all 0.3s ease',
                                  outline: 'none'
                                }}
                                value={passForm.confirm} 
                                onChange={e => setPassForm({...passForm, confirm: e.target.value})}
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = '#10b981';
                                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2)';
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = '#334155';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              />
                          </div>
                          <button 
                            type="button"
                            onClick={handleChangePassword}
                            style={{ 
                              padding: '16px', 
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '12px', 
                              cursor: 'pointer',
                              fontSize: '1.1rem',
                              fontWeight: '800',
                              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                              transition: 'all 0.3s ease',
                              marginTop: '1rem'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 6px 25px rgba(16, 185, 129, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.4)';
                            }}
                          >
                              🔐 ยืนยันการเปลี่ยนรหัส
                          </button>
                      </div>
                  </div>
              )}

          </div>
        </div>
      </main>
    </div>
  );
}