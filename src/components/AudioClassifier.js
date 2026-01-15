import { useEffect, useRef, useState } from 'react';

// YAMNet class list (521 sounds)
const YAMNET_CLASSES = [
  "Speech", "Child speech, kid speaking", "Conversation", "Narration, monologue", 
  "Babbling", "Speech synthesizer", "Shout", "Bellow", "Whoop", "Yell", 
  "Children shouting", "Screaming", "Whispering", "Laughter", "Baby laughter",
  "Giggle", "Snicker", "Belly laugh", "Chuckle, chortle", "Crying, sobbing",
  "Baby cry, infant cry", "Whimper", "Wail, moan", "Sigh", "Singing",
  "Choir", "Yodeling", "Chant", "Mantra", "Male singing",
  "Female singing", "Child singing", "Synthetic singing", "Rapping", "Humming",
  "Groan", "Grunt", "Whistling", "Breathing", "Wheeze",
  "Snoring", "Gasp", "Pant", "Snort", "Cough",
  "Throat clearing", "Sneeze", "Sniff", "Run", "Shuffle",
  "Walk, footsteps", "Chewing, mastication", "Biting", "Gargling", "Stomach rumble",
  "Burping, eructation", "Hiccup", "Fart", "Hands", "Finger snapping",
  "Clapping", "Heart sounds, heartbeat", "Heart murmur", "Cheering", "Applause",
  "Chatter", "Crowd", "Hubbub, speech noise, speech babble", "Children playing", "Animal",
  "Domestic animals, pets", "Dog", "Bark", "Yip", "Howl",
  "Bow-wow", "Growling", "Whimper (dog)", "Cat", "Purr",
  "Meow", "Hiss", "Caterwaul", "Livestock, farm animals, working animals", "Horse",
  "Clip-clop", "Neigh, whinny", "Cattle, bovinae", "Moo", "Cowbell",
  "Pig", "Oink", "Goat", "Bleat", "Sheep",
  "Fowl", "Chicken, rooster", "Cluck", "Crowing, cock-a-doodle-doo", "Turkey",
  "Gobble", "Duck", "Quack", "Goose", "Honk",
  "Wild animals", "Roaring cats (lions, tigers)", "Roar", "Bird", "Bird vocalization, bird call, bird song",
  "Chirp, tweet", "Squawk", "Pigeon, dove", "Coo", "Crow",
  "Caw", "Owl", "Hoot", "Bird flight, flapping wings", "Canidae, dogs, wolves",
  "Rodents, rats, mice", "Mouse", "Patter", "Insect", "Cricket",
  "Mosquito", "Fly, housefly", "Buzz", "Bee, wasp, etc.", "Frog",
  "Croak", "Snake", "Rattle", "Whale vocalization", "Music",
  "Musical instrument", "Plucked string instrument", "Guitar", "Electric guitar", "Bass guitar",
  "Acoustic guitar", "Steel guitar, slide guitar", "Tapping (guitar technique)", "Strum", "Banjo",
  "Sitar", "Mandolin", "Zither", "Ukulele", "Keyboard (musical)",
  "Piano", "Electric piano", "Organ", "Electronic organ", "Hammond organ",
  "Synthesizer", "Sampler", "Harpsichord", "Percussion", "Drum kit",
  "Drum machine", "Drum", "Snare drum", "Rimshot", "Drum roll",
  "Bass drum", "Timpani", "Tabla", "Cymbal", "Hi-hat",
  "Wood block", "Tambourine", "Rattle (instrument)", "Maraca", "Gong",
  "Tubular bells", "Mallet percussion", "Marimba, xylophone", "Glockenspiel", "Vibraphone",
  "Steelpan", "Orchestra", "Brass instrument", "French horn", "Trumpet",
  "Trombone", "Bowed string instrument", "String section", "Violin, fiddle", "Pizzicato",
  "Cello", "Double bass", "Wind instrument, woodwind instrument", "Flute", "Saxophone",
  "Clarinet", "Harp", "Bell", "Church bell", "Jingle bell",
  "Bicycle bell", "Tuning fork", "Chime", "Wind chime", "Change ringing (campanology)",
  "Harmonica", "Accordion", "Bagpipes", "Didgeridoo", "Shofar",
  "Theremin", "Singing bowl", "Scratching (performance technique)", "Pop music", "Hip hop music",
  "Beatboxing", "Rock music", "Heavy metal", "Punk rock", "Grunge",
  "Progressive rock", "Rock and roll", "Psychedelic rock", "Rhythm and blues", "Soul music",
  "Reggae", "Country", "Swing music", "Bluegrass", "Funk",
  "Folk music", "Middle Eastern music", "Jazz", "Disco", "Classical music",
  "Opera", "Electronic music", "House music", "Techno", "Dubstep",
  "Drum and bass", "Electronica", "Electronic dance music", "Ambient music", "Trance music",
  "Music of Latin America", "Salsa music", "Flamenco", "Blues", "Music for children",
  "New-age music", "Vocal music", "A capella", "Music of Africa", "Afrobeat",
  "Christian music", "Gospel music", "Music of Asia", "Carnatic music", "Music of Bollywood",
  "Ska", "Traditional music", "Independent music", "Song", "Background music",
  "Theme music", "Jingle (music)", "Soundtrack music", "Lullaby", "Video game music",
  "Christmas music", "Dance music", "Wedding music", "Happy music", "Sad music",
  "Tender music", "Exciting music", "Angry music", "Scary music", "Wind",
  "Rustling leaves", "Wind noise (microphone)", "Thunderstorm", "Thunder", "Water",
  "Rain", "Raindrop", "Rain on surface", "Stream", "Waterfall",
  "Ocean", "Waves, surf", "Steam", "Gurgling", "Fire",
  "Crackle", "Vehicle", "Boat, Water vehicle", "Sailboat, sailing ship", "Rowboat, canoe, kayak",
  "Motorboat, speedboat", "Ship", "Motor vehicle (road)", "Car", "Vehicle horn, car horn, honking",
  "Toot", "Car alarm", "Power windows, electric windows", "Skidding", "Tire squeal",
  "Car passing by", "Race car, auto racing", "Truck", "Air brake", "Air horn, truck horn",
  "Reversing beeps", "Ice cream truck, ice cream van", "Bus", "Emergency vehicle", "Police car (siren)",
  "Ambulance (siren)", "Fire engine, fire truck (siren)", "Motorcycle", "Traffic noise, roadway noise", "Rail transport",
  "Train", "Train whistle", "Train horn", "Railroad car, train wagon", "Train wheels squealing",
  "Subway, metro, underground", "Aircraft", "Aircraft engine", "Jet engine", "Propeller, airscrew",
  "Helicopter", "Fixed-wing aircraft, airplane", "Bicycle", "Skateboard", "Engine",
  "Light engine (high frequency)", "Dental drill, dentist's drill", "Lawn mower", "Chainsaw", "Medium engine (mid frequency)",
  "Heavy engine (low frequency)", "Engine knocking", "Engine starting", "Idling", "Accelerating, revving, vroom",
  "Door", "Doorbell", "Ding-dong", "Sliding door", "Slam",
  "Knock", "Tap", "Squeak", "Cupboard open or close", "Drawer open or close",
  "Dishes, pots, and pans", "Cutlery, silverware", "Chopping (food)", "Frying (food)", "Microwave oven",
  "Blender", "Water tap, faucet", "Sink (filling or washing)", "Bathtub (filling or washing)", "Hair dryer",
  "Toilet flush", "Toothbrush", "Electric toothbrush", "Vacuum cleaner", "Zipper (clothing)",
  "Keys jangling", "Coin (dropping)", "Scissors", "Electric shaver, electric razor", "Shuffling cards",
  "Typing", "Typewriter", "Computer keyboard", "Writing", "Alarm clock",
  "Telephone", "Telephone bell ringing", "Ringtone", "Telephone dialing, DTMF", "Dial tone",
  "Busy signal", "Alarm", "Siren", "Civil defense siren", "Buzzer",
  "Smoke detector, smoke alarm", "Fire alarm", "Foghorn", "Whistle", "Steam whistle",
  "Mechanisms", "Ratchet, pawl", "Clock", "Tick", "Tick-tock",
  "Gears", "Pulleys", "Sewing machine", "Mechanical fan", "Air conditioning",
  "Cash register", "Printer", "Camera", "Single-lens reflex camera", "Tools",
  "Hammer", "Jackhammer", "Sawing", "Filing (rasp)", "Sanding",
  "Power tool", "Drill", "Explosion", "Gunshot, gunfire", "Machine gun",
  "Fusillade", "Artillery fire", "Cap gun", "Fireworks", "Firecracker",
  "Burst, pop", "Eruption", "Boom", "Wood", "Chop",
  "Splinter", "Crack", "Glass", "Chink, clink", "Shatter",
  "Liquid", "Splash, splatter", "Slosh", "Squish", "Drip",
  "Pour", "Trickle, dribble", "Gush", "Fill (with liquid)", "Spray",
  "Pump (liquid)", "Stir", "Boiling", "Sonar", "Arrow",
  "Whoosh, swoosh, swish", "Thump, thud", "Thunk", "Electronic tuner", "Effects unit",
  "Chorus effect", "Basketball bounce", "Bang", "Slap, smack", "Whack, thwack",
  "Smash, crash", "Breaking", "Bouncing", "Whip", "Flap",
  "Scratch", "Scrape", "Rub", "Roll", "Crushing",
  "Crumpling, crinkling", "Tearing", "Beep, bleep", "Ping", "Ding",
  "Clang", "Squeal", "Creak", "Rustle", "Whir",
  "Clatter", "Sizzle", "Clicking", "Clickety-clack", "Rumble",
  "Plop", "Jingle, tinkle", "Hum", "Zing", "Boing",
  "Crunch", "Silence", "Sine wave", "Harmonic", "Chirp tone",
  "Sound effect", "Pulse", "Inside, small room", "Inside, large room or hall", "Inside, public space",
  "Outside, urban or manmade", "Outside, rural or natural", "Reverberation", "Echo", "Noise",
  "Environmental noise", "Static", "Mains hum", "Distortion", "Sidetone",
  "Cacophony", "White noise", "Pink noise", "Throbbing", "Vibration",
  "Television", "Radio", "Field recording"
];

