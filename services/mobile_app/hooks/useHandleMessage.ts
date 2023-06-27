import { useUser } from '@clerk/clerk-expo';
import { createProduct } from '../api';
import { Product } from '../utils/types';

function parseProduct(
  domain: string,
  product_url: string,
  productData: any
): Product {
  let product: Product = {
    url: product_url,
    name: '',
    brand: '',
    price: '',
    currency: '',
    images: [],
  };

  if (domain === 'zalando.com' || domain === 'zalando.se') {
    product['name'] = productData['name'];
    product['brand'] = productData['brand']['name'];
    product['price'] = productData['offers'][0]['price'];
    product['currency'] = productData['offers'][0]['priceCurrency'];
    product['images'] = productData['image'];
    if (product.images) {
      // remove query parameters from images to get high quality
      for (let i = 0; i < product.images.length; i++) {
        product.images[i] = product.images[i].substring(
          0,
          product.images[i].indexOf('?')
        );
      }
    }
  } else if (domain === 'hm.com' || domain === 'www2.hm.com') {
    product['name'] = productData['name'];
    product['brand'] = productData['brand']['name'];
    product['price'] = productData['offers'][0]['price'];
    product['currency'] = productData['offers'][0]['priceCurrency'];
    product['images'] = ['https://' + productData['image'].slice(2)];
  } else if (domain === 'sellpy.com') {
    product['name'] = productData['name'];
    product['brand'] = productData['brand'] || '?';
    product['price'] = productData['offers']['price'];
    product['currency'] = productData['offers']['priceCurrency'];
    product['images'] = [productData['image']];
  } else if (domain === 'softgoat.com') {
    product['name'] = productData['name'];
    product['brand'] = productData['brand']['name'];
    product['price'] = productData['offers']['price'].replace(/\s/g, '');
    product['currency'] = productData['offers']['priceCurrency'];
    product['images'] = [];
  } else if (domain === 'zara.com') {
    product['name'] = productData['name'];
    product['brand'] = productData['brand'];
    product['price'] = productData['offers']['price'];
    product['currency'] = productData['offers']['priceCurrency'];
    product['images'] = productData['image'];
  }

  return product;
}

function parseImageSrc(domain: string, imageSrc: string) {
  if (domain === 'hm.com') {
    return 'https://' + imageSrc.slice(2);
  }

  return imageSrc;
}

export const useHandleMessage = (
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product>>,
  refetchProducts: () => void,
  domain: string
) => {
  const { user } = useUser();

  const handleMessage = async (event: any) => {
    console.log('got da message');
    if (!user?.id) return;

    // message type 1: product data
    const parsedData = JSON.parse(event.nativeEvent.data);
    if (parsedData.type === 'product') {
      console.log('product data', JSON.parse(parsedData.data));

      const product: Product = parseProduct(
        domain,
        event.nativeEvent.url,
        JSON.parse(parsedData.data)
      );

      console.log('product', product);

      setCurrentProduct(product);

      try {
        await createProduct(user?.id, product, domain);
        refetchProducts();
      } catch (error) {
        console.error(error);
      }
    } else if (parsedData.type === 'imageSrc') {
      const imageSrc: string = parsedData.data;
      const parsedImageSrc = parseImageSrc(domain, imageSrc);
      console.log('parsedImageSrc', parsedImageSrc);

      setCurrentProduct((prev) => ({ ...prev, images: [parsedImageSrc] }));
      // insert images here
    } else {
      console.log('unknown message type:', parsedData.data);
    }
  };

  return handleMessage;
};
