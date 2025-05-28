# Add something to show how many players at each position you have
class Team:
    def __init__(self, name: str = "My Team"):
        self.name = name
        self.players = []

    def add_player(self, player_stats: dict):
        self.players.append(player_stats)

    def get_roster(self):
        return [player["PLAYER_NAME"] for player in self.players]
    
    def get_full_stats(self):
        return self.players
    
    def get_team_totals(self):
        if not self.players:
            return {}
        
        totals = {}
        for player in self.players:
            for stat, value in player.items():
                if stat == "PLAYER_NAME" or stat == "GP":
                    continue
                try:
                    totals[stat] = totals.get(stat, 0) + float(value)
                except(ValueError, TypeError):
                    pass
        return totals
