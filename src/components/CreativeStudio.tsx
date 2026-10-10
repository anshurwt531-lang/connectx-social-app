import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Film,
  Camera,
  Download,
  Share2,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Play,
  Upload,
  AlertCircle,
  HelpCircle,
  Layers,
  Palette,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import { Post } from '../types';
import { PRESET_LOGOS } from '../data/sampleData';

interface CreativeStudioProps {
  initialTab?: 'logo' | 'video' | 'snap';
  initialImageForVideo?: string;
  initialVideoPrompt?: string;
  onPublishPost: (postData: Partial<Post>) => void;
  onAddToStory: (mediaUrl: string, isVideo: boolean, caption?: string) => void;
  onClose: () => void;
}

export const CreativeStudio: React.FC<CreativeStudioProps> = ({
  initialTab = 'logo',
  initialImageForVideo,
  initialVideoPrompt,
  onPublishPost,
  onAddToStory,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'logo' | 'video' | 'snap'>(initialTab);

  // Logo Designer State
  const [companyName, setCompanyName] = useState('PulseGrid Labs');
  const [industry, setIndustry] = useState('Cybersecurity & Cloud');
  const [style, setStyle] = useState('Modern Geometric Minimalist');
  const [colorPalette, setColorPalette] = useState('Obsidian Black & Electric Neon Violet');
  const [customPrompt, setCustomPrompt] = useState(
    'A high-tech emblem combining an abstract kinetic grid with an iridescent crystal core, precision vector aesthetic, sharp futuristic luxury branding on obsidian background.'
  );
  // STRICT REQUIREMENT: Affordance for 1K, 2K, 4K
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [logoAspectRatio, setLogoAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');

  // Image Generation Status
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [generatedLogoUrl, setGeneratedLogoUrl] = useState<string | null>(
    initialImageForVideo || PRESET_LOGOS[0].imageUrl
  );
  const [logoError, setLogoError] = useState<string | null>(null);

  // Video / Veo Animator State
  // STRICT REQUIREMENT: veo-3.1-fast-generate-preview, 16:9 or 9:16 aspect ratio
  const [selectedPhotoForVideo, setSelectedPhotoForVideo] = useState<string>(
    initialImageForVideo || PRESET_LOGOS[0].imageUrl
  );
  const [videoAspectRatio, setVideoAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [videoResolution, setVideoResolution] = useState<'720p' | '1080p'>('720p');
  const [videoPrompt, setVideoPrompt] = useState(
    initialVideoPrompt ||
      'Bring this company logo to life with a dramatic 3D kinetic spin, glowing volumetric light streaks, and floating neon particle effects, 60fps cinematic reveal.'
  );
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoProgressStep, setVideoProgressStep] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(
    PRESET_LOGOS[0].videoPreview
  );
  const [videoError, setVideoError] = useState<string | null>(null);

  // Snap / Camera Post State
  const [snapImage, setSnapImage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'normal' | 'cyber' | 'warm' | 'noir' | 'film'>('normal');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('ConnectX Studio');
  const [isPublishedNotification, setIsPublishedNotification] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const snapFileInputRef = useRef<HTMLInputElement | null>(null);

  // Quick preset logos
  const applyPreset = (preset: (typeof PRESET_LOGOS)[0]) => {
    setCompanyName(preset.name);
    setIndustry(preset.industry);
    setCustomPrompt(preset.prompt);
    setGeneratedLogoUrl(preset.imageUrl);
    setSelectedPhotoForVideo(preset.imageUrl);
    if (preset.videoPreview) {
      setGeneratedVideoUrl(preset.videoPreview);
    }
  };

  // Generate Logo Handler using Gemini 3 Pro Image (with fallback simulation)
  const handleGenerateLogo = async () => {
    setIsGeneratingLogo(true);
    setLogoError(null);

    const fullPrompt = `Official corporate logo for company "${companyName}" in the ${industry} industry. Style: ${style}. Color palette: ${colorPalette}. Details: ${customPrompt}. Render high fidelity, professional graphic identity mark, clean composition.`;

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          aspectRatio: logoAspectRatio,
          imageSize: imageSize, // 1K, 2K, 4K affordance
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server returned an error');
      }

      if (data.imageUrl) {
        setGeneratedLogoUrl(data.imageUrl);
        setSelectedPhotoForVideo(data.imageUrl); // Sync to video animator tab!
      } else {
        throw new Error('No image was returned from Gemini API.');
      }
    } catch (err: any) {
      console.warn('API error, using demo sample preset for showcase:', err);
      // Graceful fallback with clear explanation
      const sample = PRESET_LOGOS[Math.floor(Math.random() * PRESET_LOGOS.length)];
      setGeneratedLogoUrl(sample.imageUrl);
      setSelectedPhotoForVideo(sample.imageUrl);
      setLogoError(
        `${err.message || 'API request failed'}. Demo fallback image loaded for preview.`
      );
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  // Generate Video using Veo (veo-3.1-fast-generate-preview)
  const handleGenerateVideo = async () => {
    if (!selectedPhotoForVideo) {
      setVideoError('Please choose or upload a photo/logo first.');
      return;
    }

    setIsGeneratingVideo(true);
    setVideoError(null);
    setVideoProgressStep('Sending request to Veo video generation engine...');

    try {
      // If photo is remote URL or preset, convert to base64 or pass data
      let base64Data = selectedPhotoForVideo;
      if (selectedPhotoForVideo.startsWith('http')) {
        setVideoProgressStep('Encoding photo frames for model upload...');
        const imgRes = await fetch(selectedPhotoForVideo);
        const blob = await imgRes.blob();
        base64Data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }

      setVideoProgressStep('Initiating Veo (veo-3.1-fast-generate-preview) operation...');

      const startRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          imageBase64: base64Data,
          aspectRatio: videoAspectRatio, // 16:9 or 9:16
          resolution: videoResolution,
        }),
      });

      const startData = await startRes.json();

      if (!startRes.ok) {
        throw new Error(startData.error || 'Failed to start video generation');
      }

      const operationName = startData.operationName;
      setVideoProgressStep('Veo is synthesizing 3D motion & lighting paths...');

      // Polling loop
      let isDone = false;
      let attempts = 0;
      const maxAttempts = 30; // 30 * 2.5s = ~75s

      while (!isDone && attempts < maxAttempts) {
        attempts++;
        await new Promise((r) => setTimeout(r, 2500));
        setVideoProgressStep(
          `Generating animated video (Pass ${attempts}/${maxAttempts}). Veo kinetic simulation in progress...`
        );

        const pollRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });

        const pollData = await pollRes.json();
        if (pollData.error) {
          throw new Error(pollData.error);
        }

        if (pollData.done) {
          isDone = true;
          break;
        }
      }

      if (isDone) {
        setVideoProgressStep('Downloading high-res MP4 stream...');
        const dlRes = await fetch('/api/video-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });

        if (!dlRes.ok) {
          throw new Error('Failed to download completed video stream');
        }

        const videoBlob = await dlRes.blob();
        const videoObjectUrl = URL.createObjectURL(videoBlob);
        setGeneratedVideoUrl(videoObjectUrl);
      } else {
        throw new Error('Generation took longer than expected.');
      }
    } catch (err: any) {
      console.warn('Veo API call encountered error:', err);
      // Graceful preview simulation fallback with preset animated sample
      setGeneratedVideoUrl(
        PRESET_LOGOS[0].videoPreview ||
          'https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-digital-lines-31778-large.mp4'
      );
      setVideoError(
        `${err.message || 'Veo generation in test mode'}. Loaded animated sample video for demonstration.`
      );
    } finally {
      setIsGeneratingVideo(false);
      setVideoProgressStep('');
    }
  };

  // Upload Custom Photo for Video Animator
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhotoForVideo(reader.result as string);
        setGeneratedVideoUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Publish to Feed
  const handlePublishToFeed = () => {
    if (activeTab === 'video' && generatedVideoUrl) {
      onPublishPost({
        imageUrl: selectedPhotoForVideo,
        videoUrl: generatedVideoUrl,
        isVideo: true,
        caption: `Animated kinetic brand video for "${companyName}" created with Veo fast preview in ConnectX Studio 🎥✨`,
        hashtags: ['#VeoVideo', '#MotionDesign', '#ConnectX', '#BrandIdentity'],
        location: 'ConnectX Motion Lab',
        isAiGenerated: true,
        aiModel: 'veo-3.1-fast-generate-preview',
        logoBrand: companyName,
      });
    } else if (generatedLogoUrl) {
      onPublishPost({
        imageUrl: generatedLogoUrl,
        caption: `New ${imageSize} official logo concept for "${companyName}". Designed in ConnectX Studio with Gemini 3 Pro Image! 💎`,
        hashtags: ['#LogoDesign', '#Gemini3Pro', '#Branding', '#ConnectXStudio'],
        location: 'ConnectX Design Studio',
        isAiGenerated: true,
        aiModel: `gemini-3-pro-image-preview (${imageSize})`,
        logoBrand: companyName,
      });
    }
    setIsPublishedNotification(true);
    setTimeout(() => {
      setIsPublishedNotification(false);
      onClose();
    }, 1200);
  };

  // Add to Story
  const handlePublishToStory = () => {
    if (activeTab === 'video' && generatedVideoUrl) {
      onAddToStory(
        generatedVideoUrl,
        true,
        `New animated brand reveal for ${companyName} ⚡ #Veo`
      );
    } else if (generatedLogoUrl) {
      onAddToStory(
        generatedLogoUrl,
        false,
        `Fresh brand mark for ${companyName} (${imageSize}) ✨`
      );
    }
    setIsPublishedNotification(true);
    setTimeout(() => {
      setIsPublishedNotification(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 md:p-6 overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-[#0b0d16] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 md:px-6 border-b border-white/10 bg-[#0e111d]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400 text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                ConnectX Creative Studio
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  AI Media Lab
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Design Company Logos (Gemini 3 Pro) & Animate into Videos (Veo)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#090b12] px-4 md:px-6">
          <button
            onClick={() => setActiveTab('logo')}
            className={`flex items-center gap-2 py-3 px-4 text-xs md:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'logo'
                ? 'border-violet-500 text-white bg-violet-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>1. Design Company Logo (Gemini 3 Pro)</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 py-3 px-4 text-xs md:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'video'
                ? 'border-fuchsia-500 text-white bg-fuchsia-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Film className="w-4 h-4 text-fuchsia-400" />
            <span>2. Animate Photo into Video (Veo)</span>
          </button>

          <button
            onClick={() => setActiveTab('snap')}
            className={`flex items-center gap-2 py-3 px-4 text-xs md:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'snap'
                ? 'border-amber-400 text-white bg-amber-400/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span>3. Camera & Snap Filters</span>
          </button>
        </div>

        {/* Tab 1: AI LOGO DESIGNER */}
        {activeTab === 'logo' && (
          <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
            {/* Left Controls Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-3 rounded-2xl bg-violet-950/30 border border-violet-500/20 text-xs text-violet-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Gemini 3 Pro Image Generator</span>: Powered by{' '}
                  <code className="text-violet-300 font-mono">gemini-3-pro-image-preview</code>. Configure your
                  brand identity below, pick your resolution (1K, 2K, or 4K), and then click animate to create a video!
                </div>
              </div>

              {/* Company Name & Industry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-violet-400" /> Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Solaris Quantum"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-violet-400" /> Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-violet-500"
                  >
                    <option value="Cybersecurity & Cloud">Cybersecurity & Cloud</option>
                    <option value="AI & Generative Tech">AI & Generative Tech</option>
                    <option value="CleanTech & Energy">CleanTech & Energy</option>
                    <option value="Luxury Fashion & Streetwear">Luxury Fashion & Streetwear</option>
                    <option value="Fintech & Web3">Fintech & Web3</option>
                    <option value="Audio & Music Tech">Audio & Music Tech</option>
                    <option value="Gaming & Esports">Gaming & Esports</option>
                    <option value="Specialty Coffee & Culinary">Specialty Coffee & Culinary</option>
                  </select>
                </div>
              </div>

              {/* Visual Style & Color Palette */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-fuchsia-400" /> Visual Style
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-violet-500"
                  >
                    <option value="Modern Geometric Minimalist">Modern Geometric Minimalist</option>
                    <option value="Cyberpunk Neon Holographic">Cyberpunk Neon Holographic</option>
                    <option value="3D Raytraced Glassmorphism">3D Raytraced Glassmorphism</option>
                    <option value="Swiss Bauhaus Typographic Mark">Swiss Bauhaus Typographic Mark</option>
                    <option value="Organic Bioluminescent Emblem">Organic Bioluminescent Emblem</option>
                    <option value="Luxury Golden Heritage Crest">Luxury Golden Heritage Crest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-400" /> Color Palette
                  </label>
                  <select
                    value={colorPalette}
                    onChange={(e) => setColorPalette(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-violet-500"
                  >
                    <option value="Obsidian Black & Electric Neon Violet">Obsidian & Electric Violet</option>
                    <option value="Cyan Luminescence & Magenta Pink">Cyan & Magenta Pink</option>
                    <option value="Emerald Green & Champagne Gold">Emerald & Champagne Gold</option>
                    <option value="Monochrome Titanium Silver">Monochrome Titanium Silver</option>
                    <option value="Sunset Amber, Tangerine & Coral">Sunset Amber & Coral</option>
                  </select>
                </div>
              </div>

              {/* STRICT REQUIREMENT: Image Size Affordance (1K, 2K, 4K) */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Image Resolution Affordance
                  </span>
                  <span className="text-[11px] text-violet-400 font-semibold">
                    gemini-3-pro-image-preview
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setImageSize(size)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        imageSize === size
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 border-violet-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="text-sm">{size}</div>
                      <div className="text-[10px] font-normal opacity-80">
                        {size === '1K' ? '1024 x 1024' : size === '2K' ? '2048 x 2048' : '3840 x 3840 Ultra'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Aspect Ratio</label>
                <div className="flex gap-2">
                  {[
                    { label: '1:1 Square (Logo)', val: '1:1' },
                    { label: '16:9 Banner', val: '16:9' },
                    { label: '9:16 Story/Reel', val: '9:16' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setLogoAspectRatio(item.val as any)}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border ${
                        logoAspectRatio === item.val
                          ? 'bg-violet-600/30 border-violet-400 text-white'
                          : 'bg-white/5 border-white/10 text-zinc-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt customization */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Logo Vision & Detailed Prompt
                </label>
                <textarea
                  rows={2}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 leading-relaxed"
                />
              </div>

              {/* Presets Quick Picker */}
              <div>
                <span className="text-[11px] font-bold text-zinc-400 block mb-1">
                  Or pick a showcase preset:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_LOGOS.map((p: (typeof PRESET_LOGOS)[0]) => (
                    <button
                      key={p.name}
                      onClick={() => applyPreset(p)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] text-zinc-300 hover:text-white transition-colors"
                    >
                      ⚡ {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Action Button */}
              <button
                onClick={handleGenerateLogo}
                disabled={isGeneratingLogo}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 text-white font-bold text-sm shadow-lg shadow-violet-700/30 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGeneratingLogo ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Designing {imageSize} Logo with Gemini 3 Pro...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Logo ({imageSize} Resolution)</span>
                  </>
                )}
              </button>

              {logoError && (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{logoError}</span>
                </div>
              )}
            </div>

            {/* Right Output & Next Step Column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300">Generated Logo Canvas</span>
                  {generatedLogoUrl && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready in {imageSize}
                    </span>
                  )}
                </div>

                {/* Logo Preview Display */}
                <div className="relative w-full aspect-square rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center group">
                  {isGeneratingLogo ? (
                    <div className="text-center p-6 space-y-3">
                      <div className="w-12 h-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin mx-auto" />
                      <p className="text-xs font-bold text-white">Synthesizing vector mark...</p>
                      <p className="text-[10px] text-zinc-400">
                        Applying {colorPalette} in {imageSize} high fidelity.
                      </p>
                    </div>
                  ) : generatedLogoUrl ? (
                    <>
                      <img
                        src={generatedLogoUrl}
                        alt="Generated Logo"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                        <span className="text-white font-bold text-sm">{companyName}</span>
                        <span className="text-zinc-300 text-xs">{industry}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6 text-zinc-500 text-xs">
                      Enter company details and click &quot;Generate Logo&quot;
                    </div>
                  )}
                </div>

                {/* Direct Action: Jump to Animate with Veo */}
                {generatedLogoUrl && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-fuchsia-950/40 to-violet-950/40 border border-fuchsia-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-fuchsia-300">
                      <Film className="w-4 h-4 text-fuchsia-400" />
                      <span>Next Step: Animate this Logo!</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Bring &quot;{companyName}&quot; to life with kinetic 3D motion using{' '}
                      <strong>Veo (veo-3.1-fast-generate-preview)</strong>.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedPhotoForVideo(generatedLogoUrl);
                        setActiveTab('video');
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-fuchsia-800/30 transition-all"
                    >
                      <span>Proceed to Animate with Veo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Publish & Download Bar */}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handlePublishToFeed}
                    disabled={!generatedLogoUrl}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold disabled:opacity-40 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Post to Feed</span>
                  </button>

                  <button
                    onClick={handlePublishToStory}
                    disabled={!generatedLogoUrl}
                    className="py-2.5 px-3 rounded-xl bg-violet-600/30 hover:bg-violet-600/40 border border-violet-500/30 text-violet-200 text-xs font-bold disabled:opacity-40 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Add to Story</span>
                  </button>
                </div>

                {generatedLogoUrl && (
                  <a
                    href={generatedLogoUrl}
                    download={`${companyName}_Logo_${imageSize}.png`}
                    className="py-1.5 text-center text-[11px] font-semibold text-zinc-400 hover:text-white flex items-center justify-center gap-1 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download {imageSize} PNG Master</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: ANIMATE PHOTO / LOGO INTO VIDEO WITH VEO */}
        {activeTab === 'video' && (
          <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
            {/* Left Controls Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-3 rounded-2xl bg-fuchsia-950/30 border border-fuchsia-500/20 text-xs text-fuchsia-200 flex items-start gap-2.5">
                <Film className="w-4 h-4 text-fuchsia-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Veo Video Generator</span>: Powered by{' '}
                  <code className="text-fuchsia-300 font-mono">veo-3.1-fast-generate-preview</code>. Animate any
                  uploaded photo or generated company logo into a cinematic 60fps video with aspect ratio 16:9 or 9:16!
                </div>
              </div>

              {/* Photo Source Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-violet-400" /> Selected Image for Motion
                  </label>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-violet-400 hover:text-violet-300 font-semibold"
                  >
                    + Upload Custom Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10">
                  <img
                    src={selectedPhotoForVideo}
                    alt="Source"
                    className="w-16 h-16 rounded-xl object-cover ring-1 ring-violet-500/40"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {companyName} Brand Visual
                    </span>
                    <span className="text-[11px] text-zinc-400 block">
                      Ready to synthesize into animated video with Veo
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('logo')}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] text-zinc-300 font-semibold"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* STRICT REQUIREMENT: Aspect Ratio (16:9 or 9:16) */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Veo Video Aspect Ratio (Required: 16:9 or 9:16)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVideoAspectRatio('9:16')}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                      videoAspectRatio === '9:16'
                        ? 'bg-gradient-to-r from-fuchsia-600/30 to-violet-600/30 border-fuchsia-400 text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-white font-bold">9:16 Portrait Reel / Story</div>
                      <div className="text-[10px] text-zinc-400">Mobile Snap & Instagram format</div>
                    </div>
                    <span className="text-base">📱</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoAspectRatio('16:9')}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                      videoAspectRatio === '16:9'
                        ? 'bg-gradient-to-r from-fuchsia-600/30 to-violet-600/30 border-fuchsia-400 text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-white font-bold">16:9 Landscape Cinema</div>
                      <div className="text-[10px] text-zinc-400">Widescreen brand commercial</div>
                    </div>
                    <span className="text-base">🖥️</span>
                  </button>
                </div>
              </div>

              {/* Resolution: 720p or 1080p */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Video Resolution Quality
                </label>
                <div className="flex gap-2">
                  {(['720p', '1080p'] as const).map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setVideoResolution(res)}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold border ${
                        videoResolution === res
                          ? 'bg-fuchsia-600/40 border-fuchsia-400 text-white'
                          : 'bg-white/5 border-white/10 text-zinc-400'
                      }`}
                    >
                      {res} HD
                    </button>
                  ))}
                </div>
              </div>

              {/* Motion Prompt */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Veo Kinetic Motion & Camera Prompt
                </label>
                <textarea
                  rows={3}
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="Describe camera movement, light streaks, particles, or dynamic zoom..."
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-fuchsia-500 leading-relaxed"
                />
              </div>

              {/* Quick Motion Presets */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-zinc-400">Quick motion styles:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Dynamic 3D logo orbit with glowing neon sparks',
                    'Smooth cinematic zoom-in with holographic smoke',
                    'Liquid chrome morphing into kinetic brand emblem',
                    'Glitch cyberpunk pulse with laser grid reflections',
                  ].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setVideoPrompt(style)}
                      className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-zinc-300"
                    >
                      ✦ {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-amber-500 text-white font-bold text-sm shadow-lg shadow-fuchsia-700/30 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGeneratingVideo ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Video with Veo ({videoAspectRatio})...</span>
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4" />
                    <span>Generate Video with Veo ({videoAspectRatio})</span>
                  </>
                )}
              </button>

              {videoError && (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{videoError}</span>
                </div>
              )}
            </div>

            {/* Right Video Player & Share Column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300">Veo Video Output</span>
                  {generatedVideoUrl && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {videoAspectRatio} Video Ready
                    </span>
                  )}
                </div>

                {/* Video Player Display Container */}
                <div
                  className={`relative w-full rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center ${
                    videoAspectRatio === '9:16' ? 'aspect-[9/16] max-h-[360px]' : 'aspect-video'
                  }`}
                >
                  {isGeneratingVideo ? (
                    <div className="text-center p-6 space-y-3 max-w-xs">
                      <div className="w-12 h-12 rounded-full border-4 border-fuchsia-500 border-t-transparent animate-spin mx-auto" />
                      <p className="text-xs font-bold text-white">Veo Kinetic Synthesis Active</p>
                      <p className="text-[10px] text-fuchsia-300 animate-pulse font-mono leading-relaxed">
                        {videoProgressStep || 'Computing 60fps motion vectors...'}
                      </p>
                    </div>
                  ) : generatedVideoUrl ? (
                    <video
                      src={generatedVideoUrl}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 text-zinc-500 text-xs">
                      Click &quot;Generate Video with Veo&quot; to animate this image.
                    </div>
                  )}
                </div>
              </div>

              {/* Publish & Story Actions */}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handlePublishToFeed}
                    disabled={!generatedVideoUrl}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white text-xs font-bold disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-md shadow-fuchsia-900/30 transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Post Video to Feed</span>
                  </button>

                  <button
                    onClick={handlePublishToStory}
                    disabled={!generatedVideoUrl}
                    className="py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold disabled:opacity-40 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Post to Story</span>
                  </button>
                </div>

                {generatedVideoUrl && (
                  <a
                    href={generatedVideoUrl}
                    download={`${companyName}_Veo_Animated_${videoAspectRatio.replace(':', 'x')}.mp4`}
                    className="py-1.5 text-center text-[11px] font-semibold text-zinc-400 hover:text-white flex items-center justify-center gap-1 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Animated MP4</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: CAMERA SNAP & PHOTO POST WITH FILTERS */}
        {activeTab === 'snap' && (
          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto">
            {/* Left Camera / Filter View */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-300">Camera / Snap Viewfinder</label>
                <button
                  onClick={() => snapFileInputRef.current?.click()}
                  className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
                >
                  Upload from Device
                </button>
                <input
                  ref={snapFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setSnapImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>

              {/* Viewfinder Canvas */}
              <div
                className={`relative w-full aspect-square rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center ${
                  activeFilter === 'cyber'
                    ? 'contrast-125 saturate-150 hue-rotate-15'
                    : activeFilter === 'warm'
                    ? 'sepia-[0.35] contrast-105 saturate-125'
                    : activeFilter === 'noir'
                    ? 'grayscale contrast-150'
                    : activeFilter === 'film'
                    ? 'contrast-110 saturate-90 brightness-95'
                    : ''
                }`}
              >
                {snapImage ? (
                  <img
                    src={snapImage}
                    alt="Snap preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <Camera className="w-12 h-12 text-zinc-600 mx-auto" />
                    <p className="text-xs text-zinc-400">Click below to take a snapshot or upload photo</p>
                    <button
                      onClick={() =>
                        setSnapImage(
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
                    >
                      Use Demo Camera Shot
                    </button>
                  </div>
                )}
              </div>

              {/* Snapchat style live filters bar */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Snap & Camera Filters
                </label>
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  {[
                    { id: 'normal', name: 'Normal', icon: '✨' },
                    { id: 'cyber', name: 'Cyberpunk', icon: '⚡' },
                    { id: 'warm', name: 'Warm Sunset', icon: '🌅' },
                    { id: 'noir', name: 'Noir Dark', icon: '🌑' },
                    { id: 'film', name: '35mm Film', icon: '🎞️' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(f.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        activeFilter === f.id
                          ? 'bg-violet-600/40 border-violet-400 text-white'
                          : 'bg-white/5 border-white/10 text-zinc-400'
                      }`}
                    >
                      <div className="text-sm">{f.icon}</div>
                      <div className="text-[10px] mt-0.5 truncate">{f.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Post Meta Form */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Caption</label>
                  <textarea
                    rows={3}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption... #ConnectX #Moments"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Location Tag</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Publish Buttons */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    if (!snapImage) return;
                    onPublishPost({
                      imageUrl: snapImage,
                      caption: caption || 'Captured in ConnectX Camera 📸',
                      location,
                      hashtags: ['#ConnectXSnap', '#Vibes'],
                    });
                    setIsPublishedNotification(true);
                    setTimeout(() => {
                      setIsPublishedNotification(false);
                      onClose();
                    }, 1200);
                  }}
                  disabled={!snapImage}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-violet-700/30 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share to ConnectX Feed</span>
                </button>

                <button
                  onClick={() => {
                    if (!snapImage) return;
                    onAddToStory(snapImage, false, caption || 'Snap moment ⚡');
                    setIsPublishedNotification(true);
                    setTimeout(() => {
                      setIsPublishedNotification(false);
                      onClose();
                    }, 1200);
                  }}
                  disabled={!snapImage}
                  className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Add to My Story</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success toast notification */}
        {isPublishedNotification && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs shadow-xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>Successfully published to ConnectX!</span>
          </div>
        )}
      </div>
    </div>
  );
};
