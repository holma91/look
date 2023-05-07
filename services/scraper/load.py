import os
import logging

from Loader import Loader
from dotenv import load_dotenv

load_dotenv()

def main():
    logging.basicConfig(filename='./logs/load.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    db_url = os.environ.get('db_url_dev')

    loader = Loader(db_url=db_url)
    loader.run("./results/gucci/2023-05-07.jsonl")
    loader.run("./results/loro_piana/2023-05-07.jsonl")

if __name__ == '__main__':
    main()