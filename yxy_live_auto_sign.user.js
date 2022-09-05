// ==UserScript==
// @name         优学院直播/保利威直播自动签到
// @namespace    https://github.com/ufec/yxy_live_auto_sign
// @version      0.0.1
// @description  顾名思义，fuck ulearning
// @author       ufec
// @homepage     https://github.com/ufec/yxy_live_auto_sign
// @supportURL   https://github.com/ufec/yxy_live_auto_sign
// @updateURL    https://ghproxy.com/https://raw.githubusercontent.com/ufec/yxy_live_auto_sign/main/yxy_live_auto_sign.user.js
// @downloadURL  https://ghproxy.com/https://raw.githubusercontent.com/ufec/yxy_live_auto_sign/main/yxy_live_auto_sign.user.js
// @match        https://live.polyv.cn/watch/*
// @match        https://www.ulearning.cn/ulearning/live.html?channelId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=polyv.cn
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  function execSign() {
    // 签到界面弹窗元素
    let signDialog = document.querySelector(
      '.plv-iar-btn-default.pws-btn-bg-color.pws-vclass-btn--primary',
    );
    if (signDialog == null) {
      setTimeout(execSign, 2000);
      return;
    }
    // 定位到具体签到Dialog
    signDialog = signDialog.parentElement.parentElement.parentElement.parentElement.parentElement;
    // 签到按钮
    let signButton = null;
    document
      .querySelectorAll(
        '.plv-iar-btn-default.pws-btn-bg-color.pws-vclass-btn--primary',
      )
      .forEach((btn) => {
        if (btn.innerText == '立即签到') {
          signButton = btn;
        }
      });
    if (signButton == null) {
      return;
    }
    if (!window.hasOwnProperty('polyvLiveAutoSignObserver')) {
      window.polyvLiveAutoSignObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          console.log('mutation: ', mutation);
          if (
            window.getComputedStyle(mutation.target).getPropertyValue('display') !=
            'none'
          ) {
            signButton.click(); // 点击签到按钮
            alert('签到成功');
          }
        });
      });
    }
    console.log('开始监听签到弹窗');
    window.polyvLiveAutoSignObserver.observe(signDialog, {
      attributes: true,
      attributeFilter: ['style'],
    });
  }

  window.onload = function () {
    const liveIframe = document.querySelector('#liveIframe');
    if (liveIframe != null) {
      // 等待iframe加载完成后跳转到iframe的页面
      liveIframe.addEventListener('load', function () {
        // 获取直播间页面地址
        const polyvUrl = liveIframe.src;
        // 执行跳转
        window.location.href = polyvUrl;
      });
    } else {
      execSign();
    }
  };
})();