import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";
import { useCallback } from "react";

const ParticlesBackground = () => {

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (

    <Particles
      id="tsparticles"
      className="fixed top-0 left-0 w-full h-full -z-10"

      init={particlesInit}

      options={{
        background:{
          color:{
            value:"transparent"
          }
        },

        particles:{
          number:{
            value:60
          },

          color:{
            value:"#000000"
          },

          links:{
            enable:true,
            distance:150,
            color:"#000000",
            opacity:0.3
          },

          move:{
            enable:true,
            speed:1
          },

          size:{
            value:3
          }
        }
      }}
    />
  )
}

export default ParticlesBackground