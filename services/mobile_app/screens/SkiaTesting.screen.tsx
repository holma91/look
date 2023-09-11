import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BackdropFilter,
  Blur,
  Canvas,
  Circle,
  ColorMatrix,
  Fill,
  Group,
  Image,
  Mask,
  Offset,
  Rect,
  useImage,
} from '@shopify/react-native-skia';
import { Box } from '../styling/RestylePrimitives';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const generateMaskArray = (width: number, height: number) => {
  const maskArray = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );

  const aspectRatio = height / width;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Scale the diagonal line based on the aspect ratio
      if (Math.round(x * aspectRatio) === y) {
        maskArray[y][x] = true;
      }
    }
  }

  return maskArray;
};

export default function SkiaTesting() {
  return (
    <SafeAreaView
      edges={['right', 'top', 'left']}
      style={{ flex: 1, backgroundColor: 'lightgrey' }}
    >
      <FittingExample />
    </SafeAreaView>
  );
}

/*
we have:
  - an image of size 256x512
  - a mask of size 256x512
    the mask is represented by a 2D array (256x512) of boolean values. true means the pixel is in the mask, false means it is not.
  
what we need to do:
  1. draw the image
  2. draw the mask on top of the image
*/

const FittingExample = () => {
  const image = useImage(require('../assets/products/softgoat3/base.jpeg'));

  const BLACK_AND_WHITE = [
    0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0,
  ];

  const imgWidth = width;
  const imgHeight = 512;

  const maskArray = generateMaskArray(imgWidth, imgHeight);

  return (
    <Canvas style={{ flex: 1 }}>
      <Image
        image={image}
        x={0}
        y={0}
        width={imgWidth}
        height={imgHeight}
        fit="cover"
      />
      <Group>
        {maskArray.map((row, y) =>
          row.map((isMasked, x) =>
            isMasked ? (
              <Rect x={x} y={y} width={1} height={1} color={'red'} />
            ) : null
          )
        )}
      </Group>
    </Canvas>
  );
};

const MaskExample = () => (
  <Canvas style={{ width: 256, height: 256 }}>
    <Mask
      mask={
        <Group>
          <Circle cx={128} cy={128} r={128} opacity={0.5} />
          <Circle cx={128} cy={128} r={64} />
        </Group>
      }
    >
      <Rect x={0} y={0} width={256} height={256} color="lightblue" />
    </Mask>
  </Canvas>
);

const BackdropExample = () => {
  const BLACK_AND_WHITE = [
    0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0,
  ];

  const TEST = [
    0.3, 0.3, 0.3, 0, 0, 0.59, 0.59, 0.59, 0, 0, 0.11, 0.11, 0.11, 0, 0, 0, 0,
    0,
  ];
  const image = useImage(require('../assets/oslo.jpg'));

  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Image image={image} x={0} y={0} width={256} height={256} fit="cover" />
      <BackdropFilter
        clip={{ x: 0, y: 128, width: 256, height: 128 }}
        filter={<ColorMatrix matrix={BLACK_AND_WHITE} />}
      />
    </Canvas>
  );
};

const OffsetExample = () => {
  const image = useImage(require('../assets/oslo.jpg'));
  if (!image) {
    return null;
  }
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill color="lightblue" />
      <Image image={image} x={0} y={0} width={256} height={256} fit="cover">
        <Offset x={64} y={64} />
      </Image>
    </Canvas>
  );
};

const ComposeImageFilter = () => {
  const image = useImage(require('../assets/oslo.jpg'));
  if (!image) {
    return null;
  }
  return (
    <Canvas style={{ flex: 1 }}>
      <Image x={0} y={0} width={256} height={256} image={image} fit="cover">
        <Blur blur={2} mode="clamp">
          <ColorMatrix
            matrix={[
              -0.578, 0.99, 0.588, 0, 0, 0.469, 0.535, -0.003, 0, 0, 0.015,
              1.69, -0.703, 0, 0, 0, 0, 0, 1, 0,
            ]}
          />
        </Blur>
      </Image>
    </Canvas>
  );
};

const ImageDemo = () => {
  const image = useImage(require('../assets/oslo.jpg'));
  return (
    <Canvas style={{ flex: 1 }}>
      <Image image={image} fit="cover" x={0} y={0} width={128} height={128} />
      <Image image={image} fit="fill" x={0} y={138} width={128} height={128} />
      <Image
        image={image}
        fit="fitHeight"
        x={0}
        y={276}
        width={128}
        height={128}
      />
      <Image
        image={image}
        fit="fitWidth"
        x={0}
        y={412}
        width={128}
        height={128}
      />
      <Image
        image={image}
        fit="scaleDown"
        x={0}
        y={550}
        width={128}
        height={128}
      />
    </Canvas>
  );
};

const ImageGrid = () => {
  const image1 = useImage(require('../assets/products/softgoat3/gen1.png'));
  const image2 = useImage(require('../assets/products/softgoat3/gen2.png'));
  const image3 = useImage(require('../assets/products/softgoat3/gen3.png'));
  const image4 = useImage(require('../assets/products/softgoat3/gen4.png'));
  return (
    <Canvas style={{ flex: 1 }}>
      <Image
        image={image1}
        fit="cover"
        x={0}
        y={0}
        width={width / 2}
        height={256}
      />
      <Image
        image={image2}
        fit="cover"
        x={width / 2}
        y={0}
        width={width / 2}
        height={256}
      />
      <Image
        image={image3}
        fit="cover"
        x={0}
        y={256}
        width={width / 2}
        height={256}
      />
      <Image
        image={image4}
        fit="cover"
        x={width / 2}
        y={256}
        width={width / 2}
        height={256}
      />
    </Canvas>
  );
};

const GroupExample = () => {
  const size = 256;
  const r = size * 0.33;
  return (
    <Box flex={1} backgroundColor="grey" padding="m" gap="m">
      <Canvas style={{ flex: 1, backgroundColor: 'white' }}>
        <Circle cx={r} cy={r} r={r} color="cyan" />
        <Circle cx={size - r} cy={r} r={r} color="magenta" />
        <Circle cx={size / 2} cy={size - r} r={r} color="yellow" />
      </Canvas>
      <Canvas style={{ flex: 1, backgroundColor: 'white' }}>
        <Group blendMode="multiply" color="green">
          <Circle cx={r} cy={r} r={r} color="cyan" />
          <Circle cx={size - r} cy={r} r={r} color="magenta" />
          <Circle cx={size / 2} cy={size - r} r={r} color="yellow" />
        </Group>
      </Canvas>
    </Box>
  );
};
