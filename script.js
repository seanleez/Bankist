'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = () => {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

///////////////////////////////////////
// Button scrolling

btnScrollTo.addEventListener('click', () => {
  section1.scrollIntoView({ behavior: 'smooth' });

  // const s1Coords = section1.getBoundingClientRect();
  // console.log(s1Coords.left, s1Coords.top);
  // console.log(window.pageXOffset, window.pageYOffset);
  // window.scrollTo({
  //   left: s1Coords.left + window.pageXOffset,
  //   top: s1Coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
});

///////////////////////////////////////
// Page navigation
// document.querySelectorAll('.nav__link').forEach(element => {
//   const id = element.getAttribute('href');
//   element.addEventListener('click', e => {
//     e.preventDefault();
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

document.querySelector('.nav__links').addEventListener('click', (e) => {
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    e.preventDefault();
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', (event) => {
  const clickedButton = event.target.closest('.operations__tab');

  if (!clickedButton) return;

  // Remove active tab
  tabs.forEach((tab) => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach((tabContent) =>
    tabContent.classList.remove('operations__content--active')
  );

  // Active tab
  clickedButton.classList.add('operations__tab--active');

  // Active content area
  const dataTab = clickedButton.getAttribute('data-tab');
  document
    .querySelector(`.operations__content--${dataTab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu fade animation

const handleHover = (e, opacity) => {
  if (e.target.classList.contains('nav__link')) {
    const logo = document.querySelector('.nav__logo');
    const links = document.querySelectorAll('.nav__link');

    links.forEach((link) => {
      if (link !== e.target) {
        link.style.opacity = opacity;
      }
    });
    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', (e) => handleHover(e, 0.5));

nav.addEventListener('mouseout', (e) => handleHover(e, 1));

// Passing "argument" into handler
///////////////////////////////////////
// Sticky navigation: Intersection Observer API
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll', (e) => {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = (entries) => {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);
///////////////////////////////////////
// Reveal sections
const sections = document.querySelectorAll('.section');
const revealSection = (entries, observer) => {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});

sections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
// Lazy loading images
const featureImages = document.querySelectorAll('.features__img');

const loadFullImage = (entries, observer) => {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove('lazy-img');
    entry.target.setAttribute('src', entry.target.getAttribute('data-src'));
    observer.unobserve(entry.target);
  }
};

const imageObserver = new IntersectionObserver(loadFullImage, {
  root: null,
  threshold: 0.5,
});

featureImages.forEach((img) => {
  imageObserver.observe(img);
});
///////////////////////////////////////
// Slider
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
const slideLength = slides.length;
let currentSlideIndex = 0;

const createDots = () => {
  slides.forEach((s, i) => {
    const dotBtn = document.createElement('button');
    dotBtn.classList.add('dots__dot');
    dotBtn.setAttribute('data-slide', i);
    dotContainer.insertAdjacentElement('beforeend', dotBtn);
  });
};

createDots();

const activeDotButton = (index) => {
  const dotBtn = document.querySelector(`button[data-slide="${index}"]`);
  document.querySelectorAll('.dots__dot').forEach((btn) => {
    btn.classList.remove('dots__dot--active');
  });
  dotBtn.classList.add('dots__dot--active');
};

activeDotButton(currentSlideIndex);

document.querySelectorAll('.dots__dot').forEach((btn) => {
  btn.addEventListener('click', () => {
    const curIndex = btn.getAttribute('data-slide');
    goToSlide(curIndex);
    currentSlideIndex = curIndex;
    activeDotButton(curIndex);
  });
});

const goToSlide = (currentIndex) => {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${100 * (index - currentIndex)}%)`;
  });
};
goToSlide(0);

const prevSlide = () => {
  if (currentSlideIndex === 0) {
    currentSlideIndex = slideLength - 1;
  } else {
    currentSlideIndex--;
  }
  goToSlide(currentSlideIndex);
  activeDotButton(currentSlideIndex);
};

const nextSlide = () => {
  if (currentSlideIndex === slideLength - 1) {
    currentSlideIndex = 0;
  } else {
    currentSlideIndex++;
  }
  goToSlide(currentSlideIndex);
  activeDotButton(currentSlideIndex);
};

sliderBtnLeft.addEventListener('click', prevSlide);
sliderBtnRight.addEventListener('click', nextSlide);

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    prevSlide();
  }
  if (e.key === 'ArrowRight') {
    nextSlide();
  }
});
///////////////////////////////////////
///////////////////////////////////////
// Lifecycle DOM Events
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree built!', e);
// });

// window.addEventListener('load', function (e) {
//   console.log('Page fully loaded', e);
// });

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
