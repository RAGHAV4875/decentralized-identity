import React, { useState } from 'react';
import { BrowserProvider, Contract } from 'ethers'; // Import ethers
import { Button, TextField, Container, Typography, Box } from '@mui/material';

function App() {
    const [did, setDID] = useState('');
    const [document, setDocument] = useState('');

    // Connect to MetaMask
    const connectWallet = async () => {
        if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setDID(`did:ethr:${address}`);
        } else {
            alert('Install MetaMask!');
        }
    };

    // Register DID on the blockchain
    const registerDID = async () => {
        if (!window.ethereum) {
            alert('MetaMask is not installed!');
            return;
        }

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Replace with your contract address and ABI
        const contractAddress = '0x575E9A32D6337B227Ca604663f94b33B6982098D';
        const contractABI = [
            'function registerDID(string did, string document)',
        ];

        const contract = new Contract(contractAddress, contractABI, signer);

        try {
            const tx = await contract.registerDID(did, document);
            await tx.wait(); // Wait for the transaction to be mined
            alert('DID Registered!');
        } catch (error) {
            console.error('Error registering DID:', error);
            alert('Failed to register DID. Check the console for details.');
        }
    };

    // Sign a message and verify it using the backend
    const signMessage = async () => {
        if (!window.ethereum) {
            alert('MetaMask is not installed!');
            return;
        }

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Example message to sign
        const message = 'Hello, this is a signed message!';

        // Sign the message
        const signature = await signer.signMessage(message);
        console.log('Signature:', signature);

        // Send the message and signature to the backend for verification
        const response = await fetch('http://localhost:3001/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, signature, did }),
        });

        const result = await response.json();
        if (result.isValid) {
            alert('Signature is valid!');
        } else {
            alert('Signature is invalid!');
        }
    };

    return (
        <Container>
            <Box mt={5}>
                <Typography variant="h4">Decentralized Identity Wallet</Typography>

                {/* Connect Wallet Button */}
                <Button variant="contained" onClick={connectWallet} sx={{ mt: 2 }}>
                    Connect Wallet
                </Button>

                {/* Display DID and Registration Form */}
                {did && (
                    <Box mt={3}>
                        <Typography>Your DID: {did}</Typography>

                        {/* Identity Document Input */}
                        <TextField
                            label="Identity Document (JSON)"
                            multiline
                            rows={4}
                            value={document}
                            onChange={(e) => setDocument(e.target.value)}
                            sx={{ mt: 2, width: '100%' }}
                        />

                        {/* Register DID Button */}
                        <Button variant="contained" onClick={registerDID} sx={{ mt: 2 }}>
                            Register DID
                        </Button>

                        {/* Sign and Verify Message Button */}
                        <Button variant="contained" onClick={signMessage} sx={{ mt: 2 }}>
                            Sign and Verify Message
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
}

export default App;