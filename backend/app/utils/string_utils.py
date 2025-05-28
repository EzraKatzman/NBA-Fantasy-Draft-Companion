import unicodedata

def normalize_name(name: str) -> str:
    """
    Removes accents and diacritics from a string (e.g., 'Jokić' → 'Jokic').

    Args:
        name (str): Input name string.

    Returns:
        str: Normalized ASCII-only string.
    """
    return ''.join(c for c in unicodedata.normalize('NFKD', name) if not unicodedata.combining(c))
