const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 5000;
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/register', async (req, res) => {
    const { username, password, address, creditCardNo, cardAmount } = req.body;

    if (!username || !password || !address || !creditCardNo || !cardAmount) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    db.get('SELECT * FROM restaurant_user_info WHERE username = ?', [username], async (err, row) => {
        if (err) {
            console.error('Error querying the database:', err.message);
            return res.status(500).json({ message: 'Error querying the database.' });
        }

        if (row) {
            return res.status(400).json({ message: 'A user with this username already exists.' });
        }

        try {
       
            const hashedPassword = await bcrypt.hash(password, 10);
            const cardAmountInt = parseInt(cardAmount, 10); 

            db.run('INSERT INTO restaurant_user_info (username, password, address, creditCardNo, cardAmount) VALUES (?, ?, ?, ?, ?)', 
                [username, hashedPassword, address, creditCardNo, cardAmountInt], function(err) {
                    if (err) {
                        console.error('Error inserting user:', err.message);
                        return res.status(500).json({ message: 'Error inserting user.' });
                    }
                    return res.status(201).json({ message: 'User registered successfully.' });
                });
        } catch (hashError) {
            console.error('Error hashing password:', hashError);
            return res.status(500).json({ message: 'Error hashing password.' });
        }
    });
});


app.post('/login', (req, res) => {

    const { username, password } = req.body;
    
    db.get('SELECT * FROM restaurant_user_info WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.log("There was an error")
        }
        if (!row) {
            console.log("There's no username in our system that matches the one entered")
        }

        bcrypt.compare(password, row.password, (compareErr, match) => {
            if (compareErr) {
                console.error("Error comparing passwords:", compareErr);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (!match) {
                console.log("Password is incorrect");
                return res.status(401).json({ message: 'Invalid password' });
            }
            
            const token = jwt.sign({ username: row.username, id: row.id }, JWT_SECRET, { expiresIn: '2h' });

            return res.status(200).json({
                message: 'Login successful',
                username: row.username,
                card_amount: row.cardAmount,
                token, 
            });
        });
    });
});

app.get('/getUserData', (req, res) => {
    const { username } = req.query;
    db.get('SELECT * FROM restaurant_user_info WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (row) {
            return res.status(200).json(row); 
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    });
});

app.post('/paynow', (req, res) => {
    console.log('Received a payment request:', req.body);
    const { username, address, creditCardNo, totalAmount } = req.body;
  

    db.get('SELECT * FROM restaurant_user_info WHERE username = ?', [username], (err, user) => {
        if (err) {
            console.log("Database error:", err);
            return res.status(500).send('Internal Server Error');
        }
        if (!user) {
            console.log("No user was found with that username.");
            return res.status(404).send('User not found');
        }

        const { cardAmount } = user;
        if (cardAmount >= totalAmount) {
            const newCardAmount = cardAmount - totalAmount;

            db.run('UPDATE restaurant_user_info SET cardAmount = ? WHERE username = ?', [newCardAmount, username], (err) => {
                if (err) {
                    console.log("Error updating card amount:", err);
                    return res.status(500).send('Failed to update card amount');
                }
                res.status(200).send('Payment successful');
            });
        } else {
            console.log("Insufficient funds.");
            return res.status(400).send('Insufficient funds');
        }
    });
});




process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing the database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});