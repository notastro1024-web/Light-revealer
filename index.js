import { GoogleGenAI, Type, Modality } from "@google/genai";

// --- CONSTANTS ---
const GALLERY_ITEMS = [
  { id: 1, title: 'Celestial Dragon', story: 'Forged in starlight, this piece captures the silent roar of a cosmic beast.', category: 'Mythical', imageUrl: 'https://picsum.photos/seed/dragon/800/1000', limit: 50 },
  { id: 2, title: 'The Gilded City', story: 'A vision of a future metropolis, where architecture touches the heavens.', category: 'Structure/Place', imageUrl: 'https://picsum.photos/seed/city/800/1000', limit: 25 },
  { id: 3, title: 'Ephemeral Gaze', story: 'A portrait that holds a thousand untold stories, illuminated from within.', category: 'Human', imageUrl: 'https://picsum.photos/seed/gaze/800/1000', limit: 100 },
  { id: 4, title: 'Automaton Heart', story: 'The soul of a machine, rendered in circuits of light.', category: 'Vehicle', imageUrl: 'https://picsum.photos/seed/robotcar/800/1000', limit: 75 },
  { id: 5, title: 'Spirit Wolf', story: 'The embodiment of the wild, its spirit glowing against the eternal night.', category: 'Animal', imageUrl: 'https://picsum.photos/seed/wolf/800/1000', limit: 50 },
  { id: 6, title: 'Phoenix Flight', story: 'Rising from ashes, a testament to rebirth and incandescent hope.', category: 'Bird', imageUrl: 'https://picsum.photos/seed/phoenix/800/1000', limit: 30 },
  { id: 7, title: 'The Lone Knight', story: 'A silent guardian whose armor gleams with the light of a forgotten oath.', category: 'Human', imageUrl: 'https://picsum.photos/seed/knight/800/1000', limit: 40 },
  { id: 8, title: 'Oceanic Leviathan', story: 'A creature from the deep, its form a dance of bioluminescence and shadow.', category: 'Mythical', imageUrl: 'https://picsum.photos/seed/leviathan/800/1000', limit: 20 },
  { id: 9, title: 'Machina Wings', story: 'A futuristic aircraft, slicing through clouds with wings of pure energy.', category: 'Vehicle', imageUrl: 'https://picsum.photos/seed/plane/800/1000', limit: 60 },
  { id: 10, title: 'The Oracle', story: 'Her eyes see beyond time, her wisdom radiating as a soft, knowing light.', category: 'Human', imageUrl: 'https://picsum.photos/seed/oracle/800/1000', limit: 15 },
];
const ART_STYLES = ['Outline', 'Pencil Sketch', 'Colored Glow'];
const FRAME_MATERIALS = ['Wood', 'Metal', 'Matte', 'Gloss', 'Epoxy'];
const FRAME_COLORS = ['Black', 'Gold', 'White', 'Bronze'];

// --- GEMINI SERVICE ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file) => {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const identifyImageElements = async (imageFile) => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          imagePart,
          { text: "Identify the main, distinct subjects or elements in this image. The subjects should be things that can be artistically stylized. Provide a list of 3-5 elements." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            elements: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        },
      },
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result.elements || [];
  } catch (error) {
    console.error("Error identifying image elements:", error);
    return ["Full Image"]; // Fallback
  }
};

const generateArtPreview = async (imageFile, elementsToStyle) => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    
    let prompt = "Using the provided image as a reference, create a new piece of art. The style should be luxurious, high-end, and suitable for a glowing art frame. ";
    prompt += "The background should be dark and atmospheric to emphasize the glow. ";

    if (elementsToStyle.length === 0 || elementsToStyle.some(e => e.element === 'Full Image')) {
        prompt += `Redraw the entire image in a glowing '${elementsToStyle[0]?.style || 'Colored Glow'}' style.`;
    } else {
        elementsToStyle.forEach(item => {
            let styleDescription = '';
            switch(item.style) {
                case 'Outline': styleDescription = 'a crisp, glowing outline'; break;
                case 'Pencil Sketch': styleDescription = 'a detailed, glowing pencil sketch style'; break;
                case 'Colored Glow': styleDescription = 'a vibrant, painterly colored glow'; break;
            }
            prompt += `The element '${item.element}' should be rendered in ${styleDescription}. `;
        });
        prompt += "Elements not mentioned should blend seamlessly into the dark background."
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, { text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    return null;

  } catch (error) {
    console.error("Error generating art preview:", error);
    return null;
  }
};


