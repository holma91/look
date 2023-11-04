'use client';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  BASE_PROMPT,
  MASKS_URL,
  convertImageURLToBase64,
  BASE_NEGATIVE_PROMPT,
  IMG2IMG_URL,
  EMBEDDINGS_URL,
} from './page';

export default function Sam() {
  const [image, setImage] = useState(
    'https://softgoat.centracdn.net/client/dynamic/images/2244_cdca5aecf6-11421w23bl_2-size1024.jpg'
  );
  const [prompt, setPrompt] = useState(BASE_PROMPT);
  const [uid, setUid] = useState('');
  const [mask, setMask] = useState('');
  const [dots, setDots] = useState<{ x: number; y: number; value: number }[]>(
    []
  );
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
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
    setMask('');
    setGeneratedImages([]);

    // 2. Clear the canvas and redraw the original image
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    const img = new Image();
    img.src = image;

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
      const pointCoords = dots.map((dot) => [dot.x, dot.y]);
      const pointLabels = dots.map((dot) => dot.value);

      const canvas = canvasRef.current;
      if (!canvas) return;

      // Adjust scaling based on canvas dimensions
      const scaleFactorWidth = canvas.width / canvas.offsetWidth;
      const scaleFactorHeight = canvas.height / canvas.offsetHeight;

      const scaledPointCoords = pointCoords.map((p) => [
        p[0] * scaleFactorWidth,
        p[1] * scaleFactorHeight,
      ]);

      const response = await fetch(MASKS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          point_coords: scaledPointCoords,
          point_labels: pointLabels,
        }),
      });

      const data = await response.json();
      setMask(data[0]);
      const maskDataURL = `data:image/png;base64,${data[0]}`;
      renderImageWithMask(maskDataURL);
    } catch (error) {
      console.error(`Error during mask prediction: ${error}`);
    }
  };

  async function handleGenerate(): Promise<void> {
    let base64Image = '';
    try {
      base64Image = await convertImageURLToBase64(image);
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return;
    }
    const payload = {
      prompt,
      negative_prompt: BASE_NEGATIVE_PROMPT,
      sampler: 'DPM++ 2M Karras',
      steps: 25,
      init_images: [base64Image],
      mask: mask,
      width: 1024,
      height: 1369,
      inpaint_full_res: true,
      inpaint_full_res_padding: 32,
      inpainting_fill: 1,
    };
    const response = await fetch(IMG2IMG_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('data', data);
    setGeneratedImages(data.images);
  }

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
      ctx.globalAlpha = 1; // Reset opacity back to default
    };
  };

  useEffect(() => {
    const img = new Image();
    img.src = image;

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

        const response = await fetch(EMBEDDINGS_URL, {
          method: 'POST',
          body: formData,
        });

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
    img.onerror = () => {
      console.error('Failed to load the image from the provided URL.');
      // You can handle further actions here if needed, for now, it just logs an error
    };
  }, [image]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* <p className="text-center mb-3">uid: {uid}</p> */}
      <div className="mt-1 mb-3 w-[350px]">
        <input
          type="text"
          name="title"
          id="title"
          className="block w-full rounded-md py-1.5 text-white ring-1 ring-neutral-800 placeholder:text-gray-400 outline-none focus:ring-2  focus:ring-white sm:text-sm sm:leading-6 px-3 bg-transparent"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-center h-full w-full">
        <canvas
          ref={canvasRef}
          className="w-[350px]"
          onClick={handleSingleClick}
          onContextMenu={handleRightClick}
        ></canvas>
        <div>
          {generatedImages.map((base64Img, index) => (
            <img
              key={index}
              src={`data:image/jpeg;base64,${base64Img}`}
              alt={`Generated ${index}`}
              className="w-[350px]"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-4 w-[350px]">
        <button
          aria-label="Reset"
          title={'Reset configuration'}
          className="relative flex w-full items-center justify-center rounded-md p-3 tracking-wide bg-black border border-white text-white hover:opacity-90"
          onClick={reset}
        >
          <span>Reset</span>
        </button>
        <button
          aria-label="Segment"
          disabled={uid === '' || dots.length === 0 || mask !== ''}
          title={'Segment image'}
          className={clsx(
            'relative flex w-full items-center justify-center rounded-md p-3 tracking-wide text-white hover:opacity-90',
            {
              'bg-blue-600': uid !== '' && dots.length !== 0 && mask === '',
              'bg-blue-300 cursor-not-allowed opacity-70':
                uid === '' || dots.length === 0 || mask !== '',
            }
          )}
          onClick={handleSegment}
        >
          <span>Segment</span>
        </button>
        <label htmlFor="title" className="block text-sm font-medium leading-6">
          Prompt
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="title"
            id="title"
            className="block w-full rounded-md py-1.5 text-white ring-1 ring-neutral-800 placeholder:text-gray-400 outline-none focus:ring-2  focus:ring-white sm:text-sm sm:leading-6 px-3 bg-transparent"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <button
          aria-label="Generate"
          disabled={uid === '' || dots.length === 0}
          title={'Generate image'}
          className={clsx(
            'relative flex w-full items-center justify-center rounded-md p-3 tracking-wide text-white hover:opacity-90',
            {
              'bg-blue-600': mask !== '',
              'bg-blue-300 cursor-not-allowed opacity-70': mask === '',
            }
          )}
          onClick={handleGenerate}
        >
          <span>Generate</span>
        </button>
      </div>
    </div>
  );
}
