import pandas as pd
import os
from app.utils.config import DEFAULT_DB_PATH

def save_dataframe(df: pd.DataFrame, path: str = DEFAULT_DB_PATH):
    try:
        df.to_csv(path, index=False)
        print(f"Player data saved to {path}")
    except Exception as e:
        print(f"Failed to save Dataframe: {e}")

def load_dataframe(path: str = DEFAULT_DB_PATH) -> pd.DataFrame:
    if not os.path.exists(path):
        print(f"No saved data at {path}")
        return pd.DataFrame()
    
    try:
        return pd.read_csv(path)
    except Exception as e:
        print(f"Failed to load Dataframe: {e}")
        return pd.DataFrame()
    
"""For future development"""
# Add naming to csv files, letting users store multiple sessions
# Search by session name, see all session names
