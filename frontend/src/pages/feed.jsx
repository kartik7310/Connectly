import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import feedService from '../services/feedService';
import { addFeed } from '../store/store-slices/feedSlice';
import UserCard from '../components/UserCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const hasDragged = useRef(false);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const getFeed = async () => {
    try {
      const { data, success } = await feedService.getFeed();
      const userData = data.users;

      if (success) {
        dispatch(addFeed(userData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const checkScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    checkScroll();
    slider.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      slider.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [feed]);

  const getScrollStep = () => {
    if (!sliderRef.current) return 380 + 24;
    const children = sliderRef.current.children;
    if (children.length >= 2) {
      return children[1].offsetLeft - children[0].offsetLeft;
    }
    return (children[0]?.clientWidth || 380) + 24;
  };

  const scrollNext = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: getScrollStep(), behavior: "smooth" });
  };

  const scrollPrev = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
  };

  // Mouse Drag Handlers for Desktop
  const handleMouseDown = (e) => {
    if (e.button !== 0 || !sliderRef.current) return;
    isDragging.current = true;
    hasDragged.current = false;
    dragStartX.current = e.pageX - sliderRef.current.offsetLeft;
    dragScrollLeft.current = sliderRef.current.scrollLeft;
    sliderRef.current.style.scrollBehavior = 'auto';
    sliderRef.current.style.scrollSnapType = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - dragStartX.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
    }
    sliderRef.current.scrollLeft = dragScrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (sliderRef.current) {
      sliderRef.current.style.scrollBehavior = 'smooth';
      sliderRef.current.style.scrollSnapType = 'x mandatory';
      checkScroll();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollPrev();
    }
  };

  const handleClickCapture = (e) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDragged.current = false;
    }
  };

  if (!Array.isArray(feed) || feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl text-gray-400">📭</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">You're all caught up!</h2>
        <p className="text-gray-500 max-w-md">There are no new connection suggestions at the moment. Check back later as our network grows.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center">
      {/* Main Discover Connections Section Container (85-90% width on desktop) */}
      <div className="w-[92%] sm:w-[88%] md:w-[85%] max-w-4xl mx-auto">
        {/* Header Section aligned with Carousel */}
        <div className="w-full mb-8 sm:mb-10 flex items-end justify-between px-1 sm:px-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 tracking-tight">Discover Connections</h1>
            <p className="text-sm sm:text-base text-gray-500">People you might be interested in collaborating with.</p>
          </div>

          {/* Desktop Navigation Arrows aligned vertically with heading */}
          {feed.length > 1 && (
            <div className="hidden sm:flex items-center gap-2.5 shrink-0 ml-4">
              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canScrollLeft}
                className="p-2.5 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
                aria-label="Previous suggested connection"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollRight}
                className="p-2.5 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
                aria-label="Next suggested connection"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Horizontal Slider Section */}
        <div className="w-full relative">
          <div
            ref={sliderRef}
            role="region"
            aria-label="Discover connections slider"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onClickCapture={handleClickCapture}
            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2 px-1 sm:px-2 no-scrollbar select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 rounded-2xl"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {feed.map((user) => (
              <div
                key={user._id}
                className="w-[82%] sm:w-[380px] shrink-0 snap-start flex"
              >
                <UserCard user={user} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
