'use client'

import { useEffect, useMemo, useState } from 'react';
import { Sora } from 'next/font/google'
import Image from 'next/image'
import StarRatings from 'react-star-ratings';

import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '@/tailwind.config'
import ProductCard from '@/components/ProductCard'
import { BuyIcon, MinusIcon, PlusIcon } from '@/components/icons';
import axios from 'axios';
import { ProductItem } from '@/utils/product';

const sora = Sora({ subsets: ['latin'] })

export default function Detail({ params: { productId } }: { params: { productId: string } }) {
  const [amount, setAmount] = useState<number>(1);
  const [product, setProduct] = useState<ProductItem>();
  const [recommendProducts, setRecommendProducts] = useState<ProductItem[]>([]);

  const fullConfig = resolveConfig(tailwindConfig);
  const colors = fullConfig.theme?.colors! as any;

  const productDetails = useMemo(() => {
    if (product?.product_specification) {
      const specifications = product.product_specification.split("|");
      return specifications.map((spec) => {
        const pair = spec.split(":");
        return {
          key: pair[0],
          value: pair[1]
        }
      })
    }
  }, [product?.product_specification]);

  const getProduct = async (productId: string) => {
    try {
      const response = await axios.get<ProductItem>(`/api/product/${productId}`);
      setProduct(response.data);
    } catch (err) {

    }
  }

  const getRecommendProducts = async (productId: string) => {
    try {
      const response = await axios.get<ProductItem[]>(`/api/recommended_products/${productId}`);
      setRecommendProducts(response.data);
    } catch (err) {

    }
  }

  useEffect(() => {
    getProduct(productId);
    getRecommendProducts(productId);
  }, [productId]);

  const onPlus = () => {
    setAmount(amount + 1);
  }

  const onMinus = () => {
    if (amount > 1) {
      setAmount(amount - 1);
    }
  }

  return (
    <main className="mt-12">
      <section className='mb-12'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='col-sapn-1'>
            <div className='relative h-[300px] lg:h-[600px]'>
              {product?.image ?
                <Image className='rounded-md' src={product.image} layout='fill' objectFit='contain' alt="" />
                :
                null
              }
            </div>
          </div>
          <div className='col-sapn-1'>
            <div className="flex-1 flex flex-col">
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
                <h2 className="text-[34px] font-semibold mt-4">{product?.product_name || ''}</h2>
                <p className="mt-4 text-textSecondaryInverse">{product?.about_product || ''}</p>
                <h3 className="text-2xl font-semibold mt-4">Product Details</h3>
                <div className='flex flex-col text-textSecondaryInverse'>
                  {productDetails ?
                    productDetails.map((spec, index) =>
                      <span key={`product-specification-${index}`}><b>{spec.key}:</b> {spec.value}</span>
                    )
                    :
                    null
                  }
                </div>
              </div>
              <div className='flex items-center justify-between mt-9'>
                <span className={`text-[34px] font-semibold text-textPrimaryInverse ${sora.className}`}>{product?.selling_price || ''}</span>
                <div className='chatbot-buy-amount flex items-center gap-4'>
                  <button onClick={onMinus}>
                    <MinusIcon />
                  </button>
                  <div className='w-[40px] h-[40px] rounded-md border border-borderPrimary'>
                    <div className="chatbot-input !p-1">
                      <input className='w-full h-full text-center' value={amount} onChange={e => setAmount(Number(e.target.value))} />
                    </div>
                  </div>
                  <button onClick={onPlus}>
                    <PlusIcon />
                  </button>
                  <button className='chatbot-button flex rounded-md items-center justify-center px-2.5 origin:px-3'>
                    <BuyIcon />
                    <span className='font-semibold text-sm ml-2'>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='mb-12'>
        <div className='flex items-center gap-6 mb-6'>
          <h2 className={`${sora.className} text-2xl font-semibold`}>Related Products</h2>
          <hr className='chatbot-divider flex-1' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {recommendProducts.map((product, index) =>
            <div key={`product-card-${index}`} className='col-span-1'>
              <ProductCard data={product} />
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
