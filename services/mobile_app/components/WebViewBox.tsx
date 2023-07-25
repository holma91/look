import { WebView } from 'react-native-webview';
import { useUser } from '@clerk/clerk-expo';
import { parseImageSrc, parseProduct } from '../utils/parsing';
import { Product } from '../utils/types';
import { addProductImages, createProduct } from '../api';
import { useQueryClient } from '@tanstack/react-query';

type WebViewBoxProps = {
  webviewRef: any;
  handleLoadEnd: (navState: any) => void;
  url: string;
  domain: string;
  currentProduct: Product;
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product>>;
  refetchProducts: () => void;
};

export function WebViewBox({
  webviewRef,
  handleLoadEnd,
  url,
  domain,
  currentProduct,
  setCurrentProduct,
  refetchProducts,
}: WebViewBoxProps) {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const handleMessage = async (event: any) => {
    if (!user?.id) return;

    const productUrl = event.nativeEvent.url;

    // message type 1: product data
    const parsedData = JSON.parse(event.nativeEvent.data);
    const url = event.nativeEvent.url;
    console.log('got message, parsedData.type:', parsedData.type);

    if (parsedData.type === 'product') {
      const product: Product = parseProduct(
        domain,
        productUrl,
        JSON.parse(parsedData.data)
      );

      setCurrentProduct(product);

      try {
        console.log('full product:', product);

        await createProduct(user?.id, product, domain);
        queryClient.invalidateQueries({ queryKey: ['brands', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['products', user?.id] });
      } catch (error) {
        console.error(error);
      }
    } else if (parsedData.type === 'imageSrc') {
      console.log('got imageSrc:', parsedData.data);

      const imageSrc: string = parsedData.data;
      const parsedImageSrc = parseImageSrc(domain, imageSrc);

      console.log('parsedImageSrc:', parsedImageSrc);
      console.log('currentProduct.images:', currentProduct.images);
      console.log(
        'currentProduct.images.includes(parsedImageSrc)',
        currentProduct.images.includes(parsedImageSrc)
      );

      if (!currentProduct.images.includes(parsedImageSrc)) {
        // If not, add the image to the array and make the API call
        setCurrentProduct((prev) => ({
          ...prev,
          images: [...prev.images, parsedImageSrc],
        }));

        try {
          await addProductImages(user.id, url, parsedImageSrc);
        } catch (e) {
          console.error(e);
        }
      }
    } else if (parsedData.type === 'no product') {
      if (currentProduct.url !== '') {
        setCurrentProduct({
          url: '',
          name: '',
          brand: '',
          price: '',
          currency: '',
          images: [],
        });
        // setCurrentImage('');
      }
    } else {
      console.log('unknown message type:', parsedData.type, parsedData.data);
    }
  };

  return (
    <WebView
      ref={webviewRef}
      startInLoadingState={true} // https://github.com/react-native-webview/react-native-webview/issues/124
      source={{
        uri: url,
      }}
      onLoadEnd={handleLoadEnd}
      onMessage={handleMessage}
      mediaPlaybackRequiresUserAction={true}
    />
  );
}
