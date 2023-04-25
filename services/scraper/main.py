from Scraper import Scraper
from models import Gucci, Hucci
starters = ['gucci', 'tomford', 'moncler', 'loropiana','burberry']


def main():
    scraper = Scraper()
    model = Hucci(country='us', scraper=scraper)
    print("model:", model)
    model.start()

if __name__ == '__main__':
    main()