import logging.config
import os

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,

    "formatters": {
        "standard": {
            "format": "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s"
        },
    },

    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "DEBUG",
            "formatter": "standard",
        },
        "data_file": {
            "class": "logging.handlers.RotatingFileHandler",
            "maxBytes": 5 * 1024 * 1024,  # 5 MB
            "backupCount": 1, 
            "level": "DEBUG",
            "formatter": "standard",
            "filename": "logs/data.log",
            "encoding": "utf8"
        },
        "models_file": {
            "class": "logging.handlers.RotatingFileHandler",
            "maxBytes": 5 * 1024 * 1024,  # 5 MB
            "backupCount": 1,           
            "level": "DEBUG",
            "formatter": "standard",
            "filename": "logs/models.log",
            "encoding": "utf8"
        },
        "services_file": {
            "class": "logging.handlers.RotatingFileHandler",
            "maxBytes": 5 * 1024 * 1024,  # 5 MB
            "backupCount": 1,           
            "level": "DEBUG",
            "formatter": "standard",
            "filename": "logs/services.log",
            "encoding": "utf8"
        },
        "utils_file": {
            "class": "logging.handlers.RotatingFileHandler",
            "maxBytes": 5 * 1024 * 1024,  # 5 MB
            "backupCount": 1,           
            "level": "DEBUG",
            "formatter": "standard",
            "filename": "logs/utils.log",
            "encoding": "utf8"
        },
    },

    "loggers": {
        "app.data": {
            "handlers": ["console", "data_file"],
            "level": "DEBUG",
            "propagate": False
        },
        "app.models": {
            "handlers": ["console", "models_file"],
            "level": "DEBUG",
            "propagate": False
        },
        "app.services": {
            "handlers": ["console", "services_file"],
            "level": "DEBUG",
            "propagate": False
        },
        "app.utils": {
            "handlers": ["console", "utils_file"],
            "level": "DEBUG",
            "propagate": False
        },
    },

    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    }
}

def setup_logging():
    os.makedirs("logs", exist_ok=True)
    logging.config.dictConfig(LOGGING_CONFIG)