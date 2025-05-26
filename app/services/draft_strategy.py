from copy import deepcopy
from app.utils.config import STAT_WEIGHTS

PRESET_STRATEGIES = {
    'balanced': {},
    'punt_fg': {
        'FG%': 0.0,
        '3PM': 1.2,
        'FT%': 1.1,
        'AST': 1.1,
        'STL': 1.1,
    },
    'punt_tov': {
        'TOV': 0.0,
    },
    'big_man_focus': {
        'REB': 1.2,
        'BLK': 1.3,
        'FG%': 1.1,
        'FT%': 0.8,
        'AST': 0.9,
        '3PM': 0.8,
    },
    'guard_focus': {
        'AST': 1.2,
        '3PM': 1.2,
        'FT%': 1.1,
        'REB': 0.8,
        'BLK': 0.8,
    }
}

def list_presets() -> list:
    """
    Returns a list of available draft strategy presets.
    """
    return list(PRESET_STRATEGIES.keys()) + ['custom']

def apply_draft_strategy(strategy: str = 'balanced', custom_overrides: dict = None) -> dict:
    """
    Adjusts base STAT_WEIGHTS using a draft strategy preset and/or custom overrides.

    Args:
        strategy (str): Name of preset strategy (e.g., 'punt_fg', 'guard_build').
        custom_overrides (dict): Optional dictionary of custom weights to override the preset.

    Returns:
        dict: Final adjusted stat weights.
    """
    weights = deepcopy(STAT_WEIGHTS)

    preset = PRESET_STRATEGIES.get(strategy.lower(), {})
    for stat, multiplier in preset.items():
        if stat in weights:
            weights[stat] *= multiplier
        
    if custom_overrides:
        for stat, value in custom_overrides.items():
            if stat in weights:
                weights[stat] = value

    return weights

# def set_custom_strategy(custom_weights: dict) -> None:
    """
    Sets or replaces the 'custom' strategy with user-defined stat weights.

    Args:
        custom_weights (dict): Dictionary of stat weights to use as a custom strategy.
    """
#     valid_stats = set(STAT_WEIGHTS.keys())
#     for stat in custom_weights:
#         if stat not in valid_stats:
#             raise ValueError(f"Invalid stat '{stat}' in custom weights. Allowed Stats: {sorted(valid_stats)}")
        
#     PRESET_STRATEGIES['custom'] = custom_weights

def select_draft_strategy(selection: str, custom_overrides: dict = None) -> dict:
    """
    Selects a strategy by name or applies custom weights.

    Args:
        selection (str): Name of the preset to apply, or "custom".
        custom_overrides (dict): Optional overrides (only used if selection == 'custom').

    Returns:
        dict: Adjusted stat weights based on the chosen strategy.
    """
    selection = selection.lower()

    # if selection != 'custom' and selection not in PRESET_STRATEGIES:
    if selection not in PRESET_STRATEGIES:
        raise ValueError(f"Invalid strategy selection. Choose from: {list_presets()}")
    
    return apply_draft_strategy(strategy=selection, custom_overrides=custom_overrides)
