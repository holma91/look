import { WebView } from 'react-native-webview';
import { useUser } from '@clerk/clerk-expo';
import { parseImageSrc, parseProduct } from '../utils/parsingOld';
import { Product } from '../utils/types';
import { addProductImages, createProduct } from '../api';
import { useQueryClient } from '@tanstack/react-query';
import { parseProductData } from '../utils/parsing';

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

    // message type 1: product data
    const parsedData = JSON.parse(event.nativeEvent.data);
    const url = event.nativeEvent.url;
    console.log('got message, parsedData.type:', parsedData.type);

    if (parsedData.type === 'product') {
      try {
        const product = parseProductData(
          event.nativeEvent.url,
          event.nativeEvent.data
        );

        setCurrentProduct(product);
        console.log('full product:', product);

        await createProduct(user?.id, product, domain);
        queryClient.invalidateQueries({ queryKey: ['brands', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['products', user?.id] });
      } catch (e) {
        console.log('error parsing product data OR when sending to server:', e);
      }
    } else if (parsedData.type === 'imageSrc') {
      const imageSrc: string = parsedData.data;
      const parsedImageSrc = parseImageSrc(domain, imageSrc);

      if (!currentProduct.images.includes(parsedImageSrc)) {
        // If not, add the image to the array and make the API call
        setCurrentProduct((prev) => ({
          ...prev,
          images: [...prev.images, parsedImageSrc],
        }));

        try {
          await addProductImages(user.id, url, parsedImageSrc);
          queryClient.invalidateQueries({ queryKey: ['products', user?.id] });
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
      }
    } else if (parsedData.type === 'imagesWithoutLink') {
      // console.log('imagesWithoutLink', parsedData.data);
      // console.log('imagesWithoutLink.length', parsedData.data.length);
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
