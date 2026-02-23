/**
 * CSS Shadow Generator Logic
 * Handles real-time preview and code generation
 */
function initShadowGenerator() {
    const modalBody = document.getElementById('modal-body');
    modalTitle.innerText = "CSS Shadow Generator";
    
    modalBody.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div class="space-y-8">
                <div>
                    <div class="flex justify-between mb-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-gray-400">Horizontal Offset</label>
                        <span id="h-val" class="text-xs text-white">10px</span>
                    </div>
                    <input type="range" id="h-shadow" min="-50" max="50" value="10" class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white">
                </div>

                <div>
                    <div class="flex justify-between mb-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-gray-400">Vertical Offset</label>
                        <span id="v-val" class="text-xs text-white">10px</span>
                    </div>
                    <input type="range" id="v-shadow" min="-50" max="50" value="10" class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white">
                </div>

                <div>
                    <div class="flex justify-between mb-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-gray-400">Blur Radius</label>
                        <span id="b-val" class="text-xs text-white">20px</span>
                    </div>
                    <input type="range" id="blur-shadow" min="0" max="100" value="20" class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white">
                </div>

                <div>
                    <div class="flex justify-between mb-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-gray-400">Spread</label>
                        <span id="s-val" class="text-xs text-white">0px</span>
                    </div>
                    <input type="range" id="spread-shadow" min="-20" max="50" value="0" class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white">
                </div>
            </div>

            <div class="flex flex-col items-center gap-8">
                <div id="preview-container" class="w-full aspect-square bg-black rounded-3xl border border-white/5 flex items-center justify-center p-12">
                    <div id="shadow-target" class="w-32 h-32 bg-white rounded-2xl"></div>
                </div>
                <div class="w-full relative group">
                    <pre id="shadow-output" class="bg-black border border-white/10 p-4 rounded-xl text-xs text-gray-300 font-mono overflow-x-auto">box-shadow: 10px 10px 20px 0px rgba(0,0,0,0.5);</pre>
                    <button onclick="copyShadowCode()" class="absolute top-3 right-3 text-gray-500 hover:text-white transition">
                        <i data-lucide="copy" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Listeners for real-time updates
    const ids = ['h-shadow', 'v-shadow', 'blur-shadow', 'spread-shadow'];
    ids.forEach(id => {
        document.getElementById(id).addEventListener('input', updateShadow);
    });

    lucide.createIcons();
}

function updateShadow() {
    const h = document.getElementById('h-shadow').value;
    const v = document.getElementById('v-shadow').value;
    const b = document.getElementById('blur-shadow').value;
    const s = document.getElementById('spread-shadow').value;

    // Update labels
    document.getElementById('h-val').innerText = `${h}px`;
    document.getElementById('v-val').innerText = `${v}px`;
    document.getElementById('b-val').innerText = `${b}px`;
    document.getElementById('s-val').innerText = `${s}px`;

    const shadowStr = `${h}px ${v}px ${b}px ${s}px rgba(0,0,0,0.5)`;
    document.getElementById('shadow-target').style.boxShadow = shadowStr;
    document.getElementById('shadow-output').innerText = `box-shadow: ${shadowStr};`;
}

function copyShadowCode() {
    const code = document.getElementById('shadow-output').innerText;
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
}