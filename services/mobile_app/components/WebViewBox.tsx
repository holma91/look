import { WebView } from 'react-native-webview';
import { useHandleMessage } from '../hooks/useHandleMessage';
import { Product } from '../utils/types';

type WebViewBoxProps = {
  webviewRef: any;
  handleLoadEnd: (navState: any) => void;
  url: string;
  domain: string;
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product>>;
  refetchProducts: () => void;
};

export function WebViewBox({
  webviewRef,
  handleLoadEnd,
  url,
  domain,
  setCurrentProduct,
  refetchProducts,
}: WebViewBoxProps) {
  const handleMessage = useHandleMessage(
    setCurrentProduct,
    refetchProducts,
    domain
  );

  return (
    <WebView
      ref={webviewRef}
      startInLoadingState={true} // https://github.com/react-native-webview/react-native-webview/issues/124
      source={{
        uri: url,
      }}
      onLoadEnd={handleLoadEnd}
      onMessage={handleMessage}
    />
  );
}
