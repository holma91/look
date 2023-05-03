import os
import logging

from models.gucci import Transformer
from dotenv import load_dotenv

load_dotenv()

def main():
    logging.basicConfig(filename='transformer.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    db_url = os.environ.get('db_url_dev')
    transformer = Transformer(db_url=db_url)

    transformer.run("./results/gucci/2023-05-03.jsonl")



if __name__ == '__main__':
    main()