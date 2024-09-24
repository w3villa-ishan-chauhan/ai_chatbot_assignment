from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import os
from groq import AsyncGroq
import json

app = FastAPI()
client = AsyncGroq(
    api_key="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"
)
app.mount("/static", StaticFiles(directory="../frontend"), name="static")


@app.get("/")
async def get():
    return HTMLResponse(open("../frontend/index.html").read())


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        async for chunk in get_bot_response(data):
            await websocket.send_text(json.dumps({"response": chunk}))


async def get_bot_response(input):
    response_content = ""
    stream = await client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "you are a helpful assistant."
            },
            {
                "role": "user",
                "content": input,
            }
        ],
        model="llama3-8b-8192",
        stream=True,
    )
    
    async for chunk in stream:
        content = chunk.choices[0].delta.content
        yield content  # Yield each chunk instead of returning all at once

