// // 
// import fs from 'fs';
// import path from 'path';

// export default function handler(req, res) {
//   // Enable CORS
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }

//   try {
//     // Read the database file
//     const dbPath = path.join(process.cwd(), 'api/db.json');
//     const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

//     const { url, method, query } = req;

//     // Handle different API endpoints
//     if (url.includes('/users')) {
//       if (method === 'GET') {
//         const { email, password } = query;
//         if (email && password) {
//           // Login functionality
//           const user = db.users.find(u => u.email === email && u.password === password);
//           return res.json(user ? [user] : []);
//         }
//         // Get all users
//         return res.json(db.users);
//       }
//     }

//     if (url.includes('/tasks')) {
//       if (method === 'GET') {
//         const { userId } = query;
//         if (userId) {
//           const userTasks = db.tasks.filter(task => task.userId == userId);
//           return res.json(userTasks);
//         }
//         return res.json(db.tasks);
//       }
//     }

//     // Default response
//     return res.status(404).json({ error: 'Endpoint not found' });

//   } catch (error) {
//     console.error('API Error:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// }



import fs from 'fs';
import path from 'path';
import { createServer } from 'http';
import { parse } from 'url';

// Serverless function for Vercel
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Read the database file
    const dbPath = path.join(process.cwd(), 'api/db.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    const { pathname, query: urlQuery } = parse(req.url, true);
    const { method } = req;

    // Handle different API endpoints
    if (pathname.includes('/users')) {
      if (method === 'GET') {
        const { email, password } = urlQuery;
        if (email && password) {
          // Login functionality
          const user = db.users.find(u => u.email === email && u.password === password);
          return res.json(user ? [user] : []);
        }
        // Get all users
        return res.json(db.users);
      }
    }

    if (pathname.includes('/tasks')) {
      if (method === 'GET') {
        const { userId } = urlQuery;
        if (userId) {
          const userTasks = db.tasks.filter(task => task.userId == userId);
          return res.json(userTasks);
        }
        return res.json(db.tasks);
      }
    }

    // Default response
    return res.status(404).json({ error: 'Endpoint not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Local development server
if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
  const server = createServer((req, res) => {
    // Add JSON response helper
    res.json = (data) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };

    // Call the handler function
    handler(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`JSON Server is running on port ${PORT}`);
  });
}