'use client';

import clsx from 'clsx';
import { ProductOption } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  option: ProductOption;
  currentModel: string;
  setCurrentModel: Dispatch<SetStateAction<string>>;
};

export function ModelSelector({
  option,
  currentModel,
  setCurrentModel,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleModelChange = (value: string) => {
    const optionSearchParams = new URLSearchParams(searchParams.toString());

    optionSearchParams.set(option.id.toLowerCase(), value);
    const optionUrl = createUrl(pathname, optionSearchParams);
    router.replace(optionUrl, { scroll: false });
    setCurrentModel(value);
  };

  return (
    <dl className="mb-8">
      <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
      <dd className="flex flex-wrap gap-3">
        {option.values.map((value) => {
          const isActive = currentModel === value;
          const isAvailableForSale = value !== 'me';

          return (
            <button
              key={value}
              onClick={() => handleModelChange(value)}
              title={`${option.name} ${value}`}
              className={clsx(
                'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
                {
                  'cursor-default ring-2 ring-blue-600': isActive,
                  'ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600 ':
                    !isActive && isAvailableForSale,
                  'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700':
                    !isAvailableForSale,
                }
              )}
            >
              {value}
            </button>
          );
        })}
      </dd>
    </dl>
  );
}
