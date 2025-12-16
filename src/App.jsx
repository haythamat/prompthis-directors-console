import React, { useState, useEffect, useRef } from 'react';
import { Copy, RefreshCw, Video, Image as ImageIcon, Cpu, Layers, Check, Focus, Zap, Edit3, MapPin, Users, Sparkles, Wand2, Code, ArrowRight, X, Film, Aperture, Palette, AlertCircle } from 'lucide-react';

// --- UTILS: Normalization & Parsing ---
const withRef = (arr) => [...arr, "[ 📷 Reference Image ]"];

const isRef = (val) => val === "[ 📷 Reference Image ]";

const cleanLabel = (val) => {
  if (!val) return "";
  if (isRef(val)) return "from reference image";
  // Remove content in parenthesis e.g. "35mm (Storyteller)" -> "35mm"
  return val.split(' (')[0];
};

const parseNumber = (str) => {
  if (!str || isRef(str)) return null;
  const match = str.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
};

const parseAR = (val) => {
  if (!val || isRef(val)) return "16:9";
  // Extracts "16:9" from "16:9 (Standard)"
  const match = val.match(/(\d+(\.\d+)?):(\d+(\.\d+)?)/);
  return match ? match[0] : "16:9";
};

const getRandomOption = (arr) => {
  // Safe filtering: Exclude reference tags, ensure array is valid
  if (!Array.isArray(arr)) return "";
  const validOptions = arr.filter((x) => !isRef(x));
  if (validOptions.length === 0) return "";
  return validOptions[Math.floor(Math.random() * validOptions.length)];
};

