import Image from "next/image";
import { stripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Carousel } from "@/components/carousel";
import Categories from '@/components/categories';
import DailyProducts from '@/components/daily-products';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { faqItems } from '@/lib/data';

export default async function Home() {

  // Hero Image
  const product = await stripe.products.retrieve("prod_SBEO6zvhsjhgn4", {
    expand: ["default_price"],
  });

  // Carousel Images starting after specific product
  const products = await stripe.products.list({
    expand: ["data.default_price"],
    limit: 5,
    starting_after: "prod_SD8wR8lcbXfTgV",
  });

  return (
    <div>

      <section className="rounded bg-neutral-100 dark:bg-neutral-900 border-2 border-gray-300 dark:border-neutral-500 py-8 sm:py-12">
        <div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
          <div className="max-w-md space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-black dark:text-neutral-100">
              Bem vindo à ShopinGo
            </h2>
            <p className="text-neutral-600 dark:text-neutral-100">
              Os melhores produtos, os melhores preços, tudo em um só lugar!
            </p>
            <Button
              asChild
              variant="default"
              className="
              inline-flex items-center justify-center 
              rounded-full px-6 py-3 bg-black text-white 
              cursor-pointer hover:bg-black dark:hover:bg-black"
            >
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full px-6 py-3"
              >
                Ver todos os produtos
              </Link>
            </Button>
          </div>
          <Image
            alt="Hero Image"
            src={product.images[0]}
            className="rounded"
            width={450}
            height={450}
            draggable={false}
          />
        </div>
      </section>

      <section className="py-8">
        <div className="h-[400px]">
          <Carousel products={products.data} />
        </div>
      </section>

      <section className="py-8">
        <div className="w-full">
          <Categories />
        </div>
      </section>

      <section className="py-12">
        <DailyProducts />
      </section>

      <section className="pt-4 pb-7 bg-neutral-100 dark:bg-neutral-900 border-t-2 border-b-2 border-gray-300 dark:border-neutral-500 rounded">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-xl font-semibold text-black dark:text-neutral-100 text-center mb-4">
            Dúvidas Frequentes
          </h2>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqItems.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm transition-all"
              >
                <AccordionTrigger 
                className="
                w-full px-5 py-3 text-left text-md font-medium text-black
              dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700
                rounded-lg transition-colors cursor-pointer">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4 pt-0 text-neutral-700 dark:text-neutral-300 text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

    </div>
  );
}
