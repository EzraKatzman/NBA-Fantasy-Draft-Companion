import sys
import os
from loguru import logger

LOG_DIR = "logs"
MODULES = ["services", "models", "data", "utils"]

def level_based_format(record):
    level = record["level"].name

    level_colors = {
        "DEBUG": "<black>",
        "INFO": "<white>",
        "WARNING": "<yellow>",
        "ERROR": "<red>",
        "CRITICAL": "<red>"
    }

    color = level_colors.get(level, "<white>")

    return(
        f"<green>[{record['time']:YYYY-MM-DD HH:mm:ss}]</green> "
        f"{color}{level: <8}</> "
        f"<cyan>{record['name']}:{record['function']}:{record['line']}</cyan> - "
        f"{color}{record['message']}</>\n"
    )

def plain_file_format(record):
    return (
        f"[{record['time']:YYYY-MM-DD HH:mm:ss}] "
        f"{record['level'].name: <8} "
        f"{record['name']}:{record['function']}:{record['line']} - "
        f"{record['message']}\n"
    )

def setup_logging():
    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR)

    logger.remove()

    logger.add(
        sink=sys.stdout,
        level="DEBUG",
        format=level_based_format,
        colorize=True,
        enqueue=True,
        backtrace=True,
        diagnose=True
    )

    for module in MODULES:
        log_path = os.path.join(LOG_DIR, f"{module}.log")

        logger.add(
            sink=log_path,
            format=plain_file_format,
            level="DEBUG",
            colorize=False,
            rotation="500 KB",
            retention="10 days",
            compression="zip",
            enqueue=True,
            filter=lambda record, mod=module: record["name"].startswith(f"app.{mod}")
        )
        