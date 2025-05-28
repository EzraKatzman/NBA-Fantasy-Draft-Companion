import pandas as pd
import logging

from app.data.fetch_players import fetch_current_season_stats
from app.models.team import Team
from app.models.scoring import calculate_paa
from app.services.draft_strategy import select_draft_strategy
from app.utils.config import DEFAULT_SEASON
from app.utils.string_utils import normalize_name

logger = logging.getLogger(__name__)
class UserTeamService:
    def __init__(self, season=DEFAULT_SEASON, per_mode='PerGame', ignore_min_games: bool = False, strategy: str  = 'balanced', custom_weights: dict = None):
        self.team = Team()

        self.weights = select_draft_strategy(strategy, custom_overrides=custom_weights)
        raw_df = fetch_current_season_stats(season=season, per_mode=per_mode, ignore_min_games=ignore_min_games)
        self.player_pool_df = calculate_paa(raw_df, weights=self.weights) if not raw_df.empty else pd.DataFrame()

    def find_player(self, player_name: str):
        self.player_pool_df["NORMALIZED_NAME"] = self.player_pool_df["PLAYER_NAME"].apply(
            lambda name: normalize_name(name).lower()
        )
        matches = self.player_pool_df[
            self.player_pool_df["NORMALIZED_NAME"].str.lower() == player_name.lower()
        ]
        self.player_pool_df.drop(columns=["NORMALIZED_NAME"], inplace=True)
        
        if matches.empty:
            logger.error(f"No player named '{player_name}' found")
            return
        
        if len(matches) > 1:
            logger.error(f"Multiple players found matching '{player_name}'. Please be more specific")
            logger.info(matches["PLAYER_NAME"].to_list())
            return
        
        return matches

    def draft(self, player_name: str):
        matches = self.find_player(player_name)
        if matches is None:
            return
        
        row = matches.iloc[0]
        self.team.add_player(row)
        self.player_pool_df = self.player_pool_df.drop(matches.index)

        logger.info(f"Drafted {player_name} successfully!")
    
    def exclude(self, player_name: str):
        matches = self.find_player(player_name)
        if matches is None:
            return

        player_name = matches.iloc[0]["PLAYER_NAME"]
        self.player_pool_df = self.player_pool_df.drop(matches.index)

        logger.info(f"Excluded {player_name} from the draft pool")

    def view_roster(self):
        return self.team.get_roster()
    
    def view_remaining_pool(self):
        return self.player_pool_df.copy()
    
    def search_player(self, player_name: str):
        matches = self.find_player(player_name)
        if matches is None:
            return
        
        return matches.to_string(index=False)
    
    def show_best_available(self, top_n=15):
        if self.player_pool_df.empty:
            logging.error("No players available")
            return
        
        best = self.player_pool_df.sort_values(by="PAA", ascending=False).head(top_n)
        return(best.to_string(index=False))       

    def update_strategy(self, new_strategy: str, custom_weights: dict = None):
        """
        Updates the draft strategy mid-draft and recalculates PAA for the remaining player pool.

        Args:
            new_strategy (str): Name of the new strategy to apply.
            custom_weights (dict): Optional custom overrides for the new strategy.
        """
        try:
            self.weights = select_draft_strategy(new_strategy, custom_overrides=custom_weights)
            self.player_pool_df = calculate_paa(self.player_pool_df.drop(columns=["PAA"], errors="ignore"))
            logger.info(f"Strategy updated to {new_strategy}. PAA values recalculated")
        except ValueError as ve:
            logger.exception(f"Failed to update strategy: {ve}")
    