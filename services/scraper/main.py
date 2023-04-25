from models import Gucci, Hucci
starters = ['gucci', 'tomford', 'moncler', 'loropiana','burberry']


def main():
    model = Hucci(country='us')
    print("model:", model)
    model.start()

if __name__ == '__main__':
    main()