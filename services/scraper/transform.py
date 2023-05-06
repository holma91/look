import os
import logging

import models
from dotenv import load_dotenv

load_dotenv()

def main():
    logging.basicConfig(filename='transformer.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    db_url = os.environ.get('db_url_dev')
    transformer = models.gucci.Transformer(db_url=db_url, model_id="gucci")
    transformer2 = models.loro_piana.Transformer(db_url=db_url, model_id="loro_piana")
    # transformer.run("./results/gucci/2023-05-05.jsonl")
    transformer2.run("./results/loro_piana/2023-05-06.jsonl")



if __name__ == '__main__':
    main()