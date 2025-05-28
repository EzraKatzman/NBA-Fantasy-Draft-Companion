import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from logging_config import setup_logging

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/items")
def get_items():
    return [{"id": 1, "name": "Foo"}, {"id": 2, "name": "Bar"}]

if __name__ == "__main__":
    setup_logging()

    uvicorn.run(app, host="0.0.0.0", port=8000)
    