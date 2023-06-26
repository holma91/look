import { useUser } from '@clerk/clerk-expo';
import { createProduct } from '../api';
import { Product } from '../utils/types';

export const useHandleMessage = (
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product>>,
  refetchProducts: () => void,
  domain: string
) => {
  const { user } = useUser();

  const handleMessage = async (event: any) => {
    const product_url = event.nativeEvent.url;
    if (!user?.id) return;

    // message type 1: product data
    const parsedData = JSON.parse(event.nativeEvent.data);
    if (parsedData.type === 'product') {
      const product: Product = parsedData.data;

      product.url = product_url;

      setCurrentProduct(product);

      try {
        await createProduct(user?.id, product, domain);
        refetchProducts();
      } catch (error) {
        console.error(error);
      }
    } else if (parsedData.type === 'imageSrc') {
      const imageSrc: string = parsedData.data;
      setCurrentProduct((prev) => ({ ...prev, images: [imageSrc] }));
    } else {
      console.log('unknown message type:', parsedData.data);
    }
  };

  return handleMessage;
};
