const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

const MODEL_URL = 'https://router.huggingface.co/hf-inference/v1/chat/completions';
const ROUTER_V1 = 'https://router.huggingface.co/v1/chat/completions';

async function testHF() {
    console.log('Testing: ' + ROUTER_V1);
    try {
        const response = await axios.post(
            ROUTER_V1,
            { 
                model: "meta-llama/Meta-Llama-3-8B-Instruct",
                messages: [{ role: "user", content: "Hello!" }],
                max_tokens: 50
            },
            {
                headers: {
                    'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        );
        console.log('Success:', response.data.choices[0].message);
    } catch (err) {
        console.log('Error status:', err.response?.status);
        console.log('Error msg:', err.message);
    }
}
testHF();
