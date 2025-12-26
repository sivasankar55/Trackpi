import React, { useState } from 'react'
import { accordionData } from './accordionData';
import faqIcon from '../assets/faq-icon.png';
import { faqList } from './faqList';
import './css/faq.css';

const Faq2 = () => {
    const [openId, setIsOpenId] = useState(null);
    const toggleAccordian = (id) => {
        setIsOpenId(openId === id ? null : id); 
    }
  return (
    <>
    <h1 className='text-white text-[1.2rem] font-bold ml-6 mt-5 sm:ml-9 sm:text-3xl'>FAQ</h1>

    <section className='faq-container px-5 mt-5 sm:flex sm:flex-row-reverse sm:justify-between sm:px-12'>
        <div className='sm:w-[650px]'>
        <div className='relative  '>
            <i className='fa fa-search text-[#848484] text-[18px] absolute left-3 top-1/2 transform -translate-y-1/2'></i>
            <input 
                type="search" 
                name="search" 
                id="search" 
                placeholder='Search...'
                className='rounded-[15px] w-full pl-10 px-3.5 text-3.5 font-medium' />
        </div>
        <div className="accordian-div">
            <div id="accordion-collapse" data-accordion="collapse">
                {accordionData.map((item) => (
                    <div key={item.id} className='border-b border-white'>
                        <h2 id={`accordion-collapse-heading-${item.id} text-left `}>
                            <button
                                type="button"
                                className="flex w-full p-5 font-medium text-white gap-3 items-start"
                                data-accordion-target={`#accordion-collapse-body-${item.id}`}
                                aria-expanded={openId === item.id}
                                aria-controls={`accordion-collapse-body-${item.id}`}
                                onClick={() => toggleAccordian(item.id)}
                            >
                                <span className="text-white text-3 flex-1 text-left font-semibold">{item.question}</span>
                                <svg data-accordion-icon className={`w-3 h-3 transform transition-transform duration-200 ${openId === item.id ? 'rotate-180' : '' } shrink-0`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                                </svg>
                            </button>
                        </h2>
                        {openId === item.id && (
                            <div
                                id={`accordion-collapse-body-${item.id}`}
                                className=""
                                aria-labelledby={`accordion-collapse-heading-${item.id}`}
                            >
                                <div className="p-5 border-b border-white">
                                    <p className="mb-2 text-white">{item.answer}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
        </div>

        {/* frequently asked question */}
        <div className='mt-10 sm:w-[660px] sm:mt-0'>
            <h1 className='text-white text-3.5 font-bold text-center mb-5 sm:text-2xl'>Here are some of the frequently asked questions</h1>

            
            {faqList.map((faq) => (
            <div key={faq.id} className="mb-4">
                {/* Question Row */}
                <div className="flex items-center gap-3 sm:gap-7">
                <img src={faqIcon} alt="FAQ Icon" className="w-10" />
                <h3 className="text-white font-semibold text-xl">{faq.question}</h3>
                </div>

                {/* Answer Row */}
                <div className="flex items-stretch gap-[34px] mt-2 ml-4 sm:gap-12">
                <div className="w-1 bg-[#FF9D00] border-2 border-[#FF9D00]"></div>
                <p className="text-white font-medium text-base text-justify">{faq.answer}</p>
                </div>
            </div>
            ))}


        </div>
    </section>
    </>
  )
}

export default Faq2