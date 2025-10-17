const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { username, password, name, secretCode } = req.body;
      
      if (!username || !password || !name) {
        return res.status(400).json({ error: 'Заполните все поля' });
      }

      if (secretCode !== 'SCHOOL2024') {
        return res.status(403).json({ error: 'Неверный код регистрации' });
      }

      if (global.schoolHubData.users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'Пользователь уже существует' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        username,
        password: hashedPassword,
        name,
        role: 'user'
      };

      global.schoolHubData.users.push(newUser);
      const { password: _, ...userWithoutPassword } = newUser;

      return res.json({ 
        message: 'Регистрация успешна!', 
        user: userWithoutPassword 
      });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка регистрации' });
    }
  }

  return res.status(405).json({ error: 'Метод не поддерживается' });
};