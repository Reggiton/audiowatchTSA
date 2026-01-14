const YAMNET_CLASSES = [
  "Speech", "Child speech, kid speaking", "Conversation", "Narration, monologue", "Babbling", "Speech synthesizer",
  "Shout", "Bellow", "Whoop", "Yell", "Children shouting", "Screaming", "Whispering", "Laughter", "Baby laughter",
  "Giggle", "Snicker", "Belly laugh", "Chuckle, chortle", "Crying, sobbing", "Baby cry, infant cry", "Whimper",
  "Wail, moan", "Sigh", "Singing", "Choir", "Yodeling", "Chant", "Mantra", "Child singing", "Synthetic singing",
  "Rapping", "Humming", "Groan", "Grunt", "Whistling", "Breathing", "Wheeze", "Snoring", "Gasp", "Pant",
  "Snort", "Cough", "Throat clearing", "Sneeze", "Sniff", "Run", "Shuffle", "Walk, footsteps", "Chewing, mastication",
  "Biting", "Gargling", "Stomach rumble", "Burping, eructation", "Hiccup", "Fart", "Hands", "Finger snapping",
  "Clapping", "Heart sounds, heartbeat", "Heart murmur", "Cheering", "Applause", "Chatter", "Crowd", "Hubbub, speech noise, speech babble",
  "Children playing", "Animal", "Domestic animals, pets", "Dog", "Bark", "Yip", "Howl", "Bow-wow",
  "Growling", "Whimper (dog)", "Cat", "Purr", "Meow", "Hiss", "Caterwaul", "Livestock, farm animals, working animals",
  "Horse", "Clip-clop", "Neigh, whinny", "Cattle, bovinae", "Moo", "Cowbell", "Pig", "Oink",
  "Goat", "Bleat", "Sheep", "Fowl", "Chicken, rooster", "Cluck", "Crowing, cock-a-doodle-doo", "Turkey",
  "Gobble", "Duck", "Quack", "Goose", "Honk", "Wild animals", "Roaring cats (lions, tigers)", "Roar",
  "Bird", "Bird vocalization, bird call, bird song", "Chirp, tweet", "Squawk", "Pigeon, dove", "Coo", "Crow",
  "Caw", "Owl", "Hoot", "Bird flight, flapping wings", "Canidae, dogs, wolves", "Rodents, rats, mice", "Mouse",
  "Patter", "Insect", "Cricket", "Mosquito", "Fly, housefly", "Buzz", "Bee, wasp, etc.", "Frog",
  "Croak", "Snake", "Rattle", "Whale vocalization", "Music", "Musical instrument", "Plucked string instrument", "Guitar",
  "Electric guitar", "Bass guitar", "Acoustic guitar", "Steel guitar, slide guitar", "Tapping (guitar technique)", "Strum", "Banjo", "Sitar",
  "Mandolin", "Zither", "Ukulele", "Keyboard (musical)", "Piano", "Electric piano", "Organ", "Electronic organ",
  "Hammond organ", "Synthesizer", "Sampler", "Harpsichord", "Percussion", "Drum kit", "Drum machine", "Drum",
  "Snare drum", "Rimshot", "Drum roll", "Bass drum", "Timpani", "Tabla", "Cymbal", "Hi-hat",
  "Wood block", "Tambourine", "Rattle (instrument)", "Maraca", "Gong", "Tubular bells", "Mallet percussion", "Marimba, xylophone",
  "Glockenspiel", "Vibraphone", "Steelpan", "Orchestra", "Brass instrument", "French horn", "Trumpet", "Trombone",
  "Bowed string instrument", "String section", "Violin, fiddle", "Pizzicato", "Cello", "Double bass", "Wind instrument, woodwind instrument", "Flute",
  "Saxophone", "Clarinet", "Harp", "Bell", "Church bell", "Jingle bell", "Bicycle bell", "Tuning fork",
  "Chime", "Wind chime", "Change ringing (campanology)", "Harmonica", "Accordion", "Bagpipes", "Didgeridoo", "Shofar",
  "Theremin", "Singing bowl", "Scratching (performance technique)", "Pop music", "Hip hop music", "Beatboxing", "Rock music", "Heavy metal",
  "Punk rock", "Grunge", "Progressive rock", "Rock and roll", "Psychedelic rock", "Rhythm and blues", "Soul music", "Reggae",
  "Country", "Swing music", "Bluegrass", "Funk", "Folk music", "Middle Eastern music", "Jazz", "Disco",
  "Classical music", "Opera", "Electronic music", "House music", "Techno", "Dubstep", "Drum and bass", "Electronica",
  "Electronic dance music", "Ambient music", "Trance music", "Music of Latin America", "Salsa music", "Flamenco", "Blues", "Music for children",
  "New-age music", "Vocal music", "A capella", "Music of Africa", "Afrobeat", "Christian music", "Gospel music", "Music of Asia",
  "Carnatic music", "Music of Bollywood", "Ska", "Traditional music", "Independent music", "Song", "Background music", "Theme music",
  "Jingle (music)", "Soundtrack music", "Lullaby", "Video game music", "Christmas music", "Dance music", "Wedding music", "Happy music",
  "Sad music", "Tender music", "Exciting music", "Angry music", "Scary music", "Wind", "Rustling leaves", "Wind noise (microphone)",
  "Thunderstorm", "Thunder", "Water", "Rain", "Raindrop", "Rain on surface", "Stream", "Waterfall",
  "Ocean", "Waves, surf", "Steam", "Gurgling", "Fire", "Crackle", "Vehicle", "Boat, Water vehicle",
  "Sailboat, sailing ship", "Rowboat, canoe, kayak", "Motorboat, speedboat", "Ship", "Motor vehicle (road)", "Car", "Vehicle horn, car horn, honking",
  "Toot", "Car alarm", "Power windows, electric windows", "Skidding", "Tire squeal", "Car passing by", "Race car, auto racing",
  "Truck", "Air brake", "Air horn, truck horn", "Reversing beeps", "Ice cream truck, ice cream van", "Bus", "Emergency vehicle",
  "Police car (siren)", "Ambulance (siren)", "Fire engine, fire truck (siren)", "Motorcycle", "Traffic noise, roadway noise", "Rail transport", "Train",
  "Train whistle", "Train horn", "Railroad car, train wagon", "Train wheels squealing", "Subway, metro, underground", "Aircraft", "Aircraft engine",
  "Jet engine", "Propeller, airscrew", "Helicopter", "Fixed-wing aircraft, airplane", "Bicycle", "Skateboard", "Engine", "Light engine (high frequency)",
  "Dental drill, dentist's drill", "Lawn mower", "Chainsaw", "Medium engine (mid frequency)", "Heavy engine (low frequency)", "Engine knocking", "Engine starting",
  "Idling", "Accelerating, revving, vroom", "Door", "Doorbell", "Ding-dong", "Sliding door", "Slam", "Knock",
  "Tap", "Squeak", "Cupboard open or close", "Drawer open or close", "Dishes, pots, and pans", "Cutlery, silverware", "Chopping (food)",
  "Frying (food)", "Microwave oven", "Blender", "Water tap, faucet", "Sink (filling or washing)", "Bathtub (filling or washing)", "Hair dryer",
  "Toilet flush", "Toothbrush", "Electric toothbrush", "Vacuum cleaner", "Zipper (clothing)", "Keys jangling", "Coin (dropping)", "Scissors",
  "Electric shaver, electric razor", "Shuffling cards", "Typing", "Typewriter", "Computer keyboard", "Writing", "Alarm", "Telephone",
  "Telephone bell ringing", "Ringtone", "Telephone dialing, DTMF", "Dial tone", "Busy signal", "Alarm clock", "Siren", "Civil defense siren",
  "Buzzer", "Smoke detector, smoke alarm", "Fire alarm", "Foghorn", "Whistle", "Steam whistle", "Mechanisms", "Ratchet, pawl",
  "Clock", "Tick", "Tick-tock", "Gears", "Pulleys", "Sewing machine", "Mechanical fan", "Air conditioning",
  "Cash register", "Printer", "Camera", "Single-lens reflex camera", "Tools", "Hammer", "Jackhammer", "Sawing",
  "Filing (rasp)", "Sanding", "Power tool", "Drill", "Explosion", "Gunshot, gunfire", "Machine gun", "Fusillade",
  "Artillery fire", "Cap gun", "Fireworks", "Firecracker", "Burst, pop", "Eruption", "Boom", "Wood",
  "Chop", "Splinter", "Crack", "Glass", "Chink, clink", "Shatter", "Liquid", "Splash, splatter",
  "Slosh", "Squish", "Drip", "Pour", "Trickle, dribble", "Gush", "Fill (with liquid)", "Spray",
  "Pump (liquid)", "Stir", "Boiling", "Sonar", "Arrow", "Whoosh, swoosh, swish", "Thump, thud", "Thunk",
  "Electronic tuner", "Effects unit", "Chorus effect", "Basketball bounce", "Bang", "Slap, smack", "Whack, thwack", "Smash, crash",
  "Breaking", "Bouncing", "Whip", "Flap", "Scratch", "Scrape", "Rub", "Roll",
  "Crushing", "Crumpling, crinkling", "Tearing", "Beep, bleep", "Ping", "Ding", "Clang", "Squeal",
  "Creak", "Rustle", "Whir", "Clatter", "Sizzle", "Clicking", "Clickety-clack", "Rumble",
  "Plop", "Jingle, tinkle", "Hum", "Zing", "Boing", "Crunch", "Silence", "Sine wave",
  "Harmonic", "Chirp tone", "Sound effect", "Pulse", "Inside, small room", "Inside, large room or hall", "Inside, public space",
  "Outside, urban or manmade", "Outside, rural or natural", "Reverberation", "Echo", "Noise", "Environmental noise", "Static",
  "Mains hum", "Distortion", "Sidetone", "Cacophony", "White noise", "Pink noise", "Throbbing", "Vibration",
  "Television", "Radio", "Field recording"
];

