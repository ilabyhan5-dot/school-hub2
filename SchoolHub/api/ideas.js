const bcrypt = require('bcryptjs');

// Глобальное хранилище (в продакшене заменить на базу данных)
global.schoolHubData = global.schoolHubData || {
  ideas: [],
  users: [
    {
      username: 'superadmin',
      password: '$2a$10$8K1p/a0dRTlB0ZQ1F8c8QOcC5p5u5p5u5p5u5p5u5p5u5p5u5p5u',
      name: 'Главный Админ',
      role: 'superadmin'
    },
    {
      username: 'admin',
      password: '$2a$10$8K1p/a0dRTlB0ZQ1F8c8QOcC5p5u5p5u5p5u5p5u5p5u5p5u5p5u',
      name: 'Администратор', 
      role: 'admin'
    }
  ],
  settings: {
    siteName: "Школьный Хаб",
    siteDescription: "Предложите мероприятие своей мечты. Анонимно или от своего имени.",
    primaryColor: "#3A86FF"
  }
};

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const ideas = global.schoolHubData.ideas
        .filter(idea => idea.status !== 'deleted')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(ideas);
    }

    if (req.method === 'POST') {
      const { title, category, description, author, anonymous } = req.body;
      
      if (!title || !category || !description) {
        return res.status(400).json({ error: 'Заполните все поля' });
      }

      const newIdea = {
        id: Date.now().toString(),
        title,
        category,
        description,
        author: anonymous ? 'Аноним' : (author || 'Ученик'),
        anonymous: !!anonymous,
        votes: 0,
        voters: [],
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      global.schoolHubData.ideas.push(newIdea);
      return res.json({ message: 'Идея добавлена!', idea: newIdea });
    }

    return res.status(405).json({ error: 'Метод не поддерживается' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
};