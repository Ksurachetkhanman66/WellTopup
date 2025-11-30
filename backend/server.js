const express = require('express');
const mysql = require('mysql2/promise'); // ใช้อันนี้ตามอาจารย์
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 1. ตั้งค่า Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dit312_6601977', // ✅ แก้ชื่อ DB ตรงนี้
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 2. Health Check (เช็คว่าต่อ DB ติดไหม)
app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', db: rows[0].ok === 1 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// ============================================
// 3. API Routes ของโปรเจกต์ Game Topup
// ============================================

// 3.1 ดึงรายชื่อเกมทั้งหมด
app.get('/api/games', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM games');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// 3.2 ดึงสินค้าของเกม (ตาม Game ID)
app.get('/api/game_items', async (req, res) => {
  try {
    const gameId = req.query.game_id;
    const [rows] = await pool.query('SELECT * FROM game_items WHERE game_id = ?', [gameId]);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// 1.1 API ดึงข้อมูลเกมเดียว (ตาม ID)
app.get('/api/games/:id', async (req, res) => {
  try {
    const gameId = req.params.id;
    const [rows] = await pool.query('SELECT * FROM games WHERE id = ?', [gameId]);
    
    if (rows.length === 0) {
        return res.status(404).json({ message: 'Game not found' });
    }
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// 3.3 สมัครสมาชิก (Register)
// backend/server.js

app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // บรรทัดนี้คือคำสั่ง "ส่งข้อมูลเข้า Database" ครับ
    await pool.query('INSERT INTO users (username, password, email) VALUES (?,?,?)', 
      [username, password, email]
    );

    res.json({ status: 'success', message: 'สมัครสมาชิกสำเร็จ' });

  } catch (e) {
    console.error(e);
    // ดักจับ Error กรณีชื่อซ้ำ (Error Code ของ MySQL คือ ER_DUP_ENTRY)
    if (e.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเปลี่ยนชื่อใหม่' });
    }
    res.status(500).json({ message: 'สมัครไม่สำเร็จ: ' + e.message });
  }
});

// 3.4 เข้าสู่ระบบ (Login)
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', 
      [username, password]
    );

    if (rows.length > 0) {
      res.json({ status: 'success', user: rows[0] });
    } else {
      res.status(401).json({ message: 'Login failed' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// 3.5 สั่งซื้อสินค้า (ตัดเงิน + บันทึก Order)
app.post('/api/orders', async (req, res) => {
  const { user_id, game_id, item_id, price, in_game_uid } = req.body;

  // เริ่ม Transaction (เพื่อให้แน่ใจว่าตัดเงินและบันทึกของต้องสำเร็จพร้อมกัน)
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. เช็คเงินก่อน
    const [users] = await connection.query('SELECT balance FROM users WHERE id = ?', [user_id]);
    
    // 🔥 แก้ตรงนี้: แปลงเป็น parseFloat ทั้งคู่เพื่อให้แน่ใจว่าเป็นตัวเลข
    const currentBalance = parseFloat(users[0].balance);
    const itemPrice = parseFloat(price);

    if (users.length === 0 || currentBalance < itemPrice) {
      throw new Error('ยอดเงินไม่เพียงพอ');
    }

    // 2. ตัดเงิน
    await connection.query('UPDATE users SET balance = balance - ? WHERE id = ?', [price, user_id]);

    // 3. บันทึก Order
    await connection.query(
      'INSERT INTO orders (user_id, game_id, item_id, price, in_game_uid) VALUES (?,?,?,?,?)',
      [user_id, game_id, item_id, price, in_game_uid]
    );

    await connection.commit(); // ยืนยันการทำงาน
    res.json({ status: 'success', message: 'เติมเงินสำเร็จ!' });

  } catch (e) {
    await connection.rollback(); // ยกเลิกถ้าระบบพังกลางทาง
    res.status(400).json({ message: e.message });
  } finally {
    connection.release(); // คืน connection
  }
});

// 3.6 ดูประวัติการซื้อ (History)
app.get('/api/orders', async (req, res) => {
  try {
    const userId = req.query.user_id;
    const sql = `
      SELECT o.id, g.name as game_name, i.name as item_name, o.price, o.created_at 
      FROM orders o 
      JOIN games g ON o.game_id = g.id 
      JOIN game_items i ON o.item_id = i.id 
      WHERE o.user_id = ? 
      ORDER BY o.created_at DESC
    `;
    const [rows] = await pool.query(sql, [userId]);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// 7. API เปลี่ยนรหัสผ่าน
app.post('/api/change_password', async (req, res) => {
  try {
    const { user_id, old_password, new_password } = req.body;
    
    // 1. เช็ครหัสเดิมก่อน
    const [users] = await pool.query('SELECT * FROM users WHERE id = ? AND password = ?', [user_id, old_password]);
    
    if (users.length === 0) {
      return res.status(400).json({ message: 'รหัสผ่านเดิมไม่ถูกต้อง' });
    }

    // 2. อัปเดตรหัสใหม่
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [new_password, user_id]);
    
    res.json({ status: 'success', message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// 8. API ดึงข้อมูล User (รวมยอดเงิน)
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    // ดึงเฉพาะ id, username, balance (ไม่เอา password)
    const [rows] = await pool.query('SELECT id, username, email, balance FROM users WHERE id = ?', [userId]);
    
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
// ✅ 9. API เติมเงินเข้ากระเป๋า (Wallet Top-up)
app.post('/api/topup', async (req, res) => {
  const { user_id, amount } = req.body;

  // เริ่ม Transaction เพื่อความชัวร์ (เงินเพิ่ม + เก็บประวัติ)
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. เพิ่มเงินในตาราง users
    await connection.query('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, user_id]);

    // 2. บันทึกประวัติลงตาราง wallet_transactions
    await connection.query(
      'INSERT INTO wallet_transactions (user_id, amount, type) VALUES (?, ?, ?)',
      [user_id, amount, 'topup']
    );

    await connection.commit();

    // 3. ดึงยอดเงินล่าสุดส่งกลับไปอัปเดตหน้าเว็บ
    const [rows] = await connection.query('SELECT balance FROM users WHERE id = ?', [user_id]);
    
    res.json({ 
        status: 'success', 
        message: 'เติมเงินสำเร็จ!', 
        newBalance: rows[0].balance 
    });

  } catch (e) {
    await connection.rollback();
    res.status(500).json({ message: 'เติมเงินล้มเหลว: ' + e.message });
  } finally {
    connection.release();
  }
});
// 4. Start Server
const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`✅ API listening on http://localhost:${port}`));