class AudioClassifier {
  constructor() {
    this.classifier = null;
    this.isModelLoaded = false;
    this.audioContext = null;
    this.scriptProcessor = null;
    this.mediaStreamSource = null;
    this.userCorrections = new Map();
    this.latestResult = null;
  }

  async loadModel() {
    if (this.isModelLoaded) return true;
    
    try {
      console.log('Loading MediaPipe YAMNet model...');
      
      const audio = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0');
      const { AudioClassifier: MPAudioClassifier, FilesetResolver } = audio;
      
      const audioFileset = await FilesetResolver.forAudioTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0/wasm"
      );
      
      this.classifier = await MPAudioClassifier.createFromOptions(audioFileset, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/audio_classifier/yamnet/float32/1/yamnet.tflite"
        }
      });
      
      this.isModelLoaded = true;
      console.log('MediaPipe YAMNet model loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading MediaPipe model:', error);
      this.isModelLoaded = false;
      return false;
    }
  }

  loadUserCorrections(corrections) {
    this.userCorrections.clear();
    corrections.forEach(correction => {
      const key = `${correction.yamnet_class}`;
      this.userCorrections.set(key, correction.corrected_sound_type);
    });
  }

  async startStreamingClassification(stream, audioContext) {
    if (!this.isModelLoaded || !this.classifier) {
      console.log('Waiting for model to load...');
      await this.loadModel();
    }
    
    if (!this.isModelLoaded || !this.classifier) {
      console.error('Model failed to load');
      return false;
    }

    try {
      this.audioContext = audioContext;
      
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
      this.scriptProcessor = this.audioContext.createScriptProcessor(16384, 1, 1);
      
      this.scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
        if (!this.classifier) {
          console.log('Classifier not ready');
          return;
        }
        
        const inputBuffer = audioProcessingEvent.inputBuffer;
        const inputData = inputBuffer.getChannelData(0);
        
        const results = this.classifier.classify(inputData);
        console.log('MediaPipe classification results:', results);
        
        if (results && results.length > 0) {
          const categories = results[0].classifications[0].categories;
          console.log('Top category:', categories[0].categoryName, 'Confidence:', categories[0].score);
          
          const topCategory = categories[0];
          const categoryName = topCategory.categoryName;
          const confidence = Math.floor(topCategory.score * 100);
          
          let finalSoundType = categoryName;
          if (this.userCorrections.has(categoryName)) {
            finalSoundType = this.userCorrections.get(categoryName);
          }
          
          this.latestResult = {
            soundType: finalSoundType,
            confidence: confidence,
            rawClass: categoryName,
            allPredictions: categories.slice(0, 5).map(cat => ({
              className: cat.categoryName,
              score: cat.score,
              classIndex: cat.index || 0
            }))
          };
          console.log('Latest result stored:', this.latestResult);
        }
      };
      
      this.mediaStreamSource.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.audioContext.destination);
      
      console.log('Streaming classification started successfully');
      return true;
    } catch (error) {
      console.error('Error starting streaming classification:', error);
      return false;
    }
  }

  getLatestResult() {
    console.log('Latest result requested:', this.latestResult);
    return this.latestResult;
  }

  stopStreamingClassification() {
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect();
      this.scriptProcessor = null;
    }
    if (this.mediaStreamSource) {
      this.mediaStreamSource.disconnect();
      this.mediaStreamSource = null;
    }
    this.audioContext = null;
    this.latestResult = null;
  }

  getAllClasses() {
    return YAMNET_CLASSES;
  }

  cleanup() {
    this.stopStreamingClassification();
    if (this.classifier) {
      this.classifier.close?.();
      this.classifier = null;
    }
  }
}

export default new AudioClassifier();
