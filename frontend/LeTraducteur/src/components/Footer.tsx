import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';


const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-[#2cd0fa] text-navy flex items-center justify-center p-4">
      <div className="flex space-x-4">
      <p className="text-center mt-2">
                Made with &hearts; by Alana Barrett-Frew &copy; 2024
            </p>
                <a href="https://github.com/AlanaBF/LLM" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faGithub} size="2x" />
                </a>
                <a href="https://www.alanabarrettfrew.com/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faUserCircle} size="2x" />
                </a>
            </div>
         
        </footer>
    );
}

export default Footer;
