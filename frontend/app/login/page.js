"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const apiHost = process.env.NEXT_PUBLIC_API_HOST;
      
      const res = await fetch(`${apiHost}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }

      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("username", data.user.username);

        alert("ยินดีต้อนรับ " + data.user.username);
        router.push("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
        }
      `}</style>

      <main style={{ 
        maxWidth: "450px", 
        width: "100%",
        animation: "fadeIn 0.8s ease-out"
      }}>
        <div style={{ 
          background: "#1e293b",
          padding: "3rem",
          borderRadius: "24px",
          border: "2px solid #334155",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
        }}>
          
          {/* Header */}
          <header style={{ 
            textAlign: "center", 
            marginBottom: "2.5rem"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: "50%",
              margin: "0 auto 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem",
              boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
              animation: "glow 2s ease-in-out infinite"
            }}>
              🎮
            </div>
            <h1 style={{ 
              margin: "0 0 0.5rem 0",
              fontSize: "2rem",
              fontWeight: "800",
              color: "#f1f5f9",
              letterSpacing: "-0.5px"
            }}>เข้าสู่ระบบ</h1>
            <p style={{ 
              margin: 0,
              fontSize: "1rem",
              color: "#94a3b8",
              fontWeight: "600"
            }}>Game Topup Center</p>
          </header>

          {/* Form */}
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "0.75rem", 
                fontWeight: "700",
                color: "#e2e8f0",
                fontSize: "0.95rem"
              }}>
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                required
                style={{ 
                  width: "100%", 
                  padding: "15px 20px", 
                  fontSize: "1rem",
                  background: "#0f172a",
                  border: "2px solid #334155",
                  borderRadius: "12px",
                  color: "#f1f5f9",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  outline: "none"
                }}
                placeholder="กรอกชื่อผู้ใช้"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#10b981";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#334155";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "0.75rem", 
                fontWeight: "700",
                color: "#e2e8f0",
                fontSize: "0.95rem"
              }}>
                รหัสผ่าน
              </label>
              <input
                type="password"
                required
                style={{ 
                  width: "100%", 
                  padding: "15px 20px", 
                  fontSize: "1rem",
                  background: "#0f172a",
                  border: "2px solid #334155",
                  borderRadius: "12px",
                  color: "#f1f5f9",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  outline: "none"
                }}
                placeholder="กรอกรหัสผ่าน"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#10b981";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#334155";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {error && (
              <div style={{ 
                color: "#ef4444", 
                textAlign: "center", 
                fontSize: "0.95rem",
                padding: "12px",
                background: "rgba(239, 68, 68, 0.1)",
                borderRadius: "12px",
                border: "2px solid #ef4444",
                fontWeight: "600",
                animation: "fadeIn 0.3s ease-out"
              }}>
                ❌ {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              style={{
                marginTop: "0.5rem",
                padding: "16px",
                background: loading 
                  ? "#334155" 
                  : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                fontWeight: "800",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                boxShadow: loading ? "none" : "0 4px 20px rgba(16, 185, 129, 0.4)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 25px rgba(16, 185, 129, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(16, 185, 129, 0.4)";
                }
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <span style={{ animation: "pulse 1s ease-in-out infinite" }}>⏳</span>
                  กำลังตรวจสอบ...
                </span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <span>🔐</span>
                  เข้าสู่ระบบ
                </span>
              )}
            </button>
          </div>

          {/* Footer */}
          <div style={{ 
            marginTop: "2rem", 
            textAlign: "center", 
            fontSize: "0.95rem",
            paddingTop: "2rem",
            borderTop: "1px solid #334155"
          }}>
            <span style={{ color: "#94a3b8" }}>ยังไม่มีบัญชี? </span>
            <a 
              href="/register" 
              style={{ 
                color: "#10b981", 
                textDecoration: "none",
                fontWeight: "700",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#059669";
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#10b981";
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              สมัครสมาชิก
            </a>
          </div>

          {/* Back to Home */}
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <a 
              href="/" 
              style={{ 
                color: "#64748b",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: "600",
                transition: "all 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#94a3b8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#64748b";
              }}
            >
              <span>←</span> กลับหน้าหลัก
            </a>
          </div>
        </div>

        {/* Decorative Elements */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0
        }} />
      </main>
    </div>
  );
}