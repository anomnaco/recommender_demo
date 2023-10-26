'use client'
import { Sora } from 'next/font/google'
import Image from "next/image";
import StarRatings from 'react-star-ratings';

import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '@/tailwind.config'
import { ProductItem } from '@/utils/product';
import Link from 'next/link';

const sora = Sora({ subsets: ['latin'] })

export default function ProductCard({ data }: { data: ProductItem }) {
  const fullConfig = resolveConfig(tailwindConfig);
  const colors = fullConfig.theme?.colors! as any;
  const productId = data.uniq_id;

  return (
    <Link href={`/product/${productId}`}>
      <div className="chatbot-product-card h-[600px]">
        <div className="relative max-h-[240px] min-h-[240px]">
          <Image layout='fill' objectFit='contain' src={data.image} alt="product-image" />
        </div>
        <div className="chatbot-product-card-info flex-1 flex flex-col justify-between">
          <div className='mt-4'>
            <StarRatings
              // ignoreInlineStyles
              rating={3.6}
              starRatedColor={colors['categoryMagenta']}
              starEmptyColor={colors['textSecondary']}
              starDimension="16px"
              numberOfStars={5}
              name='rating'
              starSpacing="1px"
              svgIconPath="M7.00004 10.8466L11.12 13.3333L10.0267 8.64663L13.6667 5.49329L8.87337 5.08663L7.00004 0.666626L5.12671 5.08663L0.333374 5.49329L3.97337 8.64663L2.88004 13.3333L7.00004 10.8466Z"
              svgIconViewBox="0 0 14 14"
            />
            <h2 className="chatbot-product-title text-xl font-semibold mt-4">{data.product_name}</h2>
            <p className="chatbot-product-description mt-4 text-textSecondaryInverse">{data.about_product}</p>
          </div>
          <span className={`text-[34px] font-semibold text-textPrimaryInverse ${sora.className}`}>{data.selling_price}</span>
        </div>
      </div>
    </Link>
  )
}