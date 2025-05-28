import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.user_team_service import UserTeamService
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

user_service = UserTeamService()
@app.get("/view-players")
def view_players():
    """
    Returns the full list of available players sorted by PAA (descending).
    The frontend paginates this data.
    """
    df = user_service.view_remaining_pool()

    if df.empty:
        return {"error": "No players available"}
    
    sorted_df = df.sort_values(by="PAA", ascending=False)
    return sorted_df.to_dict(orient="records")


@app.get("/items")
def get_items():
    return [{"id": 1, "name": "Foo"}, {"id": 2, "name": "Bar"}]

if __name__ == "__main__":
    setup_logging()

    uvicorn.run(app, host="0.0.0.0", port=8000)
    