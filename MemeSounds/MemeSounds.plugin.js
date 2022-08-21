/**
 * @name MemeSounds2
 * @version 0.6999.0
 * @description Plays Memetastic sounds depending on what is being sent in chat. This was heavily inspired by the idea of Metalloriff's bruh plugin so go check him out!
 * @invite SsTkJAP3SE
 * @author Nicky blackburn
 * @authorId 557388558017495046
 * @authorLink https://github.com/Lonk12/
 * @source https://github.com/Lonk12/BetterDiscordPlugins/blob/main/MemeSounds/MemeSounds.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Lonk12/BetterDiscordPlugins/main/MemeSounds/MemeSounds.plugin.js
 */

 module.exports = (() => {
	
	/* Configuration */
	const config = {info: {name: "Meme HARDCORE  Sounds", authors: [{name: "Nicky Blackburn", discord_id: "349970363813330954", github_username: "Lonk12", twitter_username: "wolfyypaw"},{name: "FlyMaster#2642", discord_id: "459726660359553025", github_username: "Apceniy"}], version: "0.6999.0", description: "Plays Memetastic sounds depending on what is being sent in chat. This was heavily inspired by the idea of Metalloriff's bruh plugin so go check him out!", github: "https://github.com/Lonk12/BetterDiscordPlugins/blob/main/MemeSounds/MemeSounds.plugin.js", github_raw: "https://raw.githubusercontent.com/Lonk12/BetterDiscordPlugins/main/MemeSounds/MemeSounds.plugin.js"}, defaultConfig: [{id: "setting", name: "Sound Settings", type: "category", collapsible: true, shown: true, settings: [{id: "LimitChan", name: "Limit to the current channel only.", note: "When enabled, sound effects will only play within the currently selected channel.", type: "switch", value: true}, {id: "delay", name: "Sound effect delay.", note: "The delay in miliseconds between each sound effect.", type: "slider", value: 200, min: 10, max: 1000, renderValue: v => Math.round(v) + "ms"}, {id: "volume", name: "Sound effect volume.", note: "How loud the sound effects will be.", type: "slider", value: 1, min: 0.01, max: 1, renderValue: v => Math.round(v*100) + "%"}]}], changelog: [{title: "New Stuff UWU", items: ["Added A bunch of new sounds", "Made by a furry for a furies and her cutie bf. to list sounds type memesound-help"]}]};

	/* Library Stuff */
	return !global.ZeresPluginLibrary ? class {
		constructor() { this._config = config; }
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
		load() {BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {confirmText: "Download Now", cancelText: "Cancel", onConfirm: () => {require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (err, res, body) => {if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9"); await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));});}});}
		start() { }
		stop() { }
	} : (([Plugin, Api]) => {

		const plugin = (Plugin, Api) => { try {
			
			/* Constants */
			const {DiscordModules: {Dispatcher, SelectedChannelStore}} = Api;
		
			const sounds = [
				{re: /no?ice/gmi, file: "noice.mp3", duration: 600},
				{re: /bazinga/gmi, file: "bazinga.mp3", duration: 550},
				{re: /oof/gmi, file: "oof.mp3", duration: 250},
				{re: /bruh/gmi, file: "bruh.mp3", duration: 470},
				{re: /🗿/gmi, file: "moyai.mp3", duration: 100},

				// furrie speek
			
				{re: /owo/gmi, file: "owodaddy.mp3", duration: 470},
				{re: /uwu/gmi, file: "uwu.mp3", duration: 470},
				{re: /daddy/gmi, file: "daddy.mp3", duration: 470},
				{re: /fuck me/gmi, file: "hard.mp3", duration: 470},
				{re: /yiff/gmi, file: "yiff.mp3", duration: 470},

				// my bf in chilly noises
				{re: /boing/gmi, file: "boing.mp3", duration: 470},
				{re: /🥵/gmi, file: "micheluwu.mp3", duration: 470},
				{re: /Nyaaa/gmi, file: "nyaaa.mp3", duration: 470},
				
				// my bf  sounds
				{re: /momo/gmi, file: "momo.mp3", duration: 470},
				{re: /what/gmi, file: "what.mp3", duration: 470},
				{re: /harder/gmi, file: "hardder.mp3", duration: 470},
				{re: /brb/gmi, file: "brb.mp3", duration: 470},
				{re: /burp/gmi, file: "burp.mp3", duration: 470},
				// owo
				{re: /na/gmi, file: "na.mp3", duration: 470},
				{re: /no/gmi, file: "no.mp3", duration: 470},
				{re: /cockslut/gmi, file: "cockslut.mp3", duration: 470},
				{re: /fuck this/gmi, file: "fuckthis.mp3", duration: 470},
				{re: /fuck this/gmi, file: "fuckthis.mp3", duration: 470},
				{re: /hehe/gmi, file: "hehe.mp3", duration: 470},
				{re: /no dick/gmi, file: "nodick.mp3", duration: 470},
				{re: /hit me/gmi, file: "hitme.mp3", duration: 470},
				{re: /suck me/gmi, file: "suck.mp3", duration: 470},
				{re: /moaning/gmi, file: "bf moaning.mp3", duration: 470},
			
			];

			/* Double message event fix */
			let lastMessageID = null;

			/* Meme Sounds Class */
			return class MemeSounds extends Plugin {
				constructor() {
					super();
				}

				getSettingsPanel() {
					return this.buildSettingsPanel().getElement();
				}
	
				onStart() {
					Dispatcher.subscribe("MESSAGE_CREATE", this.messageEvent);
				}
				
				messageEvent = async ({ channelId, message, optimistic }) => {
					if (this.settings.setting.LimitChan && channelId != SelectedChannelStore.getChannelId())
						return;

					if(message.content == "memesound-help"){
						// custom self commands 
						
						BdApi.showConfirmationModal("Supported Words ", `The Supported words are as follows:

	// Normie memes	
	1. noice,
	2. bazinga,
	3. oof,
	4. bruh, 
	5. 🗿,

	// furries
    6. owo , 
	7. uwu ,
	8. daddy , 
	9. fuck me , 
	10. yiff,

	// Dragon Prince memes
	11. na , 
	12. no , 
	13. cockslut ,
	14. fuck this 

	// more Dragon Prince memes 
	15. momo , 
	16. what , 
	17. harder , 
	18. brb , 
	19. burp , 
	20. Nyaaa , 
	21. boing,
	22. 🥵 , 
	23. suck me ,






						
						
					`, {confirmText: "Ok Have fun", cancelText: "Cancel", onConfirm: () => {BdApi.showToast("UwU hope you have fun from a horny foxgirl~", {warning:true})}, danger:true});
						

					}

					if (!optimistic && lastMessageID != message.id) {
						lastMessageID = message.id;
						let queue = new Map();
						for (let sound of sounds) {
							for (let match of message.content.matchAll(sound.re))
								queue.set(match.index, sound);
						}
						for (let sound of [...queue.entries()].sort((a, b) => a[0] - b[0])) {
							let audio = new Audio("https://github.com/NicholasBlackburn1/BetterDiscordPlugins/raw/main/MemeSounds/Sounds/"+sound[1].file);
							audio.volume = this.settings.setting.volume;
							audio.play();
							await new Promise(r => setTimeout(r, sound[1].duration+this.settings.setting.delay));
						}
					}
					
				};
				
				onStop() {
					Dispatcher.unsubscribe("MESSAGE_CREATE", this.messageEvent);
				}
			}
		} catch (e) { console.error(e); }};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
