import './App.css';
import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Rank from './components/Rank/Rank';
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

function AppC() {

  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {

    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "#0d47a1",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 6,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    [],
  );
  return {
    particlesLoaded,
    options
  };
}


function App() {
  const PAT = 'd278ee897e79400699574022b388c24f';
  const USER_ID = 'qraztec';
  const APP_ID = 'test';
  const MODEL_ID = 'face-detection';
  const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
  const [input, setInput] = useState('');
  const [imageURL, setURL] = useState('');
  const [boxes, setBoxes] = useState([]);
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setSign] = useState(false);
  const [entries, setEntries] = useState(0)
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    joined: ''
  })

  function Reset() {
  
    setInput('')
    setURL('')
    setBoxes([])
    setRoute('signin')
    setSign(false)
    setEntries(0)
    setUser({
      id: '',
      name: '',
      email: '',
      joined: ''
    })
  }
  
  const loadUser = (data) => {
    
    setUser(prevUser => ({
      ...prevUser, 
      id: data.id,
      name: data.name,
      email: data.email,
      joined: data.joined
    })
    )
    setEntries(data.entries)
  }


  const { particlesLoaded, options } = AppC();

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = (boxes) => {
    console.log(boxes)
    setBoxes(boxes)
  }

  const onInputChange = (event) => {
    console.log(event.target.value);
    setInput(event.target.value);

  };
  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": input
            // "base64": IMAGE_BYTES_STRING
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  const onSubmit = () => {
    setURL(input);
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
      .then(response => response.json())
      .then(result => {
        
        
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              console.log('count', count)
              setEntries(count.entries)
              //console.log('user object', user.entries)
            })
            .catch(error => console.log('Error updating user entries:', error))
          

        const regions = result.outputs[0].data.regions;
        const newBoxes = regions.map(region => calculateFaceLocation(region))
        displayFaceBox(newBoxes)
        

      })
      .catch(error => console.log('error', error));

      
  };

  const onRouteChange = (route) => {
    if (route === 'signout') {
      Reset()
    } else if (route === 'home') {
      setSign(true);
    }
    setRoute(route);
  }

  return (
    <div className="App">

      <Particles className="particles"
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
      />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === 'home' ?
        <div>
          <Logo />
          <Rank name={user.name} entries={entries}/>
          <ImageLinkForm onInputChange={onInputChange} onSubmit={onSubmit} />
          <FaceRecognition boxes={boxes} imageURL={imageURL} />
        </div>

        : (
          route === 'signin' ?
            <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
            : <Register loadUser={loadUser} onRouteChange={onRouteChange} />
        )


      }
    </div>

  );
}



export default App;
