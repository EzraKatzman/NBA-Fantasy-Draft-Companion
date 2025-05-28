import pandas as pd

from app.utils.config import STAT_WEIGHTS

def calculate_paa(df: pd.DataFrame, weights:dict = None) -> pd.DataFrame:
    """
    Calculate Percent Above Average (PAA) for each player in the dataframe.

    Args:
        df (pd.DataFrame): DataFrame with player stats as columns

    Returns:
        pd.DataFrame: Same dataframe with a new 'PAA' column added
    """
    if df.empty:
        return df
    
    weights = weights or STAT_WEIGHTS
    stats = [stat for stat in weights.keys() if stat in df.columns]

    league_avg = df[stats].mean()

    def player_paa(row):
        paa_score = 0.0
        for stat in stats:
            diff = row[stat] - league_avg[stat]
            weighted_diff = diff * weights[stat]
            paa_score += weighted_diff
        return paa_score
    
    df = df.copy()
    df['PAA'] = df.apply(player_paa, axis=1)

    return df
