"use strict";

function createOrFocusTab() {
    chrome.windows.getAll({ populate: true }, function (wins) {
        let multi = false;
        let focuswin = null;

        for (let i = 0, _len = wins.length; i < _len; i++) {
            if (wins[i].focused) {
                focuswin = wins[i];
            }

            for (let j = 0, __len = wins[i].tabs.length; j < __len; j++) {
                if (
                    wins[i].tabs[j].url.match(/^chrome-extension:\/\//) &&
                    wins[i].tabs[j].title == "Kurotodon財団版"
                ) {
                    // 多重起動
                    multi = true;

                    // 既に開いているウィンドウ＆タブにフォーカス
                    chrome.windows.update(wins[i].id, { focused: true });
                    chrome.tabs.update(wins[i].tabs[j].id, { selected: true });

                    break;
                }
            }
        }

        if (multi == false) {
            let param = { "url": "index.html" };

            if (focuswin != null) {
                param.windowId = focuswin.id;
            }

            chrome.tabs.create(param);
        }
    });
}

chrome.action.onClicked.addListener((tab) => {
    console.log("test");
    createOrFocusTab();
    // console.log(chrome.action);

    // chrome.scripting.executeScript({
    // 	function: createOrFocusTab
    // })
});
