from nba_api.stats.endpoints import leaguedashplayerstats
import pandas as pd


from app.utils.config import RAW_9CAT_COLUMNS, STAT_RENAME_MAP, DEFAULT_SEASON, MINIMUM_GAME_REQUIREMENT

def fetch_current_season_stats(season=DEFAULT_SEASON, per_mode='PerGame', ignore_min_games: bool = False):
    try:
        print(f"fetching data for {season} season...")
        response = leaguedashplayerstats.LeagueDashPlayerStats(
            season = season,
            per_mode_detailed=per_mode
        )
        data = response.get_data_frames()[0]

        if 'GP' not in data.columns: 
            raise ValueError("Games played ('GP') column is missing from API response")
        
        if not ignore_min_games:
            filtered_data = data[data['GP'] >= MINIMUM_GAME_REQUIREMENT]
        else:
            filtered_data = data

        df = filtered_data[RAW_9CAT_COLUMNS].copy()
        df.drop(columns='GP', inplace=True, errors='ignore')
        df.rename(columns=STAT_RENAME_MAP, inplace=True)
        
        return df
    except Exception as e:
        print(f"Error fetching NBA data: {e}")
        return pd.DataFrame()
