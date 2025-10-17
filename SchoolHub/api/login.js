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
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Введите логин и пароль' });
      }

      const user = global.schoolHubData.users.find(u => u.username === username);
      if (!user) {
        return res.status(400).json({ error: 'Пользователь не найден' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Неверный пароль' });
      }

      const { password: _, ...userWithoutPassword } = user;
      return res.json({ 
        message: 'Вход успешен!', 
        user: userWithoutPassword 
      });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка входа' });
    }
  }

  return res.status(405).json({ error: 'Метод не поддерживается' });
};