const express = require('express');
const { ethers } = require('ethers'); // Import ethers for signature verification
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend-backend communication
app.use(express.json()); // Parse JSON request bodies

// Signature Verification Endpoint
app.post('/verify', async (req, res) => {
    const { message, signature, did } = req.body;

    try {
        // Extract the address from the DID (e.g., did:ethr:0x123...)
        const didAddress = did.split(':')[2];

        // Recover the address from the signature
        const recoveredAddress = ethers.verifyMessage(message, signature);

        // Compare the recovered address with the DID address
        const isValid = recoveredAddress.toLowerCase() === didAddress.toLowerCase();

        // Send the verification result
        res.json({ isValid });
    } catch (error) {
        console.error('Error verifying signature:', error);
        res.status(500).json({ error: 'Failed to verify signature' });
    }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});