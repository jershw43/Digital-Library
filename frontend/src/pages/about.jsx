import React from 'react';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const About = () => {
  const handleLink = async (e) => {
    e.preventDefault();
    const url = 'https://jershw43.github.io/Digital-Library/index.html';
    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url });
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div style={{ marginTop: '100px', padding: '20px' }}>
      <h2>About Page</h2>
      <p>Our Digital Library is a modern platform designed to make accessing and managing books simple and intuitive. Whether you're looking to explore new titles, organize your reading list, or discover your next favorite book, our library provides a seamless experience for book lovers of all kinds. Built with accessibility and user experience in mind, we aim to bring the joy of reading to everyone, anywhere.</p>
      <h3>Our Team</h3>
      <p>Josh Watson</p>
      <p>Camron Mellott</p>
      <p>Luke Joseph</p>
      <p>Learn more about our Digital Library.</p>
      <a href="https://jershw43.github.io/Digital-Library/index.html" onClick={handleLink}>
        View Full Project Details
      </a>
    </div>
  );
};

export default About;