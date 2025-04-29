'use client';

import { paymentMethods } from '@/lib/data';
import Image from 'next/image';
import React from 'react';
import { FaInstagram, FaTiktok, FaTwitter, FaFacebookF, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white border-t-2 border-gray-300 dark:border-neutral-700 mt-12">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        <div>
          <h4 className="text-lg font-semibold mb-4">Atendimento ao Cliente</h4>
          <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <li className="cursor-pointer hover:underline">Como Comprar</li>
            <li className="cursor-pointer hover:underline">Métodos de Pagamento</li>
            <li className="cursor-pointer hover:underline">Garantia Shopee</li>
            <li className="cursor-pointer hover:underline">Devolução e Reembolso</li>
            <li className="cursor-pointer hover:underline">Fale Conosco</li>
            <li className="cursor-pointer hover:underline">Ouvidoria</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Sobre a ShopinGo</h4>
          <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <li className="cursor-pointer hover:underline">Sobre Nós</li>
            <li className="cursor-pointer hover:underline">Políticas da Loja</li>
            <li className="cursor-pointer hover:underline">Política de Privacidade</li>
            <li className="cursor-pointer hover:underline">Programa de Afiliados</li>
            <li className="cursor-pointer hover:underline">Blog</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Pagamento</h4>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((payment) => (
              <div
                key={payment.name}
                className="w-14 h-10 p-1.5 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm flex items-center justify-center overflow-hidden"
              >
                <Image
                  src={payment.image}
                  alt={payment.name}
                  width={48}
                  height={30}
                  className="object-contain"
                  quality={100}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Siga-nos</h4>
          <div className="flex gap-4 text-xl text-neutral-700 dark:text-neutral-300">
            <FaInstagram className="cursor-pointer hover:text-black dark:hover:text-white transition-colors" />
            <FaTiktok className="cursor-pointer hover:text-black dark:hover:text-white transition-colors" />
            <FaTwitter className="cursor-pointer hover:text-black dark:hover:text-white transition-colors" />
            <FaFacebookF className="cursor-pointer hover:text-black dark:hover:text-white transition-colors" />
            <FaLinkedin className="cursor-pointer hover:text-black dark:hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-neutral-600 dark:text-neutral-400 py-4 border-t border-gray-300 dark:border-neutral-700">
        © {new Date().getFullYear()} ShopinGo. Todos os direitos reservados.
      </div>
      <div className="text-center text-sm text-neutral-600 dark:text-neutral-400 py-4 border-t border-gray-300 dark:border-neutral-700">
        <p>Desenvolvido por
          <a href="https://github.com/Gabriel-otirB"
            target="_blank"
            className='ml-1 mr-1 font-semibold text-neutral-600 dark:text-neutral-100'
          >Gabriel-otirB
          </a>
          &copy; {new Date().getFullYear()}.</p>
      </div>
    </footer>
  );
};

export default Footer;
