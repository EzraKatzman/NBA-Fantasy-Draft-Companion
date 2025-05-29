import os
import json
from dotenv import load_dotenv

load_dotenv()

# Default NBA Season
DEFAULT_SEASON = '2024-25'

# 9CAT columns to use
RAW_9CAT_COLUMNS = [
    'PLAYER_NAME', 'GP', 'PTS', 'REB', 
    'AST', 'STL', 'BLK', 'FG_PCT', 
    'FT_PCT', 'TOV', 'FG3M'
]

# Renaming select categories for readability
STAT_RENAME_MAP = {
    'FG_PCT': 'FG%',
    'FT_PCT': 'FT%',
    'FG3M': '3PM'
}

try:
    STAT_WEIGHTS = json.loads(os.getenv("STAT_WEIGHTS", "{}"))
except json.JSONDecodeError:
    raise ValueError("Invalid STAT_WEIGHTS format in .env")

try:
    PRESET_STRATEGIES = json.loads(os.getenv("PRESET_STRATEGIES", "{}"))
except json.JSONDecodeError:
    raise ValueError("Invalid PRESET_STRATEGIES format in .env")

MINIMUM_GAME_REQUIREMENT = 42

# TODO: Position aliasing for sorting by position

# Path to save generated dataframe/session
DEFAULT_DB_PATH = 'data/players_stats.csv'
