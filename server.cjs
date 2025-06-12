const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Enable CORS
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
});

server.use(jsonServer.bodyParser);
server.use(middlewares);

// Custom route for login
server.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = router.db.get('users').value();
    console.log('Users in database:', users);
    if (!users || users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
    }
    
    const user = users.find(u => 
        u.email === email && 
        u.password === password
    );

    if (user) {
        const token = Buffer.from(JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role
        })).toString('base64');

        res.status(200).json({
            user,
            token,
            message: 'Login successful'
        });
    } else {
        res.status(401).json({ 
            message: 'Invalid email or password' 
        });
    }
});

server.use(router);

server.listen(3001, () => {
    console.log('JSON Server is running on port 3001');
});