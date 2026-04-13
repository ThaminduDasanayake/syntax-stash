import argparse
import sys
import logging

# Set up basic logging instead of just using print()
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

def process_data(input_path: str, verbose: bool):
    """Core logic of your script goes here."""
    if verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    logging.debug(f"Starting processing for: {input_path}")

    # --- YOUR LOGIC HERE ---

    logging.info("Processing completed successfully.")

def main():
    # Set up the argument parser
    parser = argparse.ArgumentParser(description="A simple and robust Python CLI boilerplate.")

    # Positional argument (Required)
    parser.add_argument("input", help="Path to the input file or data")

    # Optional flag (e.g., -v or --verbose)
    parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose debug output")

    args = parser.parse_args()

    try:
        process_data(args.input, args.verbose)
    except FileNotFoundError:
        logging.error(f"Could not find the file: {args.input}")
        sys.exit(1)
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()