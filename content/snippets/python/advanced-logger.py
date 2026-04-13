import logging
from logging.handlers import RotatingFileHandler

def setup_logger(name: str, log_file: str, level=logging.INFO):
    """Sets up a logger that writes to both the console and a rotating file."""
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Formatter
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    # Console Handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    # File Handler (Rotates after 5MB, keeps 3 backups)
    file_handler = RotatingFileHandler(log_file, maxBytes=5*1024*1024, backupCount=3)
    file_handler.setFormatter(formatter)

    # Add handlers
    if not logger.handlers:
        logger.addHandler(console_handler)
        logger.addHandler(file_handler)

    return logger

# Usage Example:
if __name__ == "__main__":
    # Initialize the logger
    my_logger = setup_logger("API_Service", "api_service.log")

    # Test logs
    my_logger.debug("This won't show because level is INFO")
    my_logger.info("Logger initialized successfully.")
    my_logger.warning("This is a warning message.")
    my_logger.error("This is an error message!")