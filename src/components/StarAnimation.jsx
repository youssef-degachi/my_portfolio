"use client";  // This makes the component a Client Component


import React, {useCallback} from 'react'
import  Particles from 'react-tsparticles';
import { loadFull} from 'tsparticles';


const StarAnimation = () => {
  // init 
  const particlesInit = useCallback(async (engine) =>{
    await loadFull(engine);
  });

  const particlesLoaded = useCallback(async () => {});

  return (
    <Particles 
    className='w-full h-full absolute translate-z-0 z-50'
    id='tsparticles'
    init={particlesInit}
    loaded={particlesLoaded}
    option={{
      FullScreen:{ enable: false},
      background:{
        color:{
          value:'#000000', // default ''
        },
      },
      fpsLimit:120,
      interactivity:{
        events:{
          onClick:{
            enable:false,
            mode:'push',
          },
          onHover:{
            enable:true,
            mode:'repulse',
          },
          resize:true,
        },
        modes:{
          push:{
            quantity:90,
          },
          repulse:{
            distance:200,
            duration:0.4,
          },
        },
      },
      particles:{
        color:{
          value: '#f64a8a',
        },
        links:{
          color: '#f64a8a',
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        collisions:{
          enable:true,
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'bounce'
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number:{
          density: {
            enable: true,
            area: 800,
          },
          value: 80,
        },
        opacity: {
          value: 0.5
        },
        shape: {
          type: 'circle'
        },
        size: {
          value: {min: 1,max: 5},
        },
      },
      detectRetina: true,
    }}
    />
  )
}

export default StarAnimation