// --- DATA: THE DIRECTOR'S SUITE V6.2 FIXED ---
const options = {
  // 1. Format
  useCase: withRef([
    "Cinematic Feature Film Shot", "High-End TV Commercial", "Music Video Visualizer", "Documentary Footage", 
    "Video Game Cutscene (Unreal 5)", "Abstract Art Installation", "Social Media Viral Hook"
  ]),
  aspectRatio: withRef(["2.39:1 (Anamorphic)", "16:9 (Standard)", "9:16 (Vertical)", "4:3 (Classic)", "1:1 (Square)", "4:5 (Social)"]),
  resolution: withRef(["4K (UHD)", "8K (Raw)", "1080p (HD)"]),
  
  // 2. Set & Location
  locationType: withRef(["Exterior", "Interior", "Studio Set", "Abstract Void", "Urban City"]),
  scene: withRef(["Neon Tokyo Streets", "Blooming Flower Field", "Lush Green Mountains", "Post-Apocalyptic Ruins", "Medieval Throne Room", "Mars Colony", "Victorian Mansion", "California Beach", "Deep Space Station"]),
  timeOfDay: withRef(["Bright Daylight", "Golden Hour", "Blue Hour", "High Noon", "Night", "Midnight", "Dawn"]),
  weather: withRef(["Clear Sky", "Rainbow", "Heavy Rain", "Fog & Mist", "Snowstorm", "Sandstorm", "Overcast"]),

  // 3. Subject
  charCount: withRef(["Single Subject", "Two Subjects", "Small Group", "Large Crowd", "No Humans"]),
  gender: withRef(["Female", "Male", "Non-Binary"]),
  age: withRef(["Baby", "Child", "Teenager", "20s", "30s", "Middle Aged", "Elderly"]),
  ethnicity: withRef(["Japanese", "White (Blond)", "White (Dark Hair)", "African", "Arabic", "Latino", "Indian", "Native American", "Fantasy"]),
  
  characters: withRef(["Gritty Soldier", "Cyberpunk Android", "Ethereal Model", "Samurai Warrior", "Modern Dancer", "Astronaut", "Office Worker", "Doctor", "Floating Girl"]),
  wardrobe: withRef(["Casual T-Shirt/Jeans", "Formal Suit/Gown", "Sci-Fi Armor", "Traditional Robes", "Tactical Gear", "Vintage 80s", "Distressed"]),
  accessories: withRef(["None", "Earrings", "Necklace", "Glasses", "Backpack", "Cybernetics"]),

  nonHumanSubjects: withRef(["Futuristic Vehicle", "Ancient Artifact", "Exotic Flower", "Glass Sculpture", "Cybernetic Weapon", "Haunted Doll", "Floating Monolith", "Delicious Food"]),
  nonHumanActions: withRef(["Stationary", "Floating", "Falling", "Spinning", "Exploding", "Melting", "Blooming", "Pulsing"]),

  // 4. Camera
  framing: withRef(["Medium Shot", "Wide Shot", "Extreme Wide", "Close-Up", "Extreme Close-Up", "Cowboy Shot", "Two Shot"]),
  angle: withRef(["Eye-Level", "Low Angle", "High Angle", "Overhead", "Dutch Angle", "Ground Level"]),
  perspective: withRef(["Frontal View", "Side Profile", "From Behind", "Over-The-Shoulder", "POV", "Snorriecam", "Third-Person View"]),
  movement: withRef(["Static Tripod", "Push-In", "Pull-Out", "Tracking Shot", "Fly-Through", "Glide Over", "Orbit", "Handheld", "Steadicam", "Drone Flyover"]),
  lens: withRef(["35mm", "50mm", "85mm", "24mm", "Anamorphic", "Laowa Probe", "Split Diopter", "Tilt-Shift"]),

  // Optics
  iso: withRef(["ISO 100", "ISO 200", "ISO 400", "ISO 800", "ISO 1600", "ISO 3200"]),
  aperture: withRef(["f/1.4", "f/1.8", "f/2.8", "f/4", "f/5.6", "f/8", "f/11"]),
  shutter: withRef(["1/24", "1/48", "1/50", "1/96", "Slow Shutter"]),
  
  depthField: withRef(["Shallow Depth of Field", "Deep Focus", "Rack Focus", "Tilt-Shift Blur"]),
  filmGrain: withRef(["Off", "Light Grain", "Medium Grain", "Heavy Grain"]),
  vignette: withRef(["Off", "Subtle", "Strong"]),
  chromatic: withRef(["Off", "Subtle", "Strong"]),
  // Updated Option for Magic Mode compatibility
  lensEffects: withRef(["Clean Image", "Chromatic Abnormality", "Heavy Film Grain", "Vignette", "Lens Flare", "Motion Blur", "Halation (Glow)"]),

  // 5. Physics & Mood
  action: withRef(["Standing Still", "Walking", "Running", "Flying", "Fighting", "Dancing", "Driving", "Posing"]),
  motionIntensity: withRef(["Static", "Slow Motion", "Normal Speed", "Fast", "Hyper-Speed"]),
  expression: withRef(["Stoic", "Joyful", "Terrified", "Crying", "Seductive", "Focused", "Angry"]),
  
  lightingStyle: withRef(["Naturalistic", "Low-Key", "High-Key", "Film Noir", "Studio", "Rembrandt"]),
  lightSource: withRef(["Sunlight", "Street Lights", "Neon Signs", "Moonlight", "Mixed Sources", "Fire"]),
  tone: withRef(["Neutral", "Moody", "Exhilarating", "Tense", "Romantic", "Cold", "Ethereal"]),
  
  motionBlur: withRef(["Off", "Subtle Blur", "Strong Blur", "Long-Exposure"]),
  windPhysics: withRef(["Still Air", "Light Breeze", "Strong Wind", "Turbulence"]),
  bgMotion: withRef(["None", "Train Passing", "Cars Streaking", "Crowd Moving", "Trees Swaying", "Clouds Moving"]),

  // 6. Post
  visualStyle: withRef([
    "Photorealistic", "Cinematic Lighting", "Analog Film", "Hyper-realistic", "Prism Photography", 
    "Pixel Art", "3D Octane Render", "Anime Style", "Oil Painting", "Flat Design", "Cyberpunk Synthwave"
  ]),
  colorGrade: withRef(["Teal & Orange", "Bleach Bypass", "Vivid Pop", "Monochromatic", "Vintage Sepia", "Moody Dark", "Cyberpunk Neon"]),
  filmStock: withRef(["Digital Clean", "Kodak Portra 400", "Fujifilm Velvia", "VHS Tape", "16mm Film", "IMAX"]),
  audio: withRef(["No Audio", "Immersive Nature", "Epic Orchestra", "City Noise", "Deep Drones", "Voiceover", "Foley"]),
  // Added techSpecs to options to prevent undefined error
  techSpecs: withRef(["Default", "ISO 1600 / f1.8 / Slow Shutter", "ISO 100 / f8 / Fast Shutter", "VHS Tape Quality", "16mm Film Stock", "IMAX Digital"]),

  // Technicals
  duration: ["3s", "5s", "8s", "12s"],
  fps: ["24", "30", "60"],
  batchSize: ["1", "2", "3", "4"],
  videoToggle: ["No", "Yes"]
};

