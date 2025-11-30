"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function TopupPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [game, setGame] = useState(null);
  const [items, setItems] = useState([]);
  const [uid, setUid] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [balance, setBalance] = useState(0.00); 

  const apiHost = process.env.NEXT_PUBLIC_API_HOST;

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    fetch(`${apiHost}/api/games/${id}`)
      .then(res => res.json())
      .then(data => setGame(data));

    fetch(`${apiHost}/api/game_items?game_id=${id}`)
      .then(res => res.json())
      .then(data => setItems(data));

    if (userId) {
        fetch(`${apiHost}/api/users/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.balance !== undefined) {
                    setBalance(parseFloat(data.balance));
                }
            });
    }
  }, [id, apiHost]);

  const handleBuy = async () => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) { 
        alert('กรุณาเข้าสู่ระบบก่อนเติมเงิน'); 
        router.push('/login'); 
        return; 
    }
    if (!uid) return alert('กรุณากรอก UID');
    if (!selectedItem) return alert('กรุณาเลือกแพ็กเกจ');

    if (balance < parseFloat(selectedItem.price)) {
        alert(`❌ ยอดเงินไม่พอ! (ขาดอีก ${(selectedItem.price - balance).toLocaleString()} บาท)\nกรุณาเติมเงินเข้ากระเป๋าก่อน`);
        return;
    }

    if(!confirm(`ยืนยันการเติมเงิน "${selectedItem.name}" ราคา ${selectedItem.price} บาท?`)) return;

    try {
        const res = await fetch(`${apiHost}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                game_id: id,
                item_id: selectedItem.id,
                price: selectedItem.price,
                in_game_uid: uid
            })
        });

        const data = await res.json();
        if (res.ok) {
            alert('✅ ' + data.message);
            router.push('/profile');
        } else {
            alert('❌ ' + data.message);
        }
    } catch (err) {
        alert('Error connecting server');
    }
  };

  if (!game) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #1e293b',
            borderTop: '4px solid #10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ color: '#e2e8f0', fontSize: '1.2rem', fontWeight: '600' }}>กำลังโหลด...</div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', paddingBottom: '4rem' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .package-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .package-card:hover:not(:disabled) {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
        }
      `}</style>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Header & Balance */}
        <div style={{ 
          marginBottom: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          animation: 'fadeIn 0.6s ease-out'
        }}>
          <Link href="/" style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px', 
              textDecoration: 'none', 
              background: '#1e293b', 
              color: '#f1f5f9', 
              padding: '12px 24px', 
              borderRadius: '12px', 
              fontWeight: '700',
              border: '2px solid #334155',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
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
              <span style={{ fontSize: '1.2rem' }}>←</span> กลับหน้าหลัก
          </Link>

          <div style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white', 
              padding: '12px 28px', 
              borderRadius: '12px', 
              border: '2px solid #10b981',
              fontWeight: '700',
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
              fontSize: '1.1rem'
          }}>
              💰 คงเหลือ: <span style={{ fontSize: '1.3rem' }}>{balance.toLocaleString()}</span> ฿
          </div>
        </div>

        {/* Game Banner */}
        <div style={{ 
          padding: '0', 
          overflow: 'hidden', 
          marginBottom: '2.5rem', 
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          border: '2px solid #1e293b',
          animation: 'fadeIn 0.8s ease-out 0.2s both'
        }}>
          <div style={{ position: 'relative', width: '100%', paddingBottom: '42.86%' }}>
              <img src={game.coverimage} alt={game.name} style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                backgroundColor: '#000'
              }} />
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.3) 40%, transparent 70%)' 
              }}></div>
              <div style={{ 
                position: 'absolute', 
                bottom: '24px', 
                left: '32px', 
                color: 'white',
                textShadow: '0 4px 12px rgba(0,0,0,0.8)'
              }}>
                  <h1 style={{ 
                    fontSize: 'clamp(1.8rem, 4vw, 3rem)', 
                    margin: 0, 
                    fontWeight: '800',
                    letterSpacing: '-0.5px'
                  }}>{game.name}</h1>
                  <p style={{ 
                    margin: '8px 0 0 0', 
                    fontSize: '1.1rem',
                    color: '#10b981',
                    fontWeight: '600'
                  }}>Game ID: {game.id}</p>
              </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '2rem' }}>
          
          {/* Step 1: UID */}
          <div style={{ 
            background: '#1e293b',
            padding: '2rem', 
            borderRadius: '16px',
            border: '2px solid #334155',
            borderLeft: '6px solid #10b981',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            animation: 'fadeIn 1s ease-out 0.4s both'
          }}>
              <h3 style={{ 
                margin: '0 0 1.5rem 0', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                color: '#f1f5f9',
                fontSize: '1.3rem'
              }}>
                  <span style={{ 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white', 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '1rem',
                    fontWeight: '800',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                  }}>1</span>
                  กรอกข้อมูลตัวละคร
              </h3>
              <div style={{ 
                background: '#0f172a', 
                padding: '1.5rem', 
                borderRadius: '12px',
                border: '2px solid #1e293b'
              }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '10px', 
                    fontWeight: '700', 
                    color: '#e2e8f0',
                    fontSize: '0.95rem'
                  }}>UID / User ID</label>
                  <input 
                    type="text" 
                    style={{ 
                      width: '100%', 
                      padding: '15px 20px', 
                      fontSize: '1.1rem', 
                      border: '2px solid #334155',
                      borderRadius: '12px',
                      background: '#1e293b',
                      color: '#f1f5f9',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }} 
                    placeholder="ระบุ UID ตัวละครของคุณ" 
                    value={uid} 
                    onChange={(e) => setUid(e.target.value)}
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
          </div>

          {/* Step 2: เลือกแพ็กเกจ */}
          <div style={{ 
            background: '#1e293b',
            padding: '2rem', 
            borderRadius: '16px',
            border: '2px solid #334155',
            borderLeft: '6px solid #3b82f6',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            animation: 'fadeIn 1s ease-out 0.6s both'
          }}>
              <h3 style={{ 
                margin: '0 0 1.5rem 0', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                color: '#f1f5f9',
                fontSize: '1.3rem'
              }}>
                  <span style={{ 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white', 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '1rem',
                    fontWeight: '800',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                  }}>2</span>
                  เลือกแพ็กเกจเติมเงิน
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
                gap: '15px' 
              }}>
                  {items.map((item) => (
                      <button 
                        key={item.id} 
                        className="package-card"
                        onClick={() => setSelectedItem(item)}
                        disabled={balance < item.price}
                        style={{ 
                            padding: '1.5rem', 
                            border: '2px solid',
                            borderColor: selectedItem?.id === item.id ? '#3b82f6' : '#334155',
                            borderRadius: '16px',
                            background: selectedItem?.id === item.id 
                              ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
                              : '#0f172a',
                            cursor: (balance < item.price) ? 'not-allowed' : 'pointer',
                            textAlign: 'center',
                            boxShadow: selectedItem?.id === item.id 
                              ? '0 8px 24px rgba(59, 130, 246, 0.4)' 
                              : '0 4px 12px rgba(0,0,0,0.3)',
                            opacity: (balance < item.price) ? 0.5 : 1
                        }}
                      >
                          <div style={{ 
                            fontWeight: '700', 
                            marginBottom: '10px', 
                            color: '#f1f5f9',
                            fontSize: '1.1rem'
                          }}>{item.name}</div>
                          <div style={{ 
                            color: (balance < item.price) ? '#ef4444' : '#10b981',
                            fontSize: '1.3rem', 
                            fontWeight: '800' 
                          }}>
                              {Number(item.price).toLocaleString()} ฿
                          </div>
                          {balance < item.price && (
                            <div style={{
                              marginTop: '8px',
                              fontSize: '0.75rem',
                              color: '#ef4444',
                              fontWeight: '600'
                            }}>
                              ยอดเงินไม่พอ
                            </div>
                          )}
                      </button>
                  ))}
              </div>
          </div>

          {/* Step 3: สรุปยอด */}
          <div style={{ 
            padding: '2rem', 
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: 'white', 
            borderRadius: '16px',
            border: '2px solid #334155',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '1.5rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            animation: 'fadeIn 1s ease-out 0.8s both'
          }}>
              <div>
                  <div style={{ fontSize: '0.95rem', color: '#94a3b8', fontWeight: '600' }}>ยอดชำระทั้งหมด</div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '800', 
                    color: '#10b981',
                    textShadow: '0 2px 10px rgba(16, 185, 129, 0.5)',
                    marginTop: '4px'
                  }}>
                      {selectedItem ? Number(selectedItem.price).toLocaleString() : '0'} ฿
                  </div>
              </div>
              
              <button 
                  onClick={handleBuy}
                  disabled={!selectedItem || !uid || (selectedItem && balance < selectedItem.price)}
                  style={{ 
                      padding: '16px 48px', 
                      background: (selectedItem && balance < selectedItem.price) 
                        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                        : (selectedItem && uid) 
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : '#334155',
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      fontSize: '1.2rem', 
                      fontWeight: '800', 
                      cursor: (selectedItem && uid && balance >= selectedItem.price) ? 'pointer' : 'not-allowed',
                      boxShadow: (selectedItem && uid) ? '0 8px 24px rgba(0,0,0,0.4)' : 'none',
                      transition: 'all 0.3s ease',
                      opacity: (!selectedItem || !uid || (selectedItem && balance < selectedItem.price)) ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (selectedItem && uid && balance >= selectedItem.price) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
                  }}
              >
                  {!selectedItem ? '🎮 กรุณาเลือกรายการ' : 
                   !uid ? '📝 กรุณากรอก UID' :
                   (balance < selectedItem.price) ? '❌ ยอดเงินไม่พอ' : '🚀 ยืนยันการเติมเงิน'}
              </button>
          </div>

        </div>
      </main>
    </div>
  );
}