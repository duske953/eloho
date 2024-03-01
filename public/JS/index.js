'use strict';
import $, { error } from 'jquery';
import validator from 'validator';
import axios from 'axios';
import 'slick-carousel';
const body = document.querySelector('body');
const contactForm = document.querySelector('.contact__form');
const contactBox = document.querySelector('.contact');
const userName = document.getElementById('name');
const btnCloseModal = document.querySelector('.contact__icon-close');
const overlay = document.querySelector('.overlay');
const email = document.getElementById('email');
const message = document.getElementById('message');
const messageBox = document.querySelector('.message-box');
const contactBtn = document.querySelector('.nav__item-contact');
const spinnerBorder = document.querySelector('.spinner-border');
const heroSection = document.querySelector('.hero-section');
const header = document.querySelector('.header');
const portfolioSection = document.querySelector('.portfolio-section');
const heroPortfolioLink = document.querySelector(
  '.hero-section__portfolio-link'
);
const aboutSection = document.querySelector('.about-section');
const navBox = document.querySelector('.nav__box--main');
const portfolioSectionContainer = document.querySelector(
  '.portfolio-section__container'
);
let valid = true;
let timeOutId;
function HeroSection([e]) {
  e.isIntersecting
    ? header.classList.remove('header__active')
    : header.classList.add('header__active');
}
navBox.addEventListener('click', (e) => {
  e.preventDefault(),
    e.target.classList.contains('nav__item') &&
      !e.target.classList.contains('nav__item-contact') &&
      ('About' === e.target.textContent.trim()
        ? aboutSection.scrollIntoView({ behavior: 'smooth' })
        : body.scrollIntoView({ behavior: 'smooth' }));
});

$(portfolioSectionContainer).slick();
const observer = new IntersectionObserver(HeroSection, {
  root: null,
  threshold: 0,
});
function showModal() {
  contactBox.classList.remove('inactive');
  overlay.classList.remove('inactive');
}
function closeModal() {
  contactBox.classList.add('inactive');
  overlay.classList.add('inactive');
}

function clearErrInput(...inputs) {
  inputs.forEach((input) => {
    input.nextElementSibling.classList.add('contact__err--inactive');
  });
}

function isInputValid(...inputs) {
  inputs.forEach((input) => {
    const attr = input.getAttribute('id');
    if (!input.value) {
      valid = false;
      input.nextElementSibling.classList.remove('contact__err--inactive');
      input.nextElementSibling.textContent = `${attr.replace(
        attr[0],
        attr[0].toUpperCase()
      )} is required`;
    }
    if (email.value && !validator.isEmail(email.value)) {
      valid = false;
      email.nextElementSibling.classList.remove('contact__err--inactive');
      email.nextElementSibling.textContent = 'Invalid Email address';
    }
    if (input.value && validator.isEmail(email.value)) {
      valid = true;
    }
  });
  return valid;
}

function InputValidator(...inputs) {
  return isInputValid(...inputs);
}

observer.observe(heroSection);
contactBtn.addEventListener('click', (e) => {
  showModal();
});

btnCloseModal.addEventListener('click', (e) => {
  closeModal();
});

overlay.addEventListener('click', (e) => {
  if (e.target.getAttribute('data-state') === 'fetching') return;
  closeModal();
});

heroPortfolioLink.addEventListener('click', (e) => {
  e.preventDefault();
  portfolioSectionContainer.scrollIntoView({ behavior: 'smooth' });
});

function clearInput(...inputs) {
  inputs.forEach((input) => {
    input.value = '';
  });
}

function handleResponse(text) {
  messageBox.firstElementChild.textContent = text;
  messageBox.classList.remove('inactive-message');
  spinnerBorder.classList.add('inactive');
  overlay.classList.add('inactive');
  overlay.removeAttribute('data-state');
  timeOutId = setTimeout(() => {
    messageBox.classList.add('inactive-message');
  }, 5000);
}

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  clearErrInput(userName, email, message);
  if (!InputValidator(userName, email, message)) return;
  try {
    clearTimeout(timeOutId);
    spinnerBorder.classList.remove('inactive');
    closeModal();
    overlay.classList.remove('inactive');
    overlay.setAttribute('data-state', 'fetching');
    await axios.post('/', {
      name: userName.value,
      email: email.value,
      message: message.value,
    });
    handleResponse(
      "Message Received. I'll get back to you as soon as possible"
    );
    clearInput(userName, email, message);
  } catch (err) {
    handleResponse(err.response.data);
  }
});
