'use client';

import { Button } from './ui/button';
import Link from 'next/link';
import { offers } from '@/lib/data';
import Image from 'next/image';

const DailyProducts = () => {
  return (
    <section className="rounded pt-8 pb-12 bg-neutral-100 dark:bg-neutral-900 border-2 border-gray-300 dark:border-neutral-500">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-black dark:text-neutral-100">Ofertas do Dia</h2>
          <p className="text-md text-neutral-600 dark:text-neutral-100">Aproveite as melhores promoções de hoje!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="
            bg-white dark:bg-neutral-800 rounded-lg shadow-md
              overflow-hidden transition-transform transform hover:scale-[1.02]
              duration-300 flex flex-col"
            >
              <div className="relative items-center mt-2">
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                  Oferta Limitada
                </span>
                <Image
                  src={offer.image}
                  alt={offer.title}
                  width={300} 
                  height={200} 
                  className="object-contain w-full h-48" 
                />
              </div>

              <div className="flex flex-col justify-between p-4 pt-2 h-full">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-black dark:text-neutral-100">{offer.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-100 mt-1">{offer.description}</p>
                </div>

                <div className="mt-4">
                  <Link href={offer.link}>
                    <Button
                      className="w-full rounded-full px-6 py-3 bg-black text-white cursor-pointer hover:bg-black dark:hover:bg-black"
                    >
                      Ver Mais
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DailyProducts;
