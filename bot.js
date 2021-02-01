const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const fetch = require('node-fetch')
const tts = require('google-tts-api');
const translate = require('translation-google');

var BOT_TOKEN = "1619102525:AAHqwKgUpYvFAisF3AhQkFKNpQmFo3HVLTA";

const bot = new Telegraf(BOT_TOKEN)

const LANGS = ["am", "ar", "eu", "bn", "en", "pt", "bg", "ca", "ca", "hr", "cs", "da", "nl", "et", "fi", "fr", "de", "el", "gu", "iw", "hi", "hu", "is", "id", "it", "ja", "kn", "ko", "lv", "lt", "ms", "ml", "mr", "no", "pl", "pt", "ro", "ru", "sr", "zh", "sk", "sl", "es", "sw", "sv", "ta", "te", "th", "tw", "tr", "ur", "uk", "vi", "cy"];

bot.on('inline_query', async ({ inlineQuery, answerInlineQuery }) => {
    var dil = inlineQuery.from.language_code;
    var hasmesaj = inlineQuery.query;

    if (hasmesaj) {
        parca = hasmesaj.split(" ");
        
        
        var mesaj = hasmesaj;

        if (parca[0] && parca[0].length === 2 && LANGS.includes(parca[0])) {
            if (parca[1] && parca[1].length === 2 && LANGS.includes(parca[1])) {
                dil = parca[1];
                mesaj = hasmesaj.replace(dil + " ", ""); 
                mesaj = mesaj.replace(parca[0], "");
                var cevir = await translate(mesaj, {from: parca[0], to: dil});
            } else {
                dil = parca[0];
                mesaj = mesaj.replace(parca[0], "");
                var cevir = await translate(mesaj, {to: parca[0]});
            }
        } else {
            var cevir = await translate(hasmesaj, {to: dil});
        }

        if (mesaj.length > 200) {
            var ttsurl = false;
        } else {
            var ttsurl = await tts(cevir.text, dil, 1);
        }
                
        if (ttsurl == false) {
            var ses = {type: "article", id: 1, title: "I can't synthesize more than 200 letters", description: `Sorry`, input_message_content: {message_text: "I can't synthesize more than 200 letters"}};
        } else {
            var ses = {type: "audio", id: 1, parse_mode: "HTML", caption: `<b>From:</b> <code>${cevir.from.language.iso}</code> | <b>To:</b> <code>${dil}</code>\n<b>Your message:</b> <code>${mesaj}</code>\n<b>Translated text:</b> <code>${cevir.text}</code>`, title: `${cevir.text} (${mesaj})`, description: "Click for listen it.", performer:"@Trans_LateBot", audio_url: ttsurl};
        }

        const ceviri = {type: "article", id: 0, title: cevir.text, description: `From lang: ${cevir.from.language.iso} | To lang: ${dil}`, input_message_content: {message_text: `<b>From:</b> <code>${cevir.from.language.iso}</code> | <b>To:</b> <code>${dil}</code>\n<b>Your message:</b> <code>${mesaj}</code>\n<b>Translated text:</b> <code>${cevir.text}</code>`, parse_mode: "HTML"}};
        
        if (cevir.from.text.didYouMean == true) {
            var did = {type: "article", id: 2, title: "Did you mean?", description: `${cevir.from.text.value}`, input_message_content: {message_text: `I'm think, you mean ${cevir.from.text.value}`}};
            return answerInlineQuery([ceviri, ses, did])
        } else if (cevir.from.text.autoCorrected == true) {
            var did = {type: "article", id: 2, title: "Your mistake auto-corrected", description: `${cevir.from.text.value}`, input_message_content: {message_text: `I'm think, you mean ${cevir.from.text.value}`}};
            return answerInlineQuery([ceviri, ses, did])
        } else {
            return answerInlineQuery([ceviri, ses])    
        }
    }

    const example = {type: "article", id: 0, title: "@Trans_LateBot hello", description: `AutoLang to your lang (${dil}), Your language is auto-detected (${dil}).`, input_message_content: {message_text: "You can translate any text with @Trans_LateBot! It's easy."}};
    const example2 = {type: "article", id: 1, title: "@Trans_LateBot en tr hello", description: `Basic example English to Turkish.`, input_message_content: {message_text: "You can translate any text with @Trans_LateBot! It's easy."}};
    const example3 = {type: "article", id: 2, title: "@Trans_LateBot en merhaba", description: `Basic example AutoLang to English.`, input_message_content: {message_text: "You can translate any text with @Trans_LateBot! It's easy."}};
    const example4 = {type: "article", id: 3, title: "Language List", description: `Basic example AutoLang to English.`, input_message_content: {message_text: `Amharic	am
Arabic	ar
Basque	eu
Bengali	bn
English (UK)	en-GB
Portuguese (Brazil)	pt-BR
Bulgarian	bg
Catalan	ca
Cherokee	chr
Croatian	hr
Czech	cs
Danish	da
Dutch	nl
English (US)	en
Estonian	et
Filipino	fil
Finnish	fi
French	fr
German	de
Greek	el
Gujarati	gu
Hebrew	iw
Hindi	hi
Hungarian	hu
Icelandic	is
Indonesian	id
Italian	it
Japanese	ja
Kannada	kn
Korean	ko
Latvian	lv
Lithuanian	lt
Malay	ms
Malayalam	ml
Marathi	mr
Norwegian	no
Polish	pl
Portuguese (Portugal)	pt-PT
Romanian	ro
Russian	ru
Serbian	sr
Chinese (PRC)	zh-CN
Slovak	sk
Slovenian	sl
Spanish	es
Swahili	sw
Swedish	sv
Tamil	ta
Telugu	te
Thai	th
Chinese (Taiwan)	zh-TW
Turkish	tr
Urdu	ur
Ukrainian	uk
Vietnamese	vi
Welsh	cy`}};

    return answerInlineQuery([example, example2, example3, example4])
})

bot.start((ctx) => 
    ctx.reply(`Hi, I'm Trans_Late. A Telegram bot 🤖 that can help you communicate with friends and strangers around the world without the need of understand each other language. I have several features that are very useful for that goal.\

🗣 How to use the /inline feature    
💡 This bot created by @QuLeC. Please follow updates in @Quiecs`))

bot.command('inline', ({ reply }) => reply(
    `Inline Translation 🗣
You can use me anytime, in any conversation, to translate any text you want.
    
Invoke me writing @trans_latebot and press <space>. 
Then, start writing the language you want to translate from and look for the language code, write it and press <space> again.
Repeat the process with the language you want to translate to.
Finally, write the text.
    
TL;DR: If you want to translate from English 🇬🇧 to Turkish 🇹🇷, you should write @trans_latebot en tr <text>
    
Bot, can detect languages ​​automatically. It can see the language of your Telegram also it can find what language you are writing.

💡Practical example: @Trans_Latebot en tr Hello there!
💡Practical example of auto-detect: @Trans_Latebot Hello there! (My Telegram is Turkish, and I gave english text. Its should translate from English to Turkish)`))
  
  
console.log("Bot is working")
bot.catch((error) => {console.log(error)})
bot.launch()
