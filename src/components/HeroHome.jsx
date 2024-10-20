import React, { useState, useRef, useEffect } from 'react';
import Modal from '../utils/Modal';
import videoDemo from "/videos/video.mp4";
import thumbnail from "/images/image.png";

function HeroHome() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const video = useRef(null);

  useEffect(() => {
    videoModalOpen ? video.current.play() : video.current.pause();
  }, [videoModalOpen]);

  return (
    <section className="relative bg-[#e4002b] overflow-hidden">
      {/* Left wave bar */}
  

      {/* Multiple Ball Illustrations behind hero content */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none" aria-hidden="true">
        <svg width="1360" height="578" viewBox="0 0 1360 578" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-01">
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-12 md:pt-40 md:pb-20">
          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
            <img
              src='../../public/images/mealprep.png'
              width={600}
              className="mx-auto text-5xl md:text-6xl leading-tighter tracking-tighter"
              data-aos="zoom-y-out"
            />
            <div className="max-w-6xl mx-auto">
              <p className="text-xl bold text-white mb-8" data-aos="zoom-y-out" data-aos-delay="150">
                Bringing you recipes from all around the world!
              </p>
              <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center" data-aos="zoom-y-out" data-aos-delay="300">
                <div>
                  <a className="btn text-white bg-red-600 hover:bg-red-700 w-full mb-4 sm:w-auto sm:mb-0" href="/signin">
                    Sign In
                  </a>
                </div>
                <div>
                  <a className="btn text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto sm:ml-4" href="#0">
                    More
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="flex justify-center items-center mb-8" data-aos="zoom-y-out" data-aos-delay="450">
            <div className="flex flex-col">
              {/* Applying rounded-full to make the image fully round */}
              <img className="mx-auto" src={thumbnail} width="768" height="432" alt="Hero" />
            </div>
            <button
              className="absolute top-full flex transform -translate-y-1/2 bg-white rounded-full font-medium group p-4 shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setVideoModalOpen(true);
              }}
              aria-controls="modal"
            >
              <svg
                className="w-6 h-6 fill-current text-gray-400 group-hover:text-red-600 flex-shrink-0"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0 2C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12z" />
                <path d="M10 17l6-5-6-5z" />
              </svg>
              <span className="ml-3">Quick demonstration of how it works! (30 sec)</span>
            </button>
          </div>

          {/* Modal */}
          <Modal id="modal" ariaLabel="modal-headline" show={videoModalOpen} handleClose={() => setVideoModalOpen(false)}>
            <div className="relative  pb-9/16">
              <video ref={video} className="absolute w-full h-full" width="1920" height="1080" loop autoPlay controls>
                <source src={videoDemo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </Modal>
        </div>
      </div>
    </section>
  );
}

export default HeroHome;
