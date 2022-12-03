// ==UserScript==
// @name         Better chat.OPENAI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  you can export your conversation
// @author       flolep2607
// @updateURL    https://github.com/flolep2607/better-chat-open-ai/raw/master/betterchat.user.js
// @downloadURL  https://github.com/flolep2607/better-chat-open-ai/raw/master/betterchat.user.js
// @match        https://chat.openai.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chat.openai.com
// @grant        none
// ==/UserScript==
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
(function() {
    'use strict';
    var _loaded = {};
    function addScript(url) {
        if (!_loaded[url]) {
            var s = document.createElement('script');
            s.src = url;
            document.head.appendChild(s);
            _loaded[url] = true;
        }
    }
    addScript('https://html2canvas.hertzen.com/dist/html2canvas.min.js');
    const generate_json=()=>{
        const resultat=[...document.querySelectorAll('.ThreadLayout__NodeWrapper-sc-wfs93o-0 > div')].map(r=>{
            if(!r.querySelector('.w-full.flex.flex-col')){return;}
            return {
                user:r.querySelector('img')!=null,
                msg:r.querySelector('.w-full.flex.flex-col').innerText
            }
        }).filter(r=>r)
        copyTextToClipboard(JSON.stringify(resultat));
        return resultat;
    }
    const xpath='/html/body/div[1]/div/div[1]/main/div[1]/div/div'
    const capture=()=>{
        //, {scrollY: -window.scrollY}
        let m=getElementByXpath(xpath).querySelectorAll('div>div');
        let minus=0;//m[m.length-1].scrollHeight;
        html2canvas(getElementByXpath(xpath), {scrollY: 0,height: getElementByXpath(xpath).scrollHeight-minus,windowHeight:getElementByXpath(xpath).scrollHeight-minus}).then(canvas => {
            var img = canvas.toDataURL();
            window.open(img);
        });
    }
    const HTML=`<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"><div class="floating-container"><div class="floating-button">+</div><div class="element-container"><span class="float-element tooltip-left download"><i class="material-icons">download</i></span><span class="float-element chat"><i class="material-icons">chat</i></span></div></div>`
    document.body.insertAdjacentHTML('beforeend',HTML);
    const CSS=`@import url(https://fonts.googleapis.com/css?family=Roboto);.float-element{cursor:pointer};@-webkit-keyframes come-in{0%{-webkit-transform:translatey(100px);transform:translatey(100px);opacity:0}30%{-webkit-transform:translateX(-50px) scale(.4);transform:translateX(-50px) scale(.4)}70%{-webkit-transform:translateX(0) scale(1.2);transform:translateX(0) scale(1.2)}100%{-webkit-transform:translatey(0) scale(1);transform:translatey(0) scale(1);opacity:1}}@keyframes come-in{0%{-webkit-transform:translatey(100px);transform:translatey(100px);opacity:0}30%{-webkit-transform:translateX(-50px) scale(.4);transform:translateX(-50px) scale(.4)}70%{-webkit-transform:translateX(0) scale(1.2);transform:translateX(0) scale(1.2)}100%{-webkit-transform:translatey(0) scale(1);transform:translatey(0) scale(1);opacity:1}}*{margin:0;padding:0}body,html{background:#eaedf2;font-family:Roboto,sans-serif}.floating-container{position:fixed;width:100px;height:100px;bottom:0;right:0;margin:35px 25px}.floating-container:hover{height:200px}.floating-container:hover .floating-button{box-shadow:0 10px 25px rgba(44,179,240,.6);-webkit-transform:translatey(5px);transform:translatey(5px);-webkit-transition:.3s;transition:.3s}.floating-container:hover .element-container .float-element:first-child{-webkit-animation:.4s .2s forwards come-in;animation:.4s .2s forwards come-in}.floating-container:hover .element-container .float-element:nth-child(2){-webkit-animation:.4s .4s forwards come-in;animation:.4s .4s forwards come-in}.floating-container:hover .element-container .float-element:nth-child(3){-webkit-animation:.4s .6s forwards come-in;animation:.4s .6s forwards come-in}.floating-container .floating-button{position:absolute;width:65px;height:65px;background:#2cb3f0;bottom:0;border-radius:50%;left:0;right:0;margin:auto;color:#fff;line-height:65px;text-align:center;font-size:23px;z-index:100;box-shadow:0 10px 25px -5px rgba(44,179,240,.6);cursor:pointer;-webkit-transition:.3s;transition:.3s}.floating-container .float-element{position:relative;display:block;border-radius:50%;width:50px;height:50px;margin:15px auto;color:#fff;font-weight:500;text-align:center;line-height:50px;z-index:0;opacity:0;-webkit-transform:translateY(100px);transform:translateY(100px)}.floating-container .float-element .material-icons{vertical-align:middle;font-size:16px}.floating-container .float-element:first-child{background:#42a5f5;box-shadow:0 20px 20px -10px rgba(66,165,245,.5)}.floating-container .float-element:nth-child(2){background:#4caf50;box-shadow:0 20px 20px -10px rgba(76,175,80,.5)}.floating-container .float-element:nth-child(3){background:#ff9800;box-shadow:0 20px 20px -10px rgba(255,152,0,.5)}`
    document.body.insertAdjacentHTML('beforeend',`<style>${CSS}</style>`);
    document.querySelector(".chat").addEventListener("click", generate_json);
    document.querySelector(".download").addEventListener("click", capture);
})();