let audioClassifier = null;
let isInitialized = false;

const initializeClassifier = async () => {
  if (isInitialized) return audioClassifier;
  
  try {
    const { AudioClassifier, FilesetResolver } = await import(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0'
    );
    
    const audio = await FilesetResolver.forAudioTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0/wasm'
    );
    
    audioClassifier = await AudioClassifier.createFromOptions(audio, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/audio_classifier/yamnet/float32/1/yamnet.tflite'
      }
    });
    
    isInitialized = true;
    return audioClassifier;
  } catch (error) {
    console.error('Failed to initialize audio classifier:', error);
    throw error;
  }
};

export default function AudioClassifier({ onClassification, onAudioLevel, isListening, enabledSounds = [] }) {
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const scriptNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isListeningRef = useRef(isListening);

  // Keep track of isListening in a ref so callbacks can access the latest value
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    // Cleanup function to stop everything
    const cleanup = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (scriptNodeRef.current) {
        scriptNodeRef.current.onaudioprocess = null; // CRITICAL - stop the callback
        scriptNodeRef.current.disconnect();
        scriptNodeRef.current = null;
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (onAudioLevel) {
        onAudioLevel(0);
      }
    };

    // If not listening, cleanup immediately and return
    if (!isListening) {
      cleanup();
      return;
    }

    const setup = async () => {
      if (!isListeningRef.current) return;
      
      setIsInitializing(true);
      setError(null);

      try {
        await initializeClassifier();

        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        streamRef.current = stream;

        const audioContext = new AudioContext({ sampleRate: 16000 });
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        sourceRef.current = source;

        // Create analyser for audio level visualization
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyserRef.current = analyser;

        const scriptNode = audioContext.createScriptProcessor(16384, 1, 1);
        scriptNodeRef.current = scriptNode;

        scriptNode.onaudioprocess = (audioProcessingEvent) => {
          // Check if still listening - CRITICAL for privacy
          if (!isListeningRef.current || !audioClassifier) return;

          const inputBuffer = audioProcessingEvent.inputBuffer;
          const inputData = inputBuffer.getChannelData(0);

          try {
            const results = audioClassifier.classify(inputData);
            
            if (results && results.length > 0) {
              const classifications = results[0].classifications[0].categories;
              
              const topPredictions = classifications.slice(0, 3).map(cat => ({
                label: cat.categoryName,
                confidence: cat.score
              }));

              const detectedSound = topPredictions.find(pred => 
                pred.confidence > 0.5 && enabledSounds.includes(pred.label)
              );

              if (onClassification) {
                onClassification({
                  predictions: topPredictions,
                  detectedSound: detectedSound ? detectedSound.label : null,
                  confidence: detectedSound ? detectedSound.confidence : 0,
                  timestamp: Date.now()
                });
              }
            }
          } catch (classifyError) {
            console.error('Classification error:', classifyError);
          }
        };

        // Connect audio pipeline
        // IMPORTANT: Connect in series for proper audio flow
        source.connect(scriptNode);
        source.connect(analyser);
        scriptNode.connect(audioContext.destination);

        // Start audio level monitoring
        const updateAudioLevel = () => {
          // Check if still listening - CRITICAL for privacy
          if (!analyserRef.current || !isListeningRef.current) {
            if (onAudioLevel) onAudioLevel(0);
            return;
          }

          const dataArray = new Uint8Array(analyserRef.current.fftSize);
          analyserRef.current.getByteTimeDomainData(dataArray);

          // Calculate RMS (Root Mean Square) for better audio level
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const normalized = (dataArray[i] - 128) / 128;
            sum += normalized * normalized;
          }
          const rms = Math.sqrt(sum / dataArray.length);
          const normalizedLevel = Math.min(rms * 3, 1); // Amplify by 3x for better visibility

          if (onAudioLevel) {
            console.log('Sending audio level:', normalizedLevel); // DEBUG
            onAudioLevel(normalizedLevel);
          }

          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        };
        updateAudioLevel();

        setIsInitializing(false);
      } catch (err) {
        console.error('Setup error:', err);
        setError(err.message);
        setIsInitializing(false);
        cleanup();
      }
    };

    setup();

    return cleanup;
  }, [isListening, onClassification, onAudioLevel, enabledSounds]);

  return null;
}

AudioClassifier.getAllClasses = () => YAMNET_CLASSES;
