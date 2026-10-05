<div align="center">

# NVIDIA AI API Checker

**Explore NVIDIA-hosted models. Check their likely task type. Try text chat from one clean workspace.**

A small, local-first dashboard for developers exploring the NVIDIA API Catalog.

</div>

---

## What it does

- Loads the models available to your NVIDIA API key.
- Searches and browses model IDs, providers, and API object types.
- Estimates a model's task from the metadata and model ID, including chat, embeddings, reranking, safety, vision, audio, image generation, and video generation.
- Opens a text chat test for models identified as chat candidates and displays NVIDIA responses and errors.
- Exports the returned model list and metadata as an HTML report.

> **Model labels are best-effort hints.** NVIDIA's model-list endpoint does not guarantee that a model is callable through chat completions or enabled for your account. Check the NVIDIA API Catalog for the model's actual task, endpoint, and account access. Image, audio, and video models need their own supported request formats and are not tested by the text chat dialog.

## Run locally

### Requirements

- Node.js 18 or newer
- An NVIDIA API key with access to the models you want to try

### Start

```bash
git clone https://github.com/<your-username>/nvidia-ai-api-checker.git
cd nvidia-ai-api-checker
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000), enter your NVIDIA API key, then select **Load Models**. Use **Test chat** on a chat candidate to send a prompt.

## How requests work

The browser sends requests to the local Express server. The server forwards them to NVIDIA and returns the response:

| Local route | NVIDIA endpoint | Purpose |
| --- | --- | --- |
| `POST /api/nvidia/models` | `GET /v1/models` | List models available to the supplied key |
| `POST /api/nvidia/chat` | `POST /v1/chat/completions` | Send a text conversation to a selected model |

The API key is entered in the browser and sent to your local server for forwarding. This project does not save it to disk or require a `.env` file. **Keep the app local and never publish or share your API key.** Do not expose this server publicly without adding authentication, request limits, and appropriate secret-handling controls.

## Understanding errors

- **401 / 403:** The key may be invalid, expired, or not entitled to use that model.
- **404, function not found:** The model may appear in the model list but not be callable through the chat endpoint for your account. Check its NVIDIA API Catalog page and use the endpoint documented for that model.
- **429:** The account may have reached a rate or usage limit. Wait and retry, or check your NVIDIA account limits.
- **Unsupported task:** Embedding, reranking, safety, vision, audio, image, and video models may need a different endpoint and payload than text chat.

## Tech stack

- Node.js and Express
- Plain HTML, CSS, and browser JavaScript
- NVIDIA API Catalog endpoints

## Contributing

Issues and pull requests are welcome. Include reproduction steps and remove API keys, account identifiers, and other private data from logs or screenshots before sharing them.

## License

No license has been selected for this repository yet. Add a license file before redistributing or reusing the code under open-source terms.
