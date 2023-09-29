'use client';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export default function Sam() {
  const [uid, setUid] = useState<string>('');
  const [mask, setMask] = useState('');
  const [dots, setDots] = useState<{ x: number; y: number; value: number }[]>(
    []
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawDot = (x: number, y: number, value: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Consider the scaling factor due to CSS resizing
    const scaleFactor = canvas.width / canvas.offsetWidth;

    ctx.beginPath();
    ctx.arc(x * scaleFactor, y * scaleFactor, 10, 0, 2 * Math.PI);
    ctx.fillStyle = value === 0 ? 'red' : 'blue';
    ctx.fill();

    setDots((prevDots) => [...prevDots, { x, y, value }]);
  };

  const reset = () => {
    // 1. Reset the dots state
    setDots([]);

    // 2. Clear the canvas and redraw the original image
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    const img = new Image();
    img.src =
      'https://softgoat.centracdn.net/client/dynamic/images/2244_cdca5aecf6-11421w23bl_2-size1024.jpg';

    img.onload = () => {
      ctx.drawImage(img, 0, 0); // Draw the original image
    };
  };

  const handleSingleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    drawDot(x, y, 1);
  };

  const handleRightClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault(); // Prevent the default context menu from showing up
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    drawDot(x, y, 0);
  };

  const handleSegment = async () => {
    try {
      // Extract point coordinates and labels from dots
      const pointCoords = dots.map((dot) => [dot.x, dot.y]);
      const pointLabels = dots.map((dot) => dot.value);

      // Adjust scaling based on canvas dimensions
      const canvas = canvasRef.current;
      if (!canvas) return;

      const scaleFactorWidth = canvas.width / canvas.offsetWidth;
      const scaleFactorHeight = canvas.height / canvas.offsetHeight;

      const scaledPointCoords = pointCoords.map((p) => [
        p[0] * scaleFactorWidth,
        p[1] * scaleFactorHeight,
      ]);

      console.log('pointCoords:', scaledPointCoords);
      console.log('pointLabels:', pointLabels);

      const response = await fetch(
        'http://localhost:8080/predictions/sam_masks/1.0',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid,
            point_coords: scaledPointCoords,
            point_labels: pointLabels,
          }),
        }
      );

      const data = await response.json();
      setMask(data[0]); // Assuming the mask data is in the first index
      console.log('mask', data[0]);
      const maskDataURL = `data:image/png;base64,${data[0]}`;
      renderImageWithMask(maskDataURL);
    } catch (error) {
      console.error(`Error during mask prediction: ${error}`);
    }
  };

  const renderImageWithMask = (maskDataURL: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maskImg = new Image();
    maskImg.src = maskDataURL;

    maskImg.onload = () => {
      ctx.globalAlpha = 0.5; // Set opacity to 0.5 for the mask
      ctx.drawImage(maskImg, 0, 0, canvas.width, canvas.height); // Draw mask over the existing image
      ctx.globalAlpha = 1.0; // Reset opacity back to default
    };
  };

  useEffect(() => {
    const img = new Image();
    img.src =
      'https://softgoat.centracdn.net/client/dynamic/images/2244_cdca5aecf6-11421w23bl_2-size1024.jpg';

    img.onload = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      console.log('img loaded, width', img.width, 'height', img.height);
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const responseImage = await fetch(img.src);
        const blob = await responseImage.blob();

        const formData = new FormData();
        formData.append('image', blob);

        const response = await fetch(
          'http://localhost:8080/predictions/sam_embeddings/1.0',
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUid(data[0]);
        console.log('uid', data[0]);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full px-48">
      <div className="flex flex-col items-center justify-center h-full w-full">
        <canvas
          ref={canvasRef}
          className="w-[450px]"
          onClick={handleSingleClick}
          onContextMenu={handleRightClick}
        ></canvas>
      </div>
      <div className="flex flex-col gap-3 pt-4 w-[450px]">
        <p className="text-center">uid: {uid}</p>
        <button
          aria-label="Add item to cart"
          title={'Test product'}
          className="relative flex w-full items-center justify-center rounded-md p-3 tracking-wide bg-black border border-white text-white hover:opacity-90"
          onClick={reset}
        >
          <span>Reset</span>
        </button>
        <button
          aria-label="Add item to cart"
          disabled={uid === '' || dots.length === 0}
          title={'Test product'}
          className={clsx(
            'relative flex w-full items-center justify-center rounded-md p-3 tracking-wide text-white hover:opacity-90',
            {
              'bg-blue-600': uid !== '' && dots.length !== 0,
              'bg-blue-300 cursor-not-allowed opacity-70':
                uid === '' || dots.length === 0,
            }
          )}
          onClick={handleSegment}
        >
          <span>Segment</span>
        </button>
      </div>
    </div>
  );
}
