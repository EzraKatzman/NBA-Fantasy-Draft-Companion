import unicodedata
import pandas as pd

def normalize_name(name: str) -> str:
    """
    Removes accents and diacritics from a string (e.g., 'Jokić' → 'Jokic').

    Args:
        name (str): Input name string.

    Returns:
        str: Normalized ASCII-only string.
    """
    return ''.join(c for c in unicodedata.normalize('NFKD', name) if not unicodedata.combining(c))

def normalize_player_stats(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalize numeric columns in player stats DataFrame with specified decimal formatting.

    - PTS, REB, AST, STL, BLK, TOV, 3PM: rounded to 1 decimal place, always show 1 decimal.
    - FG%, FT%: rounded to 3 decimal places, always show 3 decimals.
    - PAA: rounded to 2 decimal places (numeric).

    Returns a new DataFrame with formatted string columns where applicable.
    """
    df_copy = df.copy()

    formats = {
        1: ["PTS", "REB", "AST", "STL", "BLK", "TOV", "3PM"],
        3: ["FG%", "FT%"]
    }
    for decimals, cols in formats.items():
        for col in cols:
            if col in df_copy.columns:
                df_copy[col] = df_copy[col].apply(lambda x: f"{x:.{decimals}f}")

        if "PAA" in df_copy.columns:
            df_copy["PAA"] = df_copy["PAA"].round(2)

    return df_copy
