import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.services.user_team_service import UserTeamService
from logging_config import setup_logging

app = FastAPI()
user_service = UserTeamService()

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

@app.post("/draft/{player_name}")
def draft_player(player_name: str):
    result = user_service.draft(player_name)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Player {player_name} not found or already drafted.")
    return {"message": f"Drafted {player_name} successfully!"}

@app.post("/exclude/{player_name}")
def exclude_player(player_name: str):
    result = user_service.exclude(player_name)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Player '{player_name}' not found or already excluded.")
    return {"message": f"Excluded {player_name} from the draft pool"}

if __name__ == "__main__":
    setup_logging()

    uvicorn.run(app, host="0.0.0.0", port=8000)
    