// ==UserScript==
// @name         优学院直播/保利威直播自动签到
// @namespace    https://github.com/ufec/yxy_live_auto_sign
// @version      0.1.0
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
  // 执行签到
  function execSign() {
    // 签到界面弹窗元素
    let signDialog = document.querySelector(
      '.plv-iar-btn-default.pws-btn-bg-color.pws-vclass-btn--primary',
    );
    if (signDialog == null) {
      setTimeout(execSign, 3000);
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
    alert('开始监听签到弹窗');
    window.polyvLiveAutoSignObserver.observe(signDialog, {
      attributes: true,
      attributeFilter: ['style'],
    });
  }

  // 检查网页是否加载了签到弹窗
  function check() {
    const liveIframe = document.querySelector('#liveIframe');
    if (liveIframe == null) {
      setTimeout(check, 3000);
      return;
    }
    // 监听iframe加载完成
    liveIframe.onload = () => {
      // 跳转到iframe
      window.location.href = liveIframe.src;
    };
    execSign();
  }
  window.onload = function () {
    if (window.location.href.indexOf('live.polyv.cn') > -1) {
      // 保利威直播
      execSign();
    }else{
      // 优学院直播
      check();
    }
  };
})();