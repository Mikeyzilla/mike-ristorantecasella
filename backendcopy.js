const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 5000;
const cors = require('cors');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

const allowedOrigins = ['http://localhost:3000'];

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/register', async (req, res) => {
    const { username, password, address, cardAmount } = req.body;

    if (!username || !password || !address || !cardAmount) {
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

            db.run('INSERT INTO restaurant_user_info (username, password, address, cardAmount) VALUES (?, ?, ?, ?)',
                [username, hashedPassword, address, cardAmountInt], function (err) {
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
    db.get('SELECT address, cardAmount FROM restaurant_user_info WHERE username = ?', [username], (err, row) => {
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
    const { username, address, totalAmount } = req.body;


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

app.put('/changePass', (req, res) => {
    const { username, password, newPassword } = req.body;

    if (!username || !password || !newPassword) {
        return res.status(400).json({ message: 'Username, current password, and new password are required.' });
    }

    db.get(
        'SELECT username, password FROM restaurant_user_info WHERE username = ?',
        [username],
        (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            bcrypt.compare(password, user.password, async (compareErr, match) => {
                if (compareErr) {
                    console.error('BCrypt compare error:', compareErr);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                if (!match) {
                    return res.status(401).json({ message: 'Current password is incorrect' });
                }

                try {
                    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

                    db.run(
                        'UPDATE restaurant_user_info SET password = ? WHERE username = ?',
                        [hashedNewPassword, username],
                        function (updateErr) {
                            if (updateErr) {
                                console.error('Error updating password:', updateErr);
                                return res.status(500).json({ message: 'Failed to update password' });
                            }
                            return res.status(200).json({ message: 'Password updated successfully' });
                        }
                    );
                } catch (hashErr) {
                    console.error('Error hashing new password:', hashErr);
                    return res.status(500).json({ message: 'Error hashing password' });
                }
            });
        }
    );
});

app.get('/getUserBalance', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is required.' });
    }

    db.get(
        'SELECT cardAmount FROM restaurant_user_info WHERE username = ?',
        [username],
        (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (!row) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({ username, cardAmount: row.cardAmount });
        }
    );
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