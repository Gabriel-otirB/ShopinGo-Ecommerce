import Image from "next/image";
import { stripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Carousel } from "@/components/carousel";
import Categories from '@/components/categories';
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export default async function Home() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
    limit: 5,
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
            src={products.data[1].images[0]}
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

      {/* <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

        </div>
      </section> */}

    </div>
  );
}