// --- CONFIGURATION FIXED ---
// Models structured correctly as an object with arrays for 'video' and 'image'
const models = {
  video: [
    { id: 'sora', name: 'Sora', icon: Video },
    { id: 'runway', name: 'Runway Gen-3', icon: Layers },
    { id: 'flow', name: 'Flow', icon: Aperture }, 
    { id: 'json', name: 'JSON Style', icon: Code }, 
  ],
  image: [
    { id: 'midjourney', name: 'Midjourney v6', icon: ImageIcon },
    { id: 'dalle', name: 'DALL-E 3', icon: Palette },
    { id: 'gemini', name: 'Gemini', icon: Cpu },
  ]
};

const SectionHeader = ({ icon: Icon, title, color = "text-cyan-400" }) => (
  <div className={`flex items-center gap-2 mb-3 ${color} border-b border-gray-700/50 pb-1`}>
    <Icon size={16} />
    <span className="font-extrabold text-[10px] uppercase tracking-widest">{title}</span>
  </div>
);

const SelectGroup = ({ label, value, onChange, optionsList = [], disabled = false }) => {
  // Safely check optionsList is an array to prevent crashes if undefined
  const safeList = Array.isArray(optionsList) ? optionsList : [];
  const isCustom = safeList.length > 0 && !safeList.includes(value) && value !== "";
  const inputRef = useRef(null);

  useEffect(() => {
    if (isCustom && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCustom]);

  const handleSelectChange = (e) => {
    if (e.target.value === 'CUSTOM_WRITE_OWN') {
      onChange(""); 
    } else {
      onChange(e.target.value);
    }
  };

  const resetToDefault = () => {
    if (safeList.length > 0) onChange(safeList[0]);
  };

  if (disabled) {
    return (
       <div className="mb-2 opacity-30 select-none grayscale pointer-events-none">
          <div className="flex justify-between items-center mb-1">
             <label className="block text-[9px] uppercase text-gray-600 font-bold tracking-wider">{label}</label>
          </div>
          <div className="w-full bg-[#121212] border border-gray-800 text-gray-600 text-xs rounded-md p-2 italic flex items-center gap-2">
             <X size={10} /> Disabled
          </div>
       </div>
    );
 }

  return (
    <div className="mb-2 relative">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-[9px] uppercase text-gray-500 font-bold tracking-wider">{label}</label>
        {isCustom && (
          <button onClick={resetToDefault} className="flex items-center gap-1 text-[8px] uppercase font-bold text-red-400 hover:text-red-300 transition-colors bg-red-900/20 px-1.5 py-0.5 rounded">
            <X size={8} /> Reset
          </button>
        )}
      </div>
      
      {isCustom ? (
        <div className="relative animate-in fade-in zoom-in-95 duration-200">
           <input
            ref={inputRef}
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Type custom ${label}...`}
            className="w-full bg-[#1a1a1a] border border-purple-500 text-white text-xs rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-500 shadow-md shadow-purple-900/20"
          />
          <Edit3 size={12} className="absolute right-2 top-2.5 text-purple-500 pointer-events-none" />
        </div>
      ) : (
        <div className="relative group">
          <select 
            value={value || ""} 
            onChange={handleSelectChange}
            className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-300 text-xs rounded-md p-2 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all hover:border-gray-600 appearance-none cursor-pointer"
          >
            {safeList.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
            <option value="CUSTOM_WRITE_OWN" className="font-bold text-orange-400 bg-[#151515]">
              + ✎ WRITE YOUR OWN...
            </option>
          </select>
          <div className="absolute right-2 top-3 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
             <ArrowRight size={10} className="rotate-90 text-gray-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [mediaType, setMediaType] = useState('video');
  const [targetModel, setTargetModel] = useState('sora');
  const [appMode, setAppMode] = useState('builder'); 
  
  const [magicInput, setMagicInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [magicError, setMagicError] = useState(null);

  // FIXED INITIAL STATE: Removed invalid keys (techSpecs, lensEffects)
  const [selections, setSelections] = useState({
    useCase: options.useCase[0],
    aspectRatio: options.aspectRatio[0],
    resolution: options.resolution[0],
    duration: options.duration[1],
    fps: options.fps[0],
    batchSize: options.batchSize[0],
    videoToggle: options.videoToggle[0],

    locationType: options.locationType[0],
    scene: options.scene[1],
    timeOfDay: options.timeOfDay[0],
    weather: options.weather[0],

    charCount: options.charCount[0],
    gender: options.gender[0],
    age: options.age[2],
    ethnicity: options.ethnicity[0],
    characters: options.characters[8],
    wardrobe: options.wardrobe[0],
    accessories: options.accessories[0],
    
    action: options.action[3],
    motionIntensity: options.motionIntensity[3],
    expression: options.expression[0],
    motionBlur: options.motionBlur[0],
    windPhysics: options.windPhysics[0],
    bgMotion: options.bgMotion[0],

    framing: options.framing[1],
    angle: options.angle[0],
    perspective: options.perspective[2],
    movement: options.movement[3],
    lens: options.lens[0],
    
    iso: options.iso[2],
    aperture: options.aperture[1],
    shutter: options.shutter[1],
    filmGrain: options.filmGrain[0],
    vignette: options.vignette[0],
    chromatic: options.chromatic[0],
    depthField: options.depthField[0],
    lensEffects: options.lensEffects[0], // Ensure this exists in options

    lightingStyle: options.lightingStyle[0],
    lightSource: options.lightSource[0],
    tone: options.tone[0],

    visualStyle: options.visualStyle[0],
    colorGrade: options.colorGrade[0],
    filmStock: options.filmStock[0],
    audio: options.audio[1],
    techSpecs: options.techSpecs[0], // Ensure this exists in options
    
    notes: "" 
  });

  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const promptTextareaRef = useRef(null);

  const isHuman = selections.charCount !== "No Humans";

  // Auto-resize prompt textarea to fit content
  useEffect(() => {
    if (promptTextareaRef.current) {
      promptTextareaRef.current.style.height = 'auto';
      promptTextareaRef.current.style.height = `${Math.max(200, promptTextareaRef.current.scrollHeight)}px`;
    }
  }, [prompt]);

  useEffect(() => {
    if (mediaType === 'video') setTargetModel('sora');
    else setTargetModel('midjourney');
  }, [mediaType]);

  const updateSelection = (key, value) => {
    setSelections(prev => {
      // Auto-swap behavior for No Humans
      if (key === 'charCount') {
        const newIsHuman = value !== "No Humans";
        const oldIsHuman = prev.charCount !== "No Humans";
        
        if (newIsHuman !== oldIsHuman) {
          return { 
            ...prev, 
            [key]: value,
            characters: newIsHuman ? options.characters[0] : options.nonHumanSubjects[0],
            action: newIsHuman ? options.action[0] : options.nonHumanActions[0]
          };
        }
      }
      return { ...prev, [key]: value };
    });
  };

  // --- PROMPT GENERATION LOGIC ---
  useEffect(() => {
    if (appMode === 'builder') {
      const s = selections;
      
      // 1. Subject Construction
      let charString = "";
      let demographics = null;
      let wardrobeData = null;

      if (isHuman) {
        const isGenderRef = isRef(s.gender);
        const isAgeRef = isRef(s.age);
        const isEthRef = isRef(s.ethnicity);
        const isCharRef = isRef(s.characters);
        
        charString = `${cleanLabel(s.charCount)}: ${cleanLabel(s.age)} ${cleanLabel(s.ethnicity)} ${cleanLabel(s.gender)} ${cleanLabel(s.characters)}`;
        if(isGenderRef || isAgeRef || isEthRef || isCharRef) charString += " [Use Attached Reference]";
        
        const wear = cleanLabel(s.wardrobe);
        const acc = cleanLabel(s.accessories);
        if (wear || acc) charString += ` wearing ${wear} ${acc ? `with ${acc}` : ''}.`;

        demographics = { gender: cleanLabel(s.gender), age: cleanLabel(s.age), ethnicity: cleanLabel(s.ethnicity) };
        wardrobeData = { clothing: wear, accessories: acc };
      } else {
        charString = `${cleanLabel(s.charCount)}: ${cleanLabel(s.characters)} (Object/Scenery).`;
      }

      // 2. Physics & Action
      const physicsString = isHuman 
          ? `Action: ${cleanLabel(s.action)}. Expression: ${cleanLabel(s.expression)}.`
          : `Motion: ${cleanLabel(s.action)}.`;
      
      const envString = `Physics: ${cleanLabel(s.windPhysics)}, ${cleanLabel(s.motionBlur)}. Background: ${cleanLabel(s.bgMotion)}.`;

      // 3. Technicals
      const camSpecs = `${cleanLabel(s.iso)}, ${cleanLabel(s.aperture)}, ${cleanLabel(s.shutter)}`;
      const optics = `Lens: ${cleanLabel(s.lens)}, ${cleanLabel(s.depthField)}. Effects: ${cleanLabel(s.filmGrain)}, ${cleanLabel(s.vignette)}, ${cleanLabel(s.chromatic)}.`;

      // --- OUTPUT ROUTING ---

      // A. JSON OUTPUT
      if (targetModel === 'json') {
        const jsonObj = {
          meta: { 
            use_case: cleanLabel(s.useCase), 
            resolution: cleanLabel(s.resolution), 
            aspect_ratio: cleanLabel(s.aspectRatio) 
          },
          scene: { 
            location_type: cleanLabel(s.locationType), 
            environment: cleanLabel(s.scene), 
            time: cleanLabel(s.timeOfDay), 
            weather: cleanLabel(s.weather) 
          },
          subject: { 
            description: charString,
            demographics: demographics,
            wardrobe: wardrobeData,
            action: cleanLabel(s.action), 
            expression: isHuman ? cleanLabel(s.expression) : null,
            motion_intensity: cleanLabel(s.motionIntensity)
          },
          camera: { 
            framing: cleanLabel(s.framing), 
            angle: cleanLabel(s.angle),
            perspective: cleanLabel(s.perspective),
            movement: cleanLabel(s.movement), 
            lens: cleanLabel(s.lens),
            settings: {
                iso: parseNumber(s.iso),
                aperture: parseNumber(s.aperture),
                shutter: cleanLabel(s.shutter)
            },
            optics: {
                depth_of_field: cleanLabel(s.depthField),
                grain: cleanLabel(s.filmGrain),
                vignette: cleanLabel(s.vignette),
                chromatic_aberration: cleanLabel(s.chromatic)
            }
          },
          physics: {
              wind: cleanLabel(s.windPhysics), 
              motion_blur: cleanLabel(s.motionBlur), 
              background_motion: cleanLabel(s.bgMotion)
          },
          cinematography: {
              lighting: cleanLabel(s.lightingStyle), 
              source: cleanLabel(s.lightSource), 
              tone: cleanLabel(s.tone)
          },
          post: { 
              grade: cleanLabel(s.colorGrade), 
              stock: cleanLabel(s.filmStock), 
              style: cleanLabel(s.visualStyle), 
              audio: cleanLabel(s.audio) 
          },
          technical: {
              duration: s.duration, 
              fps: s.fps
          },
          notes: s.notes
        };
        setPrompt(JSON.stringify(jsonObj, null, 2));
      } 
      
      // B. MIDJOURNEY
      else if (targetModel === 'midjourney') {
        const ar = parseAR(s.aspectRatio); 
        const mjNotes = s.notes ? `, ${s.notes}` : "";
        const vidParam = s.videoToggle === "Yes" ? "--video" : "";
        const bsParam = s.batchSize ? `--bs ${s.batchSize}` : "";
        
        setPrompt(`/imagine prompt: Cinematic shot of ${charString} ${physicsString} Located in ${cleanLabel(s.locationType)} ${cleanLabel(s.scene)}, ${cleanLabel(s.timeOfDay)}. Lighting: ${cleanLabel(s.lightingStyle)} ${cleanLabel(s.lightSource)}. Shot on ${cleanLabel(s.lens)}, ${cleanLabel(s.framing)}. Aesthetic: ${cleanLabel(s.visualStyle)}, ${cleanLabel(s.colorGrade)}${mjNotes} --ar ${ar} ${bsParam} ${vidParam} --v 6.0 --stylize 300 --q 2`);
      }

      // C. NARRATIVE
      else {
        setPrompt(`A ${cleanLabel(s.resolution)} ${cleanLabel(s.useCase)}. \n\nSCENE & ATMOSPHERE:\n${cleanLabel(s.locationType)}: ${cleanLabel(s.scene)}. Time: ${cleanLabel(s.timeOfDay)}. Weather: ${cleanLabel(s.weather)}. Tone: ${cleanLabel(s.tone)}. \n\nSUBJECT & ACTION:\n${charString} \n${physicsString} \n\nPHYSICS:\n${envString} \n\nCAMERA & OPTICS:\nShot on ${cleanLabel(s.lens)} with ${cleanLabel(s.movement)} movement. Framing: ${cleanLabel(s.framing)} from ${cleanLabel(s.angle)}. Perspective: ${cleanLabel(s.perspective)}. Settings: ${camSpecs}. \n${optics} \n\nLIGHTING & STYLE:\nLighting: ${cleanLabel(s.lightingStyle)} (${cleanLabel(s.lightSource)}). Style: ${cleanLabel(s.visualStyle)}. Color: ${cleanLabel(s.colorGrade)}. Stock: ${cleanLabel(s.filmStock)}. \n\nTECHNICAL:\nDuration: ${s.duration}. FPS: ${s.fps}. \n\nAUDIO:\n${cleanLabel(s.audio)}.${s.notes ? `\n\nNOTES:\n${s.notes}` : ""}`);
      }
    }
  }, [selections, mediaType, targetModel, appMode, isHuman]);

  // Magic Writer Logic - Uses secure backend API proxy
  const handleMagicRewrite = async () => {
    if (!magicInput.trim()) return;
    setIsGenerating(true);
    setMagicError(null);
    const systemInstruction = `You are a professional Prompt Engineer for ${targetModel}. Rewrite user input into a detailed technical prompt.`;

    try {
      // Call our secure backend API proxy instead of directly calling Gemini
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: `User Idea: ${magicInput}\n\nTarget Model: ${targetModel}\n\nRephrase:` 
            }] 
          }],
          systemInstruction: systemInstruction
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (generatedText) {
        setPrompt(generatedText);
        setMagicError(null);
      } else {
        throw new Error('No response from AI');
      }
    } catch (err) {
      console.error('Magic Writer error:', err);
      setMagicError(err.message || 'Failed to generate prompt');
      // Fallback to simulated output if API fails
      setPrompt(`(AI Enhanced ${targetModel.toUpperCase()} Prompt)\nBased on: "${magicInput}"\n\nA cinematic masterpiece featuring detailed subject matter... [Simulated AI Output - API Error: ${err.message}]`);
    } finally {
      setIsGenerating(false);
    }
  };

  const randomize = () => {
    const newSelections = { ...selections };
    Object.keys(options).forEach(key => {
      if (Array.isArray(options[key])) {
         newSelections[key] = getRandomOption(options[key]);
      }
    });
    if (newSelections.charCount === "No Humans") {
        newSelections.characters = options.nonHumanSubjects[0];
        newSelections.action = options.nonHumanActions[0];
    }
    newSelections.notes = ""; 
    setSelections(newSelections);
  };

  const copyToClipboard = () => {
    // Fallback for iframe restrictions
    const textArea = document.createElement("textarea");
    textArea.value = prompt;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  };

  const renderSelect = (id, label, list, disabled = false) => (
    <SelectGroup 
      label={label} 
      value={selections[id]} 
      onChange={(v) => updateSelection(id, v)} 
      optionsList={list} 
      disabled={disabled} 
    />
  );

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 p-2 md:p-6 font-sans selection:bg-orange-500 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-6 border-b border-gray-800 pb-4">
          <div className="w-full md:w-auto">
            {/* Modified Header Structure */}
            <div className="text-[10px] md:text-xs font-bold text-gray-500 tracking-[0.3em] uppercase mb-0 pl-1">
              Bashar Alasaad's
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-600 drop-shadow-sm mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
              PROMPTHIS
            </h1>
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold bg-white text-black px-1.5 py-0.5 rounded-sm">DIRECTOR'S CONSOLE v6.2</span>
                <p className="text-gray-500 text-xs tracking-wide">Professional Cinematic Control Suite</p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto items-center">
             {appMode === 'builder' && (
               <button onClick={randomize} className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-gray-300 rounded text-xs font-bold uppercase tracking-wider transition-all border border-gray-700">
                 <RefreshCw size={14} /> Inspire Me
               </button>
             )}
          </div>
        </header>

        {/* CONTROLS */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
           <div className="flex bg-[#1e1e1e] p-1 rounded-lg border border-gray-800">
             <button onClick={() => setAppMode('builder')} className={`px-6 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all ${appMode === 'builder' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-500'}`}>
               <Layers size={14} /> BUILDER
             </button>
             <button onClick={() => setAppMode('magic')} className={`px-6 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all ${appMode === 'magic' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'text-gray-500'}`}>
               <Wand2 size={14} /> MAGIC WRITER
             </button>
           </div>
           <div className="flex bg-[#1e1e1e] p-1 rounded-lg border border-gray-800">
             <button onClick={() => setMediaType('video')} className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all ${mediaType === 'video' ? 'bg-orange-600 text-white' : 'text-gray-500'}`}>
               <Video size={14} /> VIDEO
             </button>
             <button onClick={() => setMediaType('image')} className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all ${mediaType === 'image' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>
               <ImageIcon size={14} /> IMAGE
             </button>
           </div>
           <div className="flex gap-2 overflow-x-auto p-1 scrollbar-hide">
              {(mediaType === 'video' ? models.video : models.image).map((m) => {
                const Icon = m.icon;
                return (
                  <button key={m.id} onClick={() => setTargetModel(m.id)} className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded border text-[10px] font-bold uppercase tracking-wide transition-all ${targetModel === m.id ? 'bg-[#2a2a2a] border-gray-500 text-white' : 'bg-transparent border-gray-800 text-gray-600'}`}>
                    <Icon size={12} /> {m.name}
                  </button>
                );
              })}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* MAIN FORM */}
          <div className="lg:col-span-8 space-y-4">
            {appMode === 'builder' ? (
              <>
              {/* 1. SET & LOCATION */}
              <div className="bg-[#181818] p-4 rounded-lg border border-gray-800 shadow-lg">
                <SectionHeader icon={MapPin} title="Set & Atmosphere" color="text-green-500" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {renderSelect("locationType", "Type", options.locationType)}
                    {renderSelect("scene", "Environment", options.scene)}
                    {renderSelect("timeOfDay", "Time", options.timeOfDay)}
                    {renderSelect("weather", "Weather", options.weather)}
                </div>
              </div>

              {/* 2. CAMERA & OPTICS */}
              <div className="bg-[#181818] p-4 rounded-lg border border-gray-800 shadow-lg">
                <SectionHeader icon={Focus} title="Camera & Optics" color="text-red-500" />
                <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {renderSelect("framing", "Framing", options.framing)}
                        {renderSelect("lens", "Lens / Focal", options.lens)}
                        {renderSelect("angle", "Camera Angle", options.angle)}
                        {renderSelect("perspective", "Perspective", options.perspective)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-gray-800 pt-3">
                        {renderSelect("movement", "Movement", options.movement)}
                        {renderSelect("depthField", "Depth/Focus", options.depthField)}
                        {renderSelect("iso", "ISO", options.iso)}
                        {renderSelect("aperture", "Aperture", options.aperture)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-gray-800 pt-3">
                        {renderSelect("shutter", "Shutter", options.shutter)}
                        {renderSelect("filmGrain", "Grain", options.filmGrain)}
                        {renderSelect("vignette", "Vignette", options.vignette)}
                        {renderSelect("chromatic", "Abnormality", options.chromatic)}
                    </div>
                </div>
              </div>

              {/* 3. CAST & ACTION */}
              <div className="bg-[#181818] p-4 rounded-lg border border-gray-800 shadow-lg">
                  <SectionHeader icon={Users} title="Cast & Action" color="text-yellow-500" />
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                          {renderSelect("charCount", "Cast Size", options.charCount)}
                          {renderSelect("characters", isHuman ? "Role" : "Subject", isHuman ? options.characters : options.nonHumanSubjects)}
                      </div>
                      
                      {isHuman && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-[#151515] rounded border border-gray-800/50">
                            {renderSelect("gender", "Gender", options.gender)}
                            {renderSelect("age", "Age", options.age)}
                            {renderSelect("ethnicity", "Ethnicity", options.ethnicity)}
                            {renderSelect("wardrobe", "Wardrobe", options.wardrobe)}
                            <div className="col-span-2 md:col-span-4">
                                {renderSelect("accessories", "Accessories", options.accessories)}
                            </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {renderSelect("action", isHuman ? "Action" : "Motion", isHuman ? options.action : options.nonHumanActions)}
                          {renderSelect("motionIntensity", "Intensity", options.motionIntensity)}
                          {renderSelect("expression", "Expression", options.expression, !isHuman)}
                      </div>
                  </div>
              </div>

              {/* 4. CINEMATOGRAPHY & PHYSICS */}
              <div className="bg-[#181818] p-4 rounded-lg border border-gray-800 shadow-lg">
                  <SectionHeader icon={Film} title="Cinematography & Physics" color="text-purple-500" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {renderSelect("lightingStyle", "Lighting", options.lightingStyle)}
                      {renderSelect("lightSource", "Source", options.lightSource)}
                      {renderSelect("tone", "Tone", options.tone)}
                      {renderSelect("windPhysics", "Wind", options.windPhysics)}
                      {renderSelect("motionBlur", "Blur", options.motionBlur)}
                      {renderSelect("bgMotion", "BG Motion", options.bgMotion)}
                  </div>
              </div>

              {/* 5. POST & TECHNICAL */}
              <div className="bg-[#181818] p-4 rounded-lg border border-gray-800 shadow-lg">
                  <SectionHeader icon={Zap} title="Post & Technical" color="text-blue-500" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {renderSelect("visualStyle", "Style", options.visualStyle)}
                      {renderSelect("colorGrade", "Grade", options.colorGrade)}
                      {renderSelect("filmStock", "Stock", options.filmStock)}
                      {renderSelect("audio", "Audio", options.audio)}
                  </div>
                  {/* Tech Specs */}
                  {targetModel === 'midjourney' ? (
                     <div className="grid grid-cols-4 gap-3 mt-3 pt-3 border-t border-gray-800">
                        {renderSelect("batchSize", "--bs", options.batchSize)}
                        {renderSelect("videoToggle", "--video", options.videoToggle)}
                     </div>
                  ) : (
                     <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-800">
                        {renderSelect("duration", "Duration", options.duration)}
                        {renderSelect("fps", "FPS", options.fps)}
                     </div>
                  )}
              </div>

              {/* 6. NOTES */}
              <div className="bg-[#181818] p-4 rounded-lg border border-gray-800 shadow-lg">
                  <SectionHeader icon={Edit3} title="Director's Notes" color="text-gray-400" />
                  <textarea 
                    value={selections.notes}
                    onChange={(e) => updateSelection('notes', e.target.value)}
                    placeholder="Specific details..."
                    className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-300 text-xs rounded-md p-3 focus:ring-1 focus:ring-orange-500 outline-none h-16 resize-none"
                  />
              </div>
              </>
            ) : (
              // MAGIC MODE
              <div className="bg-[#181818] p-6 rounded-lg border border-purple-500/30 shadow-lg h-full flex flex-col relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={120} /></div>
                 <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Wand2 className="text-purple-500" /> Magic Writer</h2>
                 <p className="text-gray-400 text-sm mb-4">Describe your vision naturally. The AI will convert it into a structured technical prompt.</p>
                 {magicError && (
                   <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-2">
                     <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                     <div className="flex-1">
                       <p className="text-red-400 text-xs font-bold mb-1">API Error</p>
                       <p className="text-red-300 text-xs">{magicError}</p>
                       <p className="text-red-400/70 text-[10px] mt-2">Make sure GEMINI_API_KEY is set in Vercel environment variables.</p>
                     </div>
                   </div>
                 )}
                 <textarea 
                   className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl p-4 text-white focus:border-purple-500 outline-none h-48 mb-4 resize-none"
                   placeholder="e.g. A cyberpunk samurai crying in the rain, neon lights, very sad..."
                   value={magicInput}
                   onChange={(e) => {
                     setMagicInput(e.target.value);
                     if (magicError) setMagicError(null);
                   }}
                 />
                 <div className="flex justify-end gap-3">
                    <button onClick={() => {
                      setMagicInput("");
                      setMagicError(null);
                    }} className="px-4 py-2 text-gray-500 hover:text-white transition-colors">Clear</button>
                    <button onClick={handleMagicRewrite} disabled={isGenerating || !magicInput.trim()} className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${isGenerating ? 'bg-purple-900 text-gray-400' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg'}`}>
                      {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                      {isGenerating ? "Rewriting..." : "Enhance with AI"}
                    </button>
                 </div>
              </div>
            )}
          </div>

          {/* RIGHT PREVIEW */}
          <div className="lg:col-span-4">
            <div className="sticky top-4">
              <div className={`p-[1px] rounded-xl shadow-2xl ${mediaType === 'video' ? 'bg-gradient-to-b from-orange-600 to-red-900' : 'bg-gradient-to-b from-blue-600 to-purple-900'}`}>
                <div className="bg-[#0f0f0f] rounded-xl p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
                     <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${mediaType === 'video' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}></div>
                         <h2 className="text-xs font-bold text-white tracking-widest">MONITOR</h2>
                     </div>
                     <span className="text-[9px] font-mono text-gray-500 bg-[#1a1a1a] px-2 py-1 rounded">
                       {targetModel.toUpperCase()}
                     </span>
                  </div>
                  <div className="relative min-h-[200px] max-h-[calc(100vh-300px)] overflow-auto custom-scrollbar">
                      <textarea 
                        ref={promptTextareaRef}
                        readOnly
                        value={prompt}
                        className="w-full min-h-[200px] bg-transparent text-green-400 font-mono text-xs leading-relaxed focus:outline-none resize-none custom-scrollbar"
                        style={{ minHeight: '200px' }}
                      />
                  </div>
                  <div className="mt-4 space-y-3">
                      <button
                        onClick={copyToClipboard}
                        className={`w-full py-3 rounded font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 ${copied ? 'bg-green-600 text-white' : mediaType === 'video' ? 'bg-orange-600 hover:bg-orange-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                      >
                        {copied ? <><Check size={16} /> COPIED</> : <><Copy size={16} /> COPY PROMPT</>}
                      </button>
                      <div className="flex items-start gap-2 text-[10px] text-gray-500 bg-[#151515] p-2 rounded border border-gray-800">
                        <AlertCircle size={12} className="flex-shrink-0 mt-0.5 text-gray-400" />
                        <p>
                          {appMode === 'magic' ? 'AI Generated Prompt. Edit in the text box if needed.' : 'Builder Mode active. Change dropdowns to update.'}
                        </p>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

