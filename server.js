const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

// HTML/CSS/JS files serve karega
app.use(express.static(__dirname));


// NVIDIA model API
app.post("/api/nvidia/models", async (req, res) => {
    try {
        const { apiKey } = req.body;

        if (!apiKey) {
            return res.status(400).json({
                error: "NVIDIA API key is required."
            });
        }

        const response = await fetch(
            "https://integrate.api.nvidia.com/v1/models",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Accept": "application/json"
                }
            }
        );

        const text = await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            return res.status(response.status).json({
                error: text || `NVIDIA returned HTTP ${response.status}`
            });
        }

        return res.status(response.status).json(data);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });
    }
});

app.post("/api/nvidia/chat", async (req, res) => {
    try {
        const { apiKey, model, messages } = req.body;

        if (!apiKey || typeof apiKey !== "string") {
            return res.status(400).json({ error: "NVIDIA API key is required." });
        }

        if (!model || typeof model !== "string") {
            return res.status(400).json({ error: "A model ID is required." });
        }

        if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20 ||
            messages.some(message =>
                !message ||
                !["user", "assistant"].includes(message.role) ||
                typeof message.content !== "string"
            )) {
            return res.status(400).json({ error: "Provide between 1 and 20 valid chat messages." });
        }

        const response = await fetch(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model,
                    messages,
                    max_tokens: 512,
                    stream: false
                })
            }
        );

        const text = await response.text();

        try {
            return res.status(response.status).json(JSON.parse(text));
        } catch {
            return res.status(response.status).json({
                error: text || `NVIDIA returned HTTP ${response.status}`
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`NVIDIA Model Finder running at:`);
    console.log(`http://localhost:${PORT}`);
});