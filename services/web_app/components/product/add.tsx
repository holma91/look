'use client';
import { useState } from 'react';
import clsx from 'clsx';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useProductContext } from '@/context/Product';

export function AddProduct() {
  const [addStyle, setAddStyle] = useState<'Manually' | 'By link'>('Manually');

  return (
    <div className="border border-neutral-800 p-1 rounded-xl min-w-[350px]">
      <div className="flex flex-col gap-y-2.5 p-6">
        <h3 className="font-semibold leading-none tracking-tight">
          Add product
        </h3>
        <p className="text-sm text-gray-500">
          Add a new product for virtual try on
        </p>
      </div>
      <div className="p-6 pt-0 gap-3 flex">
        <button
          className={clsx(
            'flex justify-center items-center flex-1 border p-2.5 rounded-md cursor-pointer text-sm',
            {
              'border-white': addStyle === 'Manually',
              'border-neutral-800': addStyle !== 'Manually',
              'hover:bg-neutral-900': addStyle !== 'Manually',
            }
          )}
          onClick={() => setAddStyle('Manually')}
        >
          Manually
        </button>
        <button
          className={clsx(
            'flex justify-center items-center flex-1 border p-2.5 rounded-md cursor-pointer text-sm',
            {
              'border-white': addStyle === 'By link',
              'border-neutral-800': addStyle !== 'By link',
              'hover:bg-neutral-900': addStyle !== 'By link',
            }
          )}
          onClick={() => setAddStyle('By link')}
        >
          By link
        </button>
      </div>
      {addStyle === 'Manually' ? <ManualAdd /> : <LinkAdd />}
    </div>
  );
}

function ManualAdd() {
  const { setProduct } = useProductContext();
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const router = useRouter();
  const handleManualAdd = () => {
    console.log('manual add:', title, brand, price, currency, uploadedFiles);

    const product: ManualProduct = {
      uid: '69',
      title,
      brand,
      price,
      currency,
      files: uploadedFiles,
    };

    // for now, let's assume that every user is logged out
    const isUserLoggedIn = false;

    if (isUserLoggedIn) {
      // Send product to backend, get server-generated UID, and navigate
      // router.push(`/products/${uid}`);
    } else {
      setProduct(product);
      router.push(`/products/test`);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setUploadedFiles(files);
    }
  };

  return (
    <>
      <div className="p-6 pt-0">
        <label htmlFor="title" className="block text-sm font-medium leading-6">
          Title
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="title"
            id="title"
            className="block w-full rounded-md py-1.5 text-white ring-1 ring-neutral-800 placeholder:text-gray-400 outline-none focus:ring-2  focus:ring-white sm:text-sm sm:leading-6 px-3 bg-transparent"
            placeholder="Ribbed Turtleneck"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <label
          htmlFor="brand"
          className="block text-sm font-medium leading-6 pt-4"
        >
          Brand
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="brand"
            id="brand"
            className="block w-full rounded-md py-1.5 text-white ring-1 ring-neutral-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white sm:text-sm sm:leading-6 px-3 bg-transparent"
            placeholder="Softgoat"
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <label
          htmlFor="price"
          className="block text-sm font-medium leading-6  pt-4"
        >
          Price
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="text"
            name="price"
            id="price"
            className="bg-black block w-full rounded-md py-2 pl-7 pr-20 text-white ring-1 ring-inset outline-none ring-neutral-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
            placeholder="0.00"
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <label htmlFor="currency" className="sr-only">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-2 text-gray-400 outline-none sm:text-sm"
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option>USD</option>
              <option>CAD</option>
              <option>EUR</option>
            </select>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0">
        <label
          htmlFor="cover-photo"
          className="block text-sm font-medium leading-6 text-white"
        >
          Images
        </label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-neutral-800 px-6 py-6">
          <div className="text-center">
            <PhotoIcon
              className="mx-auto h-12 w-12 text-gray-300"
              aria-hidden="true"
            />
            <div className="flex flex-col justify-center items-center">
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className=" cursor-pointer rounded-md bg-black font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload images</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple
                    className="sr-only bg-transparent"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              {/* <p className="text-xs leading-5 text-gray-600">
                PNG, JPG, GIF up to 10MB
              </p> */}
            </div>
            <div className="flex flex-wrap gap-2 mt-3 max-w-[280px]">
              {uploadedFiles.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded preview ${index}`}
                  className="w-[64px] h-[64px] object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0">
        <button
          onClick={handleManualAdd}
          aria-label="Add item to cart"
          disabled={false}
          title="Add product"
          className="relative flex w-full items-center justify-center rounded-md bg-blue-600 p-4 tracking-wide text-white hover:opacity-90"
        >
          <div className="absolute left-0 ml-4">
            <PlusIcon className="h-5" />
          </div>
          <span>Add product</span>
        </button>
      </div>
    </>
  );
}

function LinkAdd() {
  const router = useRouter();
  const handleLinkAdd = () => {
    console.log('link add');
    // do some behind the scenes scraping
    // add link to zustand, generate uid for the url path
    // router.push('/products/uid');
    router.push('/product');

    // retrieve from zustand
  };

  return (
    <>
      <div className="p-6 pt-0">
        <label htmlFor="link" className="block text-sm font-medium leading-6">
          Link
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="link"
            id="link"
            className="block w-full rounded-md py-1.5 text-white ring-1 ring-neutral-800 placeholder:text-gray-400 outline-none focus:ring-2  focus:ring-white sm:text-sm sm:leading-6 px-3 bg-transparent"
            placeholder="https://softgoat.com/p/mens-melange-o-neck-grey/"
          />
        </div>
      </div>
      <div className="p-6 pt-0">
        <button
          onClick={handleLinkAdd}
          aria-label="Add item to cart"
          disabled={false}
          title="Add product"
          className="relative flex w-full items-center justify-center rounded-md bg-blue-600 p-4 tracking-wide text-white hover:opacity-90"
        >
          <div className="absolute left-0 ml-4">
            <PlusIcon className="h-5" />
          </div>
          <span>Add product</span>
        </button>
      </div>
    </>
  );
}
