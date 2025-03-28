import React, { useState, useEffect } from 'react';

const EnhancedCharacterAvatar = ({
  // Basic appearance
  gender = 'female',
  ageRange = 'adult', // child, teen, adult, senior
  hairColor = '#5A3825',
  skinTone = '#F5D0B9',
  eyeColor = '#3B6D9A',
  hairStyle = 'long', // short, medium, long, bald
  faceShape = 'oval', // round, oval, square, heart
  
  // Facial features
  hasGlasses = false,
  glassesShape = 'round', // round, square, cat-eye
  glassesColor = '#333333',
  hasFacialHair = false,
  facialHairStyle = 'none', // none, beard, mustache, goatee
  facialHairColor = '#5A3825',
  
  // Accessories
  hasEarrings = false,
  earringsColor = '#FFD700',
  hasHat = false,
  hatStyle = 'none', // none, beanie, cap, wide-brim
  hatColor = '#4A7BA6',
  
  // Expressions
  expression = 'neutral', // neutral, happy, sad, surprised, angry
  speaking = false,
  blinking = false,
  mouthOpenness = 0,
  
  // Animation settings
  enableBlinking = true,
  enableBreathing = true
}) => {
  // State for animations
  const [isBlinking, setIsBlinking] = useState(blinking);
  const [breathScale, setBreathScale] = useState(1);
  const [randomMouthOpen, setRandomMouthOpen] = useState(speaking ? mouthOpenness : 0);
  
  // Blink animation
  useEffect(() => {
    if (!enableBlinking) return;
    
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, Math.random() * 3000 + 2000); // Random blink between 2-5 seconds
    
    return () => clearInterval(blinkInterval);
  }, [enableBlinking]);
  
  // Breathing animation
  useEffect(() => {
    if (!enableBreathing) return;
    
    let direction = 0.0005;
    const breathingInterval = setInterval(() => {
      setBreathScale(prev => {
        const newScale = prev + direction;
        if (newScale > 1.01 || newScale < 0.99) {
          direction = -direction;
        }
        return newScale;
      });
    }, 50);
    
    return () => clearInterval(breathingInterval);
  }, [enableBreathing]);
  
  // Speaking animation
  useEffect(() => {
    if (!speaking) {
      setRandomMouthOpen(0);
      return;
    }
    
    const speakingInterval = setInterval(() => {
      setRandomMouthOpen(Math.random() * 0.8 + 0.2); // Random value between 0.2 and 1
    }, 150);
    
    return () => clearInterval(speakingInterval);
  }, [speaking]);
  
  // Define face shapes
  const faceShapePaths = {
    round: "M100,150 C65,150 50,125 50,100 C50,65 70,50 100,50 C130,50 150,65 150,100 C150,125 135,150 100,150 Z",
    oval: "M100,160 C70,160 55,135 55,100 C55,65 70,40 100,40 C130,40 145,65 145,100 C145,135 130,160 100,160 Z",
    square: "M60,140 C60,145 70,150 100,150 C130,150 140,145 140,140 L140,70 C140,60 130,50 100,50 C70,50 60,60 60,70 L60,140 Z",
    heart: "M100,160 C70,160 55,135 55,100 C55,65 70,50 100,50 C130,50 145,65 145,100 C145,135 130,160 100,160 Z"
  };
  
  // Modify face shape based on age range
  let adjustedFaceShape = faceShapePaths[faceShape];
  if (ageRange === 'child') {
    // Rounder, smaller face for children
    adjustedFaceShape = "M100,145 C70,145 55,125 55,95 C55,65 75,55 100,55 C125,55 145,65 145,95 C145,125 130,145 100,145 Z";
  } else if (ageRange === 'senior') {
    // More defined lines and slightly sagging for seniors
    adjustedFaceShape = "M100,160 C75,165 55,135 55,100 C55,65 70,40 100,40 C130,40 145,65 145,100 C145,135 125,165 100,160 Z";
  }
  
  // Hair styles based on gender and style
  const getHairPath = () => {
    if (hairStyle === 'bald') return null;
    
    const baseHair = {
      short: {
        male: "M50,100 C50,60 70,40 100,35 C130,40 150,60 150,100 L145,65 C140,55 130,45 100,40 C70,45 60,55 55,65 L50,100 Z",
        female: "M50,100 C50,60 70,40 100,35 C130,40 150,60 150,100 L145,65 C140,55 130,45 100,40 C70,45 60,55 55,65 L50,100 Z"
      },
      medium: {
        male: "M45,110 C45,60 65,35 100,30 C135,35 155,60 155,110 L150,65 C145,50 130,35 100,30 C70,35 55,50 50,65 L45,110 Z",
        female: "M40,120 C40,60 65,30 100,25 C135,30 160,60 160,120 L155,65 C150,50 135,30 100,25 C65,30 50,50 45,65 L40,120 Z"
      },
      long: {
        male: "M40,140 C40,60 65,30 100,25 C135,30 160,60 160,140 L155,65 C150,50 135,30 100,25 C65,30 50,50 45,65 L40,140 Z",
        female: "M30,160 C30,60 60,25 100,20 C140,25 170,60 170,160 L165,65 C160,45 140,25 100,20 C60,25 40,45 35,65 L30,160 Z"
      }
    };
    
    return baseHair[hairStyle][gender];
  };
  
  // Get eyebrow shape based on expression
  const getEyebrows = () => {
    const baseY = 75;
    const width = 15;
    const thickness = 2;
    
    switch(expression) {
      case 'angry':
        return (
          <>
            <path
              d={`M${80-width},${baseY-5} Q${80},${baseY-10} ${80+width},${baseY-5}`}
              stroke={hairColor}
              strokeWidth={thickness}
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M${120-width},${baseY-5} Q${120},${baseY-10} ${120+width},${baseY-5}`}
              stroke={hairColor}
              strokeWidth={thickness}
              strokeLinecap="round"
              fill="none"
            />
          </>
        );
      case 'surprised':
        return (
          <>
            <path
              d={`M${80-width},${baseY-3} Q${80},${baseY-8} ${80+width},${baseY-3}`}
              stroke={hairColor}
              strokeWidth={thickness}
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M${120-width},${baseY-3} Q${120},${baseY-8} ${120+width},${baseY-3}`}
              stroke={hairColor}
              strokeWidth={thickness}
              strokeLinecap="round"
              fill="none"
            />
          </>
        );
      case 'sad':
        return (
          <>
            <path
              d={`M${80-width},${baseY-8} Q${80},${baseY-5} ${80+width},${baseY}`}
              stroke={hairColor}
              strokeWidth={thickness}
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M${120-width},${baseY-8} Q${120},${baseY-5} ${120+width},${baseY}`}
              stroke={hairColor}
              strokeWidth={thickness}
              strokeLinecap="round"
              fill="none"
            />
          </>
        );
      case 'happy':
      case 'neutral':
      default:
        return (
          <>
            <path
              d={`M${80-width},${baseY} Q${80},${baseY-5} ${80+width},${baseY}`}
              stroke={hairColor}
              strokeWidth={thickness}
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M${120-width},${baseY} Q${120},${baseY-5} ${120+width},${baseY}`}
              stroke={hairColor}
              strokeWidth={thickness}
              strokeLinecap="round"
              fill="none"
            />
          </>
        );
    }
  };
  
  // Get mouth shape based on expression and speaking state
  const getMouth = () => {
    const mouthY = 115;
    const width = 15;
    const actualMouthOpenness = speaking ? randomMouthOpen * 8 : mouthOpenness * 8;
    
    switch(expression) {
      case 'happy':
        return (
          <path
            d={`M${100-width},${mouthY} Q${100},${mouthY + (speaking ? actualMouthOpenness : 5)} ${100+width},${mouthY}`}
            fill={speaking ? "#A54034" : "none"}
            stroke="#A54034"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      case 'sad':
        return (
          <path
            d={`M${100-width},${mouthY} Q${100},${mouthY - (speaking ? actualMouthOpenness/2 : 5)} ${100+width},${mouthY}`}
            fill={speaking ? "#A54034" : "none"}
            stroke="#A54034"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      case 'surprised':
        return (
          <ellipse
            cx="100"
            cy={mouthY}
            rx={8}
            ry={speaking ? actualMouthOpenness : 6}
            fill="#A54034"
            stroke="#A54034"
            strokeWidth="1"
          />
        );
      case 'angry':
        return (
          <path
            d={`M${100-width},${mouthY} L${100},${mouthY + (speaking ? actualMouthOpenness/2 : 0)} L${100+width},${mouthY}`}
            fill={speaking ? "#A54034" : "none"}
            stroke="#A54034"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      case 'neutral':
      default:
        return (
          <path
            d={`M${100-width},${mouthY} ${speaking ? `Q${100},${mouthY + actualMouthOpenness}` : ''} ${100+width},${mouthY}`}
            fill={speaking ? "#A54034" : "none"}
            stroke="#A54034"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
    }
  };
  
  // Get glasses based on shape
  const getGlasses = () => {
    if (!hasGlasses) return null;
    
    const baseY = 85;
    let leftLens, rightLens, bridge, temples;
    
    switch(glassesShape) {
      case 'round':
        leftLens = <circle cx="80" cy={baseY} r="12" fill="none" stroke={glassesColor} strokeWidth="2" />;
        rightLens = <circle cx="120" cy={baseY} r="12" fill="none" stroke={glassesColor} strokeWidth="2" />;
        bridge = <line x1="92" y1={baseY} x2="108" y2={baseY} stroke={glassesColor} strokeWidth="2" />;
        temples = (
          <>
            <line x1="68" y1={baseY} x2="55" y2={baseY-5} stroke={glassesColor} strokeWidth="2" />
            <line x1="132" y1={baseY} x2="145" y2={baseY-5} stroke={glassesColor} strokeWidth="2" />
          </>
        );
        break;
      case 'square':
        leftLens = <rect x="68" y={baseY-10} width="24" height="20" rx="2" fill="none" stroke={glassesColor} strokeWidth="2" />;
        rightLens = <rect x="108" y={baseY-10} width="24" height="20" rx="2" fill="none" stroke={glassesColor} strokeWidth="2" />;
        bridge = <line x1="92" y1={baseY} x2="108" y2={baseY} stroke={glassesColor} strokeWidth="2" />;
        temples = (
          <>
            <line x1="68" y1={baseY} x2="55" y2={baseY-5} stroke={glassesColor} strokeWidth="2" />
            <line x1="132" y1={baseY} x2="145" y2={baseY-5} stroke={glassesColor} strokeWidth="2" />
          </>
        );
        break;
      case 'cat-eye':
        leftLens = (
          <path
            d="M68,85 Q70,75 80,75 Q90,75 92,85 Q92,95 80,95 Q68,95 68,85 Z"
            fill="none"
            stroke={glassesColor}
            strokeWidth="2"
          />
        );
        rightLens = (
          <path
            d="M108,85 Q110,75 120,75 Q130,75 132,85 Q132,95 120,95 Q108,95 108,85 Z"
            fill="none"
            stroke={glassesColor}
            strokeWidth="2"
          />
        );
        bridge = <line x1="92" y1={baseY} x2="108" y2={baseY} stroke={glassesColor} strokeWidth="2" />;
        temples = (
          <>
            <line x1="68" y1={baseY} x2="55" y2={baseY-5} stroke={glassesColor} strokeWidth="2" />
            <line x1="132" y1={baseY} x2="145" y2={baseY-5} stroke={glassesColor} strokeWidth="2" />
          </>
        );
        break;
      default:
        return null;
    }
    
    return (
      <>
        {leftLens}
        {rightLens}
        {bridge}
        {temples}
      </>
    );
  };
  
  // Get facial hair
  const getFacialHair = () => {
    if (!hasFacialHair || facialHairStyle === 'none' || gender !== 'male') return null;
    
    switch(facialHairStyle) {
      case 'beard':
        return (
          <path
            d="M70,115 C70,140 85,145 100,145 C115,145 130,140 130,115 C130,125 130,135 100,140 C70,135 70,125 70,115 Z"
            fill={facialHairColor}
          />
        );
      case 'mustache':
        return (
          <path
            d="M80,110 C80,105 90,105 100,105 C110,105 120,105 120,110 C115,115 105,115 100,115 C95,115 85,115 80,110 Z"
            fill={facialHairColor}
          />
        );
      case 'goatee':
        return (
          <path
            d="M90,115 C90,130 95,135 100,135 C105,135 110,130 110,115 C110,125 105,130 100,130 C95,130 90,125 90,115 Z"
            fill={facialHairColor}
          />
        );
      default:
        return null;
    }
  };
  
  // Get hat
  const getHat = () => {
    if (!hasHat || hatStyle === 'none') return null;
    
    switch(hatStyle) {
      case 'beanie':
        return (
          <path
            d="M50,70 C50,40 70,20 100,20 C130,20 150,40 150,70 C150,60 130,50 100,50 C70,50 50,60 50,70 Z"
            fill={hatColor}
          />
        );
      case 'cap':
        return (
          <>
            <path
              d="M40,70 C40,40 70,20 100,20 C130,20 160,40 160,70 L160,80 C130,80 70,80 40,80 L40,70 Z"
              fill={hatColor}
            />
            <path
              d="M40,80 L60,80 L60,70 L40,70 Z"
              fill={hatColor}
            />
          </>
        );
      case 'wide-brim':
        return (
          <>
            <ellipse
              cx="100"
              cy="70"
              rx="70"
              ry="15"
              fill={hatColor}
            />
            <path
              d="M70,70 C70,50 85,40 100,40 C115,40 130,50 130,70 C130,65 115,60 100,60 C85,60 70,65 70,70 Z"
              fill={hatColor}
            />
          </>
        );
      default:
        return null;
    }
  };
  
  // Get earrings
  const getEarrings = () => {
    if (!hasEarrings) return null;
    
    return (
      <>
        <circle cx="60" cy="100" r="3" fill={earringsColor} />
        <circle cx="140" cy="100" r="3" fill={earringsColor} />
      </>
    );
  };
  
  return (
    <div className="relative w-full h-full">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{ transform: `scale(${breathScale})` }}
      >
        {/* Base face */}
        <path
          d={adjustedFaceShape}
          fill={skinTone}
        />
        
        {/* Ears */}
        <ellipse cx="55" cy="100" rx="5" ry="10" fill={skinTone} />
        <ellipse cx="145" cy="100" rx="5" ry="10" fill={skinTone} />
        
        {/* Hair */}
        {getHairPath() && (
          <path
            d={getHairPath()}
            fill={hairColor}
          />
        )}
        
        {/* Hat (goes over hair) */}
        {getHat()}
        
        {/* Eyebrows */}
        {getEyebrows()}
        
        {/* Eyes */}
        <g>
          <ellipse
            cx="80"
            cy="85"
            rx="8"
            ry={isBlinking ? 1 : 5}
            fill="white"
            stroke="#333"
            strokeWidth="0.5"
          />
          <circle
            cx="80"
            cy="85"
            r={isBlinking ? 0 : 3}
            fill={eyeColor}
          />
          
          <ellipse
            cx="120"
            cy="85"
            rx="8"
            ry={isBlinking ? 1 : 5}
            fill="white"
            stroke="#333"
            strokeWidth="0.5"
          />
          <circle
            cx="120"
            cy="85"
            r={isBlinking ? 0 : 3}
            fill={eyeColor}
          />
        </g>
        
        {/* Nose */}
        <path
          d={`M95,95 Q100,105 105,95`}
          fill="none"
          stroke={skinTone === '#F5D0B9' ? '#DEBBAA' : '#' + (parseInt(skinTone.slice(1), 16) - 0x151515).toString(16)}
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Mouth */}
        {getMouth()}
        
        {/* Facial hair */}
        {getFacialHair()}
        
        {/* Glasses */}
        {getGlasses()}
        
        {/* Earrings */}
        {getEarrings()}
        
        {/* Age-specific details */}
        {ageRange === 'senior' && (
          <>
            {/* Wrinkles */}
            <path
              d="M70,75 C75,72 85,72 90,75"
              fill="none"
              stroke="#DEBBAA"
              strokeWidth="1"
            />
            <path
              d="M110,75 C115,72 125,72 130,75"
              fill="none"
              stroke="#DEBBAA"
              strokeWidth="1"
            />
            <path
              d="M75,110 C85,107 115,107 125,110"
              fill="none"
              stroke="#DEBBAA"
              strokeWidth="1"
            />
          </>
        )}
      </svg>
    </div>
  );
};

export default EnhancedCharacterAvatar;