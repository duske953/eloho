"use strict";
const body = document.querySelector("body"),
  contactForm = document.querySelector(".contact__form"),
  contactBox = document.querySelector(".contact"),
  userName = document.getElementById("name"),
  btnCloseModal = document.querySelector(".contact__icon-close"),
  overlay = document.querySelector(".overlay"),
  email = document.getElementById("email"),
  message = document.getElementById("message"),
  messageBox = document.querySelector(".message-box"),
  contactBtn = document.querySelector(".nav__item-contact"),
  contactPortfolio = document.querySelector(".contact-portfolio"),
  spinnerBorder = document.querySelector(".spinner-border"),
  heroSection = document.querySelector(".hero-section"),
  header = document.querySelector(".header"),
  portfolioSection = document.querySelector(".portfolio-section"),
  aboutLink = document.querySelector(".about--link"),
  heroPortfolioLink = document.querySelector(".hero-section__portfolio-link"),
  aboutSection = document.querySelector(".about-section"),
  navBox = document.querySelector(".nav__box--main");
function HeroSection(e, t) {
  e[0].isIntersecting
    ? header.classList.remove("header__active")
    : header.classList.add("header__active");
}
navBox.addEventListener("click", (e) => {
  e.preventDefault(),
    e.target.classList.contains("nav__item") &&
      !e.target.classList.contains("nav__item-contact") &&
      ("About" === e.target.textContent.trim()
        ? aboutSection.scrollIntoView({ behavior: "smooth" })
        : body.scrollIntoView({ behavior: "smooth" }));
});
const observer = new IntersectionObserver(HeroSection, {
  root: null,
  threshold: 0,
});
function showModal() {
  contactBox.classList.remove("inactive"), overlay.classList.remove("inactive");
}
function closeModal() {
  contactBox.classList.add("inactive"), overlay.classList.add("inactive");
}
function showMessageSentResponse(e) {
  (messageBox.firstElementChild.textContent = e),
    messageBox.classList.remove("inactive-message"),
    setTimeout(() => messageBox.classList.add("inactive-message"), 5e3);
}
function checkEmailValid(e) {
  return e.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}
function checkInputEmpty(...e) {
  e.filter((e, t) => {
    0 === e.value.trim().length &&
      e.nextElementSibling.classList.remove("contact__err--inactive"),
      0 !== e.value.trim().length &&
        e.nextElementSibling.classList.add("contact__err--inactive");
  });
}
function checkLengthInput(...e) {
  return e.some((e) => 0 === e.value.trim().length);
}
observer.observe(heroSection),
  contactBtn.addEventListener("click", (e) => {
    showModal();
  }),
  contactPortfolio.addEventListener("click", (e) => {
    showModal();
  }),
  btnCloseModal.addEventListener("click", (e) => {
    closeModal();
  }),
  aboutLink.addEventListener("click", function (e) {
    e.preventDefault(), portfolioSection.scrollIntoView({ behavior: "smooth" });
  }),
  heroPortfolioLink.addEventListener("click", (e) => {
    e.preventDefault(), portfolioSection.scrollIntoView({ behavior: "smooth" });
  }),
  contactForm.addEventListener("submit", function (e) {
    if ((e.preventDefault(), checkLengthInput(userName, email, message)))
      return checkInputEmpty(userName, email, message);
    if (!checkEmailValid(email.value))
      return (
        email.nextElementSibling.classList.remove("contact__err--inactive"),
        (email.nextElementSibling.textContent = "Invalid email"),
        message.nextElementSibling.classList.add("contact__err--inactive"),
        void userName.nextElementSibling.classList.add("contact__err--inactive")
      );
    email.nextElementSibling.classList.add("contact__err--inactive"),
      contactBox.classList.add("inactive"),
      spinnerBorder.classList.remove("inactive");
    const t = {
      name: userName.value,
      email: email.value,
      message: message.value,
    };
    let o = new XMLHttpRequest();
    o.open("POST", "/"),
      o.setRequestHeader("content-type", "application/json"),
      (o.onload = function () {
        "success" === o.responseText
          ? ((userName.value = email.value = message.value = ""),
            showMessageSentResponse(
              "Message received. I'll get back to you as soon as possible"
            ),
            closeModal(),
            spinnerBorder.classList.add("inactive"))
          : (showMessageSentResponse(o.response),
            closeModal(),
            spinnerBorder.classList.add("inactive"));
      }),
      o.send(JSON.stringify(t));
  });
const portfolioSectionContainer = document.querySelector(
  ".portfolio-section__container"
);
$(portfolioSectionContainer).slick();
