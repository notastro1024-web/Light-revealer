
import React, { useState } from 'react';
import { ART_CATEGORIES, ART_STYLES, FRAME_COLORS, FRAME_MATERIALS, PRE_SELECTED_ART } from '../constants';
import { ArtCategory, ArtStyle, ElementStylePair, FrameColor, FrameMaterial } from '../types';
import Icon from '../components/Icon';
import { identifyImageElements, generateArtPreview } from '../services/geminiService';

const StepIndicator: React.FC<{ step: number; title: string; currentStep: number }> = ({ step, title, currentStep }) => (
    <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
            currentStep >= step ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-400 border-2 border-gray-700'
        }`}>
            {currentStep > step ? <Icon name="check" className="w-6 h-6"/> : step}
        </div>
        <div className="ml-4">
            <div className="text-xs text-gray-400">Step {step}</div>
            <div className={`font-bold ${currentStep >= step ? 'text-white' : 'text-gray-500'}`}>{title}</div>
        </div>
    </div>
);

const CustomizationPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<ArtCategory | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const [identifiedElements, setIdentifiedElements] = useState<string[]>([]);
    const [elementsToStyle, setElementsToStyle] = useState<ElementStylePair[]>([]);
    const [isIdentifying, setIsIdentifying] = useState(false);

    const [frameMaterial, setFrameMaterial] = useState<FrameMaterial>('Wood');
    const [frameColor, setFrameColor] = useState<FrameColor>('Black');
    const [hasEmblem, setHasEmblem] = useState(true);

    const [generatedArt, setGeneratedArt] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadedFile(file);
            setImagePreview(URL.createObjectURL(file));
            setIdentifiedElements([]);
            setElementsToStyle([]);
            setGeneratedArt(null);
            
            setIsIdentifying(true);
            const elements = await identifyImageElements(file);
            setIdentifiedElements(['Full Image', ...elements]);
            // Default to styling the full image
            setElementsToStyle([{ element: 'Full Image', style: 'Colored Glow' }]);
            setIsIdentifying(false);
            setCurrentStep(2);
        }
    };

    const handleElementStyleChange = (element: string, style: ArtStyle) => {
        setElementsToStyle(prev => {
            if(element === 'Full Image') {
                return [{ element: 'Full Image', style: style }];
            }
            const otherElements = prev.filter(e => e.element !== element && e.element !== 'Full Image');
            return [...otherElements, { element, style }];
        });
    };
    
    const handleElementSelectionToggle = (element: string) => {
        setElementsToStyle(prev => {
             if (element === 'Full Image') {
                 // if full image is checked, uncheck others. If it's unchecked, do nothing.
                return prev.find(e => e.element === 'Full Image') ? [] : [{element: 'Full Image', style: 'Colored Glow'}];
             }
             
            // Remove 'Full Image' if a specific element is selected
            const withoutFullImage = prev.filter(e => e.element !== 'Full Image');
            const isSelected = withoutFullImage.some(e => e.element === element);

            if (isSelected) {
                return withoutFullImage.filter(e => e.element !== element);
            } else {
                return [...withoutFullImage, { element, style: 'Colored Glow' }];
            }
        });
    };
    
    const handleGenerateClick = async () => {
        if (!uploadedFile || elementsToStyle.length === 0) return;
        setIsGenerating(true);
        setGeneratedArt(null);
        const artUrl = await generateArtPreview(uploadedFile, elementsToStyle);
        setGeneratedArt(artUrl);
        setIsGenerating(false);
        if(artUrl) setCurrentStep(4);
    };

    const getFrameClasses = () => {
        let classes = 'p-2 transition-all duration-300 ';
        switch(frameColor) {
            case 'Black': classes += 'bg-gray-900 border-gray-700 '; break;
            case 'Gold': classes += 'bg-yellow-500 border-yellow-700 '; break;
            case 'White': classes += 'bg-gray-200 border-gray-400 '; break;
            case 'Bronze': classes += 'bg-amber-700 border-amber-900 '; break;
        }
         switch(frameMaterial) {
            case 'Wood': classes += 'shadow-lg '; break; // simple shadow
            case 'Metal': classes += 'shadow-xl bg-gradient-to-br from-gray-500 to-gray-700 '; break;
            case 'Matte': classes += 'shadow-md '; break;
            case 'Gloss': classes += 'shadow-2xl '; break;
            case 'Epoxy': classes += 'shadow-2xl border-4 '; break;
        }
        return classes;
    }

    return (
        <div className="min-h-screen bg-black py-12 animate-fadeIn">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="font-cinzel text-5xl font-bold text-white">Craft <span className="text-yellow-400">Yours</span></h1>
                    <p className="text-gray-400 mt-4 max-w-3xl mx-auto">Follow the steps to design your unique Luminark. From the art itself to the frame that holds it, every detail is in your hands.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Panel: Steps */}
                    <div className="lg:col-span-1 space-y-8 bg-gray-900/50 p-6 border border-gray-800 rounded-lg h-fit">
                        <StepIndicator step={1} title="Select Your Art" currentStep={currentStep}/>
                        <StepIndicator step={2} title="Define The Glow" currentStep={currentStep}/>
                        <StepIndicator step={3} title="Choose The Frame" currentStep={currentStep}/>
                        <StepIndicator step={4} title="Final Preview" currentStep={currentStep}/>
                    </div>

                    {/* Right Panel: Content */}
                    <div className="lg:col-span-2 space-y-12">
                         {/* Step 1: Art Selection */}
                        <div className="bg-gray-900/50 p-6 border border-gray-800 rounded-lg">
                            <h3 className="font-cinzel text-xl text-yellow-400 mb-4">Step 1: Select Your Art Reference</h3>
                            <p className="text-gray-400 mb-4 text-sm">Upload your own image to begin the transformation. This will be the foundation for your glowing masterpiece.</p>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Icon name="upload" className="w-10 h-10 mb-3 text-gray-400"/>
                                        <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
                                    </div>
                                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*"/>
                                </label>
                            </div>
                        </div>

                         {/* Step 2: Define Glow */}
                        {currentStep >= 2 && uploadedFile && (
                            <div className="bg-gray-900/50 p-6 border border-gray-800 rounded-lg">
                                <h3 className="font-cinzel text-xl text-yellow-400 mb-4">Step 2: Define The Glow</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-gray-400 mb-2 text-sm">Your reference image:</p>
                                        {imagePreview && <img src={imagePreview} alt="Upload preview" className="rounded-lg w-full object-cover"/>}
                                    </div>
                                    <div>
                                        <p className="text-gray-400 mb-2 text-sm">Select elements to stylize:</p>
                                        {isIdentifying ? (
                                            <div className="flex items-center text-yellow-400"><Icon name="loader" className="w-5 h-5 animate-spin mr-2"/> Analyzing image...</div>
                                        ) : (
                                            <div className="space-y-3">
                                                {identifiedElements.map(el => (
                                                    <div key={el} className="bg-gray-800 p-3 rounded-lg">
                                                        <div className="flex items-center justify-between">
                                                            <label className="flex items-center cursor-pointer">
                                                                <input type="checkbox" className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 text-yellow-400 focus:ring-yellow-500"
                                                                    checked={elementsToStyle.some(e=>e.element === el)} 
                                                                    onChange={() => handleElementSelectionToggle(el)}
                                                                />
                                                                <span className="ml-3 text-white">{el}</span>
                                                            </label>
                                                        </div>
                                                        {elementsToStyle.some(e=>e.element === el) && (
                                                             <select onChange={(e) => handleElementStyleChange(el, e.target.value as ArtStyle)} className="mt-2 w-full bg-gray-700 text-white border-gray-600 rounded-md p-2 text-sm">
                                                                {ART_STYLES.map(style => <option key={style} value={style}>{style}</option>)}
                                                            </select>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <button onClick={handleGenerateClick} disabled={isGenerating || elementsToStyle.length === 0} 
                                            className="w-full mt-4 px-8 py-3 font-semibold text-black bg-yellow-400 rounded-md hover:bg-yellow-300 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center">
                                            {isGenerating && <Icon name="loader" className="w-5 h-5 animate-spin mr-2"/>}
                                            {isGenerating ? 'Generating Art...' : 'Generate Art Preview'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Frame Selection */}
                        {currentStep >= 2 && (
                             <div className="bg-gray-900/50 p-6 border border-gray-800 rounded-lg">
                                 <h3 className="font-cinzel text-xl text-yellow-400 mb-4">Step 3: Choose The Frame</h3>
                                 <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-gray-400 text-sm">Material</label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {FRAME_MATERIALS.map(mat => (
                                                <button key={mat} onClick={() => {setFrameMaterial(mat); setCurrentStep(s=>Math.max(s,3))}} className={`px-4 py-2 text-sm rounded-md transition-colors ${frameMaterial === mat ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>{mat}</button>
                                            ))}
                                        </div>
                                    </div>
                                     <div>
                                        <label className="text-gray-400 text-sm">Color</label>
                                         <div className="flex flex-wrap gap-2 mt-2">
                                            {FRAME_COLORS.map(col => (
                                                <button key={col} onClick={() => {setFrameColor(col); setCurrentStep(s=>Math.max(s,3))}} className={`px-4 py-2 text-sm rounded-md transition-colors ${frameColor === col ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>{col}</button>
                                            ))}
                                        </div>
                                    </div>
                                 </div>
                                  <div className="mt-4">
                                        <label className="flex items-center cursor-pointer">
                                            <input type="checkbox" checked={hasEmblem} onChange={(e) => setHasEmblem(e.target.checked)} className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 text-yellow-400 focus:ring-yellow-500"/>
                                            <span className="ml-3 text-white">Include Luminark Emblem</span>
                                        </label>
                                    </div>
                             </div>
                        )}
                         
                        {/* Step 4: Final Preview */}
                        {currentStep >= 4 && generatedArt && (
                            <div className="bg-gray-900/50 p-6 border border-gray-800 rounded-lg">
                                <h3 className="font-cinzel text-xl text-yellow-400 mb-4">Step 4: Your Luminark Preview</h3>
                                <div className="flex justify-center items-center p-4 bg-black rounded-lg">
                                    <div className={`${getFrameClasses()} rounded-lg relative`}>
                                        <img src={generatedArt} alt="Generated art preview" className="rounded w-full max-w-lg"/>
                                        {hasEmblem && <div className="absolute bottom-4 right-4 font-cinzel text-xs text-opacity-50" style={{color: frameColor === 'White' || frameColor === 'Gold' ? 'black' : 'white'}}>L</div>}
                                    </div>
                                </div>
                                <button className="w-full mt-6 px-8 py-3 font-semibold text-black bg-yellow-400 rounded-md hover:bg-yellow-300 transition-colors duration-300">
                                    Book Your Luminark
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomizationPage;
