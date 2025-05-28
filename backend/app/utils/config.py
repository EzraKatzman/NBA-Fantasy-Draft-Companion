
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

STAT_WEIGHTS = {
    'PTS': 1.0,
    'REB': 1.0,
    'AST': 1.0,
    'STL': 1.0,
    'BLK': 1.0,
    'FG%': 1.0,
    'FT%': 1.0,
    '3PM': 1.0,
    'TOV': 1.0
}

MINIMUM_GAME_REQUIREMENT = 42

# TODO: Position aliasing for sorting by position

# Path to save generated dataframe/session
DEFAULT_DB_PATH = 'data/players_stats.csv'
