import React, { useEffect, useState, useRef } from 'react';
import { Monitor, GamepadIcon, Maximize2, Code2, Upload } from 'lucide-react';

const EMULATOR_JS_URL = 'https://cdn.emulatorjs.org/latest/data/emulator.js';
const UI_JS_URL = 'https://cdn.emulatorjs.org/latest/data/ui.js';

function App() {
  const [selectedSystem, setSelectedSystem] = useState('nes');
  const [romFile, setRomFile] = useState<File | null>(null);
  const [cheatFile, setCheatFile] = useState<File | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadEmulatorScripts = async () => {
      const script1 = document.createElement('script');
      script1.src = EMULATOR_JS_URL;
      script1.async = true;

      const script2 = document.createElement('script');
      script2.src = UI_JS_URL;
      script2.async = true;

      document.body.appendChild(script1);
      document.body.appendChild(script2);
    };

    loadEmulatorScripts();

    return () => {
      const scripts = document.querySelectorAll(`script[src*="emulatorjs"]`);
      scripts.forEach(script => script.remove());
    };
  }, []);

  const handleFullscreen = () => {
    if (gameContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        gameContainerRef.current.requestFullscreen();
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'rom' | 'cheat') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'rom') {
        setRomFile(file);
      } else {
        setCheatFile(file);
      }
    }
  };

  const systems = [
    { id: 'nes', name: 'Nintendo (NES)', ext: '.nes', cheatExt: '.cht' },
    { id: 'snes', name: 'Super Nintendo', ext: '.smc,.sfc', cheatExt: '.cht' },
    { id: 'gba', name: 'Game Boy Advance', ext: '.gba', cheatExt: '.cht' },
    { id: 'n64', name: 'Nintendo 64', ext: '.n64,.z64', cheatExt: '.cht' },
    { id: 'psx', name: 'PlayStation', ext: '.iso,.bin', cheatExt: '.cht' },
    { id: 'genesis', name: 'Sega Genesis', ext: '.md,.bin', cheatExt: '.cht' }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black text-white">
      <header className="p-6 border-b border-gray-700/50 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto flex items-center gap-3">
          <Monitor className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            RetroPlay Online
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 shadow-xl border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <GamepadIcon className="w-7 h-7 text-blue-400" />
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Game Setup
              </span>
            </h2>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Gaming System
                  </label>
                  <select
                    value={selectedSystem}
                    onChange={(e) => setSelectedSystem(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {systems.map((system) => (
                      <option key={system.id} value={system.id}>
                        {system.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Upload ROM File
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept={systems.find(s => s.id === selectedSystem)?.ext}
                      onChange={(e) => handleFileChange(e, 'rom')}
                      className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                               file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold
                               file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:transition-colors"
                    />
                    <Upload className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Upload Cheat File (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept={systems.find(s => s.id === selectedSystem)?.cheatExt}
                      onChange={(e) => handleFileChange(e, 'cheat')}
                      className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                               file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold
                               file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:transition-colors"
                    />
                    <Code2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {romFile && (
                  <button
                    onClick={handleFullscreen}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                  >
                    <Maximize2 className="w-5 h-5" />
                    Toggle Fullscreen
                  </button>
                )}
              </div>
            </div>
          </div>

          <div 
            ref={gameContainerRef}
            className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-700/50"
          >
            {romFile ? (
              <div id="game"></div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-b from-gray-800/50 to-black text-gray-400">
                <div className="text-center space-y-4 p-8">
                  <GamepadIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                  <p className="text-xl font-medium">
                    Select a ROM file to start playing
                  </p>
                  <p className="text-sm opacity-75">
                    Supported systems: NES, SNES, GBA, N64, PlayStation, Genesis
                  </p>
                  {!romFile && (
                    <p className="text-xs text-gray-500 mt-8 max-w-md">
                      💡 Tip: You can upload cheat files (.cht) to enhance your gaming experience.
                      Access cheats through the emulator menu once the game is loaded.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 text-center text-gray-400 border-t border-gray-800/50">
        <div className="container mx-auto px-4">
          <p className="text-sm max-w-2xl mx-auto">
            RetroPlay Online is a web-based emulator for classic gaming systems.
            Please ensure you have the legal rights to use any ROM files you upload.
            Game ROMs and cheat files are processed entirely in your browser and are never uploaded to any server.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;