//importando funcion principal
//
import { funcionPrincipal } from "../main.js"; 
const inViewPort = ([e]) => {
    const {isIntersecting, target} = e;

    if(isIntersecting){
        funcionPrincipal();
        observer.unobserve(target);
    }
};

const observer = new IntersectionObserver(inViewPort);

export const getObserver = (node) => {
  observer.observe(node);
};