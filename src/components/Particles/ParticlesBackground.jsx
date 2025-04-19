// src/components/ParticlesBackground.jsx
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: "#f4f4f4", // Cor de fundo
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: true, mode: "repulse" },
          },
        },
        particles: {
          color: { value: "#000000" }, // Cor das particulas
          links: {
            color: "#000000", // Linhas pretas
            distance: 200, // Distância das particulas
            enable: true,
            opacity: 0.3, // Transparência particula
            width: 1,
          },
          move: {
            enable: true,
            speed: 1.2, // Velocidade de movimento das particulas
            direction: "none",
            random: true,
            straight: false,
            outModes: { default: "bounce" },
          },
          number: { 
            density: { 
              enable: true, 
              area: 1000, // Área maior = partículas mais espaçadas
            }, 
            value: 45 // Quantidade de particulas
          },
          opacity: { value: 0.2 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 2 } },
        },
        detectRetina: true,
      }}
    />
  );
}