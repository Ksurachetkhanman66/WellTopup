"use client";

import { useState, useEffect } from "react";

// --- ข้อมูล Banner (Mock Data) ---
const banners = [
  { id: 1, img: "https://digicodes.net/wp-content/uploads/2020/03/digital-top-up-home-banner.jpg", title: "โปรโมชั่นต้อนรับสมาชิกใหม่" },
  { id: 2, img: "https://cdn-webth.garenanow.com/webth/cdn/rov/non-events/official/20250627/cb2232b1-eea8-4a9b-818c-702c299dd8f7.jpg", title: "RoV เติมคุ้มรับสกินฟรี" },
  { id: 3, img: "https://techissuestoday.com/wp-content/uploads/2024/08/valorant-night-market.webp", title: "Valorant Night Market มาแล้ว!" },
  { id: 4, img: "https://genshin-countdown.gengamer.in/wp-content/uploads/69131345e72e550ad16be02btfdTcOkZ03-1.webp", title: "GenshinImpact ส่วนลด 30%!" },
];

export default function Page() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all"); 
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const pcGameIds = [104, 106, 110, 117, 118, 119]; 

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const storedId = localStorage.getItem("userId");
    
    if (storedUser && storedId) {
      setUser({ username: storedUser, id: storedId });
    }

    async function getGames() {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_HOST;
        const res = await fetch(`${apiHost}/api/games`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch games");
        const data = await res.json();

        const gamesWithPlatform = data.map(game => ({
            ...game,
            platform: pcGameIds.includes(game.id) ? 'pc' : 'mobile'
        }));

        setRows(gamesWithPlatform);
        setFilteredRows(gamesWithPlatform);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getGames();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  const handleFilter = (cat) => {
    setCategory(cat);
    if (cat === "all") {
      setFilteredRows(rows);
    } else {
      setFilteredRows(rows.filter((game) => game.platform === cat));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(); 
  };

  if (loading) {
    return (
      <main style={{ 
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
      </main>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#0f172a',
      paddingBottom: '4rem'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .game-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .game-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
        }
        .game-card:hover img {
          transform: scale(1.1);
        }
      `}</style>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* --- Header Navbar --- */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '2rem 0',
          animation: 'fadeIn 0.6s ease-out'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800',
            color: '#10b981',
            textShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🎮 Game Topup
          </h1>
          
          <div>
            {user ? (
              <a href="/profile" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  textDecoration: 'none', 
                  background: '#1e293b',
                  padding: '10px 20px', 
                  borderRadius: '12px', 
                  border: '2px solid #334155',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.boxShadow = '0 4px 25px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#334155';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
              }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>👤</div>
                  <div>
                      <div style={{ fontSize: '1rem', fontWeight: '700', color: '#f1f5f9' }}>{user.username}</div>
                      <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }}>จัดการบัญชี</div>
                  </div>
              </a>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                  <a href="/login" style={{ 
                    padding: '10px 24px', 
                    fontWeight: '600', 
                    color: '#f1f5f9',
                    textDecoration: 'none',
                    background: '#1e293b',
                    borderRadius: '12px',
                    border: '2px solid #334155',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#10b981';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#334155';
                  }}>
                    เข้าสู่ระบบ
                  </a>
                  <a href="/register" style={{ 
                    padding: '10px 24px', 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white', 
                    borderRadius: '12px', 
                    textDecoration: 'none',
                    fontWeight: '600',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                    border: '2px solid #10b981',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(16, 185, 129, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.4)';
                  }}>
                    สมัครสมาชิก
                  </a>
              </div>
            )}
          </div>
        </header>

        {/* --- Banner Slider --- */}
        <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '450px', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            marginBottom: '3rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            border: '2px solid #1e293b',
            animation: 'fadeIn 0.8s ease-out 0.2s both'
        }}>
          <div style={{ 
              display: 'flex', 
              width: '100%', 
              height: '100%',
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: 'transform 0.5s ease-in-out'
          }}>
              {banners.map((banner) => (
                  <div key={banner.id} style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
                      <img src={banner.img} alt={banner.title} style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                        backgroundColor: '#000'
                      }} />
                      <div style={{ 
                        position: 'absolute', 
                        bottom: '0', 
                        left: '0', 
                        width: '100%', 
                        padding: '24px', 
                        background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.7) 50%, transparent 100%)',
                        color: 'white'
                      }}>
                          <h2 style={{ 
                            margin: 0, 
                            fontSize: '1.8rem',
                            fontWeight: '800',
                            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                          }}>{banner.title}</h2>
                      </div>
                  </div>
              ))}
          </div>

          <button onClick={prevSlide} style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '15px', 
              transform: 'translateY(-50%)',
              background: 'rgba(30, 41, 59, 0.8)', 
              border: '2px solid #334155', 
              borderRadius: '50%', 
              width: '45px', 
              height: '45px', 
              color: 'white', 
              fontSize: '1.5rem', 
              cursor: 'pointer',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#10b981';
            e.currentTarget.style.borderColor = '#10b981';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
            e.currentTarget.style.borderColor = '#334155';
          }}>❮</button>

          <button onClick={nextSlide} style={{ 
              position: 'absolute', 
              top: '50%', 
              right: '15px', 
              transform: 'translateY(-50%)',
              background: 'rgba(30, 41, 59, 0.8)', 
              border: '2px solid #334155', 
              borderRadius: '50%', 
              width: '45px', 
              height: '45px', 
              color: 'white', 
              fontSize: '1.5rem', 
              cursor: 'pointer',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#10b981';
            e.currentTarget.style.borderColor = '#10b981';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
            e.currentTarget.style.borderColor = '#334155';
          }}>❯</button>

          <div style={{ 
            position: 'absolute', 
            bottom: '15px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            display: 'flex', 
            gap: '8px'
          }}>
              {banners.map((_, index) => (
                  <div key={index} 
                      onClick={() => setCurrentSlide(index)}
                      style={{ 
                          width: '10px',
                          height: '10px', 
                          borderRadius: '50%', 
                          background: currentSlide === index ? '#10b981' : '#334155',
                          cursor: 'pointer', 
                          transition: 'all 0.3s',
                          border: '2px solid ' + (currentSlide === index ? '#10b981' : '#1e293b')
                      }}
                  />
              ))}
          </div>
        </div>

        {/* --- Categories --- */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '2.5rem',
          animation: 'fadeIn 1s ease-out 0.4s both'
        }}>
          {[
            { key: 'all', icon: '🔥', label: 'ทั้งหมด' },
            { key: 'mobile', icon: '📱', label: 'มือถือ' },
            { key: 'pc', icon: '💻', label: 'PC' }
          ].map((tab) => (
            <button 
              key={tab.key}
              onClick={() => handleFilter(tab.key)}
              style={{ 
                padding: '14px 32px',
                fontSize: '1rem',
                fontWeight: '700',
                border: '2px solid',
                borderColor: category === tab.key ? '#10b981' : '#334155',
                borderRadius: '12px',
                cursor: 'pointer',
                background: category === tab.key 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : '#1e293b',
                color: 'white',
                boxShadow: category === tab.key 
                  ? '0 4px 20px rgba(16, 185, 129, 0.4)' 
                  : '0 2px 10px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (category !== tab.key) {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (category !== tab.key) {
                  e.currentTarget.style.borderColor = '#334155';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- Game Grid --- */}
        <section style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          animation: 'fadeIn 1.2s ease-out 0.6s both'
        }}>
          {filteredRows.map((game, index) => (
            <a 
              key={game.id} 
              href={`/topup/${game.id}`} 
              style={{ 
                textDecoration: 'none',
                animation: `slideIn 0.5s ease-out ${0.1 * index}s both`
              }}
            >
              <div className="game-card" style={{
                background: '#1e293b',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                border: '2px solid #334155'
              }}>
                {game.coverimage && (
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    overflow: 'hidden',
                    position: 'relative',
                    borderBottom: '2px solid #334155'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: game.platform === 'pc' 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                        : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                      color: 'white',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      zIndex: 2,
                      border: '2px solid rgba(255,255,255,0.2)'
                    }}>
                      {game.platform === 'pc' ? '💻 PC' : '📱 Mobile'}
                    </div>
                    <img 
                      src={game.coverimage} 
                      alt={game.name} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }} 
                    />
                  </div>
                )}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ 
                    margin: '0 0 12px 0',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#f1f5f9',
                    lineHeight: '1.4'
                  }}>
                    {game.name}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid #334155'
                  }}>
                    <span style={{
                      fontSize: '0.9rem',
                      color: '#10b981',
                      fontWeight: '600'
                    }}>เติมเงินเลย</span>
                    <span style={{
                      fontSize: '1.5rem',
                      color: '#10b981'
                    }}>→</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </section>
      </main>
    </div>
  );
}