// --- APPLICATION LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    const state = {
        currentPage: 'Home',
        customization: {
            currentStep: 1,
            uploadedFile: null,
            identifiedElements: [],
            elementsToStyle: [],
            frameMaterial: 'Wood',
            frameColor: 'Black',
            hasEmblem: true,
            generatedArt: null,
        }
    };

    // --- DOM ELEMENTS ---
    const pageElements = document.querySelectorAll('[data-page]');
    const navLinks = document.querySelectorAll('[data-page-link]');
    const galleryContainer = document.getElementById('gallery-container');
    const dropzoneInput = document.getElementById('dropzone-file');
    const imagePreview = document.getElementById('image-preview');
    const elementsContainer = document.getElementById('elements-container');
    const generateArtBtn = document.getElementById('generate-art-btn');
    const frameMaterialsContainer = document.getElementById('frame-materials-container');
    const frameColorsContainer = document.getElementById('frame-colors-container');
    const emblemCheckbox = document.getElementById('emblem-checkbox');
    const finalPreviewFrame = document.getElementById('final-preview-frame');
    const generatedArtPreview = document.getElementById('generated-art-preview');
    const emblemPreview = document.getElementById('emblem-preview');
    
    const stepContents = {
      2: document.getElementById('step-2-content'),
      3: document.getElementById('step-3-content'),
      4: document.getElementById('step-4-content'),
    };
    
    const stepIndicators = {
        1: document.getElementById('step-indicator-1'),
        2: document.getElementById('step-indicator-2'),
        3: document.getElementById('step-indicator-3'),
        4: document.getElementById('step-indicator-4'),
    };

    // --- RENDER FUNCTIONS ---
    const renderGallery = () => {
        if (!galleryContainer) return;
        galleryContainer.innerHTML = GALLERY_ITEMS.map(item => `
            <div class="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 group glow-effect">
                <div class="relative h-96 overflow-hidden">
                    <img src="${item.imageUrl}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                    <div class="absolute bottom-0 left-0 p-6">
                        <span class="text-xs bg-yellow-400 text-black font-semibold px-3 py-1 rounded-full uppercase">${item.category}</span>
                        <h3 class="font-cinzel text-2xl text-white mt-2">${item.title}</h3>
                    </div>
                </div>
                <div class="p-6">
                    <p class="text-gray-400 mb-4 h-20">${item.story}</p>
                    <div class="flex justify-between items-center">
                        <button data-page-link="Contact" class="px-6 py-2 font-semibold text-black bg-yellow-400 rounded-md hover:bg-yellow-300 transition-colors duration-300">
                            Request Ownership
                        </button>
                        <div class="text-right">
                            <p class="text-sm text-gray-400">Limited Edition</p>
                            <p class="font-bold text-white">1 of ${item.limit}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        document.querySelectorAll('#gallery-container [data-page-link]').forEach(link => {
            link.addEventListener('click', () => navigateTo(link.dataset.pageLink));
        });
    };
    
    const renderStepIndicators = () => {
        const { currentStep } = state.customization;
        const titles = ["Select Your Art", "Define The Glow", "Choose The Frame", "Final Preview"];
        for (let i = 1; i <= 4; i++) {
            const isCompleted = currentStep > i;
            const isActive = currentStep >= i;
            stepIndicators[i].innerHTML = `
                <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                        isActive ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-400 border-2 border-gray-700'
                    }">
                        ${isCompleted ? '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>' : i}
                    </div>
                    <div class="ml-4">
                        <div class="text-xs text-gray-400">Step ${i}</div>
                        <div class="font-bold ${isActive ? 'text-white' : 'text-gray-500'}">${titles[i-1]}</div>
                    </div>
                </div>
            `;
        }
    };

    const renderCustomizationStep = () => {
        const { currentStep } = state.customization;
        renderStepIndicators();
        Object.values(stepContents).forEach(el => el.classList.add('hidden'));
        if (currentStep >= 2) stepContents[2].classList.remove('hidden');
        if (currentStep >= 2) stepContents[3].classList.remove('hidden');
        if (currentStep >= 4 && state.customization.generatedArt) stepContents[4].classList.remove('hidden');
    };
    
    const renderIdentifiedElements = () => {
        elementsContainer.innerHTML = state.customization.identifiedElements.map(el => {
            const isSelected = state.customization.elementsToStyle.some(e => e.element === el);
            return `
                 <div key="${el}" class="bg-gray-800 p-3 rounded-lg">
                    <div class="flex items-center justify-between">
                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox" data-element="${el}" class="element-checkbox form-checkbox h-5 w-5 bg-gray-700 border-gray-600 text-yellow-400 focus:ring-yellow-500"
                                ${isSelected ? 'checked' : ''}
                            />
                            <span class="ml-3 text-white">${el}</span>
                        </label>
                    </div>
                    ${isSelected ? `
                        <select data-element="${el}" class="element-style-select mt-2 w-full bg-gray-700 text-white border-gray-600 rounded-md p-2 text-sm">
                            ${ART_STYLES.map(style => `<option value="${style}" ${state.customization.elementsToStyle.find(e=>e.element === el)?.style === style ? 'selected' : ''}>${style}</option>`).join('')}
                        </select>
                    ` : ''}
                </div>
            `
        }).join('');

        elementsContainer.querySelectorAll('.element-checkbox').forEach(box => {
            box.addEventListener('change', () => handleElementSelectionToggle(box.dataset.element));
        });
        elementsContainer.querySelectorAll('.element-style-select').forEach(select => {
            select.addEventListener('change', (e) => handleElementStyleChange(select.dataset.element, e.target.value));
        });
    }

    const renderFrameOptions = () => {
        frameMaterialsContainer.innerHTML = FRAME_MATERIALS.map(mat => `
            <button data-material="${mat}" class="px-4 py-2 text-sm rounded-md transition-colors ${state.customization.frameMaterial === mat ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}">${mat}</button>
        `).join('');
        frameColorsContainer.innerHTML = FRAME_COLORS.map(col => `
            <button data-color="${col}" class="px-4 py-2 text-sm rounded-md transition-colors ${state.customization.frameColor === col ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}">${col}</button>
        `).join('');

        frameMaterialsContainer.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                state.customization.frameMaterial = btn.dataset.material;
                if (state.customization.currentStep < 3) state.customization.currentStep = 3;
                renderFrameOptions();
                renderFinalPreview();
                renderCustomizationStep();
            });
        });
        frameColorsContainer.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                state.customization.frameColor = btn.dataset.color;
                if (state.customization.currentStep < 3) state.customization.currentStep = 3;
                renderFrameOptions();
                renderFinalPreview();
                renderCustomizationStep();
            });
        });
    }

    const renderFinalPreview = () => {
        const { frameColor, frameMaterial, hasEmblem, generatedArt } = state.customization;
        if (!generatedArt) return;

        let classes = 'p-2 transition-all duration-300 rounded-lg relative ';
        switch(frameColor) {
            case 'Black': classes += 'bg-gray-900 border-gray-700 '; break;
            case 'Gold': classes += 'bg-yellow-500 border-yellow-700 '; break;
            case 'White': classes += 'bg-gray-200 border-gray-400 '; break;
            case 'Bronze': classes += 'bg-amber-700 border-amber-900 '; break;
        }
         switch(frameMaterial) {
            case 'Wood': classes += 'shadow-lg '; break;
            case 'Metal': classes += 'shadow-xl bg-gradient-to-br from-gray-500 to-gray-700 '; break;
            case 'Matte': classes += 'shadow-md '; break;
            case 'Gloss': classes += 'shadow-2xl '; break;
            case 'Epoxy': classes += 'shadow-2xl border-4 '; break;
        }
        finalPreviewFrame.className = classes;

        generatedArtPreview.src = generatedArt;

        if (hasEmblem) {
            emblemPreview.classList.remove('hidden');
            emblemPreview.style.color = (frameColor === 'White' || frameColor === 'Gold') ? 'black' : 'white';
        } else {
            emblemPreview.classList.add('hidden');
        }
    }

    // --- EVENT HANDLERS & LOGIC ---
    const navigateTo = (page) => {
        state.currentPage = page;
        pageElements.forEach(p => {
            p.classList.toggle('hidden', p.id !== `page-${page}`);
        });
        navLinks.forEach(link => {
            const isButton = link.tagName === 'BUTTON';
            if (isButton && link.parentElement.id === 'nav-links') {
                const isActive = link.dataset.pageLink === page;
                link.className = `nav-link px-4 py-2 text-sm uppercase tracking-widest transition-colors duration-300 ${
                    isActive ? 'text-yellow-400 glow-text' : 'text-gray-300 hover:text-white'
                }`;
            }
        });
        window.scrollTo(0, 0);
    };

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            state.customization.uploadedFile = file;
            
            state.customization.identifiedElements = [];
            state.customization.elementsToStyle = [];
            state.customization.generatedArt = null;
            state.customization.currentStep = 1;
            renderCustomizationStep();

            imagePreview.src = URL.createObjectURL(file);
            elementsContainer.innerHTML = `<div class="flex items-center text-yellow-400"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v3m0 12v3m9-9h-3m-12 0H3m16.5-6.5l-2-2m-9 9l-2-2m0-9l2 2m9 9l2 2" /></svg> Analyzing image...</div>`;
            state.customization.currentStep = 2;
            renderCustomizationStep();

            const elements = await identifyImageElements(file);
            state.customization.identifiedElements = ['Full Image', ...elements];
            state.customization.elementsToStyle = [{ element: 'Full Image', style: 'Colored Glow' }];
            renderIdentifiedElements();
        }
    };
    
    const handleElementStyleChange = (element, style) => {
        const item = state.customization.elementsToStyle.find(e => e.element === element);
        if (item) item.style = style;
        renderIdentifiedElements();
    };
    
    const handleElementSelectionToggle = (element) => {
        const { elementsToStyle } = state.customization;
        if (element === 'Full Image') {
            state.customization.elementsToStyle = elementsToStyle.some(e => e.element === 'Full Image') ? [] : [{element: 'Full Image', style: 'Colored Glow'}];
        } else {
            const withoutFullImage = elementsToStyle.filter(e => e.element !== 'Full Image');
            const isSelected = withoutFullImage.some(e => e.element === element);
            if (isSelected) {
                state.customization.elementsToStyle = withoutFullImage.filter(e => e.element !== element);
            } else {
                state.customization.elementsToStyle = [...withoutFullImage, { element, style: 'Colored Glow' }];
            }
        }
        renderIdentifiedElements();
    };

    const handleGenerateClick = async () => {
        if (!state.customization.uploadedFile || state.customization.elementsToStyle.length === 0) return;

        generateArtBtn.disabled = true;
        generateArtBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v3m0 12v3m9-9h-3m-12 0H3m16.5-6.5l-2-2m-9 9l-2-2m0-9l2 2m9 9l2 2" /></svg> Generating Art...`;
        
        state.customization.generatedArt = null;
        renderCustomizationStep();
        
        const artUrl = await generateArtPreview(state.customization.uploadedFile, state.customization.elementsToStyle);
        state.customization.generatedArt = artUrl;
        
        generateArtBtn.disabled = false;
        generateArtBtn.innerHTML = 'Generate Art Preview';

        if (artUrl) {
            state.customization.currentStep = 4;
            renderFinalPreview();
            renderCustomizationStep();
        }
    };

    // --- INITIALIZATION ---
    navLinks.forEach(link => {
        link.addEventListener('click', () => navigateTo(link.dataset.pageLink));
    });

    renderGallery();
    renderStepIndicators();
    renderFrameOptions();

    dropzoneInput.addEventListener('change', handleFileChange);
    generateArtBtn.addEventListener('click', handleGenerateClick);
    emblemCheckbox.addEventListener('change', (e) => {
        state.customization.hasEmblem = e.target.checked;
        renderFinalPreview();
    });
});
