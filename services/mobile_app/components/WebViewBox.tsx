import { WebView } from 'react-native-webview';
import { useUser } from '@clerk/clerk-expo';
import { parseImageSrc, parseProduct } from '../utils/parsing';
import { Product } from '../utils/types';
import { addProductImages, createProduct } from '../api';

type WebViewBoxProps = {
  webviewRef: any;
  handleLoadEnd: (navState: any) => void;
  url: string;
  domain: string;
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product>>;
  setCurrentImage: React.Dispatch<React.SetStateAction<string>>;
  refetchProducts: () => void;
};

export function WebViewBox({
  webviewRef,
  handleLoadEnd,
  url,
  domain,
  setCurrentProduct,
  setCurrentImage,
  refetchProducts,
}: WebViewBoxProps) {
  const { user } = useUser();

  const handleMessage = async (event: any) => {
    console.log('got da message:', event.nativeEvent.data);
    if (!user?.id) return;

    const productUrl = event.nativeEvent.url;

    // message type 1: product data
    const parsedData = JSON.parse(event.nativeEvent.data);
    if (parsedData.type === 'product') {
      const product: Product = parseProduct(
        domain,
        productUrl,
        JSON.parse(parsedData.data)
      );

      setCurrentProduct(product);
      if (product.images.length > 0) {
        setCurrentImage(product.images[0]);
      } else {
        setCurrentImage('');
      }

      try {
        console.log('product:', product);
        console.log('domain:', domain);

        await createProduct(user?.id, product, domain);
        refetchProducts();
      } catch (error) {
        console.error(error);
      }
    } else if (parsedData.type === 'imageSrc') {
      const imageSrc: string = parsedData.data;
      const parsedImageSrc = parseImageSrc(domain, imageSrc);

      // setCurrentProduct((prev) => ({ ...prev, images: [parsedImageSrc] }));
      setCurrentImage(parsedImageSrc);
      // insert images here
      try {
        await addProductImages(user?.id, productUrl, parsedImageSrc);
        refetchProducts();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('unknown message type:', parsedData.data);
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
