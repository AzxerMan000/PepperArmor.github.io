const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Allow cross-origin requests (Roblox can fetch)
app.use(express.json()); // To parse JSON in POST requests

// In-memory whitelist data (you can replace this with a DB or file later)
let whitelist = {
  Owner: "VISIT_GMOD",   // <-- Replace with the actual owner Roblox username
  AllowedUsers: []            // Start empty; owner can add users later
};

// GET /whitelist — returns the current whitelist JSON
app.get('/whitelist', (req, res) => {
  res.json(whitelist);
});

// POST /whitelist/add — add a user to the whitelist (owner only)
app.post('/whitelist/add', (req, res) => {
  const secretKey = req.headers['x-api-key'];
  if (secretKey !== 'your-secret-key') {
    return res.status(403).json({ error: "Forbidden" });
  }

  const userToAdd = req.body.username;
  if (!userToAdd) {
    return res.status(400).json({ error: "No username provided" });
  }

  if (!whitelist.AllowedUsers.includes(userToAdd)) {
    whitelist.AllowedUsers.push(userToAdd);
  }

  res.json({ message: `Added ${userToAdd}`, whitelist });
});

// POST /whitelist/remove — remove a user from the whitelist (owner only)
app.post('/whitelist/remove', (req, res) => {
  const secretKey = req.headers['x-api-key'];
  if (secretKey !== 'your-secret-key') {
    return res.status(403).json({ error: "Forbidden" });
  }

  const userToRemove = req.body.username;
  whitelist.AllowedUsers = whitelist.AllowedUsers.filter(u => u !== userToRemove);

  res.json({ message: `Removed ${userToRemove}`, whitelist });
});

// Start the server on the environment port (Glitch provides PORT env var)
const listener = app.listen(process.env.PORT, () => {
  console.log(`API server listening on port ${listener.address().port}`);
});
