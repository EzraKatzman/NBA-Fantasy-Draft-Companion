import pandas as pd

from app.data.fetch_players import fetch_current_season_stats
from app.models.scoring import calculate_paa
from app.services.user_team_service import UserTeamService
from app.services.draft_strategy import list_presets

def main():
    df = fetch_current_season_stats()

    if df.empty:
        print("No data returned")
    else:
        pd.set_option('display.max_columns', None)
        return(df.head(10))
    
def test_draft_service():
    service = UserTeamService()
    service.draft("Alex Len")
    service.exclude("AJ Green")
    print(service.view_roster())
    print(service.show_best_available())

def test_paa_calculation():
    df = fetch_current_season_stats()
    df_with_paa = calculate_paa(df)
    print(df_with_paa.sort_values(by="PAA", ascending=False).head(20))

def test_sample_draft():
    print(list_presets())
    service = UserTeamService()
    service.update_strategy("punt_tov")
    service.update_strategy("balanced")
    print(service.show_best_available())
    service.draft("Luka Doncic")
    service.exclude("Giannis Antetokounmpo")
    service.update_strategy("guard_focus")
    print(service.show_best_available())
    service.draft("Evan Mobley")
    print(service.view_roster())

def test_misc():
    service = UserTeamService()
    print(service.search_player("Cade Cunningham"))

if __name__ == "__main__":
    test_sample_draft()