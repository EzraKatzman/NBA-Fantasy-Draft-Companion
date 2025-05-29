from copy import deepcopy
from loguru import logger

from app.utils.config import STAT_WEIGHTS, PRESET_STRATEGIES

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
        logger.error(f"{selection} not a valid strategy")
        raise ValueError(f"Invalid strategy selection. Choose from: {list_presets()}")
    
    return apply_draft_strategy(strategy=selection, custom_overrides=custom_overrides)
